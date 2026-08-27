import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Layers, 
  Cpu,
  Download,
  Printer
} from 'lucide-react';
import { generateOfficialPdf } from '../utils/generatePdfDoc';
import { Logo } from './Logo';

interface ArchitectureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'DIAGNOSTIC' | 'ENTITIES' | 'STATE_MACHINE' | 'FORMALIZATION' | 'ROADMAP'>('DIAGNOSTIC');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        id="architecture-spec-modal"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0 gap-3">
          <div className="flex items-center space-x-3">
            <Logo size="sm" variant="badge" />
            <div>
              <h2 className="text-xs font-display font-bold text-slate-900">AO MARKET • Diagnóstico & Especificação de Arquitetura</h2>
              <p className="text-[10px] text-slate-500">Auditoria Completa e Arquitetura do Ecossistema Económico Digital de Angola</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generateOfficialPdf}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer border border-amber-400"
              title="Gerar e descarregar documento oficial em formato PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descarregar PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center space-x-1 cursor-pointer"
              title="Imprimir especificação"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-1.5 p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto text-[11px] shrink-0 font-semibold">
          <button
            onClick={() => setActiveSection('DIAGNOSTIC')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs cursor-pointer ${
              activeSection === 'DIAGNOSTIC' ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            1. Diagnóstico Técnico & Produto
          </button>
          <button
            onClick={() => setActiveSection('ENTITIES')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs cursor-pointer ${
              activeSection === 'ENTITIES' ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            2. Modelo de Dados & Entidades
          </button>
          <button
            onClick={() => setActiveSection('STATE_MACHINE')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs cursor-pointer ${
              activeSection === 'STATE_MACHINE' ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            3. Máquina de Estados & OTP
          </button>
          <button
            onClick={() => setActiveSection('FORMALIZATION')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs cursor-pointer ${
              activeSection === 'FORMALIZATION' ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            4. Formalização & INSS
          </button>
          <button
            onClick={() => setActiveSection('ROADMAP')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs cursor-pointer ${
              activeSection === 'ROADMAP' ? 'bg-amber-500 text-black font-extrabold shadow-xs border border-amber-400' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            5. Roadmap & Expansão
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed bg-white">
          {activeSection === 'DIAGNOSTIC' && (
            <div className="space-y-3">
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-1.5 text-slate-800">
                <h3 className="text-xs font-bold flex items-center text-amber-900">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                  Visão Geral & Diagnóstico do Ecossistema
                </h3>
                <p className="text-[11px] text-slate-600">
                  O <strong className="text-slate-900">AO MARKET</strong> transcende um marketplace convencional: ele articula produção agrícola/industrial, comércio grossista/retalhista, logística rodoviária interprovincial, custódia financeira e inclusão social na Segurança Social (INSS Angola).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center text-xs">
                    <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Stack Tecnológico Escolhido
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                    <li><strong className="text-slate-900">Frontend:</strong> React 19 com TypeScript, Tailwind CSS v4, Motion</li>
                    <li><strong className="text-slate-900">Design System:</strong> Tipografia com estética contemporânea, fundo branco e cores nacionais</li>
                    <li><strong className="text-slate-900">Mobile-First & Low-Data Mode:</strong> Otimizado para redes 3G/4G em Angola</li>
                    <li><strong className="text-slate-900">Segurança:</strong> Custódia AO Protect, validação por duplo PIN OTP</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center text-xs">
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Cadeia de Valor Integrada
                  </div>
                  <p className="text-slate-900 font-mono text-[10px] bg-white p-3 rounded-xl border border-slate-200 leading-relaxed shadow-xs">
                    PRODUZIR → PUBLICAR → VENDER → COMPRAR → PAGAR (AO PAY) → RECOLHER (PIN #1) → TRANSPORTAR (AO LOGISTICS) → ENTREGAR (PIN #2) → LIBERTAR FUNDOS → FORMALIZAR (INSS)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ENTITIES' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Mapeamento de Entidades do Modelo Relacional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-[10px]">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">User & Role</strong>
                  <span className="text-slate-500">id, name, email, phone, role, province, municipality, verificationLevel, isFormalized, inssNumber, nif</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">Product & Lot</strong>
                  <span className="text-slate-500">id, title, category, price, unit, availableStock, originProvince, farmName, isProducedInAngola, weightKg, b2bBulkPricing</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">Order & OrderItem</strong>
                  <span className="text-slate-500">id, buyerId, items, subtotal, freightCost, total, status, paymentMethod, isPaymentEscrowed, pickupOtp, deliveryOtp</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">FreightLoad & Driver</strong>
                  <span className="text-slate-500">id, orderId, origin, destination, cargoWeight, volumeM3, vehicleType, suggestedFreightAOA, status, distanceKm</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">B2B RFQ (Cotação)</strong>
                  <span className="text-slate-500">id, buyerCompany, producerId, productTitle, requestedQuantity, targetPriceAOA, quotedPriceAOA, frequency, status</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block font-sans text-xs mb-0.5">DisputeRecord (AO Protect)</strong>
                  <span className="text-slate-500">id, orderId, complainantRole, reason, description, evidenceUrls, status, escrowHeldAmountAOA, resolution</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'STATE_MACHINE' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Máquina de Estados Finita e Protocolo de Segurança PIN OTP</h3>
              <div className="bg-slate-50 text-slate-800 p-4 rounded-2xl border border-slate-200 font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="text-amber-800 font-bold">Transições Permitidas no Ciclo de Vida do Pedido:</div>
                <div className="text-slate-600">CREATED → PAYMENT_PENDING → PAID (Retenção em Custódia AO Protect)</div>
                <div className="text-slate-600">→ ACCEPTED (Produtor aceita lote) → PREPARING (Pesagem & Embalamento)</div>
                <div className="text-slate-600">→ DRIVER_ASSIGNED (Alocação no AO Logistics) → PICKED_UP (Validado por OTP de Recolha #8921)</div>
                <div className="text-slate-600">→ IN_TRANSIT (Rastreio Rodoviário ativo) → DELIVERED (Validado por OTP de Entrega #4409)</div>
                <div className="text-slate-600">→ COMPLETED (Libertação irreversível de fundos da custódia para o produtor e transportador)</div>
              </div>
            </div>
          )}

          {activeSection === 'FORMALIZATION' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Crescer com Proteção: Mecanismo de Inclusão no INSS Angola</h3>
              <p className="text-[11px] text-slate-600">
                O sistema adota os princípios do Decreto Presidencial n.º 227/18 e o Programa PREI, estruturando 5 níveis de confiança progressivos. Ao invés de uma exigência punitiva, a formalização confere <strong className="text-slate-900">vantagens económicas imediatas</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <strong className="text-emerald-900 block text-xs">Benefícios Legais de Cidadania</strong>
                  <span className="text-emerald-700 text-[11px]">Pensão de Velhice, Subsídio de Maternidade de 90 dias, Pensão de Invalidez e Prestações de Sobrevivência à família.</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <strong className="text-amber-900 block text-xs">Benefícios Comerciais no Ecossistema</strong>
                  <span className="text-amber-800 text-[11px]">Selo de Vendedor de Nível 4, acesso a cotações B2B de grandes supermercados/restaurantes, e elegibilidade para microcrédito bancário.</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ROADMAP' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900">Roadmap Estratégico de Evolução</h3>
              <div className="space-y-2 text-[11px]">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900">Fase 1 (MVP Construído):</strong> <span className="text-slate-600">Marketplace multirrole, 18 províncias, AO Logistics com frete e OTP, AO PAY com custódia, AO Protect disputas, Simulador INSS e AO Assist.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900">Fase 2 (Integrações Bancárias Oficiais):</strong> <span className="text-slate-600">Conexão API direta com a EMIS (Multicaixa GPO) e webservices de consulta de regularidade contributiva do INSS.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900">Fase 3 (Expansão Regional):</strong> <span className="text-slate-600">Corredores de comércio transfronteiriço da SADC (Angola, RDC, Zâmbia, Namíbia).</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition cursor-pointer border border-amber-400 shadow-xs"
          >
            Fechar Especificação
          </button>
        </div>
      </div>
    </div>
  );
};
