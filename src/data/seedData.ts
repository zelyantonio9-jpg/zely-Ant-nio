import { 
  Product, 
  UserProfile, 
  DriverProfile, 
  Order, 
  FreightLoad, 
  B2BQuotationRequest, 
  DisputeRecord,
  ChatMessage,
  DisintermediationAlert,
  SecurityAuditEntry
} from '../types';

// Real clean master profile for administrative supervision
export const SEED_PROFILES: UserProfile[] = [
  {
    id: 'usr_admin',
    name: 'Direção Geral AO MARKET',
    email: 'admin@aomarket.ao',
    phone: '+244 923 000 001',
    role: 'admin',
    entityType: 'PESSOA_SINGULAR',
    activeProfiles: ['BUYER'],
    province: 'Luanda',
    municipality: 'Luanda',
    address: 'Edifício Kilamba, Avenida 4 de Fevereiro, Luanda',
    verificationLevel: 5,
    isFormalized: true,
    nif: '5001239870',
    reputationScore: 5.0,
    completedTransactions: 0,
    fulfillmentRate: 100,
    avgResponseTimeMin: 2,
    badge: 'Supervisão Geral',
    joinedAt: '2026-01-15'
  }
];

// Clean products list - ready for real user-created and market-created products
export const SEED_PRODUCTS: Product[] = [];

// Clean real transaction registries
export const SEED_ORDERS: Order[] = [];

export const SEED_DRIVERS: DriverProfile[] = [];

export const SEED_FREIGHT_LOADS: FreightLoad[] = [];

export const SEED_RFQS: B2BQuotationRequest[] = [];

export const SEED_DISPUTES: DisputeRecord[] = [];

export const SEED_CHAT_MESSAGES: ChatMessage[] = [];

export const SEED_SECURITY_LOGS: SecurityAuditEntry[] = [];
