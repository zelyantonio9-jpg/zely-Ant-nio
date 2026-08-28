import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import { Logo } from './Logo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EcosystemRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemRulesModal: React.FC<EcosystemRulesModalProps> = ({ isOpen, onClose }) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'CONTAS' | 'PRODUTOS_VENDAS' | 'PAGAMENTOS' | 'LOGISTICA' | 'DISPUTAS' | 'SEGURANCA'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const downloadRulesPdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(10, 37, 64); // #0A2540
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REPÚBLICA DE ANGOLA • AO MARKET', 14, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Regulamento Oficial, Governação e Termos de Operação do Ecossistema', 14, 22);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Regra Central do Ecossistema:', 14, 40);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('"O AO MARKET conecta e facilita a transação, mas cada parte mantém responsabilidade pela sua própria atividade."', 14, 47);

    autoTable(doc, {
      startY: 55,
      head: [['N.º', 'Domínio', 'Regra Principal & Requisito Vinculativo']],
      body: [
        ['1', 'Conta', 'Cada utilizador deve possuir uma conta real verificada e uma única persona ativa.'],
        ['2', 'Produtos', 'Só podem ser publicados produtos e serviços expressamente permitidos e certificados.'],
        ['3', 'Vendas', 'O vendedor é estritamente responsável pela veracidade, qualidade e disponibilidade do lote.'],
        ['4', 'Compras', 'O comprador deve fornecer dados exatos de entrega e honrar os pagamentos contratuais.'],
        ['5', 'Pagamentos', 'Toda transação deve seguir os canais oficiais suportados (Multicaixa Express / BNA / AO PAY).'],
        ['6', 'Entregas', 'A transportadora é integralmente responsável pela execução da carga rodoviária.'],
        ['7', 'Avaliações', 'Apenas intervenientes de transações concluídas têm legitimidade para emitir avaliações.'],
        ['8', 'Fraude', 'Contas, lotes ou movimentações suspeitas estão sujeitos a bloqueio preventivo pela supervisão.'],
        ['9', 'Privacidade', 'Cada persona acede exclusivamente aos dados indispensáveis ao exercício da sua função.'],
        ['10', 'Disputas', 'Controvérsias entre comprador e vendedor são dirimidas na câmara de mediação AO Protect.'],
        ['11', 'Cancelamentos', 'Regidos por matriz rigorosa em função do estado da encomenda (pré-expedição vs trânsito).'],
        ['12', 'Dados', 'Interdição estrita de dados fictícios em ambiente produtivo; sincronização via Firebase.'],
        ['13', 'Auditoria', 'Todas as operações sensíveis são imutavelmente registadas em trilha de auditoria.'],
        ['14', 'INSS', 'Consulta autorizada mediante consentimento expresso e minimização de dados do segurado.']
      ],
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5 }
    });

    doc.save('AO_MARKET_Regulamento_Governacao_2026.pdf');
  };

  const rules = [
    {
      number: '01',
      id: 'rule-account',
      title: 'Conta & Identidade Única',
      category: 'CONTAS',
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      rule: 'Cada utilizador deve ter uma conta real e uma única persona.',
      description: 'É vedada a criação de identidades duplicadas ou perfis fantasma. Cada cidadão ou entidade jurídica opera com a sua persona real verificada por BI/NIF.',
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
      description: 'O sistema de inteligência e a Direção de Supervisão dispõem de autoridade para suspender cautelarmente perfis, cancelar lotes irregulares e congelar montantes sob custódia em caso de indícios de fraude ou desintermediação.',
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
      obligation: 'Garantia de confidencialidade comercial e conformidade com a Lei de Proteção de Dados de Angola.'
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

  const filteredRules = rules.filter(r => {
    const matchesCategory = filterCategory === 'ALL' || r.category === filterCategory;
    const matchesSearch = searchTerm.trim() === '' || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        id="ecosystem-rules-modal"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0a192f] text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center space-x-3">
            <Logo size="sm" variant="badge" />
            <div>
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-display font-extrabold text-white">
                  Regras Principais & Governação do AO MARKET
                </h2>
              </div>
              <p className="text-[11px] text-slate-300">
                Diretrizes Oficiais e Compromissos Vinculativos do Ecossistema Nacional
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={downloadRulesPdf}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer border border-amber-400"
              title="Descarregar regulamento em PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descarregar PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow-xs transition flex items-center space-x-1 cursor-pointer"
              title="Imprimir regulamento"
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

        {/* Central Principle Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-medium text-xs border-b border-amber-300 shadow-xs shrink-0">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold uppercase text-[10px] tracking-wider block text-black/80 font-mono">
                REGRA CENTRAL DO ECOSSISTEMA
              </span>
              <p className="text-xs font-extrabold leading-snug">
                "O AO MARKET conecta e facilita a transação, mas cada parte mantém responsabilidade pela sua própria atividade."
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto text-[11px] font-semibold">
            {[
              { id: 'ALL', label: 'Todas as Regras (14)' },
              { id: 'CONTAS', label: 'Contas & INSS' },
              { id: 'PRODUTOS_VENDAS', label: 'Produtos & Vendas' },
              { id: 'PAGAMENTOS', label: 'Pagamentos' },
              { id: 'LOGISTICA', label: 'Entregas' },
              { id: 'DISPUTAS', label: 'Disputas & Reembolsos' },
              { id: 'SEGURANCA', label: 'Fraude & Auditoria' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer text-xs ${
                  filterCategory === tab.id
                    ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar regra ou termo..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Rules Grid Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-white flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map(r => (
              <div 
                key={r.id}
                className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-amber-400 transition space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                        {r.icon}
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-700">Regra {r.number}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                      {r.category.replace('_', ' & ')}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900">
                    {r.title}
                  </h3>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-xs">
                    {r.rule}
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-[10px] text-amber-900 font-medium">
                  <strong>Obrigação Legal:</strong> {r.obligation}
                </div>
              </div>
            ))}
          </div>

          {/* Cancellation & Refund Policy Table */}
          <div className="mt-6 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Matriz Específica de Cancelamentos e Reembolsos por Estado do Pedido</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2">Estado da Encomenda</th>
                    <th className="p-2">Direito a Cancelamento</th>
                    <th className="p-2">Condição de Reembolso</th>
                    <th className="p-2">Custas de Transporte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-mono font-bold text-amber-800">PENDING / PAID</td>
                    <td className="p-2 text-emerald-700 font-bold">Imediato</td>
                    <td className="p-2">100% devolvido ao comprador da custódia</td>
                    <td className="p-2 text-slate-500">Sem custos aplicáveis</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-blue-800">IN_TRANSIT</td>
                    <td className="p-2 text-amber-700 font-bold">Requer Mediação</td>
                    <td className="p-2">Sujeito a retenção de custos de frete incorridos</td>
                    <td className="p-2 text-slate-700">A cargo de quem desiste</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold text-emerald-800">DELIVERED</td>
                    <td className="p-2 text-slate-600">Apenas Não Conformidade</td>
                    <td className="p-2">Devolução após perícia da câmara AO Protect</td>
                    <td className="p-2 text-slate-700">Conforme decisão arbitral</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Regulamento vigente para o território da República de Angola • Atualizado para 2026.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl transition text-xs shadow-xs cursor-pointer border border-amber-400"
          >
            Compreendi & Aceito as Regras
          </button>
        </div>
      </div>
    </div>
  );
};
