import { UserRole, PermissionAction, CompanyTeamRole } from '../types';

export interface RoleDefinition {
  role: UserRole;
  namePt: string;
  description: string;
  permissions: PermissionAction[];
  isAdministrative: boolean;
}

/**
 * Master Role-Based Access Control (RBAC) Matrix for AO MARKET
 * Strictly enforces what each profile is granted to perform.
 */
export const ROLE_PERMISSIONS_MATRIX: Record<UserRole, PermissionAction[]> = {
  visitor: [
    'products:read',
    'documents:read' // Only public docs if applicable
  ],
  
  buyer: [
    'products:read',
    'orders:create',
    'orders:read',
    'orders:cancel',
    'transport:read',
    'documents:read',
    'chats:read',
    'chats:send',
    'disputes:create',
    'disputes:read'
  ],

  producer: [
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'products:stock_update',
    'orders:read',
    'orders:accept',
    'orders:prepare',
    'orders:status_update',
    'documents:upload',
    'documents:read',
    'chats:read',
    'chats:send'
  ],

  merchant: [
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'products:stock_update',
    'orders:create',
    'orders:read',
    'orders:accept',
    'orders:prepare',
    'orders:cancel',
    'orders:status_update',
    'transport:read',
    'documents:upload',
    'documents:read',
    'chats:read',
    'chats:send',
    'disputes:create',
    'disputes:read'
  ],

  driver: [
    'transport:read',
    'transport:accept',
    'transport:reject',
    'transport:status_update',
    'transport:confirm_pickup',
    'transport:confirm_delivery',
    'documents:read',
    'chats:read',
    'chats:send'
  ],

  logistics_company: [
    'transport:read',
    'transport:accept',
    'transport:reject',
    'transport:status_update',
    'transport:confirm_pickup',
    'transport:confirm_delivery',
    'company:read',
    'company:update',
    'company:manage_team',
    'documents:upload',
    'documents:read',
    'chats:read',
    'chats:send'
  ],

  company_admin: [
    'company:read',
    'company:update',
    'company:manage_team',
    'company:view_finances',
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'products:stock_update',
    'orders:create',
    'orders:read',
    'orders:accept',
    'orders:prepare',
    'orders:cancel',
    'orders:status_update',
    'transport:read',
    'transport:accept',
    'transport:status_update',
    'documents:upload',
    'documents:read',
    'payments:read',
    'chats:read',
    'chats:send',
    'disputes:create',
    'disputes:read'
  ],

  company_user: [
    'company:read',
    'products:read',
    'orders:read',
    'documents:read',
    'chats:read',
    'chats:send'
  ],

  support: [
    'products:read',
    'orders:read',
    'transport:read',
    'users:read',
    'company:read',
    'documents:read',
    'documents:approve',
    'documents:reject',
    'payments:read',
    'system:config_read',
    'system:view_audit_logs',
    'chats:read',
    'chats:monitor_flagged',
    'disputes:read',
    'disputes:resolve'
  ],

  admin: [
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'products:stock_update',
    'orders:create',
    'orders:read',
    'orders:accept',
    'orders:prepare',
    'orders:cancel',
    'orders:status_update',
    'transport:read',
    'transport:accept',
    'transport:reject',
    'transport:status_update',
    'transport:confirm_pickup',
    'transport:confirm_delivery',
    'users:read',
    'users:create',
    'users:update',
    'users:suspend',
    'users:approve',
    'users:reject',
    'users:delete',
    'company:read',
    'company:update',
    'company:manage_team',
    'company:view_finances',
    'documents:upload',
    'documents:read',
    'documents:approve',
    'documents:reject',
    'documents:delete',
    'payments:read',
    'payments:confirm',
    'payments:alter',
    'system:config_read',
    'system:config_write',
    'system:view_audit_logs',
    'system:manage_roles',
    'chats:read',
    'chats:send',
    'chats:monitor_flagged',
    'disputes:create',
    'disputes:read',
    'disputes:resolve'
  ]
};

/**
 * Company Team Sub-Role Permissions
 */
export const COMPANY_SUBROLE_PERMISSIONS: Record<CompanyTeamRole, PermissionAction[]> = {
  ADMIN: [
    'company:read',
    'company:update',
    'company:manage_team',
    'company:view_finances',
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'products:stock_update',
    'orders:create',
    'orders:read',
    'orders:accept',
    'orders:prepare',
    'orders:cancel',
    'orders:status_update',
    'documents:upload',
    'documents:read',
    'payments:read',
    'chats:read',
    'chats:send'
  ],
  COMPRADOR: [
    'products:read',
    'orders:create',
    'orders:read',
    'orders:cancel',
    'documents:read',
    'chats:read',
    'chats:send'
  ],
  FINANCEIRO: [
    'company:read',
    'company:view_finances',
    'orders:read',
    'payments:read',
    'documents:read',
    'chats:read'
  ],
  OPERADOR: [
    'products:read',
    'products:stock_update',
    'orders:read',
    'orders:prepare',
    'orders:status_update',
    'transport:read',
    'transport:confirm_pickup',
    'documents:read',
    'chats:read',
    'chats:send'
  ]
};

/**
 * Valid Order State Machine Transition Rules & Authorized Roles
 */
export interface StateTransitionRule {
  from: string[];
  to: string;
  allowedRoles: UserRole[];
  allowedCompanySubRoles?: CompanyTeamRole[];
  description: string;
}

export const ORDER_STATE_TRANSITIONS: StateTransitionRule[] = [
  {
    from: ['CREATED'],
    to: 'PAYMENT_PENDING',
    allowedRoles: ['buyer', 'merchant', 'company_admin', 'company_user', 'admin'],
    description: 'Comprador prossegue para pagamento da encomenda'
  },
  {
    from: ['PAYMENT_PENDING', 'CREATED'],
    to: 'PAID',
    allowedRoles: ['admin'], // Typically gateway/admin confirmation
    description: 'Confirmação de recebimento pelo Multicaixa Express / Custódia Bancária'
  },
  {
    from: ['PAID', 'CREATED'],
    to: 'ACCEPTED',
    allowedRoles: ['producer', 'merchant', 'company_admin', 'company_user', 'admin'],
    description: 'Produtor/Vendedor aceita e confirma disponibilidade do lote'
  },
  {
    from: ['ACCEPTED'],
    to: 'PREPARING',
    allowedRoles: ['producer', 'merchant', 'company_admin', 'company_user', 'admin'],
    description: 'Produtor inicia colheita/pesagem e empacotamento da mercadoria'
  },
  {
    from: ['PREPARING'],
    to: 'READY_FOR_PICKUP',
    allowedRoles: ['producer', 'merchant', 'company_admin', 'company_user', 'admin'],
    description: 'Mercadoria pronta para recolha no armazém ou fazenda'
  },
  {
    from: ['READY_FOR_PICKUP'],
    to: 'DRIVER_ASSIGNED',
    allowedRoles: ['driver', 'logistics_company', 'admin'],
    description: 'Transportador aceita a rota de frete rodoviário'
  },
  {
    from: ['DRIVER_ASSIGNED', 'READY_FOR_PICKUP'],
    to: 'PICKED_UP',
    allowedRoles: ['driver', 'logistics_company', 'producer', 'admin'],
    description: 'Motorista recolhe carga mediante validação PIN OTP do produtor'
  },
  {
    from: ['PICKED_UP'],
    to: 'IN_TRANSIT',
    allowedRoles: ['driver', 'logistics_company', 'admin'],
    description: 'Camião em circulação interprovincial no corredor logístico'
  },
  {
    from: ['IN_TRANSIT'],
    to: 'DELIVERED',
    allowedRoles: ['driver', 'logistics_company', 'admin'],
    description: 'Carga chega ao destino e entrega é registada'
  },
  {
    from: ['DELIVERED'],
    to: 'COMPLETED',
    allowedRoles: ['buyer', 'merchant', 'company_admin', 'admin'],
    description: 'Comprador valida conformidade e liberta pagamento da custódia'
  },
  {
    from: ['CREATED', 'PAYMENT_PENDING'],
    to: 'CANCELLED',
    allowedRoles: ['buyer', 'merchant', 'company_admin', 'admin'],
    description: 'Cancelamento antes do início da preparação do lote'
  },
  {
    from: ['PAID', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED'],
    to: 'DISPUTED',
    allowedRoles: ['buyer', 'merchant', 'producer', 'driver', 'company_admin', 'admin', 'support'],
    description: 'Abertura de litígio para mediação pela câmara AO Protect'
  }
];

/**
 * Valid Freight Load State Machine Transitions
 */
export const FREIGHT_STATE_TRANSITIONS = [
  { from: 'PENDING_ACCEPTANCE', to: 'ASSIGNED', allowedRoles: ['driver', 'logistics_company', 'admin'] },
  { from: 'ASSIGNED', to: 'IN_TRANSIT', allowedRoles: ['driver', 'logistics_company', 'admin'] },
  { from: 'IN_TRANSIT', to: 'COMPLETED', allowedRoles: ['driver', 'logistics_company', 'admin'] }
];

/**
 * Disintermediation Detection Keywords (Portuguese / Angolan Context)
 */
export const DISINTERMEDIATION_TRIGGER_PATTERNS = [
  /9[1-9][0-9]\s*[0-9]{3}\s*[0-9]{3}/i, // Angola phone numbers (9xx xxx xxx)
  /\+244\s*9[1-9][0-9]/i,
  /pagar\s+(por|pela)\s+fora/i,
  /transfere\s+direto/i,
  /pagamento\s+por\s+fora/i,
  /sem\s+passar\s+pela\s+plataforma/i,
  /chama\s+no\s+whatsapp/i,
  /envia\s+no\s+zap/i,
  /iban\s+direto/i,
  /evitar\s+a\s+taxa/i,
  /desconto\s+por\s+fora/i
];
