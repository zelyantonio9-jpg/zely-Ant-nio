import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Landmark, 
  Clock, 
  ExternalLink, 
  FileCheck, 
  Sparkles,
  ArrowRight,
  Download,
  AlertTriangle,
  History,
  Info
} from 'lucide-react';
import { 
  FormalizationDossier, 
  FormalizationStage, 
  FormalizationDocument, 
  InstitutionalReferral, 
  INSSVerificationRecord,
  FormalizationAuditLog,
  UserProfile,
  DocumentTypeEnum
} from '../types';

interface FormalizationTrackerHubProps {
  currentUser: UserProfile;
  dossier?: FormalizationDossier;
  stages: FormalizationStage[];
  documents: FormalizationDocument[];
  referrals: InstitutionalReferral[];
  inssVerification?: INSSVerificationRecord;
  auditLogs: FormalizationAuditLog[];
  onOpenDiagnosis: () => void;
  onUploadDocument: (docType: DocumentTypeEnum | string, title: string, fileData: { fileName: string; fileSizeKb: number; fileMimeType: string; fileUrl?: string }) => void;
  onGenerateReferral: (target: 'AGT' | 'INSS' | 'PREI_GUICHE_UNICO' | 'BANCO_COMERCIAL') => void;
  onRefreshStatus: () => void;
}

export const FormalizationTrackerHub: React.FC<FormalizationTrackerHubProps> = ({
  currentUser,
  dossier,
  stages,
  documents,
  referrals,
  inssVerification,
  auditLogs,
  onOpenDiagnosis,
  onUploadDocument,
  onGenerateReferral,
  onRefreshStatus
}) => {
  const [activeTab, setActiveTab] = useState<'etapas' | 'documentos' | 'inss' | 'encaminhamentos' | 'historico'>('etapas');
  const [uploadDocType, setUploadDocType] = useState<string>('BI_PASSAPORTE');
  const [uploadDocTitle, setUploadDocTitle] = useState<string>('Bilhete de Identidade');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);

  // Fallback se o utilizador ainda não iniciou o diagnóstico
  if (!dossier) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center max-w-4xl mx-auto shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            Programa de Formalização AO MARKET
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Meu Caminho para a Formalização
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Venda agora e formalize progressivamente. O AO MARKET guia-o passo a passo para a obtenção do seu NIF, inscrição no INSS e emissão de faturas oficiais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
            <Building2 className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-sm font-bold text-white">1. Diagnóstico Rápido</div>
            <div className="text-xs text-slate-400 mt-1">Identifique em 2 minutos que etapas faltam para o seu negócio.</div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
            <FileText className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-sm font-bold text-white">2. Obtenção de NIF & Guias</div>
            <div className="text-xs text-slate-400 mt-1">Encaminhamento direto para a AGT e balcões de apoio PREI.</div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-sm font-bold text-white">3. Segurança Social (INSS)</div>
            <div className="text-xs text-slate-400 mt-1">Garantia de reforma, subsídios e proteção para a sua família.</div>
          </div>
        </div>

        <div>
          <button
            onClick={onOpenDiagnosis}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-xl transition-all"
          >
            Iniciar Diagnóstico de Formalização
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const handleSimulatedFileUpload = () => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      onUploadDocument(
        uploadDocType,
        uploadDocTitle,
        {
          fileName: `${uploadDocTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`,
          fileSizeKb: 480,
          fileMimeType: 'application/pdf'
        }
      );
      setIsSimulatingUpload(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner com Progresso */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                Dossiê #{dossier.id.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {dossier.province} • {dossier.municipality}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Meu Caminho para a Formalização
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Atividade: <strong className="text-white">{dossier.activityType.replace(/_/g, ' ')}</strong>
              {dossier.marketLocation && ` (${dossier.marketLocation})`}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 min-w-[240px] flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Estado do Processo</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {dossier.status.replace(/_/g, ' ')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {dossier.approvedDocumentsCount} docs validados
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-amber-400">{dossier.progressPercentage}%</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Progresso Total</div>
            </div>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden mt-6 border border-slate-800">
          <div 
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.max(dossier.progressPercentage, 5)}%` }}
          />
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('documentos')}
            className="inline-flex items-center gap-2 text-xs font-bold bg-amber-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-amber-400 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Anexar Documento
          </button>

          <button
            onClick={() => onGenerateReferral('AGT')}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <Building2 className="w-4 h-4 text-blue-400" />
            Guia de Encaminhamento AGT
          </button>

          <button
            onClick={() => onGenerateReferral('INSS')}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Guia de Encaminhamento INSS
          </button>

          <button
            onClick={onOpenDiagnosis}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 ml-auto"
          >
            Refazer Diagnóstico
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'etapas', label: '1. Etapas do Processo', icon: Clock },
          { id: 'documentos', label: '2. Documentos & Provas', icon: FileCheck },
          { id: 'inss', label: '3. Proteção Social / INSS', icon: ShieldCheck },
          { id: 'encaminhamentos', label: '4. Guias Institucionais', icon: Landmark },
          { id: 'historico', label: '5. Histórico & Auditoria', icon: History },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ETAPAS DO PROCESSO */}
      {activeTab === 'etapas' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Trilha de Formalização Progressiva</h3>
            
            <div className="space-y-4">
              {stages.length === 0 ? (
                <div className="text-sm text-slate-400 p-4 bg-slate-950/50 rounded-2xl text-center">
                  Nenhuma etapa gerada ainda. Execute o diagnóstico de formalização.
                </div>
              ) : (
                stages.map((st, idx) => {
                  const isDone = st.status === 'CONCLUIDO';
                  const isCurrent = st.status === 'EM_ANDAMENTO';
                  return (
                    <div 
                      key={st.id || idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : isCurrent
                          ? 'bg-amber-950/20 border-amber-500/50 text-amber-200 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDone 
                            ? 'bg-emerald-500 text-slate-950' 
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {st.institutionResponsible}
                            </span>
                            <h4 className="text-sm font-bold text-white">{st.stageName}</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {isDone && 'Etapa concluída com sucesso e registada em auditoria.'}
                            {isCurrent && 'Em processamento ativo. Submeta a documentação necessária para avançar.'}
                            {!isDone && !isCurrent && 'Aguardando conclusão das etapas anteriores.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                          isDone 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : isCurrent
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {st.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTOS */}
      {activeTab === 'documentos' && (
        <div className="space-y-6">
          {/* Caixa de Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-400" />
              Submeter Comprovativo ou Documento Oficial
            </h3>
            <p className="text-xs text-slate-400">
              Anexe fotografias nítidas ou ficheiros PDF do seu BI, comprovativo de morada, declaração de atividade ou certidão.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Documento</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => {
                    setUploadDocType(e.target.value);
                    const map: Record<string, string> = {
                      'BI_PASSAPORTE': 'Bilhete de Identidade / BI',
                      'NIF_EMPRESA': 'Comprovativo de NIF / AGT',
                      'DECLARACAO_ATIVIDADE': 'Declaração de Atividade / Praça',
                      'GUIA_INSS': 'Guia de Pagamento / Inscrição INSS',
                      'ALVARA_COMERCIAL': 'Cartão de Vendedor / Alvará'
                    };
                    setUploadDocTitle(map[e.target.value] || 'Documento de Formalização');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm"
                >
                  <option value="BI_PASSAPORTE">Bilhete de Identidade (BI)</option>
                  <option value="NIF_EMPRESA">Comprovativo de NIF (AGT)</option>
                  <option value="DECLARACAO_ATIVIDADE">Declaração de Atividade / Feira</option>
                  <option value="GUIA_INSS">Comprovativo de Inscrição / Guia INSS</option>
                  <option value="ALVARA_COMERCIAL">Cartão de Munícipe / Vendedor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Ficheiro</label>
                <input
                  type="text"
                  value={uploadDocTitle}
                  onChange={(e) => setUploadDocTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm"
                />
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/40 text-center space-y-3">
              <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-xs text-slate-300">
                Formatos suportados: <strong>PDF, JPG, PNG</strong> (Máx: 5MB por ficheiro)
              </div>
              <button
                type="button"
                disabled={isSimulatingUpload}
                onClick={handleSimulatedFileUpload}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                {isSimulatingUpload ? 'A Carregar Ficheiro...' : 'Carregar e Enviar para Validação'}
              </button>
            </div>
          </div>

          {/* Lista de Documentos Enviados */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Documentos Anexados ao Dossiê ({documents.length})</h3>

            {documents.length === 0 ? (
              <div className="text-xs text-slate-400 p-6 bg-slate-950/50 rounded-2xl text-center">
                Ainda não foram anexados documentos. Utilize o formulário acima para carregar o seu BI ou comprovativo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="text-sm font-bold text-white">{doc.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{doc.fileName} ({doc.fileSizeKb} KB)</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        doc.status === 'APROVADO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        doc.status === 'REJEITADO' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    {doc.rejectionReason && (
                      <div className="p-2.5 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Motivo de correção:</strong> {doc.rejectionReason}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-700/60">
                      <span>Enviado: {new Date(doc.submittedAt).toLocaleDateString('pt-AO')}</span>
                      {doc.reviewedByName && (
                        <span>Validado por: {doc.reviewedByName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INSS / SEGURANÇA SOCIAL */}
      {activeTab === 'inss' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Instituto Nacional de Segurança Social (INSS)
                </span>
                <h3 className="text-xl font-bold text-white">Integração Soberana & Regime de Conta Própria</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 max-w-2xl">
              Ao regularizar a sua inscrição no INSS através do AO MARKET, o trabalhador informal e a sua família garantem acesso a pensões por velhice, subsídio de maternidade, invalidez e proteção em caso de acidente de trabalho.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Número NISS Registado</div>
                <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                  {dossier.inssNumber || inssVerification?.niss || 'Aguardando Inscrição'}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Estado da Validação</div>
                <div className="text-base font-bold text-white mt-1">
                  {inssVerification?.status?.replace(/_/g, ' ') || 'Pendente de Comprovativo'}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Regime Recomendado</div>
                <div className="text-base font-bold text-amber-400 mt-1">
                  PREI / Conta Própria
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  Tem em mãos um comprovativo de pagamento do INSS ou o seu cartão de segurado? Anexe-o para validação oficial pelo agente autorizado.
                </div>
              </div>

              <button
                onClick={() => {
                  setUploadDocType('GUIA_INSS');
                  setUploadDocTitle('Comprovativo de Segurado INSS');
                  setActiveTab('documentos');
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shrink-0 transition-all"
              >
                Anexar Guia do INSS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENCAMINHAMENTOS INSTITUCIONAIS */}
      {activeTab === 'encaminhamentos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Guias de Encaminhamento Oficial</h3>
                <p className="text-xs text-slate-400">
                  Documentos de apresentação emitidos pelo AO MARKET para atendimento presencial ou célere nos balcões do Estado.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onGenerateReferral('AGT')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                >
                  + Guia AGT
                </button>
                <button
                  onClick={() => onGenerateReferral('INSS')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                >
                  + Guia INSS
                </button>
              </div>
            </div>

            {referrals.length === 0 ? (
              <div className="text-xs text-slate-400 p-6 bg-slate-950/50 rounded-2xl text-center">
                Nenhuma guia institucional gerada até ao momento. Clique nos botões acima para gerar a sua guia de apoio ao atendimento.
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div key={ref.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {ref.referralCode}
                        </span>
                        <span className="text-sm font-bold text-white">
                          Encaminhamento para {ref.targetInstitution}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Emitido em: {new Date(ref.generatedAt).toLocaleDateString('pt-AO')} • Estado: <strong className="text-slate-200">{ref.status}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`A descarregar Guia de Encaminhamento Oficial ${ref.referralCode} para apresentação no balcão da ${ref.targetInstitution}.`)}
                        className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar Guia PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: HISTÓRICO & AUDITORIA */}
      {activeTab === 'historico' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            Trilha de Auditoria Imutável do Dossiê
          </h3>
          <p className="text-xs text-slate-400">
            Registo transparente de todos os eventos, alterações de estado e pareceres emitidos no seu processo.
          </p>

          {auditLogs.length === 0 ? (
            <div className="text-xs text-slate-400 p-6 bg-slate-950/50 rounded-2xl text-center">
              Nenhum evento registado no log de auditoria deste dossiê.
            </div>
          ) : (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    {log.reason && <div className="text-slate-400 text-[11px] mt-0.5">{log.reason}</div>}
                  </div>
                  <div className="text-right text-slate-500 text-[11px]">
                    <div>{new Date(log.timestamp).toLocaleString('pt-AO')}</div>
                    <div>Por: {log.actorName} ({log.actorRole})</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
