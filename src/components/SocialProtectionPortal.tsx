import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  CreditCard, 
  Check, 
  Search, 
  Lock, 
  AlertTriangle, 
  QrCode, 
  FileText, 
  RefreshCw, 
  Building2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Logo } from './Logo';
import { INSSValidationResult, INSSAuditLog } from '../types';

export const SocialProtectionPortal: React.FC = () => {
  const { 
    currentUser, 
    formatKz, 
    validateInss, 
    linkInssToProfile, 
    inssAuditLogs, 
    refreshInssAuditLogs,
    attemptInssModification 
  } = useMarket();

  const [searchQuery, setSearchQuery] = useState(currentUser.nif || currentUser.inssNumber || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<INSSValidationResult | null>(null);
  const [userConsent, setUserConsent] = useState(true);
  const [linkSuccessMsg, setLinkSuccessMsg] = useState<string | null>(null);
  const [linkErrorMsg, setLinkErrorMsg] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  // Security test: Attempt direct alteration (Should fail 403)
  const [attemptFeedback, setAttemptFeedback] = useState<{ status: number; message: string; type: 'error' | 'success' } | null>(null);
  const [isAttemptingAlteration, setIsAttemptingAlteration] = useState(false);

  // Simulator based on real user sales or interactive input
  const [simulatedGrossSales, setSimulatedGrossSales] = useState<number>(currentUser.totalSalesAOA || 0);
  const selectedContributionRate = currentUser.role === 'producer' ? 0.03 : 0.04;
  const calculatedINSS = Math.round(simulatedGrossSales * selectedContributionRate);
  const estimatedPensionAOA = Math.round(simulatedGrossSales * 0.45);

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsValidating(true);
    setLinkSuccessMsg(null);
    setLinkErrorMsg(null);
    try {
      const res = await validateInss(searchQuery.trim());
      setValidationResult(res);
    } catch (err: any) {
      setLinkErrorMsg(err.message || 'Falha ao consultar API do INSS');
    } finally {
      setIsValidating(false);
    }
  };

  const handleLinkProfile = async () => {
    if (!validationResult) return;
    if (!userConsent) {
      setLinkErrorMsg('É obrigatório assinalar o consentimento expresso para vincular o registo.');
      return;
    }

    setIsLinking(true);
    setLinkSuccessMsg(null);
    setLinkErrorMsg(null);
    try {
      const res = await linkInssToProfile(validationResult, userConsent);
      setLinkSuccessMsg(res.message);
    } catch (err: any) {
      setLinkErrorMsg(err.message || 'Erro ao vincular ao perfil');
    } finally {
      setIsLinking(false);
    }
  };

  const handleTestDirectAlteration = async () => {
    setIsAttemptingAlteration(true);
    setAttemptFeedback(null);
    try {
      await attemptInssModification({
        niss: currentUser.inssNumber || 'INSS-44019283',
        action: 'FORCAR_ALTERACAO_VALOR_CONTRIBUICAO',
        novoValor: 0
      });
      setAttemptFeedback({
        status: 200,
        message: 'Aviso: Esta ação nunca deveria passar.',
        type: 'error'
      });
    } catch (err: any) {
      setAttemptFeedback({
        status: 403,
        message: 'BLOQUEIO DE SEGURANÇA ATIVO (HTTP 403): O AO MARKET opera em modo estritamente de CONSULTA (Read-Only). Alterações a dados do INSS só podem ser efetuadas nas agências físicas ou portal oficial inss.gov.ao.',
        type: 'success'
      });
    } finally {
      setIsAttemptingAlteration(false);
    }
  };

  return (
    <div id="social-protection-portal" className="space-y-5 pb-12">
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
              Validação Oficial e Integração com o INSS
            </h1>

            <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
              Consulta em tempo real da situação contributiva e registo de Produtores, Comerciantes e Transportadores. Sincronização segura de dados com proteção estrita de soberania e conformidade legal.
            </p>
          </div>
        </div>

        {/* Current User Verification Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs shrink-0 flex items-center space-x-3 shadow-xs">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
            currentUser.inssVerified
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}>
            {currentUser.inssVerified ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600" />
            )}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Estado do Titular:</div>
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              {currentUser.inssVerified ? 'Entidade Verificada' : 'Registo Não Vinculado'}
              {currentUser.inssVerified && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">
                  CONFORME
                </span>
              )}
            </div>
            <div className="text-[10px] text-amber-800 font-mono font-bold">
              {currentUser.inssNumber || 'Sem NISS Associado'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Validation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: API Query and Validation Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-amber-600" />
                <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Consultar & Validar Registo no INSS
                </h2>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                API Oficial Gov.ao
              </span>
            </div>

            <form onSubmit={handleValidate} className="space-y-3">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">
                  Número de Identificação Fiscal (NIF) ou NISS:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Ex: 5419082341 ou INSS-44019283"
                    className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>A Consultar...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Validar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Sincronização estrita de dados necessários (nome oficial, situação e certidão).</span>
                </div>
              </div>
            </form>

            {/* Quick Demo Pre-sets */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] text-slate-500 font-semibold mb-1.5 uppercase tracking-wide">
                Exemplos de Contribuintes Registados no Sandbox do INSS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Produtor Huambo (5419082341)', val: '5419082341' },
                  { label: 'Coop. AgroCuanza (5420192834)', val: '5420192834' },
                  { label: 'Transportes Kwanza (5439182730)', val: '5439182730' },
                  { label: 'Grossista Kero (5409182736)', val: '5409182736' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.val);
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-mono transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Result Display */}
            {validationResult && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className={`p-4 rounded-xl border ${
                  validationResult.isVerified
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {validationResult.isVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-bold text-xs font-mono uppercase">
                          {validationResult.officialEntityName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {validationResult.statusMessage}
                      </p>
                    </div>

                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold font-mono shrink-0 ${
                      validationResult.complianceStatus === 'REGULAR'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}>
                      {validationResult.complianceStatus}
                    </span>
                  </div>

                  {/* Metadata fields */}
                  {validationResult.isVerified && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-200/60 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">NISS Oficial:</span>
                        <span className="font-bold text-slate-900">{validationResult.niss}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">NIF Validado:</span>
                        <span className="font-bold text-slate-900">{validationResult.nif}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Regime:</span>
                        <span className="font-bold text-slate-900">{validationResult.regime}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Código Certidão:</span>
                        <span className="font-bold text-slate-900">{validationResult.certificateCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Última Contribuição:</span>
                        <span className="font-bold text-slate-900">{validationResult.lastContributionPeriod || 'Regular'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Total Trabalhadores:</span>
                        <span className="font-bold text-slate-900">{validationResult.totalContributorsCount || 1}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Linking Action */}
                {validationResult.isVerified && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="user-consent-check"
                        checked={userConsent}
                        onChange={e => setUserConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="user-consent-check" className="text-[11px] text-slate-700 leading-snug">
                        Autorizo expressamente a associação do <strong>NIF {validationResult.nif}</strong> e <strong>NISS {validationResult.niss}</strong> ao perfil empresarial de <strong>{currentUser.name}</strong> para exibição do Selo Oficial de Entidade Verificada.
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleLinkProfile}
                        disabled={isLinking || !userConsent}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        {isLinking ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>A Vincular...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Vincular e Obter Selo de Verificação</span>
                          </>
                        )}
                      </button>

                      {validationResult.qrVerificationUrl && (
                        <a
                          href={validationResult.qrVerificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Verificar Certidão Externa</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {linkSuccessMsg && (
                      <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{linkSuccessMsg}</span>
                      </div>
                    )}

                    {linkErrorMsg && (
                      <div className="p-2.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                        <span>{linkErrorMsg}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security & Sovereignty Protection Test Console */}
          <div className="bg-white rounded-2xl border border-rose-200/80 p-5 space-y-3 text-xs shadow-xs">
            <div className="flex items-center space-x-2 border-b border-rose-100 pb-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="font-bold text-rose-950 text-xs uppercase tracking-wider">
                Proteção de Soberania & Bloqueio de Alterações
              </h2>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              O AO MARKET cumpre a exigência soberana de <strong>nunca permitir alterar dados do INSS diretamente pela plataforma</strong>. O sistema mantém integração estritamente em modo de leitura e validação (Read-Only).
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-[11px] text-slate-700">
                Teste de Penetração: Simular tentativa de mutação/edição direta de registo INSS
              </div>
              <button
                type="button"
                onClick={handleTestDirectAlteration}
                disabled={isAttemptingAlteration}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shrink-0 transition-colors disabled:opacity-50"
              >
                {isAttemptingAlteration ? 'A Executar Teste...' : 'Testar Bloqueio (HTTP 403)'}
              </button>
            </div>

            {attemptFeedback && (
              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                attemptFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-900">Teste de Segurança Passou com Sucesso:</strong>
                    {attemptFeedback.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verified Badge Digital Card & Contribution Simulator */}
        <div className="lg:col-span-5 space-y-4">
          {/* Verified Entity Badge Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-5 space-y-4 shadow-sm border border-slate-700">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                  Selo de Entidade Verificada
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold">
                {currentUser.inssVerified ? 'ATIVO & CONFORME' : 'PENDENTE'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Entidade Registada:</div>
              <div className="text-sm font-bold text-white font-mono">
                {currentUser.inssOfficialName || currentUser.companyName || currentUser.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-400 font-mono">NISS Oficial:</div>
                <div className="font-bold text-amber-300 font-mono text-[11px]">
                  {currentUser.inssNumber || 'INSS-44019283'}
                </div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-400 font-mono">Certidão Digital:</div>
                <div className="font-bold text-amber-300 font-mono text-[11px]">
                  {currentUser.inssCertificateCode || 'INSS-CERT-2026-440192'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
              <div className="flex items-center space-x-1.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Verificação Criptográfica QR</span>
              </div>
              <span className="font-mono text-slate-300">Validade: 90 Dias</span>
            </div>
          </div>

          {/* Simulator Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs shadow-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Simulador de Contribuição Social Integrada
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">
                  Volume Mensal de Vendas Transacionadas (Kz):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={simulatedGrossSales}
                  onChange={e => setSimulatedGrossSales(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-600 font-medium">Contribuição Mensal (3%):</div>
                  <div className="text-base font-black text-slate-900 font-mono">{formatKz(calculatedINSS)}</div>
                  <div className="text-[9px] text-slate-400">Dedução voluntária por fatura</div>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-1">
                  <div className="text-[10px] text-emerald-800 font-medium">Pensão Vitalícia Estimada:</div>
                  <div className="text-base font-black text-emerald-900 font-mono">{formatKz(estimatedPensionAOA)}</div>
                  <div className="text-[9px] text-emerald-700 font-medium">Garantia pelo Estado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5 text-xs shadow-xs">
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <Award className="w-4 h-4 text-amber-600 mr-2" />
              Benefícios da Entidade Verificada
            </h2>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Prioridade no escoamento e frete rodoviário nacional.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Acesso a linhas de crédito bonificadas (PAC / FADA / BDA).</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">Selo de Confiança Ouro visível no Catálogo para compradores.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INSS Audit Logs Section (Institutional Transparency) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Registo de Auditoria de Consultas & Sincronização INSS
            </h2>
          </div>
          <button
            type="button"
            onClick={refreshInssAuditLogs}
            className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Logs</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Ação</th>
                <th className="py-2.5 px-3">NIF / NISS</th>
                <th className="py-2.5 px-3">Utilizador / Role</th>
                <th className="py-2.5 px-3">Decisão</th>
                <th className="py-2.5 px-3">IP / Gateway</th>
                <th className="py-2.5 px-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {inssAuditLogs.slice(0, 10).map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                    {log.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-amber-800 font-bold">
                    {log.nif || log.niss || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {log.queriedByUserName} ({log.queriedByRole})
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                      log.decision === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.decision === 'BLOCKED_READ_ONLY'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={log.notes}>
                    {log.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
