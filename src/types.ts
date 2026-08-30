export type UserRole = 
  | 'visitor'
  | 'buyer' 
  | 'producer' 
  | 'merchant' 
  | 'driver' 
  | 'logistics_company' 
  | 'admin'
  | 'support'
  | 'company_admin'
  | 'company_user'
  | 'formalization_agent'
  | 'inss_auditor';

export type PermissionAction = 
  // Products
  | 'products:create'
  | 'products:read'
  | 'products:update'
  | 'products:delete'
  | 'products:stock_update'
  // Orders
  | 'orders:create'
  | 'orders:read'
  | 'orders:accept'
  | 'orders:prepare'
  | 'orders:cancel'
  | 'orders:status_update'
  // Transport
  | 'transport:read'
  | 'transport:accept'
  | 'transport:reject'
  | 'transport:status_update'
  | 'transport:confirm_pickup'
  | 'transport:confirm_delivery'
  // Users & Team
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:suspend'
  | 'users:approve'
  | 'users:reject'
  | 'users:delete'
  // Company & Multi-tenancy
  | 'company:read'
  | 'company:update'
  | 'company:manage_team'
  | 'company:view_finances'
  // Documents
  | 'documents:upload'
  | 'documents:read'
  | 'documents:approve'
  | 'documents:reject'
  | 'documents:delete'
  // Payments & Escrow
  | 'payments:read'
  | 'payments:confirm'
  | 'payments:alter'
  // System Administration & Security
  | 'system:config_read'
  | 'system:config_write'
  | 'system:view_audit_logs'
  | 'system:manage_roles'
  // Chat & Communication
  | 'chats:read'
  | 'chats:send'
  | 'chats:monitor_flagged'
  // Disputes
  | 'disputes:create'
  | 'disputes:read'
  | 'disputes:resolve'
  // Reviews & Evaluation
  | 'orders:evaluate'
  // INSS Integration
  | 'inss:validate'
  | 'inss:link'
  | 'inss:audit_read'
  // Formalization Program
  | 'formalization:read'
  | 'formalization:create'
  | 'formalization:update'
  | 'formalization:approve'
  | 'formalization:reject'
  | 'formalization:refer'
  | 'formalization:audit';

export type EntityType = 'PESSOA_SINGULAR' | 'EMPRESA' | 'COOPERATIVA' | 'ASSOCIACAO';

export type ActorProfileType = 'PRODUCER' | 'MERCHANT' | 'TRANSPORTER' | 'BUYER' | 'EMPRESA';

export type AccountRegistrationStatus = 
  | 'PENDENTE' 
  | 'EM_ANALISE' 
  | 'APROVADO' 
  | 'ATIVO' 
  | 'DOCUMENTACAO_PENDENTE' 
  | 'REJEITADO' 
  | 'SUSPENSO';

export type FormalizationOption = 'SIM' | 'NAO' | 'EM_PROCESSO';
export type InssOption = 'SIM' | 'NAO' | 'PROCESSO_EM_CURSO';

export type CompanyServiceType = 'COMPRAR' | 'VENDER' | 'TRANSPORTAR';
export type CompanyTeamRole = 'ADMIN' | 'COMPRADOR' | 'FINANCEIRO' | 'OPERADOR';

export interface CompanyTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: CompanyTeamRole;
  status: 'ATIVO' | 'INATIVO';
  permissions: string[];
  createdAt: string;
}

export interface RegistrationAuditLog {
  id: string;
  action: string;
  performedBy: string;
  userRole: string;
  timestamp: string;
  notes?: string;
  previousStatus?: AccountRegistrationStatus;
  newStatus?: AccountRegistrationStatus;
}

export type VerificationLevel = 1 | 2 | 3 | 4 | 5;

export type DocumentVerificationStatus = 
  | 'NAO_ENVIADO' 
  | 'ENVIADO' 
  | 'EM_ANALISE' 
  | 'APROVADO' 
  | 'REJEITADO' 
  | 'EXPIRADO';

export type DocumentTypeEnum = 
  | 'BI' 
  | 'NIF' 
  | 'CERTIDAO_REGISTO_COMERCIAL' 
  | 'CARTA_CONDUCAO' 
  | 'LIVRETE_VEICULO' 
  | 'SEGURO_AUTOMOVEL' 
  | 'COMPROVATIVO_INSS' 
  | 'COMPROVATIVO_BANCARIO' 
  | 'ALVARA_COMERCIAL' 
  | 'CERTIFICADO_COOPERATIVA'
  | 'INSPECAO_TECNICA'
  | 'DECLARACAO_SOBA_ADMINISTRACAO'
  | 'TITULO_EXPLORACAO_TERRA'
  | 'FOTOGRAFIA_PERFIL'
  | 'OUTRO';

export interface UserDocument {
  id: string;
  documentType: DocumentTypeEnum;
  label: string;
  fileName: string;
  fileSizeKb: number;
  fileMimeType: string;
  uploadDate: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
  expiryDate?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface ProducerDetails {
  producerType: 'FAMILIAR' | 'AGRICULTOR' | 'PECUARISTA' | 'FAZENDA' | 'COOPERATIVA' | 'ASSOCIACAO' | 'AGROINDUSTRIA';
  farmName: string;
  activityCategory: 'AGRICULTURA' | 'PECUARIA' | 'PESCA' | 'AQUICULTURA' | 'AGROPROCESSAMENTO' | 'ARTESANATO' | 'OUTRA';
  productionCategories?: ('AGRICULTURA' | 'PECUARIA' | 'PESCA' | 'AQUICULTURA' | 'TRANSFORMACAO_AGROALIMENTAR')[];
  mainCropsOrProducts: string[];
  landAreaHectares?: number;
  annualCapacityQty: number;
  annualCapacityUnit: 'TONELADAS' | 'KG' | 'CABECAS' | 'CAIXAS' | 'SACOS';
  harvestSeason?: string; // ex: "Abril a Agosto"
  hasStorageFacility?: boolean;
  productionLocationDetails?: string;
}

export interface MerchantDetails {
  businessType?: 'GROSSISTA' | 'DISTRIBUIDOR' | 'RETALHISTA' | 'SUPERMERCADO' | 'COOPERATIVA' | string;
  merchantTypes?: ('RETALHISTA' | 'GROSSISTA' | 'DISTRIBUIDOR' | 'SUPERMERCADO' | 'HOTEL_RESTAURANTE' | 'B2B_EMPRESA')[];
  hasPhysicalStore?: boolean;
  storeAddress?: string;
  hasWarehouse?: boolean;
  warehouseLocation?: string;
  warehouseCapacityM3?: number;
  hasColdChainStorage?: boolean;
  commercialRegistryNumber?: string;
  b2bCreditTermsAccepted?: boolean;
  annualVolumeKg?: number;
  targetMarkets?: string[];
  storageCapacityTons?: number;
  offersColdStorage?: boolean;
}

export interface TransporterVehicle {
  id: string;
  vehicleType: VehicleType;
  brandModel: string;
  licensePlate: string;
  year: number;
  payloadCapacityKg: number;
  volumeCapacityM3: number;
  cargoType?: string;
  hasRefrigeration: boolean;
  technicalInspectionValid: boolean;
  registrationDocument?: string;
}

export interface TransporterDetails {
  operatorType: 'MOTORISTA_INDEPENDENTE' | 'PROPRIETARIO_VEICULO' | 'EMPRESA_TRANSPORTES' | 'COOPERATIVA_LOGISTICA';
  fleetSize: number;
  vehicles: TransporterVehicle[];
  operatingCorridors: string[];
  preferredMunicipalities?: string[];
  maxPayloadKg: number;
  offersColdChain: boolean;
}

export interface BuyerDetails {
  buyerType: 'CONSUMIDOR_FINAL' | 'RESTAURANTE_HOTEL' | 'REVENDA' | 'INSTITUICAO_ESTADO' | 'EMPRESA_TRANSFORMADORA';
  purchasingDepartmentContact?: string;
  preferredCategories?: string[];
  preferredDeliveryProvince?: string;
  defaultDeliveryAddress?: string;
}

export type INSSComplianceStatus = 
  | 'REGULAR' 
  | 'IRREGULAR' 
  | 'ISENTO' 
  | 'EM_ANALISE' 
  | 'NAO_ENCONTRADO';

export type INSSRegimeType = 
  | 'TRABALHADOR_CONTA_PROPRIA' 
  | 'PREI_SIMPLIFICADO' 
  | 'CONTA_OUTREM' 
  | 'MICROEMPRESA' 
  | 'REGIME_GERAL';

export interface INSSValidationResult {
  niss: string;
  nif: string;
  officialEntityName: string;
  entityType: string;
  regime: INSSRegimeType;
  complianceStatus: INSSComplianceStatus;
  statusMessage: string;
  lastContributionPeriod?: string;
  totalContributorsCount?: number;
  certificateIssueDate: string;
  certificateExpiryDate: string;
  certificateCode: string;
  verificationMethod: 'API_OFICIAL_INSS_GOV_AO';
  isVerified: boolean;
  verifiedAt: string;
  qrVerificationUrl?: string;
}

export interface INSSAuditLog {
  id: string;
  timestamp: string;
  nif: string;
  niss?: string;
  queriedByUserId: string;
  queriedByUserName: string;
  queriedByRole: string;
  action: 'CONSULTA_API' | 'VINCULACAO_PERFIL' | 'RENOVACAO_CERTIFICADO' | 'TENTATIVA_ALTERACAO_BLOQUEADA';
  decision: 'SUCCESS' | 'DENIED' | 'BLOCKED_READ_ONLY';
  ipAddress: string;
  userAgent?: string;
  notes: string;
  responseStatus: number;
}

export interface SocialProtectionInfo {
  status: 'INSCRITO' | 'ADERIR_INTERESSE' | 'INFORMATIVO' | 'NAO_ADERIR';
  inssNumber?: string;
  regimeType?: INSSRegimeType;
  verificationStatus: 'NAO_VALIDADO' | 'DECLARADO' | 'VALIDADO_OFICIAL';
  complianceStatus?: INSSComplianceStatus;
  officialName?: string;
  certificateCode?: string;
  certificateExpiryDate?: string;
  declaredAt?: string;
  verifiedAt?: string;
}

export interface TrustVerificationBadge {
  currentLevel: VerificationLevel;
  levelTitle: string;
  verifiedPoints: string[];
  nextRequirements: string[];
  issuedAt: string;
}

// ==========================================
// PROGRAMA DE FORMALIZAÇÃO DE NEGÓCIOS INFORMAIS
// ==========================================

export type FormalizationStageStatus = 
  | 'INFORMAL_REGISTADO'
  | 'DIAGNOSTICO_CONCLUIDO'
  | 'DOCUMENTOS_PENDENTES'
  | 'DOCUMENTOS_SUBMETIDOS'
  | 'EM_ANALISE'
  | 'PENDENTE_CORRECAO'
  | 'ENCAMINHADO_AGT'
  | 'NIF_EM_PROCESSAMENTO'
  | 'NIF_EMITIDO'
  | 'ENCAMINHADO_INSS'
  | 'INSS_EM_PROCESSAMENTO'
  | 'INSS_VINCULADO'
  | 'FORMALIZACAO_CONCLUIDA';

export type InformalActivityType = 
  | 'VENDEDOR_PRACA_MERCADO'
  | 'AGRICULTOR_FAMILIAR'
  | 'PESCADOR_ARTESANAL'
  | 'KUPAPATA_MOTORISTA_LOCAL'
  | 'ARTESAO_MANUAL'
  | 'PRESTADOR_SERVICOS_AUTONOMO'
  | 'COMERCIANTE_AMBULANTE'
  | 'PEQUENA_OFICINA_TRANSFORMACAO'
  | 'OUTRO_INFORMAL';

export interface FormalizationDocument {
  id: string;
  dossierId: string;
  userId: string;
  documentType: DocumentTypeEnum | 'DECLARACAO_ATIVIDADE' | 'FICHA_PREI' | 'GUIA_INSS';
  title: string;
  fileUrl?: string;
  fileName: string;
  fileSizeKb: number;
  fileMimeType: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  verifiedOfficialReference?: string;
}

export interface FormalizationStage {
  id: string;
  dossierId: string;
  stageCode: FormalizationStageStatus;
  stageName: string;
  institutionResponsible: 'AO_MARKET' | 'AGT' | 'INSS' | 'ADMINISTRACAO_MUNICIPAL' | 'GUICHE_UNICO' | 'BANCARIA';
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'BLOQUEADO' | 'REJEITADO';
  startedAt?: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  requiredDocuments: string[];
  submittedDocuments: string[];
}

export interface InstitutionalReferral {
  id: string;
  dossierId: string;
  userId: string;
  targetInstitution: 'AGT' | 'INSS' | 'PREI_GUICHE_UNICO' | 'BANCO_COMERCIAL' | 'ADMINISTRACAO_MUNICIPAL';
  referralCode: string;
  status: 'GERADO' | 'ENCAMINHADO' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'RECUSADO';
  protocolNumber?: string;
  contactPerson?: string;
  notes?: string;
  generatedAt: string;
  forwardedAt?: string;
  completedAt?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
}

export interface INSSVerificationRecord {
  id: string;
  dossierId: string;
  userId: string;
  nif: string;
  niss?: string;
  officialEntityName?: string;
  regimeType: INSSRegimeType;
  verificationMethod: 'MANUAL_COMPROVATIVO' | 'API_OFICIAL_INSS_GOV_AO' | 'GUICHE_PRESENCIAL';
  documentProofUrl?: string;
  documentProofName?: string;
  status: 'AGUARDANDO_VALIDACAO_INSTITUCIONAL' | 'VALIDADO_OFICIAL' | 'REJEITADO' | 'PENDENTE_COMPROVATIVO';
  officialReferenceCode?: string;
  verifiedByAgentId?: string;
  verifiedByAgentName?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface FormalizationAuditLog {
  id: string;
  dossierId: string;
  userId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: 
    | 'DOSSIER_CRIADO'
    | 'DIAGNOSTICO_SUBMETIDO'
    | 'DOCUMENTO_ENVIADO'
    | 'DOCUMENTO_APROVADO'
    | 'DOCUMENTO_REJEITADO'
    | 'ETAPA_AVANCADA'
    | 'ENCAMINHAMENTO_INSTITUCIONAL'
    | 'NIF_ATRIBUIDO'
    | 'INSS_VERIFICADO'
    | 'FORMALIZACAO_FINALIZADA'
    | 'CORRECAO_SOLICITADA';
  previousState?: FormalizationStageStatus;
  newState?: FormalizationStageStatus;
  reason?: string;
  details?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface FormalizationDossier {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  activityType: InformalActivityType;
  activityDescription?: string;
  marketLocation?: string; // ex: "Mercado do Kikolo, Bancada 45"
  province: string;
  municipality: string;
  commune?: string;
  currentVerificationLevel: VerificationLevel;
  status: FormalizationStageStatus;
  progressPercentage: number; // 0 to 100
  hasNif: boolean;
  nifNumber?: string;
  hasBi: boolean;
  biNumber?: string;
  hasInss: boolean;
  inssNumber?: string;
  worksAlone: boolean;
  helpersCount: number;
  currentInstitution: 'AO_MARKET' | 'AGT' | 'INSS' | 'ADMINISTRACAO_MUNICIPAL' | 'GUICHE_UNICO';
  assignedAgentId?: string;
  assignedAgentName?: string;
  requiredDocuments: DocumentTypeEnum[];
  submittedDocumentsCount: number;
  approvedDocumentsCount: number;
  pendingCorrectionCount: number;
  createdAt: string;
  updatedAt: string;
  lastDiagnosisAt?: string;
  estimatedCompletionDate?: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  entityType?: EntityType;
  activeProfiles?: ActorProfileType[];
  avatar?: string;
  birthDate?: string;
  province: string;
  municipality: string;
  commune?: string;
  locality?: string;
  address: string;
  landmarkReference?: string;
  
  // Registration Lifecycle & Status
  accountStatus?: AccountRegistrationStatus;
  accountStatusReason?: string;
  missingDocuments?: string[];
  verificationLevel: VerificationLevel;
  
  // Formalization & INSS
  isFormalized: boolean;
  formalizationStatus?: FormalizationOption;
  formalizationDossierId?: string;
  formalizationStage?: FormalizationStageStatus;
  informalActivityType?: InformalActivityType;
  marketPlaceLocation?: string;
  preiRegistrationNumber?: string;
  inssNumber?: string;
  inssEnrollmentStatus?: InssOption;
  inssVerified?: boolean;
  inssComplianceStatus?: INSSComplianceStatus;
  inssVerifiedAt?: string;
  inssCertificateCode?: string;
  inssOfficialName?: string;
  inssRegime?: INSSRegimeType;
  inssLastSyncAt?: string;
  nif?: string;
  biNumber?: string;
  
  // Company & Multi-service Profile
  companyId?: string;
  companyName?: string;
  companyRole?: CompanyTeamRole;
  customPermissions?: PermissionAction[];
  companyServices?: CompanyServiceType[];
  companyTeamMembers?: CompanyTeamMember[];
  legalRepresentative?: {
    name: string;
    bi: string;
    phone?: string;
    email?: string;
  };
  bankDetails?: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
  
  // Reputation & Stats
  reputationScore: number; // 0 - 5.0
  completedTransactions: number;
  fulfillmentRate: number; // percentage (e.g. 98.5)
  avgResponseTimeMin: number;
  badge?: string;
  joinedAt: string;
  
  // Enhanced detailed profiles
  producerData?: ProducerDetails;
  merchantData?: MerchantDetails;
  transporterData?: TransporterDetails;
  buyerData?: BuyerDetails;
  socialProtection?: SocialProtectionInfo;
  documents?: UserDocument[];
  trustBadge?: TrustVerificationBadge;
  auditLogs?: RegistrationAuditLog[];
}

export type ProductCategory = 
  | 'agricultura_frescos'
  | 'alimentos_frescos'
  | 'graos_cereais'
  | 'pecuaria_carnes'
  | 'pesca_mariscos'
  | 'transformacao_nacional'
  | 'moda_beleza'
  | 'eletronicos'
  | 'lar_decoracao'
  | 'artesanato_ao'
  | 'materiais_construcao'
  | 'bebidas_embalados'
  | 'artesanato_utilidades';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number; // in AOA (Kwanzas)
  unit: string; // 'kg', 'saco 50kg', 'tonelada', 'caixa', 'unidade', 'litro'
  minOrderQuantity: number;
  availableStock: number;
  originProvince: string;
  originMunicipality: string;
  farmOrFactoryName: string;
  isProducedInAngola: boolean;
  images: string[];
  producerId: string;
  producerName: string;
  producerCompanyId?: string;
  producerVerification: VerificationLevel;
  b2bBulkPricing?: {
    minQuantity: number;
    pricePerUnit: number;
  }[];
  harvestDate?: string;
  expiryDate?: string;
  weightKgPerUnit: number;
  volumeM3PerUnit: number;
  requiresRefrigeration: boolean;
  rating: number;
  reviewCount: number;
  status?: 'ATIVO' | 'DESATIVADO' | 'EM_ANALISE';
}

export type OrderStatus = 
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'DRIVER_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 
  | 'MULTICAIXA_EXPRESS'
  | 'TRANSFERENCIA_BANCARIA'
  | 'REFERENCIA_MULTICAIXA'
  | 'PAGAMENTO_ENTREGA';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  weightKg: number;
  image: string;
  producerId: string;
  producerName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompanyId?: string;
  sellerCompanyId?: string;
  items: OrderItem[];
  subtotal: number;
  freightCost: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  isPaymentEscrowed: boolean;
  destinationProvince: string;
  destinationMunicipality: string;
  destinationAddress: string;
  deliveryNotes?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  pickupOtpCode: string;
  deliveryOtpCode: string;
  createdAt: string;
  updatedAt: string;
  isB2B: boolean;
  quotationId?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export type VehicleType = 
  | 'MOTO_KUPAPATA'
  | 'CARRINHA_CANTER'
  | 'CAMIAO_3_5T'
  | 'CAMIAO_PESADO_10T'
  | 'CAMIAO_FRIGORIFICO';

export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleCapacityKg: number;
  vehicleVolumeM3: number;
  hasRefrigeration: boolean;
  currentProvince: string;
  operatingProvinces: string[];
  isAvailable: boolean;
  rating: number;
  totalDeliveries: number;
  earningsBalanceAOA: number;
  isFormalizedINSS: boolean;
}

export interface FreightLoad {
  id: string;
  orderId: string;
  originProvince: string;
  originMunicipality: string;
  originAddress: string;
  destinationProvince: string;
  destinationMunicipality: string;
  destinationAddress: string;
  cargoDescription: string;
  totalWeightKg: number;
  totalVolumeM3: number;
  requiresColdChain: boolean;
  recommendedVehicle: VehicleType;
  suggestedFreightAOA: number;
  distanceKm: number;
  status: 'PENDING_ACCEPTANCE' | 'ASSIGNED' | 'IN_TRANSIT' | 'COMPLETED';
  urgency: 'NORMAL' | 'EXPRESS' | 'AGENDADA';
  createdAt: string;
}

export interface B2BQuotationRequest {
  id: string;
  buyerCompany: string;
  buyerId: string;
  buyerNif: string;
  producerId: string;
  productTitle: string;
  requestedQuantity: number;
  targetPriceAOA?: number;
  deliveryProvince: string;
  frequency: 'PONTUAL' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL';
  status: 'ABERTO' | 'RESPONDIDO' | 'ACEITE' | 'RECUSADO';
  quotedPriceAOA?: number;
  notes: string;
  createdAt: string;
}

export interface DisputeRecord {
  id: string;
  orderId: string;
  complainantRole: 'BUYER' | 'SELLER' | 'DRIVER';
  complainantName: string;
  reason: 'PRODUTO_DANIFICADO' | 'NAO_RECEBIDO' | 'QUANTIDADE_INCORRETA' | 'ATRASO_GRAVE' | 'DISCREPANCIA_QUALIDADE';
  description: string;
  evidenceUrls: string[];
  status: 'EM_ANALISE' | 'RESOLVIDO_REEMBOLSO' | 'RESOLVIDO_LIBERACAO' | 'RECUSADO';
  escrowHeldAmountAOA: number;
  createdAt: string;
  resolutionNotes?: string;
}

export interface SocialSecuritySimulation {
  activityType: 'AGRICULTOR_INDIVIDUAL' | 'COMERCIANTE_INFORMAL' | 'MOTORISTA_KUPAPATA' | 'MICROEMPRESA';
  estimatedMonthlyIncomeAOA: number;
  contributionBaseAOA: number;
  monthlyContributionAOA: number; // Standard ~8% for self-employed or tiered
  employerContributionAOA?: number; // If applicable for microenterprises
  accessibleBenefits: {
    title: string;
    description: string;
    coverage: string;
  }[];
  ecosystemPerks: string[];
}

export interface EcosystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'FORMALIZATION' | 'SECURITY' | 'B2B';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  orderId?: string;
  companyId?: string;
  isFlaggedForDisintermediation?: boolean;
  flagReason?: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FLAGGED_BLOCKED';
}

export interface DisintermediationAlert {
  id: string;
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  suspiciousText: string;
  flaggedKeywords: string[];
  severity: 'ALTO' | 'MEDIO' | 'BAIXO';
  timestamp: string;
  status: 'PENDENTE_REVISAO' | 'AVISADO' | 'SANCIONADO' | 'FALSO_POSITIVO';
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'visitor';
  companyId?: string;
  actionRequested: string;
  targetResource: string;
  resourceId?: string;
  decision: 'ALLOWED' | 'DENIED_UNAUTHENTICATED' | 'DENIED_FORBIDDEN' | 'DENIED_OWNERSHIP' | 'DENIED_TENANT' | 'DENIED_INVALID_STATE';
  httpStatus: 200 | 201 | 401 | 403 | 422;
  rejectionReason?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface SecurityTestCase {
  id: string;
  title: string;
  category: 'AUTENTICACAO' | 'OWNERSHIP' | 'RBAC_PERMISSOES' | 'MULTI_TENANT' | 'MAQUINA_ESTADOS' | 'SUPORTE_LIMITS' | 'DESINTERMEDIACAO' | 'INSS_INTEGRIDADE';
  description: string;
  actorDescription: string;
  actorRole: UserRole | 'visitor';
  actorId: string;
  companyId?: string;
  targetEndpoint: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestPayload?: any;
  targetResourceOwnerId?: string;
  targetResourceCompanyId?: string;
  expectedStatus: 401 | 403 | 422;
  expectedErrorCode: string;
  securityPrinciple: string;
}

export interface SecurityTestResult {
  testId: string;
  passed: boolean;
  executedAt: string;
  httpStatus: number;
  responsePayload: any;
  durationMs: number;
  message: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  orderId: string;
  userId: string;
  userName: string;
  userProvince?: string;
  userVerificationLevel?: VerificationLevel;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface PlatformConfig {
  escrowHoldDays: number;
  marketplaceCommissionPercent: number;
  disintermediationAlertsEnabled: boolean;
  requireBiForHighValueTransactions: boolean;
  minimumOrderValueAOA: number;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

