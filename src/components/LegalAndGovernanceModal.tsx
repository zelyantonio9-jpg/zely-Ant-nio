import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  UserCheck, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Star, 
  ShieldAlert, 
  Lock, 
  RefreshCw, 
  Database, 
  FileText, 
  HeartHandshake, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Building2,
  FileSpreadsheet,
  Search,
  BookOpen,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Logo } from './Logo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type LegalDocTab = 'terms' | 'privacy' | 'governance' | 'returns' | 'faq' | 'contacts';

interface LegalAndGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalDocTab;
}

export const LegalAndGovernanceModal: React.FC<LegalAndGovernanceModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'terms'
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocTab>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [governanceCategory, setGovernanceCategory] = useState<'ALL' | 'CONTAS' | 'PRODUTOS_VENDAS' | 'PAGAMENTOS' | 'LOGISTICA' | 'DISPUTAS' | 'SEGURANCA'>('ALL');
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Sync initialTab when modal opens with a specific tab
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // -------------------------------------------------------------
  // 1. TERMOS E CONDIÇÕES DATA
  // -------------------------------------------------------------
  const termsSections = [
    {
      id: 'term-preamble',
      title: 'Preâmbulo & Enquadramento Jurídico',
      badge: 'Legislação Angolana',
      content: [
        'O presente documento estabelece as Condições Gerais de Acesso e Utilização da plataforma AO MARKET (doravante designada "Plataforma" ou "AO MARKET"), operada em conformidade com o ordenamento jurídico da República de Angola, nomeadamente o Código Comercial, a Lei n.º 1/07 das Actividades Comerciais, a Lei n.º 22/11 de Protecção de Dados Pessoais e as diretrizes do Banco Nacional de Angola (BNA) para pagamentos eletrónicos e custódia financeira.',
        'O registo, acesso ou utilização contínua da Plataforma por produtores rurais, comerciantes grossistas, transportadores rodoviários ou compradores finais implica a aceitação plena, integral e sem reservas dos presentes Termos e Condições, bem como da Política de Privacidade e do Regulamento de Governação do Ecossistema.'
      ]
    },
    {
      id: 'term-nature',
      title: 'Cláusula 1.ª — Objeto e Natureza da Plataforma',
      badge: 'Intermediação & Custódia',
      content: [
        '1. O AO MARKET é uma plataforma tecnológica multilateral concebida para estruturar e acelerar o escoamento agro-industrial e mercantil no território da República de Angola.',
        '2. A Plataforma conecta cooperativas agrícolas, fazendas de produção, distribuidores grossistas, operadores logísticos rodoviários e compradores institucionais ou individuais, disponibilizando infraestrutura de catálogo digital, cotações de referência, cálculo de rotas rodoviárias e câmara de custódia financeira (AO Protect Escrow).',
        '3. PRINCÍPIO CENTRAL DE RESPONSABILIDADE: O AO MARKET atua como facilitador tecnológico e intermediário neutro. Cada parte interveniente (Vendedor, Comprador ou Transportador) mantém responsabilidade jurídica, comercial, fiscal e operacional estritamente individual e integral pela sua respetiva atividade.'
      ]
    },
    {
      id: 'term-eligibility',
      title: 'Cláusula 2.ª — Elegibilidade, Cadastro e Capacidade Jurídica',
      badge: 'Identidade Verificada',
      content: [
        '1. Podem registar-se no AO MARKET pessoas singulares maiores de 18 anos dotadas de plena capacidade jurídica e munidas de Bilhete de Identidade (B.I.) angolano válido ou Passaporte com visto de residência, bem como Número de Identificação Fiscal (NIF).',
        '2. As entidades coletivas (cooperativas, sociedades comerciais, empresas de transporte) devem fazer-se representar pelos seus legítimos representantes legais, devidamente instruídas com Certidão Comercial / Alvará Comercial / Licença de Transporte e NIF institucional.',
        '3. É estritamente vedada a criação de identidades falsas, contas duplicadas para a mesma pessoa física ou personas fictícias. A cada utilizador corresponde uma conta real e verificada.'
      ]
    },
    {
      id: 'term-sellers',
      title: 'Cláusula 3.ª — Publicação de Lotes e Obrigações dos Produtores/Vendedores',
      badge: 'Obrigações do Vendedor',
      content: [
        '1. O Vendedor declara e garante que os produtos publicados no catálogo pertencem à sua produção legítima ou stock comercial, cumprindo as normas fitossanitárias, de higiene, de pesagem e de segurança alimentar vigentes em Angola.',
        '2. As fotografias carregadas no lote devem corresponder obrigatoriamente à mercadoria física real, sendo expressamente proibido o uso de ilustrações enganosas.',
        '3. Todos os preços devem ser expressos em Kwanzas (AOA), indicando claramente se incluem ou não custos de carga e o enquadramento em sede de Imposto sobre o Valor Acrescentado (IVA).',
        '4. O Vendedor é civil e financeiramente responsável por quaisquer divergências de teor de humidade, avaria ou falta de quantidade apuradas no ato de carregamento na fazenda ou armazém.'
      ]
    },
    {
      id: 'term-buyers',
      title: 'Cláusula 4.ª — Compras, Pedidos e Deveres dos Compradores',
      badge: 'Deveres do Comprador',
      content: [
        '1. O Comprador compromete-se a fornecer informações rigorosas e completas sobre a morada, coordenadas ou ponto de descarga da mercadoria.',
        '2. O Comprador deve garantir a presença de equipa de receção e descarregamento no destino acordado e realizar a conferência física no ato da entrega.',
        '3. A confirmação da receção é formalizada através do fornecimento do código PIN OTP de Entrega ao motorista do frete. A inserção do PIN OTP constitui quitação e validação final irrevogável da conformidade do lote entregue.'
      ]
    },
    {
      id: 'term-payments',
      title: 'Cláusula 5.ª — Pagamentos e Câmara de Custódia (Escrow AO Protect)',
      badge: 'Segurança Financeira',
      content: [
        '1. Todas as transações financeiras na Plataforma são liquidadas exclusivamente pelos métodos oficiais integrados: Multicaixa Express (GPO), Transferência Bancária Referenciada BNA ou Carteira Digital AO PAY.',
        '2. CUSTÓDIA FINANCEIRA (ESCROW): No momento da encomenda, o valor total (mercadorias + frete rodoviário + taxa de serviço) é debitado do Comprador e mantido sob custódia fiduciária segura.',
        '3. Os montantes sob custódia só são libertados e transferidos para as contas do Vendedor e do Transportador após a validação biométrica/OTP do recebimento físico.',
        '4. São expressamente proibidos pagamentos diretos por fora da Plataforma com o objetivo de contornar a câmara de custódia, implicando tal prática o cancelamento imediato da conta e exclusão da proteção AO Protect.'
      ]
    },
    {
      id: 'term-logistics',
      title: 'Cláusula 6.ª — Logística Rodoviária e Transporte de Cargas',
      badge: 'AO Logistics',
      content: [
        '1. Os operadores de transporte rodoviário devem possuir livrete, título de registo de propriedade da viatura, seguro de responsabilidade civil/carga em dia e inspeção periódica válida.',
        '2. O motorista responde pela guarda, amarração, proteção contra intempéries e integridade da carga desde a recolha no ponto de origem até à entrega efetiva.',
        '3. É obrigatória a validação de duplo PIN OTP: (i) OTP de Recolha na Fazenda junto do Produtor; (ii) OTP de Descarga no Destino junto do Comprador.',
        '4. Qualquer atraso por motivo de força maior (avaria mecânica, bloqueio de via, intempérie severa) deve ser imediatamente reportado na aplicação para registo de auditoria.'
      ]
    },
    {
      id: 'term-cancellations',
      title: 'Cláusula 7.ª — Política de Cancelamentos, Devoluções e Reembolsos',
      badge: 'Reembolsos Claros',
      content: [
        '1. ANTES DA EXPEDIÇÃO (Estado PENDENTE/PAGO): O Comprador pode cancelar o pedido sem penalização com reembolso a 100% dos valores retidos em custódia.',
        '2. EM TRÂNSITO RODOVIÁRIO (Estado EM_TRÂNSITO): O cancelamento unilateral pelo comprador não desobriga do pagamento integral da taxa de frete incorrida pelo motorista.',
        '3. APÓS ENTREGA (Estado ENTREGUE): O cancelamento apenas é admissível mediante abertura formal de Disputa no AO Protect, acompanhada de fotografias e laudo de não conformidade no prazo máximo de 24 horas para produtos perecíveis e 48 horas para produtos não perecíveis.'
      ]
    },
    {
      id: 'term-disputes',
      title: 'Cláusula 8.ª — Mediação Oficial e Tribunal Arbitral AO Protect',
      badge: 'Mediação Justa',
      content: [
        '1. Em caso de litígio entre Vendedor, Comprador ou Transportador quanto a pesagens, qualidade ou prazos, as partes elegem expressamente a câmara técnica AO Protect como órgão prévio de conciliação e mediação administrativa.',
        '2. A mediação analisa os manifestos de carga, registos temporais de auditoria, geolocalização e fotos da entrega para emitir uma decisão executória sobre a libertação total ou parcial dos fundos em custódia.',
        '3. Caso não seja obtido acordo amigável, é competente o Foro da Comarca de Luanda, com expressa renúncia a qualquer outro.'
      ]
    },
    {
      id: 'term-termination',
      title: 'Cláusula 9.ª — Suspensão de Contas e Disposições Finais',
      badge: 'Conformidade',
      content: [
        '1. O AO MARKET reserva-se o direito de suspender cautelarmente ou cancelar em definitivo o acesso de utilizadores que pratiquem fraudes, publiquem dados fictícios, desrespeitem o isolamento de dados ou adotem conduta desleal.',
        '2. Os presentes Termos podem ser atualizados periodicamente para refletir alterações legislativas ou operacionais, sendo as novas versões notificadas aos utilizadores com antecedência razoável.'
      ]
    }
  ];

  // -------------------------------------------------------------
  // 2. POLÍTICA DE PRIVACIDADE DATA
  // -------------------------------------------------------------
  const privacySections = [
    {
      id: 'priv-intro',
      title: '1. Compromisso & Enquadramento Legal (Lei n.º 22/11)',
      badge: 'APD Angola',
      content: [
        'A sua privacidade e a proteção dos seus dados pessoais são fundamentais para o AO MARKET. Esta Política de Privacidade descreve como recolhemos, utilizamos, tratamos, protegemos e armazenamos as suas informações pessoais e empresariais, em estrita observância da Lei n.º 22/11, de 7 de Maio (Lei de Protecção de Dados Pessoais da República de Angola) e das orientações da Agência de Protecção de Dados (APD).',
        'Ao utilizar a plataforma AO MARKET, o utilizador consente expressamente o tratamento dos seus dados nos termos descritos neste documento.'
      ]
    },
    {
      id: 'priv-collected',
      title: '2. Categorias de Dados Recolhidos',
      badge: 'Minimização de Dados',
      content: [
        'A recolha de dados orienta-se pelo princípio da minimização, solicitando apenas o estritamente necessário para cada finalidade:',
        'a) Dados de Identificação Civil e Fiscal: Nome completo, denominação social, número do Bilhete de Identidade (B.I.), Passaporte, Número de Identificação Fiscal (NIF) e data de nascimento.',
        'b) Dados de Contacto e Localização: Número de telemóvel, endereço de correio eletrónico (e-mail), província, município, comuna, morada de entrega e coordenadas geográficas (GPS) de fazendas, armazéns e pontos de descarga.',
        'c) Dados Comerciais e Operacionais: Documentos de habilitação (Alvará Comercial, Certidão de Registo Comercial, Cartão de Produtor Rural, Licença de Transporte Rodoviário, Livrete de Viatura), histórico de compras/vendas e faturas.',
        'd) Dados Bancários e Financeiros: Identificador Bancário (IBAN), número de telemóvel registado no Multicaixa Express e registo das transações de custódia (sem nunca armazenar PINs bancários ou senhas secretas).',
        'e) Dados de Segurança Social (INSS): Número de Inscrição na Segurança Social (NISS) e comprovativo de situação contributiva, unicamente com o consentimento prévio e expresso do titular (Decreto Presidencial n.º 227/18).'
      ]
    },
    {
      id: 'priv-purposes',
      title: '3. Finalidades e Base Legal do Tratamento',
      badge: 'Finalidade Específica',
      content: [
        'Os dados pessoais são tratados com as seguintes finalidades legítimas:',
        '1. Criação, autenticação e gestão da conta de utilizador.',
        '2. Processamento e execução dos contratos de compra e venda de produtos e de frete rodoviário.',
        '3. Operacionalização da câmara de custódia financeira e emissão de ordens de transferência bancária.',
        '4. Otimização e rastreio de rotas logísticas e envio de alertas de entrega por SMS e notificações na plataforma.',
        '5. Prevenção de fraudes, validação documental cadastral e cumprimento das obrigações fiscais perante a Administração Geral Tributária (AGT).',
        '6. Apoio ao cliente e resolução de controvérsias técnicas e comerciais.'
      ]
    },
    {
      id: 'priv-rbac',
      title: '4. Arquitetura de Isolamento de Dados por Persona (RBAC)',
      badge: 'Isolamento Estrito',
      content: [
        'O AO MARKET adota uma arquitetura de Controlo de Acesso Baseado em Papéis (RBAC) que garante a compartimentação de informações sensíveis:',
        '• Motoristas/Transportadores acedem unicamente aos dados estritamente operacionais da rota (nome do destinatário, telefone do ponto de recolha e morada de entrega da viagem ativa). Não têm acesso a dados bancários ou históricos globais de terceiros.',
        '• Produtores e Comerciantes acedem exclusivamente aos dados dos seus próprios lotes, encomendas recebidas e faturas emitidas. É vedado o acesso a dados de vendas ou balanços de concorrentes.',
        '• Compradores têm visibilidade dos dados do vendedor e do motorista adstrito à sua respetiva encomenda durante o ciclo de entrega.'
      ]
    },
    {
      id: 'priv-sharing',
      title: '5. Partilha de Dados e Sigilo Comercial',
      badge: 'Sem Venda de Dados',
      content: [
        '1. O AO MARKET NÃO VENDE, NÃO ALUGA e NÃO COMERCIALIZA dados pessoais a terceiros para efeitos publicitários ou de marketing de qualquer natureza.',
        '2. Os dados apenas são partilhados com:',
        'a) Os intervenientes diretos da transação (Vendedor, Comprador e Transportador) na estrita medida necessária ao cumprimento do pedido;',
        'b) Instituições financeiras e operadores de pagamento autorizados pelo BNA (EMIS / Multicaixa Express / Bancos Comerciais) para liquidação dos montantes;',
        'c) Autoridades públicas, judiciais, policiais ou fiscais (AGT, APD, INSS) sempre que exigido por mandado legal ou obrigação regulamentar.'
      ]
    },
    {
      id: 'priv-security',
      title: '6. Segurança da Informação e Trilha de Auditoria',
      badge: 'Criptografia & Auditoria',
      content: [
        '1. Implementamos medidas técnicas e organizativas rigorosas, incluindo encriptação de dados em trânsito (protocolo TLS/HTTPS) e em repouso (Base de Dados Cloud Firestore com regras de segurança ativas).',
        '2. Todas as ações críticas (início de sessão, alteração de dados cadastrais, validação documental, desbloqueio de fundos e emissão de ordens de pagamento) são registadas numa trilha de auditoria imutável com carimbo temporal (timestamp) e identificador de sessão para efeitos de rastreabilidade e segurança.'
      ]
    },
    {
      id: 'priv-rights',
      title: '7. Direitos dos Titulares dos Dados',
      badge: 'Direitos do Cidadão',
      content: [
        'Ao abrigo da Lei n.º 22/11, o titular dos dados tem o direito de, a qualquer momento e gratuitamente:',
        '• Aceder e solicitar cópia dos seus dados pessoais armazenados;',
        '• Retificar ou atualizar dados incorretos, desatualizados ou incompletos;',
        '• Solicitar a eliminação (apagamento) dos seus dados, ressalvadas as obrigações legais de conservação documental fiscal e contabilística impostas pela lei angolana;',
        '• Revogar a autorização de consulta do estado contributivo do INSS;',
        '• Para exercer os seus direitos, o utilizador pode contactar o Encarregado de Proteção de Dados (DPO) através do endereço: privacidade@aomarket.ao.'
      ]
    }
  ];

  // -------------------------------------------------------------
  // 3. POLÍTICA DE DEVOLUÇÕES & REEMBOLSOS (AO PROTECT)
  // -------------------------------------------------------------
  const returnsSections = [
    {
      id: 'ret-inspection',
      title: 'Artigo 1.º — Direito de Inspecção no Ato da Entrega',
      badge: 'Conferência Física',
      content: [
        '1. O Comprador tem o direito e o dever de inspecionar presencialmente o lote encomendado no momento em que o transportador chega ao local de descarga, antes de fornecer o PIN OTP de Entrega.',
        '2. A conferência incide sobre a quantidade física de sacos/caixas, o peso apurado, a ausência de danos por intempérie e o aspeto geral fitossanitário.',
        '3. A introdução e validação do PIN OTP de Entrega no terminal do motorista constitui declaração expressa de que o lote foi recebido em conformidade.'
      ]
    },
    {
      id: 'ret-deadlines',
      title: 'Artigo 2.º — Prazos Oficiais para Reclamação e Disputa',
      badge: 'Prazos Legais',
      content: [
        '1. Produtos Perecíveis (Hortícolas, Fruta Fresca, Folhosas): O comprador dispõe de um prazo máximo de 24 (vinte e quatro) horas a contar da entrega para reportar anomalias ocultas ou deterioração acelerada.',
        '2. Produtos Secos e Não Perecíveis (Grãos, Cereais, Farinhas, Tubérculos Secos, Mel, Artesanato): O prazo para notificação de não conformidade é de 48 (quarenta e oito) horas.',
        '3. Todas as reclamações devem ser submetidas através do módulo oficial de Mediação AO Protect com fotografia nítida do lote e indicação do número de manifesto.'
      ]
    },
    {
      id: 'ret-refund-matrix',
      title: 'Artigo 3.º — Matriz de Reembolsos por Estado da Encomenda',
      badge: 'Custódia Escrow',
      content: [
        'a) Cancelamento Antes da Expedição (Estado PENDENTE): O comprador é reembolsado a 100% do montante pago, sendo os fundos libertados de imediato na carteira AO PAY ou conta bancária.',
        'b) Cancelamento Com Carga em Trânsito (Estado EM TRÂNSITO): O comprador suporta a taxa operacional de transporte efetivamente executada, sendo-lhe restituído o valor integral da mercadoria.',
        'c) Rejeição Justificada no Ponto de Descarga (Produto Avariado/Não Conforme): A retenção em custódia é integralmente congelada pelo AO Protect. Após confirmação pericial, o comprador recebe 100% do valor do produto e o vendedor suporta os custos de retorno ou descarte.'
      ]
    },
    {
      id: 'ret-disputes-chamber',
      title: 'Artigo 4.º — Procedimento de Arbitragem e Liquidação',
      badge: 'Mediação Justa',
      content: [
        '1. A câmara de mediação AO Protect avalia as provas submetidas por Comprador, Vendedor e Transportador no prazo de 24 a 72 horas úteis.',
        '2. Havendo acordo ou laudo conclusivo, os valores retidos em custódia são desbloqueados e creditados via transferência bancária ou Multicaixa Express.',
        '3. Para apoio direto no processo de devolução, o utilizador pode acionar o AO Assist ou escrever para: suporte@aomarket.ao.'
      ]
    }
  ];

  // -------------------------------------------------------------
  // 4. FAQ (PERGUNTAS FREQUENTES)
  // -------------------------------------------------------------
  const faqSections = [
    {
      id: 'faq-escrow',
      title: 'Como funciona a Proteção de Pagamentos (Custódia Escrow)?',
      badge: 'Segurança Financeira',
      content: [
        'Quando faz uma compra no AO MARKET, o seu pagamento não vai diretamente para a conta do vendedor.',
        'O valor fica retido com 100% de segurança na Câmara de Custódia Oficial (Escrow). O montante só é transferido para o produtor/comerciante depois de o comprador receber a mercadoria no seu armazém e validar o PIN OTP de Entrega.',
        'Se houver qualquer divergência na carga, o dinheiro permanece protegido e pode ser acionada a mediação ou reembolso imediato.'
      ]
    },
    {
      id: 'faq-seller-payout',
      title: 'Como um produtor ou cooperativa recebe o valor da sua venda?',
      badge: 'Produtores Rurais',
      content: [
        'Assim que o transportador valida o PIN OTP de Entrega fornecido pelo comprador, a câmara de custódia liberta automaticamente os fundos.',
        'O saldo fica disponível no perfil do vendedor e pode ser transferido para qualquer conta bancária angolana (via IBAN) ou carteira digital autorizada pelo BNA.'
      ]
    },
    {
      id: 'faq-freight',
      title: 'Como é calculada a tarifa de frete e transporte rodoviário?',
      badge: 'Logística & DPA',
      content: [
        'O cálculo do frete é dinâmico e transparente, baseado na matriz georreferenciada das 21 províncias e 326 municípios de Angola (DPA).',
        'Leva em consideração a distância quilométrica real entre o município de origem e o município de destino, o peso da carga (kg ou toneladas), o tipo de viatura (camioneta, camião de caixa aberta, frigorífico) e o estado das vias principais.'
      ]
    },
    {
      id: 'faq-otp',
      title: 'O que é o PIN OTP de Entrega e quando devo facultá-lo?',
      badge: 'Chave de Segurança',
      content: [
        'O PIN OTP de Entrega é um código numérico confidencial gerado pelo sistema exclusivo para a sua encomenda.',
        'IMPORTANTE: NUNCA partilhe o seu PIN OTP antes de a viatura chegar e verificar fisicamente a carga. Só faculte o PIN ao motorista após abrir o camião e constatar que a quantidade e o estado dos produtos estão corretos.'
      ]
    },
    {
      id: 'faq-inss',
      title: 'Como funciona a integração com a Segurança Social (INSS Angola)?',
      badge: 'Formalização',
      content: [
        'O AO MARKET apoia a transição da economia informal para a formal através do enquadramento no regime de Trabalhador por Conta Própria (Decreto Presidencial n.º 227/18).',
        'Ao validar o seu NIF e NISS no portal, o produtor ou transportador recebe o Selo de Produtor Formalizado, ganhando acesso a reformas por velhice, subsídios de maternidade e prioridade em compras públicas e institucionais.'
      ]
    }
  ];

  // -------------------------------------------------------------
  // 5. REGRAS E GOVERNAÇÃO DATA (14 REGRAS)
  // -------------------------------------------------------------
  const rules = [
    {
      number: '01',
      id: 'rule-account',
      title: 'Conta & Identidade Única',
      category: 'CONTAS',
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      rule: 'Cada utilizador deve ter uma conta real e uma única persona.',
      description: 'É vedada a criação de identidades duplicadas ou perfis fantasma. Cada cidadão ou entidade jurídica opera com a sua persona real verificada por B.I./NIF.',
      obligation: 'Utilizadores devem manter os seus dados de contacto e credenciais permanentemente atualizados.'
    },
    {
      number: '02',
      id: 'rule-products',
      title: 'Produtos & Lotes Permitidos',
      category: 'PRODUTOS_VENDAS',
      icon: <Package className="w-4 h-4 text-emerald-600" />,
      rule: 'Só podem ser publicados produtos e serviços permitidos.',
      description: 'A plataforma destina-se a produtos da produção agrícola, pecuária, pesca, agroindústria e insumos certificados de Angola. É estritamente proibida a publicação de itens ilícitos ou fora do âmbito comercial regulado.',
      obligation: 'Os lotes devem cumprir os padrões fitossanitários e de rotulagem em vigor no país.'
    },
    {
      number: '03',
      id: 'rule-seller',
      title: 'Responsabilidade do Vendedor',
      category: 'PRODUTOS_VENDAS',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-600" />,
      rule: 'O vendedor é responsável pela veracidade, qualidade e disponibilidade.',
      description: 'O vendedor assegura que as especificações técnicas, fotografias reais, peso, teor de humidade e stock anunciado correspondem integralmente ao produto físico a carregar.',
      obligation: 'Em caso de inconformidade na receção, o vendedor responde civil e financeiramente perante a câmara de custódia.'
    },
    {
      number: '04',
      id: 'rule-buyer',
      title: 'Deveres do Comprador',
      category: 'PRODUTOS_VENDAS',
      icon: <ShoppingBag className="w-4 h-4 text-blue-600" />,
      rule: 'O comprador deve fornecer informações corretas e cumprir o pagamento.',
      description: 'O comprador compromete-se a fornecer o endereço e ponto de descarga exatos, validar a conferência no ato de entrega com o motorista e liquidar pontualmente os valores acordados.',
      obligation: 'A recusa injustificada de lote conforme implica retenção dos custos operacionais incorridos.'
    },
    {
      number: '05',
      id: 'rule-payments',
      title: 'Pagamentos & Custódia Oficial',
      category: 'PAGAMENTOS',
      icon: <CreditCard className="w-4 h-4 text-purple-600" />,
      rule: 'Toda transação deve seguir os métodos suportados pelo AO MARKET.',
      description: 'Os pagamentos são processados via Multicaixa Express, Transferência Referenciada BNA ou AO PAY com retenção temporária em câmara de custódia (Escrow) até validação do PIN OTP de entrega física.',
      obligation: 'São proibidos pagamentos informais paralelos por fora da plataforma.'
    },
    {
      number: '06',
      id: 'rule-logistics',
      title: 'Responsabilidade da Transportadora',
      category: 'LOGISTICA',
      icon: <Truck className="w-4 h-4 text-amber-600" />,
      rule: 'A transportadora é responsável pela execução da entrega.',
      description: 'O operador logístico assume a guarda e integridade da carga rodoviária desde a recolha na fazenda até à descarga no destino, com verificação obrigatória de manifesto e duplo PIN OTP.',
      obligation: 'A transportadora responde por perdas, avarias ou atrasos injustificados durante o trânsito.'
    },
    {
      number: '07',
      id: 'rule-reviews',
      title: 'Avaliações com Base em Transações Reais',
      category: 'PRODUTOS_VENDAS',
      icon: <Star className="w-4 h-4 text-amber-500" />,
      rule: 'Apenas utilizadores que participaram numa transação podem avaliar.',
      description: 'Para garantir a máxima integridade e reputação justa, apenas compradores e vendedores que concluíram efetivamente uma ordem de compra têm permissão para submeter pontuação e comentários.',
      obligation: 'Avaliações manipuladas ou falsas são automaticamente expurgadas pelo motor de auditoria.'
    },
    {
      number: '08',
      id: 'rule-fraud',
      title: 'Prevenção de Fraude & Bloqueio Preventivo',
      category: 'SEGURANCA',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
      rule: 'Contas, produtos ou transações suspeitas podem ser bloqueados.',
      description: 'O sistema de inteligência e a administração dispõem de autoridade para suspender cautelarmente perfis, cancelar lotes irregulares e congelar montantes sob custódia em caso de indícios de fraude ou desintermediação.',
      obligation: 'Contas suspensas dispõem de prazo de 5 dias úteis para prestar esclarecimentos à mediação.'
    },
    {
      number: '09',
      id: 'rule-privacy',
      title: 'Privacidade & Isolamento de Dados por Persona',
      category: 'SEGURANCA',
      icon: <Lock className="w-4 h-4 text-slate-700" />,
      rule: 'Cada persona só pode acessar os dados necessários à sua função.',
      description: 'A arquitetura RBAC (Role-Based Access Control) assegura que nenhum utilizador acede a dados confidenciais alheios (motoristas só veem a rota, empresas não veem balanços de concorrentes, compradores só veem pedidos próprios).',
      obligation: 'Garantia de confidencialidade comercial e conformidade com a Lei de Protecção de Dados de Angola.'
    },
    {
      number: '10',
      id: 'rule-disputes',
      title: 'Sistema de Reclamações & Mediação Oficial',
      category: 'DISPUTAS',
      icon: <Scale className="w-4 h-4 text-amber-600" />,
      rule: 'Problemas entre comprador e vendedor devem passar pelo sistema de reclamações.',
      description: 'Qualquer divergência quanto a qualidade, peso ou acondicionamento é submetida ao AO Protect, que atua como câmara arbitral técnica para conciliação antes de qualquer liberação ou retenção de fundos.',
      obligation: 'As decisões da câmara de mediação são vinculativas sobre os montantes sob custódia.'
    },
    {
      number: '11',
      id: 'rule-cancellations',
      title: 'Cancelamentos & Reembolsos por Estado do Pedido',
      category: 'DISPUTAS',
      icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
      rule: 'Cancelamentos e reembolsos devem seguir regras específicas por estado do pedido.',
      description: 'Antes da expedição (PENDING/PAID): cancelamento imediato com reembolso a 100%. Em trânsito (IN_TRANSIT): cancelamento requer processo de mediação com o transportador. Após entrega (DELIVERED): reembolso apenas por laudo pericial de não conformidade.',
      obligation: 'Taxas de transporte incorridas após despacho não são reembolsáveis se a desistência for unilateral.'
    },
    {
      number: '12',
      id: 'rule-data',
      title: 'Integridade de Dados & Sem Dados Fictícios',
      category: 'SEGURANCA',
      icon: <Database className="w-4 h-4 text-indigo-600" />,
      rule: 'Não utilizar dados fictícios em produção.',
      description: 'Todo o ambiente operativo reflete exclusivamente entidades reais, lotes colhidos genuínos, cotações de mercado fidedignas e auditoria documental conectada ao Firebase Firestore em tempo real.',
      obligation: 'A inserção deliberada de dados falsos constitui infração grave com desativação imediata da conta.'
    },
    {
      number: '13',
      id: 'rule-audit',
      title: 'Trilha de Auditoria & Registo Imutável',
      category: 'SEGURANCA',
      icon: <FileText className="w-4 h-4 text-emerald-700" />,
      rule: 'Ações importantes devem ficar registradas.',
      description: 'Todos os eventos críticos (autenticação, criação de lotes, validação documental, transações financeiras, alterações de rota e decisões de mediação) são gravados com timestamp ISO, IP e hash de integridade.',
      obligation: 'Os registos de auditoria são inalteráveis e acessíveis à auditoria regulatória e fiscal.'
    },
    {
      number: '14',
      id: 'rule-inss',
      title: 'Integração & Minimização de Dados do INSS',
      category: 'CONTAS',
      icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
      rule: 'Dados do INSS só podem ser consultados através da integração autorizada e com o mínimo de dados necessário.',
      description: 'As consultas de enquadramento previdenciário (Decreto Presidencial n.º 227/18) ocorrem exclusivamente via API autorizada com base no NIF/NISS sob consentimento formal do segurado, sem armazenamento de dados clínicos ou privados excessivos.',
      obligation: 'Apenas a situação cadastral e prova de inscrição são verificadas para atribuição do selo de formalização.'
    }
  ];

  // -------------------------------------------------------------
  // PDF GENERATION FUNCTIONS
  // -------------------------------------------------------------
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(10, 37, 64); // #0A2540
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('REPÚBLICA DE ANGOLA • AO MARKET', 14, 13);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    if (activeTab === 'terms') {
      doc.text('Termos e Condições Gerais de Uso da Plataforma (2026)', 14, 22);
      doc.text('Enquadramento: Código Comercial, Lei n.º 1/07 e Normas BNA', 14, 28);
      doc.setTextColor(15, 23, 42);

      const tableData = termsSections.map((sec, idx) => [
        `Art. ${idx + 1}`,
        sec.title,
        sec.content.join('\n\n')
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['N.º', 'Cláusula', 'Disposição Contratual Vinculativa']],
        body: tableData,
        headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 16, fontStyle: 'bold' },
          1: { cellWidth: 45, fontStyle: 'bold' },
          2: { cellWidth: 125 }
        }
      });
      doc.save('AO_MARKET_Termos_e_Condicoes_2026.pdf');
    } else if (activeTab === 'privacy') {
      doc.text('Política de Privacidade e Protecção de Dados Pessoais (2026)', 14, 22);
      doc.text('Em conformidade com a Lei n.º 22/11 de Angola e Directrizes APD', 14, 28);
      doc.setTextColor(15, 23, 42);

      const tableData = privacySections.map((sec, idx) => [
        `Cap. ${idx + 1}`,
        sec.title,
        sec.content.join('\n\n')
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['N.º', 'Secção', 'Política & Salvaguardas de Privacidade']],
        body: tableData,
        headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 16, fontStyle: 'bold' },
          1: { cellWidth: 45, fontStyle: 'bold' },
          2: { cellWidth: 125 }
        }
      });
      doc.save('AO_MARKET_Politica_de_Privacidade_2026.pdf');
    } else if (activeTab === 'returns') {
      doc.text('Política Oficial de Devoluções e Reembolsos AO Protect (2026)', 14, 22);
      doc.text('Mecanismos de Inspecção, Cancelamento e Mediação de Custódia', 14, 28);
      doc.setTextColor(15, 23, 42);

      const tableData = returnsSections.map((sec, idx) => [
        `Art. ${idx + 1}`,
        sec.title,
        sec.content.join('\n\n')
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['N.º', 'Artigo', 'Directriz de Devolução e Reembolso']],
        body: tableData,
        headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 16, fontStyle: 'bold' },
          1: { cellWidth: 45, fontStyle: 'bold' },
          2: { cellWidth: 125 }
        }
      });
      doc.save('AO_MARKET_Politica_Devolucoes_Reembolsos_2026.pdf');
    } else if (activeTab === 'faq') {
      doc.text('Guia de Perguntas Frequentes (FAQ) • AO MARKET (2026)', 14, 22);
      doc.text('Esclarecimentos Oficiais de Operação, Pagamento e Logística', 14, 28);
      doc.setTextColor(15, 23, 42);

      const tableData = faqSections.map((sec, idx) => [
        `Q${idx + 1}`,
        sec.title,
        sec.content.join('\n\n')
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['N.º', 'Questão Frequente', 'Resposta Oficial']],
        body: tableData,
        headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 16, fontStyle: 'bold' },
          1: { cellWidth: 45, fontStyle: 'bold' },
          2: { cellWidth: 125 }
        }
      });
      doc.save('AO_MARKET_FAQ_Perguntas_Frequentes_2026.pdf');
    } else {
      doc.text('Regulamento Oficial de Governação e 14 Regras do Ecossistema (2026)', 14, 22);
      doc.text('Regra Central: "O AO MARKET conecta e facilita, cada parte responde pela sua atividade"', 14, 28);
      doc.setTextColor(15, 23, 42);

      const tableData = rules.map(r => [
        r.number,
        r.title,
        r.rule,
        r.description
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['N.º', 'Domínio', 'Regra Principal', 'Descrição Operacional']],
        body: tableData,
        headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
        styles: { fontSize: 7.8, cellPadding: 2.5 }
      });
      doc.save('AO_MARKET_Regras_e_Governacao_2026.pdf');
    }
  };

  // Filtered lists
  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return termsSections;
    const term = searchTerm.toLowerCase();
    return termsSections.filter(s => 
      s.title.toLowerCase().includes(term) || 
      s.content.some(c => c.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const filteredPrivacy = useMemo(() => {
    if (!searchTerm.trim()) return privacySections;
    const term = searchTerm.toLowerCase();
    return privacySections.filter(s => 
      s.title.toLowerCase().includes(term) || 
      s.content.some(c => c.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const filteredReturns = useMemo(() => {
    if (!searchTerm.trim()) return returnsSections;
    const term = searchTerm.toLowerCase();
    return returnsSections.filter(s => 
      s.title.toLowerCase().includes(term) || 
      s.content.some(c => c.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const filteredFaq = useMemo(() => {
    if (!searchTerm.trim()) return faqSections;
    const term = searchTerm.toLowerCase();
    return faqSections.filter(s => 
      s.title.toLowerCase().includes(term) || 
      s.content.some(c => c.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchesCategory = governanceCategory === 'ALL' || r.category === governanceCategory;
      const matchesSearch = !searchTerm.trim() || 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, governanceCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div 
        id="legal-governance-modal"
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-[#0a192f] text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center space-x-3">
            <Logo size="sm" variant="badge" />
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm sm:text-base font-display font-extrabold text-white">
                  Portal Jurídico & Governação do AO MARKET
                </h2>
              </div>
              <p className="text-[11px] text-slate-300">
                Quadro Legal, Proteção de Dados e Regulamento Oficial do Ecossistema • Angola 2026
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={downloadPdf}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer border border-amber-400"
              title="Descarregar documento atual em formato PDF oficial"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descarregar PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow-xs transition flex items-center space-x-1 cursor-pointer"
              title="Imprimir documento"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <button
              id="tab-terms-conditions"
              onClick={() => { setActiveTab('terms'); setSearchTerm(''); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === 'terms' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Termos</span>
            </button>

            <button
              id="tab-privacy-policy"
              onClick={() => { setActiveTab('privacy'); setSearchTerm(''); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Lock className={`w-3.5 h-3.5 ${activeTab === 'privacy' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Privacidade (APD)</span>
            </button>

            <button
              id="tab-returns-policy"
              onClick={() => { setActiveTab('returns'); setSearchTerm(''); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'returns'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${activeTab === 'returns' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Devoluções & Reembolsos</span>
            </button>

            <button
              id="tab-ecosystem-governance"
              onClick={() => { setActiveTab('governance'); setSearchTerm(''); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'governance'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Scale className={`w-3.5 h-3.5 ${activeTab === 'governance' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>14 Regras de Governação</span>
            </button>

            <button
              id="tab-faq"
              onClick={() => { setActiveTab('faq'); setSearchTerm(''); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'faq' ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>Perguntas Frequentes (FAQ)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar cláusula ou tema..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Central Core Principle Banner (Always visible in all legal docs) */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-medium text-xs border-b border-amber-300 shadow-xs shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-black text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-extrabold leading-snug">
              <span className="text-black/80 font-mono uppercase tracking-wider text-[10px] mr-1.5">[REGRA CENTRAL]:</span>
              "O AO MARKET conecta e facilita a transação, mas cada parte mantém responsabilidade pela sua própria atividade."
            </p>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 bg-black/10 rounded text-[10px] font-bold text-slate-900 font-mono shrink-0">
            Lei Angolana • Vigência 2026
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================
              TAB 1: TERMOS E CONDIÇÕES DE USO
          ======================================================== */}
          {activeTab === 'terms' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Termos e Condições Gerais de Operação do AO MARKET
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Estes termos constituem o contrato vinculativo entre o utilizador e a plataforma AO MARKET para todas as operações de compra, venda de produtos agrícolas, contratação de frete rodoviário e utilização da câmara de custódia em Angola.
                  </p>
                </div>
              </div>

              {/* Terms Content List */}
              <div className="space-y-4">
                {filteredTerms.map((section, idx) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-mono text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {section.badge}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredTerms.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma cláusula encontrada para "{searchTerm}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: POLÍTICA DE PRIVACIDADE
          ======================================================== */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950 flex items-center space-x-2">
                    <span>Protecção de Dados Pessoais & Conformidade APD</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold">
                      Lei n.º 22/11
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    O AO MARKET implementa rigorosos padrões de segurança, minimização de dados e isolamento por persona (RBAC), assegurando total confidencialidade nas suas transações e dados cadastrais.
                  </p>
                </div>
              </div>

              {/* Privacy Sections */}
              <div className="space-y-4">
                {filteredPrivacy.map((section, idx) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-mono text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {section.badge}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredPrivacy.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma secção encontrada para "{searchTerm}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: REGRAS E GOVERNAÇÃO (14 REGRAS)
          ======================================================== */}
          {activeTab === 'governance' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Category Filter for Rules */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'ALL', label: 'Todas as 14 Regras' },
                  { id: 'CONTAS', label: 'Contas & Identidade' },
                  { id: 'PRODUTOS_VENDAS', label: 'Produtos, Vendas & Compras' },
                  { id: 'PAGAMENTOS', label: 'Pagamentos & Custódia' },
                  { id: 'LOGISTICA', label: 'Logística Rodoviária' },
                  { id: 'DISPUTAS', label: 'Disputas & Cancelamentos' },
                  { id: 'SEGURANCA', label: 'Segurança & Privacidade' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setGovernanceCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                      governanceCategory === cat.id
                        ? 'bg-slate-900 text-amber-400 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Rules Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredRules.map(item => (
                  <div
                    key={item.id}
                    id={item.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-3 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {item.number}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900 leading-tight">
                            {item.title}
                          </span>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                          {item.icon}
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-2.5">
                        <div className="text-[10px] text-amber-900 uppercase font-black tracking-wider mb-0.5">
                          Regra Vinculativa:
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          "{item.rule}"
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] text-slate-500 flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          <strong className="text-slate-700">Obrigação:</strong> {item.obligation}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredRules.length === 0 && (
                  <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma regra encontrada para os filtros selecionados.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: POLÍTICA DE DEVOLUÇÕES & REEMBOLSOS (AO PROTECT)
          ======================================================== */}
          {activeTab === 'returns' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-start space-x-3">
                <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-amber-950 flex items-center space-x-2">
                    <span>Política Oficial de Devoluções & Reembolsos AO Protect</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                      Custódia Escrow
                    </span>
                  </h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Protegemos compradores e produtores com garantia de conformidade na receção e liquidação transparente com mediação pericial.
                  </p>
                </div>
              </div>

              {/* Returns Sections */}
              <div className="space-y-4">
                {filteredReturns.map((section, idx) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-mono text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {section.badge}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredReturns.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma directriz de devolução encontrada para "{searchTerm}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: PERGUNTAS FREQUENTES (FAQ)
          ======================================================== */}
          {activeTab === 'faq' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950">
                    Central de Perguntas Frequentes (FAQ) • AO MARKET
                  </h3>
                  <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                    Respostas detalhadas sobre como operar, comprar, vender, transportar e receber pagamentos na plataforma.
                  </p>
                </div>
              </div>

              {/* FAQ Sections */}
              <div className="space-y-4">
                {filteredFaq.map((section, idx) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-mono text-xs font-black">
                          {idx + 1}
                        </span>
                        <span>{section.title}</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {section.badge}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredFaq.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma pergunta frequente encontrada para "{searchTerm}".
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documentos oficiais registados e em vigor na República de Angola</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={downloadPdf}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Descarregar ({activeTab === 'terms' ? 'Termos' : activeTab === 'privacy' ? 'Privacidade' : activeTab === 'returns' ? 'Devoluções' : activeTab === 'faq' ? 'FAQ' : 'Governação'})</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0a192f] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-xs transition cursor-pointer"
            >
              Entendido & Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
