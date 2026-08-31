export interface BacklogItem {
  id: string;
  epic: string;
  title: string;
  description: string;
  priority: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  status: 'Concluído' | 'Não Concluído';
  storyPoints: number;
  acceptanceCriteria: string;
  technicalNotes: string;
}

export const PRODUCT_BACKLOG_DATA: BacklogItem[] = [
  {
    id: 'AOM-01',
    epic: 'Autenticação & Identidade',
    title: 'Registo e Gestão de Perfis de Utilizadores',
    description: 'Permitir o registo completo de Produtores, Compradores, Transportadores e Empresas com localização geográfica em Angola.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Utilizador escolhe perfil, província, município e introduz contactos válidos.',
    technicalNotes: 'Implementado no RegistrationFlow e AuthModal com dados de 18 províncias.'
  },
  {
    id: 'AOM-02',
    epic: 'Autenticação & Identidade',
    title: 'Prevenção de Duplicados por NIF, Email e Telefone',
    description: 'Bloqueio estrito de contas duplicadas com os mesmos identificadores fiscais ou de contacto.',
    priority: 'Crítica',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'O backend rejeita registos com NIF/Email/Telefone já registados retornando HTTP 409.',
    technicalNotes: 'Implementado no endpoint /api/auth/register em server.ts.'
  },
  {
    id: 'AOM-03',
    epic: 'Gestão Documental',
    title: 'Upload Real de Documentos para o Firebase Storage',
    description: 'Submissão e armazenamento de ficheiros reais de identificação (BI, NIF, Carta, Livrete).',
    priority: 'Crítica',
    status: 'Concluído',
    storyPoints: 8,
    acceptanceCriteria: 'Ficheiros guardados no Firebase Storage com URL acessível e metadados reais.',
    technicalNotes: 'Integrado via storageService.ts no RegistrationFlow e DocumentVerificationCenter.'
  },
  {
    id: 'AOM-04',
    epic: 'Gestão Documental',
    title: 'Portal de Verificação Documental e Auditoria',
    description: 'Visualização e acompanhamento do estado de análise e aprovação de cada documento.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Utilizador e auditor conseguem ver documentos pendentes, aprovados e rejeitados.',
    technicalNotes: 'Componente DocumentVerificationCenter integrado no ecossistema.'
  },
  {
    id: 'AOM-05',
    epic: 'Confiança & Verificação',
    title: 'Motor de Cálculo Estrito de Nível de Confiança (1 a 5)',
    description: 'Atribuição matemática e segura do nível de confiança baseado em aprovações documentais.',
    priority: 'Crítica',
    status: 'Concluído',
    storyPoints: 8,
    acceptanceCriteria: 'Nível 3+ só é concedido após aprovação formal de documentos auditados.',
    technicalNotes: 'Motor implementado em verificationEngine.ts e sincronizado no MarketContext.'
  },
  {
    id: 'AOM-06',
    epic: 'Marketplace de Produtos',
    title: 'Publicação de Lotes e Produtos Agropecuários',
    description: 'Produtores publicam colheitas indicando província, categoria, quantidade e preço em Kwanzas.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Produto publicado com sucesso e visível no catálogo geral.',
    technicalNotes: 'Implementado no ProducerPortal e persistido no Firestore/Memory.'
  },
  {
    id: 'AOM-07',
    epic: 'Marketplace de Produtos',
    title: 'Validação Estrita de Fotografias Reais de Produtos',
    description: 'Exigência de fotos reais enviadas ao Storage, rejeitando imagens genéricas da web.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Backend e frontend impedem criação de anúncios sem fotos reais.',
    technicalNotes: 'Implementado no RealImageUploader e endpoint /api/products.'
  },
  {
    id: 'AOM-08',
    epic: 'Marketplace de Produtos',
    title: 'Catálogo de Produtos com Filtros e Pesquisa',
    description: 'Compradores navegam por categorias, províncias e pesquisam produtos disponíveis.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Listagem dinâmica com ordenação por preço, relevância e localização.',
    technicalNotes: 'Implementado no MarketplaceView com badges de selo nacional.'
  },
  {
    id: 'AOM-09',
    epic: 'Encomendas & Carrinho',
    title: 'Carrinho de Compras e Fluxo de Checkout',
    description: 'Seleção de itens de múltiplos produtores, cálculo de totais e submissão de pedidos.',
    priority: 'Alta',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Cálculo de subtotais, morada de entrega e emissão de número de encomenda.',
    technicalNotes: 'Componente CartAndCheckoutModal com suporte a reservas de stock.'
  },
  {
    id: 'AOM-10',
    epic: 'Logística & Transportes',
    title: 'Portal do Transportador e Cotação de Fretes',
    description: 'Gestão de frotas rodoviárias e cotação de fretes por rotas interprovinciais.',
    priority: 'Média',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Transportador visualiza pedidos de carga e submete ofertas de transporte.',
    technicalNotes: 'Componente LogisticsPortal com calculadora de distância/custo.'
  },
  {
    id: 'AOM-11',
    epic: 'Proteção Social & INSS',
    title: 'Portal de Formalização e Diagnóstico INSS',
    description: 'Simulação de regime de segurança social e apoio à formalização de produtores.',
    priority: 'Média',
    status: 'Concluído',
    storyPoints: 8,
    acceptanceCriteria: 'Diagnóstico institucional e verificação do estado contributivo.',
    technicalNotes: 'Componentes SocialProtectionPortal e FormalizationTrackerHub.'
  },
  {
    id: 'AOM-12',
    epic: 'Auditoria & Resolução',
    title: 'Centro de Disputas e Mediação de Transações',
    description: 'Canal de mediação de litígios e auditoria de conformidade entre compradores e produtores.',
    priority: 'Média',
    status: 'Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Registo de ocorrências e resolução supervisionada por administradores.',
    technicalNotes: 'Componente DisputesPortal com registo imutável de ações.'
  },
  {
    id: 'AOM-13',
    epic: 'Integração de Pagamentos',
    title: 'Gateway Multicaixa Express (MCX) / GPO Real',
    description: 'Integração direta com o gateway da EMIS/GPO para liquidação bancária automatizada.',
    priority: 'Alta',
    status: 'Não Concluído',
    storyPoints: 13,
    acceptanceCriteria: 'Geração de referência Multicaixa real com webhook de confirmação imediata.',
    technicalNotes: 'Requer credenciais de produção e certificado bancário EMIS.'
  },
  {
    id: 'AOM-14',
    epic: 'Notificações',
    title: 'Notificações Push via SMS para Produtores Rurais',
    description: 'Disparo de SMS para telemóveis básicos de produtores rurais sem acesso à internet.',
    priority: 'Alta',
    status: 'Não Concluído',
    storyPoints: 8,
    acceptanceCriteria: 'Produtor recebe SMS ao ter uma nova compra ou transportador atribuído.',
    technicalNotes: 'Integração com gateway SMS (Twilio ou operadoras Unitel/Africell).'
  },
  {
    id: 'AOM-15',
    epic: 'Logística Avançada',
    title: 'Rastreio GPS em Tempo Real de Cargas Rodoviárias',
    description: 'Acompanhamento por mapa em tempo real da viatura em trânsito entre províncias.',
    priority: 'Média',
    status: 'Não Concluído',
    storyPoints: 13,
    acceptanceCriteria: 'Comprador e produtor visualizam a localização do camião no mapa.',
    technicalNotes: 'Requer telemetria via app móvel e streaming WebSockets.'
  },
  {
    id: 'AOM-16',
    epic: 'Faturação Legal',
    title: 'Emissão Automática de Faturas Certificadas AGT',
    description: 'Geração de faturas proforma e definitivas com assinatura digital e hash AGT.',
    priority: 'Alta',
    status: 'Não Concluído',
    storyPoints: 13,
    acceptanceCriteria: 'Download de PDF com selo de software certificado e QR Code fiscal.',
    technicalNotes: 'Integração com API de faturação certificada em Angola.'
  },
  {
    id: 'AOM-17',
    epic: 'Modo Offline / PWA',
    title: 'Sincronização Offline para Lançamento no Campo',
    description: 'Possibilidade de registar colheitas e pesagens sem rede com sincronização posterior.',
    priority: 'Média',
    status: 'Não Concluído',
    storyPoints: 8,
    acceptanceCriteria: 'Aplicação funciona sem rede e sincroniza automaticamente ao reconectar.',
    technicalNotes: 'Implementação de IndexedDB local e Service Worker Background Sync.'
  },
  {
    id: 'AOM-18',
    epic: 'Relatórios & Exportação',
    title: 'Dashboard Analítico com Exportação Excel/PDF Avançada',
    description: 'Painéis consolidados de volume financeiro, safras e fretes com relatórios para bancos.',
    priority: 'Baixa',
    status: 'Não Concluído',
    storyPoints: 5,
    acceptanceCriteria: 'Exportação em 1 clique de balanços por cooperativa e produtor.',
    technicalNotes: 'Geração de gráficos de evolução e agregação temporal.'
  }
];
