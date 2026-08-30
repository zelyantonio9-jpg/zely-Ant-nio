import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  MapPin,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { InformalActivityType } from '../types';
import { PROVINCES_ANGOLA } from '../data/angolaGeoData';
import { DiagnosisInput, DiagnosisResult, FormalizationEngine } from '../services/formalizationEngine';

interface FormalizationDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (input: DiagnosisInput, result: DiagnosisResult) => void;
  initialData?: {
    name?: string;
    phone?: string;
    province?: string;
    municipality?: string;
  };
}

export const FormalizationDiagnosisModal: React.FC<FormalizationDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // State for form
  const [formData, setFormData] = useState<DiagnosisInput>({
    hasNif: false,
    nifNumber: '',
    hasBi: true,
    biNumber: '',
    hasInss: false,
    inssNumber: '',
    activityType: 'VENDEDOR_PRACA_MERCADO',
    activityDescription: '',
    marketLocation: '',
    province: initialData?.province || 'Luanda',
    municipality: initialData?.municipality || 'Luanda',
    worksAlone: true,
    helpersCount: 0
  });

  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  if (!isOpen) return null;

  const currentProvinceObj = PROVINCES_ANGOLA.find(p => p.name === formData.province) || PROVINCES_ANGOLA[0];

  const handleCalculateDiagnosis = () => {
    const res = FormalizationEngine.evaluateDiagnosis(formData);
    setDiagnosisResult(res);
    setStep(3);
  };

  const handleFinish = () => {
    if (diagnosisResult) {
      onComplete(formData, diagnosisResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Programa Nacional de Formalização
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  Diagnóstico de Maturidade do Negócio
                </h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-amber-100/90 mt-2 max-w-xl">
            Descubra em 2 minutos quais as etapas necessárias para regularizar a sua atividade, obter NIF, proteger-se no INSS e aceder a novos mercados.
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center space-x-2 mt-5">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-amber-300' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-amber-300' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">

          {/* STEP 1: Actividade e Localização */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  1. Qual é o seu tipo de atividade ou negócio?
                </h3>
                <p className="text-sm text-slate-400">
                  Selecione a categoria que melhor representa o seu trabalho diário.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'VENDEDOR_PRACA_MERCADO', title: 'Vendedor(a) de Praça / Mercado', desc: 'Bancada em mercado municipal, feira ou comércio de bairro' },
                  { id: 'AGRICULTOR_FAMILIAR', title: 'Agricultor(a) Familiar / Lavra', desc: 'Produção agrícola local, hortícolas e produtos do campo' },
                  { id: 'PESCADOR_ARTESANAL', title: 'Pescador(a) Artesanal', desc: 'Pesca marítima ou fluvial e venda de pescado fresco/seco' },
                  { id: 'KUPAPATA_MOTORISTA_LOCAL', title: 'Kupapata / Motorista de Frete', desc: 'Transporte de passageiros ou pequenas cargas em moto/carrinha' },
                  { id: 'ARTESAO_MANUAL', title: 'Artesão / Transformação', desc: 'Produção manual, carpintaria, cestaria ou confeção têxtil' },
                  { id: 'PRESTADOR_SERVICOS_AUTONOMO', title: 'Prestador(a) de Serviços', desc: 'Trabalhos manuais, reparações, eletricidade, beleza ou fretes' },
                  { id: 'COMERCIANTE_AMBULANTE', title: 'Comércio Ambulante / Venda Rápida', desc: 'Venda direta ou circulação em vias públicas e feiras' },
                  { id: 'OUTRO_INFORMAL', title: 'Outra Atividade Autónoma', desc: 'Outro tipo de atividade económica por conta própria' }
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, activityType: act.id as InformalActivityType })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.activityType === act.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white flex items-center justify-between">
                      {act.title}
                      {formData.activityType === act.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{act.desc}</p>
                  </button>
                ))}
              </div>

              {/* Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Província</label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      const provObj = PROVINCES_ANGOLA.find(p => p.name === newProv);
                      setFormData({
                        ...formData,
                        province: newProv,
                        municipality: provObj?.municipalities[0] || 'Sede'
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {PROVINCES_ANGOLA.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Município</label>
                  <select
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {currentProvinceObj.municipalities.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Local específico de venda ou praça (Opcional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.marketLocation || ''}
                    onChange={(e) => setFormData({ ...formData, marketLocation: e.target.value })}
                    placeholder="Ex: Mercado do 30, Bancada n.º 12 / Feira da Camama"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Equipa / Ajudantes */}
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white">Como trabalha no dia-a-dia?</div>
                  <div className="text-xs text-slate-400">Trabalha sozinho(a) ou possui ajudantes/trabalhadores?</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, worksAlone: true, helpersCount: 0 })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      formData.worksAlone 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Conta Própria (Sozinho)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, worksAlone: false, helpersCount: formData.helpersCount || 1 })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !formData.worksAlone 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Com Ajudantes ({formData.helpersCount})
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg transition-all"
                >
                  Continuar para Documentação Atual
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Documentação Atual (BI, NIF, INSS) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  2. Que documentos ou registos já possui atualmente?
                </h3>
                <p className="text-sm text-slate-400">
                  Não se preocupe se ainda não tiver tudo. O AO MARKET vai ajudá-lo(a) a obter os que faltam!
                </p>
              </div>

              {/* 1. Bilhete de Identidade */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Possui Bilhete de Identidade (BI) Nacional?</div>
                      <div className="text-xs text-slate-400">Documento de identificação de cidadão angolano</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasBi: true })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${formData.hasBi ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasBi: false, biNumber: '' })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${!formData.hasBi ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Ainda Não
                    </button>
                  </div>
                </div>

                {formData.hasBi && (
                  <div>
                    <input
                      type="text"
                      value={formData.biNumber || ''}
                      onChange={(e) => setFormData({ ...formData, biNumber: e.target.value.toUpperCase() })}
                      placeholder="Número do BI (Ex: 004819201LA041)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* 2. NIF (AGT) */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Já possui Número de Identificação Fiscal (NIF)?</div>
                      <div className="text-xs text-slate-400">NIF Singular emitido pela AGT ou através do PREI</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasNif: true })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${formData.hasNif ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasNif: false, nifNumber: '' })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${!formData.hasNif ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Ainda Não
                    </button>
                  </div>
                </div>

                {formData.hasNif && (
                  <div>
                    <input
                      type="text"
                      value={formData.nifNumber || ''}
                      onChange={(e) => setFormData({ ...formData, nifNumber: e.target.value.trim() })}
                      placeholder="Número de Contribuinte / NIF (10 dígitos ou igual ao BI)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* 3. INSS (Segurança Social) */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Já está inscrito(a) no INSS (Segurança Social)?</div>
                      <div className="text-xs text-slate-400">Número de Segurado (NISS) para pensões e proteção social</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasInss: true })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${formData.hasInss ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasInss: false, inssNumber: '' })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${!formData.hasInss ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Ainda Não
                    </button>
                  </div>
                </div>

                {formData.hasInss && (
                  <div>
                    <input
                      type="text"
                      value={formData.inssNumber || ''}
                      onChange={(e) => setFormData({ ...formData, inssNumber: e.target.value.trim() })}
                      placeholder="Número de Segurado INSS / NISS (Ex: INSS-44019283)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleCalculateDiagnosis}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg transition-all"
                >
                  Gerar Diagnóstico & Roteiro
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Resultado do Diagnóstico & Plano de Ação */}
          {step === 3 && diagnosisResult && (
            <div className="space-y-6">
              {/* Header do Resultado */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Roteiro Recomendado
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {diagnosisResult.recommendedPath === 'PREI_SIMPLIFICADO' && 'Programa de Reconversão da Economia Informal (PREI)'}
                        {diagnosisResult.recommendedPath === 'CONTA_PROPRIA' && 'Regime de Trabalhador por Conta Própria (INSS & AGT)'}
                        {diagnosisResult.recommendedPath === 'COOPERATIVA_AGRICOLA' && 'Formalização de Produtor / Cooperativa Agropecuária'}
                        {diagnosisResult.recommendedPath === 'MICROEMPRESA' && 'Regime Simplificado de Microempresa Comercial'}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">
                      {diagnosisResult.initialProgressPercentage}%
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase">Progresso Atual</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${diagnosisResult.initialProgressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Próxima Ação Imediata */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  ⚡ Próxima Ação Prioritária
                </div>
                <div className="text-sm font-semibold text-white">
                  {diagnosisResult.nextImmediateAction}
                </div>
                <div className="text-xs text-amber-200/80 mt-1">
                  Tempo estimado de conclusão do processo: cerca de <strong>{diagnosisResult.estimatedDaysToCompletion} dias</strong> com o apoio dos agentes do AO MARKET.
                </div>
              </div>

              {/* Benefícios que vai desbloquear */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Vantagens que vai desbloquear ao formalizar
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diagnosisResult.formalizationBenefits.map((b, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
                >
                  Ajustar Respostas
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-bold px-7 py-3 rounded-2xl shadow-xl transition-all"
                >
                  Abrir Meu Dossiê de Formalização
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
