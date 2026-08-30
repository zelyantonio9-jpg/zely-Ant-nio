import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  FileText, 
  Send,
  Eye,
  History,
  Download,
  Users,
  Award,
  Layers
} from 'lucide-react';
import { 
  FormalizationDossier, 
  FormalizationDocument, 
  FormalizationStageStatus, 
  UserProfile,
  FormalizationAuditLog
} from '../types';
import { PROVINCES_ANGOLA } from '../data/angolaGeoData';

interface FormalizationAdminPortalProps {
  currentUser: UserProfile;
  dossiers: FormalizationDossier[];
  documents: FormalizationDocument[];
  auditLogs: FormalizationAuditLog[];
  onApproveDocument: (documentId: string, notes?: string) => void;
  onRejectDocument: (documentId: string, reason: string) => void;
  onAdvanceStage: (dossierId: string, newStage: FormalizationStageStatus, notes: string) => void;
  onAssignAgent: (dossierId: string, agentId: string, agentName: string) => void;
  onValidateINSSRecord: (dossierId: string, niss: string, officialRef: string) => void;
  onClose: () => void;
}

export const FormalizationAdminPortal: React.FC<FormalizationAdminPortalProps> = ({
  currentUser,
  dossiers,
  documents,
  auditLogs,
  onApproveDocument,
  onRejectDocument,
  onAdvanceStage,
  onAssignAgent,
  onValidateINSSRecord,
  onClose
}) => {
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(dossiers[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('todas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

  // Modal / Form state for actions
  const [rejectionModalDoc, setRejectionModalDoc] = useState<FormalizationDocument | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('');
  const [inssValidationModalOpen, setInssValidationModalOpen] = useState<boolean>(false);
  const [inputNiss, setInputNiss] = useState<string>('');
  const [inputOfficialRef, setInputOfficialRef] = useState<string>('');

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId);
  const dossierDocuments = documents.filter(d => d.dossierId === selectedDossierId);
  const dossierAuditLogs = auditLogs.filter(a => a.dossierId === selectedDossierId);

  // Filters
  const filteredDossiers = dossiers.filter(d => {
    const matchesSearch = 
      d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.userPhone.includes(searchQuery) ||
      (d.nifNumber && d.nifNumber.includes(searchQuery)) ||
      (d.biNumber && d.biNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProvince = selectedProvinceFilter === 'todas' || d.province === selectedProvinceFilter;
    const matchesStatus = selectedStatusFilter === 'todos' || d.status === selectedStatusFilter;

    return matchesSearch && matchesProvince && matchesStatus;
  });

  const handleApproveDoc = (docId: string) => {
    onApproveDocument(docId, 'Documento verificado e conforme pelo agente de formalização.');
  };

  const handleConfirmRejection = () => {
    if (rejectionModalDoc && rejectionReasonText.trim()) {
      onRejectDocument(rejectionModalDoc.id, rejectionReasonText.trim());
      setRejectionModalDoc(null);
      setRejectionReasonText('');
    }
  };

  const handleConfirmINSS = () => {
    if (selectedDossier && inputNiss.trim()) {
      onValidateINSSRecord(
        selectedDossier.id,
        inputNiss.trim(),
        inputOfficialRef.trim() || `GUIA-PRESENCIAL-${Date.now()}`
      );
      setInssValidationModalOpen(false);
      setInputNiss('');
      setInputOfficialRef('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Consola de Formalização & PREI</h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold border border-amber-500/30">
                Agente Autorizado AO MARKET
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Operador logado: <strong>{currentUser.name}</strong> ({currentUser.role})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all"
          >
            Sair da Consola
          </button>
        </div>
      </header>

      {/* Main Layout: 2 Panes (List on left, detail on right) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Dossiers List */}
        <div className="w-full max-w-sm border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
          
          {/* Search & Filters */}
          <div className="p-4 border-b border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, telefone, BI..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedProvinceFilter}
                onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="todas">Todas as Províncias</option>
                {PROVINCES_ANGOLA.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="todos">Todos os Estados</option>
                <option value="INFORMAL_REGISTADO">Informal Registado</option>
                <option value="DOCUMENTOS_SUBMETIDOS">Docs Submetidos</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="ENCAMINHADO_AGT">Encaminhado AGT</option>
                <option value="ENCAMINHADO_INSS">Encaminhado INSS</option>
                <option value="FORMALIZACAO_CONCLUIDA">Formalizado</option>
              </select>
            </div>
          </div>

          {/* Dossiers list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredDossiers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhum dossiê de formalização encontrado com os filtros selecionados.
              </div>
            ) : (
              filteredDossiers.map(dos => {
                const isSelected = dos.id === selectedDossierId;
                return (
                  <button
                    key={dos.id}
                    onClick={() => setSelectedDossierId(dos.id)}
                    className={`w-full p-4 text-left transition-all block ${
                      isSelected 
                        ? 'bg-amber-500/10 border-l-4 border-amber-400 text-white' 
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        #{dos.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-amber-400">{dos.progressPercentage}%</span>
                    </div>

                    <div className="text-sm font-bold text-white mt-1 truncate">{dos.userName}</div>
                    <div className="text-xs text-slate-400 truncate">{dos.activityType.replace(/_/g, ' ')} • {dos.province}</div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {dos.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(dos.updatedAt).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer stats */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Total Dossiês: <strong>{dossiers.length}</strong></span>
            <span>Formalizados: <strong>{dossiers.filter(d => d.status === 'FORMALIZACAO_CONCLUIDA').length}</strong></span>
          </div>
        </div>

        {/* Right Area: Selected Dossier Detail */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {selectedDossier ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Dossier Header Info */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-amber-950/60 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                      DOSSIÊ #{selectedDossier.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Criado em {new Date(selectedDossier.createdAt).toLocaleDateString('pt-AO')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedDossier.userName}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span>Telefone: <strong>{selectedDossier.userPhone}</strong></span>
                    <span>Província: <strong>{selectedDossier.province}</strong> ({selectedDossier.municipality})</span>
                    {selectedDossier.marketLocation && (
                      <span>Praça/Bancada: <strong>{selectedDossier.marketLocation}</strong></span>
                    )}
                  </div>
                </div>

                {/* Status card */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 min-w-[220px] text-right">
                  <div className="text-xs text-slate-400 uppercase">Estado Atual</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">
                    {selectedDossier.status.replace(/_/g, ' ')}
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-2">
                    {selectedDossier.progressPercentage}%
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Avançar Etapa do Dossiê:</span>
                  <select
                    value={selectedDossier.status}
                    onChange={(e) => onAdvanceStage(selectedDossier.id, e.target.value as FormalizationStageStatus, 'Avanço de etapa executado por agente de formalização.')}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold"
                  >
                    <option value="INFORMAL_REGISTADO">1. Informal Registado</option>
                    <option value="DOCUMENTOS_SUBMETIDOS">2. Documentos Submetidos</option>
                    <option value="EM_ANALISE">3. Em Análise Administrativa</option>
                    <option value="ENCAMINHADO_AGT">4. Encaminhado para AGT (NIF)</option>
                    <option value="NIF_EMITIDO">5. NIF Emitido / Conforme</option>
                    <option value="ENCAMINHADO_INSS">6. Encaminhado para INSS</option>
                    <option value="INSS_VINCULADO">7. INSS Vinculado</option>
                    <option value="FORMALIZACAO_CONCLUIDA">8. Formalização Concluída (Selo Ouro)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInssValidationModalOpen(true)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Validar & Vincular INSS
                  </button>
                </div>
              </div>

              {/* Documentos do Dossiê */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Documentação Anexada ({dossierDocuments.length})
                  </h3>
                </div>

                {dossierDocuments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl">
                    Nenhum documento anexado a este dossiê ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dossierDocuments.map((doc) => (
                      <div key={doc.id} className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-bold text-white">{doc.title}</div>
                            <div className="text-xs text-slate-400 font-mono">{doc.documentType} • {doc.fileName}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            doc.status === 'APROVADO' ? 'bg-emerald-500/20 text-emerald-400' :
                            doc.status === 'REJEITADO' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {doc.status}
                          </span>
                        </div>

                        {doc.rejectionReason && (
                          <div className="p-2 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                            Motivo: {doc.rejectionReason}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                          <span className="text-[10px] text-slate-400">
                            Submetido: {new Date(doc.submittedAt).toLocaleDateString('pt-AO')}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => setRejectionModalDoc(doc)}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                            >
                              Rejeitar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trilha de Auditoria do Dossiê */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  Registo de Auditoria Imutável do Dossiê
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dossierAuditLogs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Nenhum registo de auditoria para este dossiê.
                    </div>
                  ) : (
                    dossierAuditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <strong className="text-amber-300">{log.action}</strong>: {log.reason || 'Sem anotações'}
                        </div>
                        <div className="text-slate-500 text-[11px] shrink-0">
                          {new Date(log.timestamp).toLocaleString('pt-AO')} por {log.actorName} ({log.actorRole})
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Selecione um dossiê na lista lateral para gerir a formalização.
            </div>
          )}
        </div>

      </div>

      {/* Modal de Rejeição Documental */}
      {rejectionModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Solicitar Correção / Rejeitar Documento</h3>
            <p className="text-xs text-slate-300">
              Indique ao utilizador de forma clara o motivo da recusa (ex: fotografia desfocada, documento caducado ou ilegível).
            </p>

            <textarea
              rows={3}
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              placeholder="Ex: A cópia do Bilhete de Identidade está cortada nas extremidades. Por favor submeta uma fotografia com boa iluminação."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReasonText.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs disabled:opacity-50"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Validação INSS */}
      {inssValidationModalOpen && selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Vincular Número de Segurado INSS</h3>
            </div>
            <p className="text-xs text-slate-300">
              Insira o número NISS validado oficialmente através de comprovativo documental ou guia presencial.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Segurado (NISS)</label>
                <input
                  type="text"
                  value={inputNiss}
                  onChange={(e) => setInputNiss(e.target.value.trim())}
                  placeholder="Ex: INSS-44019283"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Código / Referência Oficial do Documento</label>
                <input
                  type="text"
                  value={inputOfficialRef}
                  onChange={(e) => setInputOfficialRef(e.target.value.trim())}
                  placeholder="Ex: GUIA-INSS-HUAMBO-2026-0812"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setInssValidationModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmINSS}
                disabled={!inputNiss.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs disabled:opacity-50 shadow-md"
              >
                Confirmar Validação Oficial
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
