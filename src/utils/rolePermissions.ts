import { UserRole } from '../types';

export type TabId = 
  | 'home' 
  | 'marketplace' 
  | 'producer' 
  | 'merchant' 
  | 'logistics' 
  | 'social_protection' 
  | 'disputes' 
  | 'admin';

export interface TabConfig {
  id: TabId;
  label: string;
  shortLabel: string;
  description: string;
  allowedRoles: UserRole[];
  requiresAuth: boolean;
  roleSpecificNotice?: string;
}

export const ECOSYSTEM_TABS: Record<TabId, TabConfig> = {
  home: {
    id: 'home',
    label: 'Início Soberano',
    shortLabel: 'Início',
    description: 'Visão geral e destaques nacionais',
    allowedRoles: ['buyer', 'producer', 'merchant', 'driver', 'logistics_company', 'admin', 'support'],
    requiresAuth: false
  },
  marketplace: {
    id: 'marketplace',
    label: 'Catálogo Nacional',
    shortLabel: 'Catálogo',
    description: 'Exploração e compras de produtos das 21 províncias (326 municípios)',
    allowedRoles: ['buyer', 'producer', 'merchant', 'admin', 'support'],
    requiresAuth: false
  },
  producer: {
    id: 'producer',
    label: 'Portal do Produtor Rural',
    shortLabel: 'Área do Produtor',
    description: 'Gestão de colheitas, publicação de lotes e vendas da fazenda',
    allowedRoles: ['producer', 'admin'],
    requiresAuth: true,
    roleSpecificNotice: 'Área exclusiva para Produtores Agrícolas, Fazendas e Cooperativas Registadas.'
  },
  merchant: {
    id: 'merchant',
    label: 'Portal do Comerciante & Grossista',
    shortLabel: 'Grossista & RFQ',
    description: 'Cotações em grande escala (RFQ) e compras institucionais B2B',
    allowedRoles: ['merchant', 'admin'],
    requiresAuth: true,
    roleSpecificNotice: 'Área exclusiva para Comerciantes Grossistas, Centrais de Compras e Distribuidores.'
  },
  logistics: {
    id: 'logistics',
    label: 'AO Logistics • Bolsa de Cargas',
    shortLabel: 'Logística Rodoviária',
    description: 'Bolsa de fretes rodoviários, rotas interprovinciais e validação PIN OTP',
    allowedRoles: ['driver', 'logistics_company', 'admin'],
    requiresAuth: true,
    roleSpecificNotice: 'Área exclusiva para Transportadores Rodoviários Certificados e Motoristas de Frotas.'
  },
  social_protection: {
    id: 'social_protection',
    label: 'Garantia Social & INSS',
    shortLabel: 'INSS & Formalização',
    description: 'Enquadramento previdenciário e formalização da atividade económica',
    allowedRoles: ['producer', 'driver', 'logistics_company', 'admin', 'support'],
    requiresAuth: false
  },
  disputes: {
    id: 'disputes',
    label: 'AO Protect • Custódia & Mediação',
    shortLabel: 'Custódia & Litígios',
    description: 'Câmara de custódia bancária e resolução de divergências',
    allowedRoles: ['buyer', 'merchant', 'admin', 'support'],
    requiresAuth: true,
    roleSpecificNotice: 'Área de mediação para Compradores, Grossistas e Entidades sob Custódia Bancária.'
  },
  admin: {
    id: 'admin',
    label: 'Painel Administrativo',
    shortLabel: 'Painel Admin',
    description: 'Gestão de transações, validação documental e monitorização do ecossistema',
    allowedRoles: ['admin', 'support'],
    requiresAuth: true,
    roleSpecificNotice: 'Acesso restrito à equipa de administração do AO MARKET.'
  }
};

/**
 * Checks whether a given user role is allowed to view a specific tab.
 */
export function isTabAllowedForRole(tabId: string, role?: UserRole, isAuthenticated?: boolean): boolean {
  const config = ECOSYSTEM_TABS[tabId as TabId];
  if (!config) return false;

  // Unauthenticated user
  if (!isAuthenticated) {
    // Only public tabs are accessible without auth
    return !config.requiresAuth;
  }

  // If user is admin or support, they have access to their allowed roles
  if (role === 'admin') return true;

  if (!role) return !config.requiresAuth;

  return config.allowedRoles.includes(role);
}

/**
 * Returns user-friendly name for a role in Portuguese
 */
export function getRoleNamePt(role: UserRole): string {
  switch (role) {
    case 'producer':
      return 'Produtor Rural';
    case 'merchant':
      return 'Comerciante & Grossista';
    case 'driver':
    case 'logistics_company':
      return 'Transportador Rodoviário';
    case 'buyer':
      return 'Comprador';
    case 'admin':
      return 'Administrador';
    case 'support':
      return 'Suporte & Operações';
    default:
      return 'Utilizador';
  }
}

/**
 * Returns default home tab for a given role after login
 */
export function getDefaultTabForRole(role: UserRole): TabId {
  switch (role) {
    case 'producer':
      return 'producer';
    case 'merchant':
      return 'merchant';
    case 'driver':
    case 'logistics_company':
      return 'logistics';
    case 'buyer':
      return 'marketplace';
    case 'admin':
    case 'support':
      return 'admin';
    default:
      return 'home';
  }
}

export function getAccountStatusBadge(status?: string): { label: string; bgClass: string; textClass: string; borderClass: string } {
  switch (status) {
    case 'ATIVO':
      return { label: 'Conta Ativa', bgClass: 'bg-emerald-50', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' };
    case 'APROVADO':
      return { label: 'Aprovado', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-200' };
    case 'EM_ANALISE':
      return { label: 'Em Análise', bgClass: 'bg-amber-50', textClass: 'text-amber-800', borderClass: 'border-amber-200' };
    case 'DOCUMENTACAO_PENDENTE':
      return { label: 'Documentação Pendente', bgClass: 'bg-orange-50', textClass: 'text-orange-800', borderClass: 'border-orange-200' };
    case 'PENDENTE':
      return { label: 'Pendente', bgClass: 'bg-slate-100', textClass: 'text-slate-700', borderClass: 'border-slate-300' };
    case 'REJEITADO':
      return { label: 'Rejeitado', bgClass: 'bg-red-50', textClass: 'text-red-800', borderClass: 'border-red-200' };
    case 'SUSPENSO':
      return { label: 'Suspenso', bgClass: 'bg-rose-100', textClass: 'text-rose-900', borderClass: 'border-rose-300' };
    default:
      return { label: 'Ativo', bgClass: 'bg-emerald-50', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' };
  }
}
