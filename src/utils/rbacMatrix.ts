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
    'orders:evaluate',
    'payments:read',
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
    'chats:send',
    'inss:validate',
    'inss:link'
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
    'orders:evaluate',
    'transport:read',
    'documents:upload',
    'documents:read',
    'chats:read',
    'chats:send',
    'disputes:create',
    'disputes:read',
    'inss:validate',
    'inss:link'
  ],

  driver: [
    'transport:read',
    'transport:accept',
    'transport:reject',
    'transport:status_update',
    'transport:confirm_pickup',
    'transport:confirm_delivery',
    'documents:upload',
    'documents:read',
    'chats:read',
    'chats:send',
    'inss:validate',
    'inss:link'
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
    'chats:send',
    'inss:validate',
    'inss:link'
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
    'orders:evaluate',
    'transport:read',
    'transport:accept',
    'transport:status_update',
    'documents:upload',
    'documents:read',
    'payments:read',
    'chats:read',
    'chats:send',
    'disputes:create',
    'disputes:read',
    'inss:validate',
    'inss:link'
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
    'disputes:resolve',
    'inss:audit_read'
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
    'orders:evaluate',
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
    'disputes:resolve',
    'inss:validate',
    'inss:link',
    'inss:audit_read',
    'formalization:read',
    'formalization:create',
    'formalization:update',
    'formalization:approve',
    'formalization:reject',
    'formalization:refer',
    'formalization:audit'
  ],

  formalization_agent: [
    'users:read',
    'documents:read',
    'documents:approve',
    'documents:reject',
    'formalization:read',
    'formalization:create',
    'formalization:update',
    'formalization:approve',
    'formalization:reject',
    'formalization:refer',
    'formalization:audit',
    'inss:validate',
    'inss:link',
    'inss:audit_read',
    'chats:read',
    'chats:send'
  ],

  inss_auditor: [
    'users:read',
    'documents:read',
    'formalization:read',
    'formalization:audit',
    'inss:validate',
    'inss:link',
    'inss:audit_read',
    'system:view_audit_logs'
  ]
};

/**
 * Explicit Persona Profiles Definition according to Sovereign Market Requirements:
 * - Produtor: cadastra produtos, gere stock, define preços, recebe pedidos e vende.
 * - Comerciante: compra para revender, publica produtos/serviços, gere vendas, stock e pedidos.
 * - Comprador: pesquisa, compara, compra, paga, acompanha entregas e avalia.
 * - Transportadora: recebe, aceita, recolhe, transporta, atualiza e confirma entregas.
 * - Administrador: gere utilizadores, documentos, produtos, pagamentos, disputas, denúncias e configurações.
 */
export const OFFICIAL_PERSONA_PROFILES = [
  {
    role: 'producer' as UserRole,
    title: 'Produtor Rural',
    description: 'Cadastra produtos e lotes agrícolas, gere stock e inventário, define preços unitários e por atacado, recebe pedidos de compra e vende a sua produção com emissão de guia de recolha com PIN OTP.',
    coreActions: [
      'Cadastrar produtos e lotes de colheita',
      'Gerir stock e disponibilidade em fazenda',
      'Definir preços e quantidades mínimas',
      'Receber e aceitar pedidos de compra',
      'Vender e libertar carga com PIN de recolha',
      'Validar e associar NISS/NIF oficial do INSS'
    ],
    prohibitedActions: [
      'Comprar para revender como comerciante',
      'Aceitar ordens de frete rodoviário',
      'Moderar utilizadores ou alterar dados alheios'
    ]
  },
  {
    role: 'merchant' as UserRole,
    title: 'Comerciante & Grossista',
    description: 'Compra produtos para revender no atacado/retalho, publica produtos e serviços de distribuição/armazém, gere as suas vendas, stock em armazém e gere pedidos recebidos de clientes.',
    coreActions: [
      'Comprar produtos e lotes para revenda no atacado',
      'Publicar produtos e serviços de revenda/distribuição',
      'Gerir stock e inventário de armazém',
      'Gerir vendas e pedidos de clientes',
      'Emitir cotações em grande escala (RFQ)',
      'Validar conformidade INSS da empresa'
    ],
    prohibitedActions: [
      'Operar transportes rodoviários como transportadora',
      'Aceder a dados administrativos de outros utilizadores'
    ]
  },
  {
    role: 'buyer' as UserRole,
    title: 'Comprador (Consumidor & Empresa)',
    description: 'Pesquisa o catálogo nacional, compara preços entre províncias, compra produtos no retalho ou atacado, paga via Multicaixa Express / Custódia AO Protect, acompanha o transporte e entregas em tempo real e avalia vendedores.',
    coreActions: [
      'Pesquisar e comparar produtos no Catálogo Nacional',
      'Comprar produtos e fechar encomendas',
      'Pagar com segurança e custódia protegida',
      'Acompanhar entregas e rastreio rodoviário',
      'Validar entrega final com PIN OTP de descarga',
      'Avaliar produtores, comerciantes e transportadores'
    ],
    prohibitedActions: [
      'Cadastrar produtos para venda',
      'Gerir inventários de vendedores',
      'Aceitar serviços de frete'
    ]
  },
  {
    role: 'driver' as UserRole,
    title: 'Transportadora / Motorista',
    description: 'Recebe ofertas de frete na Bolsa de Cargas, aceita rotas rodoviárias, recolhe a mercadoria na origem com validação de PIN do produtor, transporta pelos corredores rodoviários, atualiza o estado em trânsito e confirma entregas com PIN do comprador.',
    coreActions: [
      'Receber ofertas de frete na Bolsa de Cargas',
      'Aceitar ordens de transporte interprovincial',
      'Recolher mercadoria com validação de PIN de recolha',
      'Transportar nos corredores logísticos nacionais',
      'Atualizar estado da viagem (Em Trânsito, Atraso, etc.)',
      'Confirmar entrega mediante PIN de descarga do comprador',
      'Validar conformidade contributiva INSS do transportador'
    ],
    prohibitedActions: [
      'Publicar produtos para venda',
      'Comprar mercadorias para revenda',
      'Alterar preços ou cancelar pedidos alheios'
    ]
  },
  {
    role: 'admin' as UserRole,
    title: 'Administrador (Supervisão Nacional)',
    description: 'Gere utilizadores (aprovação, suspensão, auditoria), documentos fiscais e legais, moderação de produtos, pagamentos e custódia bancária, disputas e mediações, denúncias de segurança e configurações do sistema.',
    coreActions: [
      'Gerir utilizadores e perfis (aprovar, suspender, auditar)',
      'Validar e aprovar documentos fiscais e empresariais',
      'Moderar produtos e catálogo nacional',
      'Supervisionar pagamentos e custódia financeira',
      'Gerir disputas e mediações de litígios (AO Protect)',
      'Monitorizar denúncias e alertas de desintermediação',
      'Consultar logs de auditoria INSS e de segurança',
      'Gerir parâmetros e configurações da plataforma'
    ],
    prohibitedActions: [
      'Alterar dados do INSS diretamente (Read-Only Governamental)',
      'Executar ações sem registo no log de auditoria imutável'
    ]
  },
  {
    role: 'formalization_agent' as UserRole,
    title: 'Agente de Formalização AO MARKET',
    description: 'Acompanha o processo de saída da informalidade, analisa dossiês, valida comprovativos, apoia emissão de NIF junto da AGT e encaminhamento para Segurança Social (INSS/PREI).',
    coreActions: [
      'Analisar dossiês de formalização de negócios informais',
      'Validar documentos (BI, declaração de atividade, guias)',
      'Solicitar correções e esclarecimentos a empreendedores',
      'Avançar etapas do dossiê institucional',
      'Emitir guias e códigos de encaminhamento institucional',
      'Registar auditoria imutável de todas as decisões tomadas'
    ],
    prohibitedActions: [
      'Forjar certidões ou comprovativos governamentais',
      'Alterar produtos ou realizar compras no marketplace',
      'Alterar permissões de utilizadores administradores'
    ]
  },
  {
    role: 'inss_auditor' as UserRole,
    title: 'Auditor Governamental / INSS',
    description: 'Audita conformidade previdenciária e contributiva, valida certidões e comprovativos de inscrição, e inspeciona trilhas de auditoria institucional.',
    coreActions: [
      'Verificar regularidade contributiva e inscrições no INSS',
      'Validar comprovativos e certidões de não devedor',
      'Consultar trilhas de auditoria e verificação institucional',
      'Emitir relatórios de conformidade da segurança social'
    ],
    prohibitedActions: [
      'Modificar dados cadastrais de produtos ou encomendas',
      'Efetuar operações financeiras na plataforma'
    ]
  }
];

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
