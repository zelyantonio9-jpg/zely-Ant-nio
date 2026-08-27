import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  CreditCard, 
  Check
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Logo } from './Logo';

export const SocialProtectionPortal: React.FC = () => {
  const { currentUser, formatKz } = useMarket();

  const [simulatedGrossSales, setSimulatedGrossSales] = useState<number>(850000);
  const selectedContributionRate = 0.03; // 3% micro/coop rate

  const calculatedINSS = Math.round(simulatedGrossSales * selectedContributionRate);
  const estimatedPensionAOA = Math.round(simulatedGrossSales * 0.45);

  return (
    <div id="social-protection-portal" className="space-y-4">
      {/* INSS Institutional Sovereign Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Logo size="lg" variant="badge" className="hidden sm:inline-flex shrink-0 mt-1" />
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                REPÚBLICA DE ANGOLA • INSTITUTO NACIONAL DE SEGURANÇA SOCIAL (INSS)
              </span>
            </div>

            <h1 className="text-xl font-display font-extrabold text-slate-900">
              Programa Nacional de Formalização e Segurança Social do Produtor Rural
            </h1>

            <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
              Regime simplificado de proteção social (Decreto Presidencial n.º 227/18 e PREI). Assegure a sua reforma por velhice, subsídio de doença, proteção de maternidade e eleve a sua classificação para o Selo de Confiança Nível 4.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs shrink-0 flex items-center space-x-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Estado do Titular:</div>
            <div className="font-bold text-slate-900 text-xs">Regularizado junto do INSS</div>
            <div className="text-[10px] text-amber-800 font-mono font-bold">{currentUser.inssNumber || 'INSS-884029-AO'}</div>
          </div>
        </div>
      </div>

      {/* Simulator Card & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Simulator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs shadow-xs lg:col-span-2">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Simulador de Contribuição Social Integrada às Vendas
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Volume Médio de Vendas Mensais (Kz):</label>
              <input
                type="number"
                step="10000"
                value={simulatedGrossSales}
                onChange={e => setSimulatedGrossSales(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-600 font-medium">Contribuição Mensal ao INSS (3%):</div>
                <div className="text-lg font-black text-slate-900 font-mono">{formatKz(calculatedINSS)}</div>
                <div className="text-[10px] text-slate-400">Dedução automática facultativa por fatura</div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <div className="text-[11px] text-emerald-800 font-medium">Pensão de Velhice Projetada:</div>
                <div className="text-lg font-black text-emerald-900 font-mono">{formatKz(estimatedPensionAOA)}</div>
                <div className="text-[10px] text-emerald-700 font-medium">Garantia vitalícia pelo Estado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs shadow-xs">
          <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
            <Award className="w-4 h-4 text-amber-600 mr-2" />
            Benefícios da Formalização
          </h2>

          <div className="space-y-2.5">
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Prioridade no escoamento rodoviário nacional pelo PRODESI.</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Acesso a linhas de crédito bancário bonificadas (PAC / FADA / BDA).</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Cobertura integral para acidentes de trabalho e assistência médica rural.</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700">Selo de Confiança Ouro visível no Catálogo para compradores de todo o país.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
