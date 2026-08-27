import { 
  UserProfile, 
  UserRole, 
  PermissionAction, 
  Product, 
  Order, 
  FreightLoad, 
  UserDocument, 
  ChatMessage,
  DisintermediationAlert,
  SecurityAuditEntry,
  OrderStatus
} from '../types';
import { 
  ROLE_PERMISSIONS_MATRIX, 
  COMPANY_SUBROLE_PERMISSIONS, 
  ORDER_STATE_TRANSITIONS, 
  DISINTERMEDIATION_TRIGGER_PATTERNS 
} from './rbacMatrix';

export interface AuthorizationResult {
  allowed: boolean;
  httpStatus: 200 | 401 | 403 | 422;
  errorCode?: 'UNAUTHENTICATED' | 'FORBIDDEN_ROLE' | 'FORBIDDEN_PERMISSION' | 'FORBIDDEN_OWNERSHIP' | 'FORBIDDEN_TENANT' | 'INVALID_STATE_TRANSITION';
  reason?: string;
  missingPermission?: PermissionAction;
}

/**
 * 1. RBAC Action Permission Check
 */
export function hasPermission(
  user: UserProfile | null | undefined, 
  action: PermissionAction
): boolean {
  if (!user) {
    return ROLE_PERMISSIONS_MATRIX.visitor.includes(action);
  }

  // Super Admin has all privileges
  if (user.role === 'admin') {
    return true;
  }

  // Check custom granted permissions if explicitly configured
  if (user.customPermissions && user.customPermissions.includes(action)) {
    return true;
  }

  // Company Sub-Role resolution
  if (user.role === 'company_user' && user.companyRole) {
    const subPermissions = COMPANY_SUBROLE_PERMISSIONS[user.companyRole] || [];
    if (subPermissions.includes(action)) return true;
  }

  // Base Role Permissions
  const rolePermissions = ROLE_PERMISSIONS_MATRIX[user.role] || [];
  return rolePermissions.includes(action);
}

/**
 * 2. Multi-Tenancy & Resource Ownership Engine
 */

export function checkProductOwnership(
  user: UserProfile | null | undefined, 
  product: Product, 
  action: 'read' | 'update' | 'delete' | 'stock'
): AuthorizationResult {
  if (action === 'read') {
    return { allowed: true, httpStatus: 200 };
  }

  if (!user) {
    return {
      allowed: false,
      httpStatus: 401,
      errorCode: 'UNAUTHENTICATED',
      reason: 'É necessário autenticar para gerir produtos.'
    };
  }

  if (user.role === 'admin') {
    return { allowed: true, httpStatus: 200 };
  }

  const reqPermission: PermissionAction = action === 'delete' 
    ? 'products:delete' 
    : action === 'stock' 
    ? 'products:stock_update' 
    : 'products:update';

  if (!hasPermission(user, reqPermission)) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_PERMISSION',
      reason: `O seu perfil (${user.role}) não tem a permissão '${reqPermission}'.`,
      missingPermission: reqPermission
    };
  }

  // Check Producer Ownership
  const isDirectOwner = product.producerId === user.id;
  const isCompanyOwner = user.companyId && product.producerCompanyId && user.companyId === product.producerCompanyId;

  if (!isDirectOwner && !isCompanyOwner) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_OWNERSHIP',
      reason: `Acesso negado: Este produto pertence a outro produtor/empresa (${product.producerName}). Não tem autorização para modificá-lo.`
    };
  }

  return { allowed: true, httpStatus: 200 };
}

export function checkOrderAccess(
  user: UserProfile | null | undefined, 
  order: Order, 
  action: 'read' | 'update_status' | 'cancel' | 'dispute'
): AuthorizationResult {
  if (!user) {
    return {
      allowed: false,
      httpStatus: 401,
      errorCode: 'UNAUTHENTICATED',
      reason: 'Autenticação obrigatória para consultar pedidos.'
    };
  }

  if (user.role === 'admin' || user.role === 'support') {
    return { allowed: true, httpStatus: 200 };
  }

  const isBuyer = order.buyerId === user.id || (user.companyId && order.buyerCompanyId === user.companyId);
  const isSeller = order.items.some(i => i.producerId === user.id) || (user.companyId && order.sellerCompanyId === user.companyId);
  const isAssignedDriver = order.driverId === user.id;

  if (action === 'read') {
    if (isBuyer || isSeller || isAssignedDriver) {
      return { allowed: true, httpStatus: 200 };
    }
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_OWNERSHIP',
      reason: 'Acesso negado: Não é parte integrante (comprador, produtor ou transportador) deste pedido.'
    };
  }

  if (action === 'cancel') {
    if (!isBuyer) {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_OWNERSHIP',
        reason: 'Apenas o comprador responsável ou a administração pode solicitar o cancelamento.'
      };
    }
    if (order.status !== 'CREATED' && order.status !== 'PAYMENT_PENDING') {
      return {
        allowed: false,
        httpStatus: 422,
        errorCode: 'INVALID_STATE_TRANSITION',
        reason: `Não é possível cancelar um pedido no estado '${order.status}'. O lote já foi processado ou despachado.`
      };
    }
    return { allowed: true, httpStatus: 200 };
  }

  return { allowed: true, httpStatus: 200 };
}

export function checkOrderStateTransition(
  user: UserProfile | null | undefined,
  order: Order,
  targetStatus: OrderStatus
): AuthorizationResult {
  if (!user) {
    return { allowed: false, httpStatus: 401, errorCode: 'UNAUTHENTICATED', reason: 'Autenticação necessária.' };
  }

  const rule = ORDER_STATE_TRANSITIONS.find(r => r.to === targetStatus && r.from.includes(order.status));
  if (!rule) {
    return {
      allowed: false,
      httpStatus: 422,
      errorCode: 'INVALID_STATE_TRANSITION',
      reason: `Transição inválida: Não é permitido mudar o estado de '${order.status}' diretamente para '${targetStatus}'.`
    };
  }

  if (user.role === 'admin') {
    return { allowed: true, httpStatus: 200 };
  }

  if (!rule.allowedRoles.includes(user.role)) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_ROLE',
      reason: `O seu perfil (${user.role}) não tem permissão para transitar o pedido para '${targetStatus}'. Permitido apenas para: ${rule.allowedRoles.join(', ')}.`
    };
  }

  // Verify ownership relation
  const isBuyer = order.buyerId === user.id || (user.companyId && order.buyerCompanyId === user.companyId);
  const isSeller = order.items.some(i => i.producerId === user.id) || (user.companyId && order.sellerCompanyId === user.companyId);
  const isDriver = order.driverId === user.id;

  if (targetStatus === 'PREPARING' || targetStatus === 'READY_FOR_PICKUP') {
    if (!isSeller) {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_OWNERSHIP',
        reason: 'Apenas o produtor titular dos itens pode avançar a preparação do lote.'
      };
    }
  }

  if (targetStatus === 'PICKED_UP' || targetStatus === 'IN_TRANSIT' || targetStatus === 'DELIVERED') {
    if (!isDriver && !isSeller) {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_OWNERSHIP',
        reason: 'Apenas o transportador atribuído a este frete pode registar o trânsito e a entrega.'
      };
    }
  }

  if (targetStatus === 'COMPLETED') {
    if (!isBuyer) {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_OWNERSHIP',
        reason: 'Apenas o comprador destinatário pode confirmar o fecho e libertação da custódia.'
      };
    }
  }

  return { allowed: true, httpStatus: 200 };
}

export function checkTenantCompanyAccess(
  user: UserProfile | null | undefined,
  targetCompanyId: string,
  action: 'read' | 'update' | 'manage_team' | 'view_finances'
): AuthorizationResult {
  if (!user) {
    return { allowed: false, httpStatus: 401, errorCode: 'UNAUTHENTICATED', reason: 'Autenticação necessária.' };
  }

  if (user.role === 'admin') {
    return { allowed: true, httpStatus: 200 };
  }

  if (user.role === 'support' && action === 'read') {
    return { allowed: true, httpStatus: 200 };
  }

  if (user.companyId !== targetCompanyId) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_TENANT',
      reason: `Violação de Multi-Tenancy: A sua conta não pertence à Empresa ID '${targetCompanyId}'. Acesso estritamente isolado.`
    };
  }

  if (action === 'manage_team' || action === 'update') {
    if (user.role !== 'company_admin' && user.companyRole !== 'ADMIN') {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_PERMISSION',
        reason: 'Apenas Administradores da Empresa podem gerir membros de equipa ou editar dados corporativos.'
      };
    }
  }

  return { allowed: true, httpStatus: 200 };
}

export function checkDocumentAccess(
  user: UserProfile | null | undefined,
  targetDocumentUserId: string,
  action: 'read' | 'upload' | 'verify' | 'delete'
): AuthorizationResult {
  if (!user) {
    return { allowed: false, httpStatus: 401, errorCode: 'UNAUTHENTICATED', reason: 'Autenticação necessária.' };
  }

  if (user.role === 'admin') {
    return { allowed: true, httpStatus: 200 };
  }

  if (user.role === 'support') {
    if (action === 'delete') {
      return {
        allowed: false,
        httpStatus: 403,
        errorCode: 'FORBIDDEN_PERMISSION',
        reason: 'O Suporte Técnico não tem permissão para apagar documentos oficiais.'
      };
    }
    return { allowed: true, httpStatus: 200 }; // Support can read & verify
  }

  if (action === 'verify') {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_ROLE',
      reason: 'Apenas a equipa de Supervisão e Administração pode auditar e aprovar documentação.'
    };
  }

  if (user.id !== targetDocumentUserId) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_OWNERSHIP',
      reason: 'Acesso negado: Não pode consultar nem gerir documentos pertencentes a outro titular.'
    };
  }

  return { allowed: true, httpStatus: 200 };
}

/**
 * 3. Chat Access & Disintermediation Protection Engine
 */
export function checkChatAccess(
  user: UserProfile | null | undefined,
  messageOrParticipants: { senderId: string; recipientId: string; companyId?: string }
): AuthorizationResult {
  if (!user) {
    return { allowed: false, httpStatus: 401, errorCode: 'UNAUTHENTICATED', reason: 'Autenticação necessária.' };
  }

  if (user.role === 'admin' || user.role === 'support') {
    return { allowed: true, httpStatus: 200 }; // Can monitor flagged or audit
  }

  const isParticipant = user.id === messageOrParticipants.senderId || user.id === messageOrParticipants.recipientId;
  const isCompanyParticipant = user.companyId && messageOrParticipants.companyId && user.companyId === messageOrParticipants.companyId;

  if (!isParticipant && !isCompanyParticipant) {
    return {
      allowed: false,
      httpStatus: 403,
      errorCode: 'FORBIDDEN_OWNERSHIP',
      reason: 'Acesso negado: Não participa nesta conversa nem está vinculado a esta transação.'
    };
  }

  return { allowed: true, httpStatus: 200 };
}

/**
 * Inspects message text for platform disintermediation (trying to transact off-platform)
 */
export function analyzeDisintermediation(text: string): { isFlagged: boolean; matchedKeywords: string[]; severity: 'ALTO' | 'MEDIO' | 'BAIXO'; reason?: string } {
  const matchedKeywords: string[] = [];

  for (const pattern of DISINTERMEDIATION_TRIGGER_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matchedKeywords.push(match[0]);
    }
  }

  if (matchedKeywords.length > 0) {
    const isSevere = matchedKeywords.some(k => /pagar|fora|iban|evitar/i.test(k));
    return {
      isFlagged: true,
      matchedKeywords,
      severity: isSevere ? 'ALTO' : 'MEDIO',
      reason: `Sinalizado pelo filtro de integridade AO MARKET: Detetadas palavras de transação externa (${matchedKeywords.join(', ')}).`
    };
  }

  return { isFlagged: false, matchedKeywords: [], severity: 'BAIXO' };
}
