import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  Download, 
  Check, 
  X, 
  RotateCcw, 
  AlertCircle,
  Filter,
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  Car,
  Sprout,
  Store,
  Building2,
  Lock,
  UserCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { 
  UserProfile, 
  UserDocument, 
  DocumentVerificationStatus, 
  VerificationLevel,
  AccountRegistrationStatus,
  ActorProfileType,
  FormalizationStageStatus
} from '../types';
import { getAccountStatusBadge } from '../utils/rolePermissions';
import { FormalizationAdminPortal } from './FormalizationAdminPortal';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser,
    registeredUsers, 
    products, 
    orders, 
    freightLoads, 
    disputes, 
    formatKz, 
    updateDocumentStatus, 
    updateUserVerificationLevel,
    updateAccountStatus,
    requestAdditionalDocuments,
    addAuditLog,
    resetToOfficialData,
    clearAllTransactions,
    formalizationDossiers,
    formalizationDocuments,
    formalizationAuditLogs,
    approveFormalizationDoc,
    rejectFormalizationDoc,
    advanceFormalizationStage,
    validateFormalizationINSS
  } = useMarket();

  // Admin / Support tab navigation
  const [adminTab, setAdminTab] = useState<'ENTITIES' | 'DOCUMENT_QUEUE' | 'FORMALIZATION' | 'AUDIT_LOGS'>('FORMALIZATION');
  
  // Detail Modal
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserProfile | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [profileFilter, setProfileFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Confirmation Modals & Action Forms
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [showConfirmClearTx, setShowConfirmClearTx] = useState<boolean>(false);

  // Document Rejection Form Modal
  const [rejectionModalDoc, setRejectionModalDoc] = useState<{ userId: string; docId: string; docLabel: string } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('Documento com baixa legibilidade ou expirado');

  // Request Additional Documents Form
  const [showRequestDocsModal, setShowRequestDocsModal] = useState<boolean>(false);
  const [missingDocsInput, setMissingDocsInput] = useState<string>('Certidão Comercial Atualizada, Comprovativo de IBAN');
  const [requestNotesInput, setRequestNotesInput] = useState<string>('Por favor submeta a documentação solicitada para elevar o nível da conta.');

  // Support Note Form
  const [supportNoteInput, setSupportNoteInput] = useState<string>('');

  const isSupportRole = currentUser.role === 'support';

  // Calculate National Macro Stats
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAOA, 0);
  const activeDisputes = disputes.filter(d => d.status === 'ABERTO' || d.status === 'EM_ANALISE').length;

  // Flatten pending documents queue
  const pendingDocs: { user: UserProfile; doc: UserDocument }[] = [];
  registeredUsers.forEach(u => {
    if (u.documents && u.documents.length > 0) {
      u.documents.forEach(doc => {
        pendingDocs.push({ user: u, doc });
      });
    }
  });

  // Filtered Users List
  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.nif && u.nif.includes(searchQuery));

    const matchesProfile = 
      profileFilter === 'ALL' ||
      (profileFilter === 'PRODUCER' && (u.role === 'producer' || u.activeProfiles?.includes('PRODUCER'))) ||
      (profileFilter === 'BUYER' && (u.role === 'buyer' || u.activeProfiles?.includes('BUYER'))) ||
      (profileFilter === 'TRANSPORTER' && (u.role === 'driver' || u.role === 'logistics_company' || u.activeProfiles?.includes('TRANSPORTER'))) ||
      (profileFilter === 'EMPRESA' && (u.entityType === 'EMPRESA' || u.activeProfiles?.includes('EMPRESA')));

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ATIVO' && (u.accountStatus === 'ATIVO' || !u.accountStatus)) ||
      (statusFilter === u.accountStatus);

    return matchesSearch && matchesProfile && matchesStatus;
  });

  const handleApproveAccount = (userId: string) => {
    updateAccountStatus(userId, 'ATIVO', 'Conta aprovada pela equipa de supervisão institucional.');
    if (selectedUserForDetail && selectedUserForDetail.id === userId) {
      setSelectedUserForDetail({ ...selectedUserForDetail, accountStatus: 'ATIVO' });
    }
  };

  const handleRejectAccount = (userId: string, reason: string) => {
    updateAccountStatus(userId, 'REJEITADO', reason);
    if (selectedUserForDetail && selectedUserForDetail.id === userId) {
      setSelectedUserForDetail({ ...selectedUserForDetail, accountStatus: 'REJEITADO', accountStatusReason: reason });
    }
  };

  const handleSuspendAccount = (userId: string) => {
    updateAccountStatus(userId, 'SUSPENSO', 'Conta suspensa preventivamente para auditoria de segurança.');
    if (selectedUserForDetail && selectedUserForDetail.id === userId) {
      setSelectedUserForDetail({ ...selectedUserForDetail, accountStatus: 'SUSPENSO' });
    }
  };

  const handleReactivateAccount = (userId: string) => {
    updateAccountStatus(userId, 'ATIVO', 'Conta reativada pela supervisão.');
    if (selectedUserForDetail && selectedUserForDetail.id === userId) {
      setSelectedUserForDetail({ ...selectedUserForDetail, accountStatus: 'ATIVO' });
    }
  };

  const handleConfirmDocRejection = () => {
    if (!rejectionModalDoc) return;
    updateDocumentStatus(rejectionModalDoc.userId, rejectionModalDoc.docId, 'REJEITADO', rejectionReasonInput);
    setRejectionModalDoc(null);
    setRejectionReasonInput('Documento com baixa legibilidade ou expirado');
  };

  const handleSendDocsRequest = () => {
    if (!selectedUserForDetail) return;
    const docsList = missingDocsInput.split(',').map(s => s.trim()).filter(Boolean);
    requestAdditionalDocuments(selectedUserForDetail.id, docsList, requestNotesInput);
    setShowRequestDocsModal(false);
  };

  const handleAddSupportNote = () => {
    if (!selectedUserForDetail || !supportNoteInput.trim()) return;
    addAuditLog(selectedUserForDetail.id, `Nota de Suporte: ${supportNoteInput.trim()}`, undefined);
    setSupportNoteInput('');
  };

  const handleEscalateCase = () => {
    if (!selectedUserForDetail) return;
    addAuditLog(selectedUserForDetail.id, 'Caso Encaminhado para a Administração', 'Encaminhamento efetuado pelo operador de suporte para validação superior.');
    updateAccountStatus(selectedUserForDetail.id, 'EM_ANALISE', 'Encaminhado para parecer da Administração.');
  };

  return (
    <div id="admin-supervision-portal" className="space-y-6 text-xs">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-display font-bold text-slate-900">
                {isSupportRole ? 'Painel de Suporte e Operações' : 'Administração do AO MARKET'}
              </h1>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold ${isSupportRole ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                {isSupportRole ? 'Suporte' : 'Administração'}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Auditoria de entidades cadastradas, verificação de documentação e controlo de transações
            </p>
          </div>
        </div>

        {/* Admin Tools */}
        {!isSupportRole && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repor Catálogo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmClearTx(true)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Transações</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation: Reset Catalog */}
      {showConfirmReset && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-amber-950">Deseja repor o Catálogo Oficial de Angola?</div>
              <div className="text-amber-800 text-[11px]">Restabelece os produtos certificados e mantém utilizadores registados.</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => { resetToOfficialData(); setShowConfirmReset(false); }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black cursor-pointer border border-amber-400"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Confirmation: Clear Tx */}
      {showConfirmClearTx && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-red-900">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="font-bold text-red-950">Deseja limpar todos os pedidos e fretes de teste?</div>
              <div className="text-red-800 text-[11px]">Limpa o histórico transacional do painel de controlo.</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowConfirmClearTx(false)}
              className="px-3 py-1 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => { clearAllTransactions(); setShowConfirmClearTx(false); }}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Limpar Transações
            </button>
          </div>
        </div>
      )}

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Volume Transacionado</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
            {formatKz(totalGMV)}
          </div>
          <div className="text-[11px] text-slate-500">
            {orders.length} encomendas registadas
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Utilizadores Registados</span>
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
            {registeredUsers.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Produtores, Empresas, Transportadores
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Documentos Submetidos</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
            {pendingDocs.length}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">
            {pendingDocs.filter(d => d.doc.status === 'EM_ANALISE').length} pendentes de validação
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Disputas e Mediação</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
            {activeDisputes}
          </div>
          <div className="text-[11px] text-slate-500">
            Processos de resolução ativos
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setAdminTab('FORMALIZATION')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
            adminTab === 'FORMALIZATION'
              ? 'bg-[#FF6B00] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Gestão de Formalização PREI ({formalizationDossiers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('ENTITIES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            adminTab === 'ENTITIES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Diretório de Cadastros ({registeredUsers.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('DOCUMENT_QUEUE')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            adminTab === 'DOCUMENT_QUEUE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Fila de Validação Documental ({pendingDocs.length})
        </button>
      </div>

      {/* TAB 0: FORMALIZATION DOSSIERS PREI */}
      {adminTab === 'FORMALIZATION' && (
        <FormalizationAdminPortal
          currentUser={currentUser}
          dossiers={formalizationDossiers}
          documents={formalizationDocuments}
          auditLogs={formalizationAuditLogs}
          onApproveDocument={approveFormalizationDoc}
          onRejectDocument={rejectFormalizationDoc}
          onAdvanceStage={(dossierId: string, newStage: FormalizationStageStatus, notes: string) => 
            advanceFormalizationStage(dossierId, newStage, notes)
          }
          onAssignAgent={(_dossierId: string, _agentId: string, _agentName: string) => {}}
          onValidateINSSRecord={validateFormalizationINSS}
          onClose={() => setAdminTab('ENTITIES')}
        />
      )}

      {/* TAB 1: ENTITIES DIRECTORY */}
      {adminTab === 'ENTITIES' && (
        <div className="space-y-3">
          
          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, NIF, telemóvel..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-1 text-slate-500 font-bold text-[11px]">
                <Filter className="w-3.5 h-3.5" />
                <span>Perfil:</span>
              </div>
              <select
                value={profileFilter}
                onChange={e => setProfileFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-900"
              >
                <option value="ALL">Todos os Perfis</option>
                <option value="PRODUCER">Produtores</option>
                <option value="BUYER">Compradores</option>
                <option value="TRANSPORTER">Transportadores</option>
                <option value="EMPRESA">Empresas</option>
              </select>

              <div className="flex items-center space-x-1 text-slate-500 font-bold text-[11px] ml-2">
                <span>Estado:</span>
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-900"
              >
                <option value="ALL">Todos os Estados</option>
                <option value="ATIVO">Ativos</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="DOCUMENTACAO_PENDENTE">Doc. Pendente</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="REJEITADO">Rejeitados</option>
                <option value="SUSPENSO">Suspensos</option>
              </select>
            </div>
          </div>

          {/* Table of Users */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Utilizadores Registados ({filteredUsers.length})
              </div>
              <span className="text-[11px] text-slate-500">Diretório Soberano de Atores Económicos</span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum utilizador encontrado com os filtros selecionados.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map(user => {
                  const badge = getAccountStatusBadge(user.accountStatus);
                  return (
                    <div key={user.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold flex items-center justify-center text-xs font-mono shadow-xs shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span>{user.name}</span>
                            {user.isFormalized && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {user.companyName && user.companyName !== user.name && (
                              <span className="text-[11px] text-slate-500 font-normal">
                                ({user.companyName})
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            <strong className="text-slate-700">{user.role.toUpperCase()}</strong> • {user.province.toUpperCase()} • Tel: <span className="font-mono text-slate-800">{user.phone}</span> • NIF: <span className="font-mono text-slate-800">{user.nif || 'N/D'}</span>
                            {user.companyServices && user.companyServices.length > 0 && (
                              <span className="ml-1.5 bg-purple-50 text-purple-800 border border-purple-200 px-1 py-0.2 rounded font-mono text-[9px]">
                                Serviços: {user.companyServices.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border font-mono ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}>
                          {badge.label}
                        </span>

                        <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-mono">
                          Nível {user.verificationLevel}/5
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedUserForDetail(user)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-[11px] flex items-center space-x-1 cursor-pointer border border-amber-400 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossiê Completo</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: DOCUMENT QUEUE */}
      {adminTab === 'DOCUMENT_QUEUE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fila de Auditoria de Documentos Submetidos
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{pendingDocs.length} documentos anexados</span>
          </div>

          {pendingDocs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhum documento registado no sistema neste momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {pendingDocs.map(({ user, doc }) => (
                <div key={doc.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{doc.label}</div>
                      <div className="text-[11px] text-slate-500">
                        Titular: <strong className="text-slate-900">{user.name}</strong> ({user.province}) • Ficheiro: <span className="font-mono text-slate-700">{doc.fileName}</span> ({doc.fileSizeKb} KB)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Submetido a {doc.uploadDate} • Estado Atual: <span className={`font-bold ${doc.status === 'APROVADO' ? 'text-emerald-700' : doc.status === 'REJEITADO' ? 'text-red-700' : 'text-amber-700'}`}>{doc.status}</span>
                      </div>
                      {doc.rejectionReason && (
                        <div className="text-[10px] text-red-700 font-semibold mt-0.5">
                          Motivo rejeição: {doc.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                    {doc.status !== 'APROVADO' && (
                      <button
                        type="button"
                        onClick={() => updateDocumentStatus(user.id, doc.id, 'APROVADO')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Aprovar</span>
                      </button>
                    )}

                    {doc.status !== 'REJEITADO' && (
                      <button
                        type="button"
                        onClick={() => setRejectionModalDoc({ userId: user.id, docId: doc.id, docLabel: doc.label })}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer border border-red-200"
                      >
                        <X className="w-3 h-3" />
                        <span>Rejeitar com Motivo</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Full Entity Audit Dossier */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 p-5 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-black font-extrabold flex items-center justify-center text-sm font-mono shadow-xs border border-amber-400">
                  {selectedUserForDetail.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedUserForDetail.name}</h3>
                    {selectedUserForDetail.companyName && (
                      <span className="text-xs text-slate-500">({selectedUserForDetail.companyName})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {selectedUserForDetail.id} • Perfil: {selectedUserForDetail.role.toUpperCase()} • Nível {selectedUserForDetail.verificationLevel}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Account Status Badge & Quick Status Actions */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="text-[11px] text-slate-500 font-bold">Estado Atual da Conta:</div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border font-mono ${getAccountStatusBadge(selectedUserForDetail.accountStatus).bgClass} ${getAccountStatusBadge(selectedUserForDetail.accountStatus).textClass} ${getAccountStatusBadge(selectedUserForDetail.accountStatus).borderClass}`}>
                    {getAccountStatusBadge(selectedUserForDetail.accountStatus).label}
                  </span>
                  {selectedUserForDetail.accountStatusReason && (
                    <span className="text-[11px] text-slate-600 italic">"{selectedUserForDetail.accountStatusReason}"</span>
                  )}
                </div>
              </div>

              {/* Admin Decision Actions */}
              <div className="flex items-center space-x-1.5 shrink-0">
                {selectedUserForDetail.accountStatus !== 'ATIVO' && (
                  <button
                    type="button"
                    onClick={() => handleApproveAccount(selectedUserForDetail.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    ✓ Aprovar Conta
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowRequestDocsModal(true)}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs cursor-pointer border border-amber-400 shadow-xs"
                >
                  Solicitar Docs
                </button>

                {selectedUserForDetail.accountStatus === 'ATIVO' ? (
                  <button
                    type="button"
                    onClick={() => handleSuspendAccount(selectedUserForDetail.id)}
                    className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs cursor-pointer border border-red-200"
                  >
                    Suspender
                  </button>
                ) : selectedUserForDetail.accountStatus === 'SUSPENSO' ? (
                  <button
                    type="button"
                    onClick={() => handleReactivateAccount(selectedUserForDetail.id)}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Reativar
                  </button>
                ) : null}
              </div>
            </div>

            {/* Dossier Tabs / Sections */}
            <div className="space-y-3 text-xs">
              
              {/* Section 1: Identification & Contacts */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">1. Identificação & Contactos</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Telemóvel:</span> <strong className="text-slate-900 font-mono">{selectedUserForDetail.phone}</strong></div>
                  <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{selectedUserForDetail.email}</strong></div>
                  <div><span className="text-slate-500">BI:</span> <strong className="text-slate-900 font-mono">{selectedUserForDetail.biNumber || 'N/D'}</strong></div>
                  <div><span className="text-slate-500">NIF:</span> <strong className="text-slate-900 font-mono">{selectedUserForDetail.nif || 'N/D'}</strong></div>
                  <div><span className="text-slate-500">Localização:</span> <strong className="text-slate-900">{selectedUserForDetail.municipality}, {selectedUserForDetail.province}</strong></div>
                  <div><span className="text-slate-500">INSS:</span> <strong className="text-emerald-700 font-mono">{selectedUserForDetail.inssNumber || 'Não inscrito'}</strong></div>
                </div>
              </div>

              {/* Section 2: Specific Activity Details */}
              {selectedUserForDetail.producerData && (
                <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="font-extrabold text-emerald-950 text-xs flex items-center">
                    <Sprout className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    <span>Dados de Produção Agrícola</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-slate-500">Fazenda:</span> <strong>{selectedUserForDetail.producerData.farmName}</strong></div>
                    <div><span className="text-slate-500">Atividade:</span> <strong>{selectedUserForDetail.producerData.activityCategory}</strong></div>
                    <div><span className="text-slate-500">Produtos:</span> <strong>{selectedUserForDetail.producerData.mainCropsOrProducts.join(', ')}</strong></div>
                    <div><span className="text-slate-500">Capacidade:</span> <strong className="font-mono">{selectedUserForDetail.producerData.annualCapacityQty} {selectedUserForDetail.producerData.annualCapacityUnit}</strong></div>
                  </div>
                </div>
              )}

              {selectedUserForDetail.transporterData && (
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                  <div className="font-extrabold text-amber-950 text-xs flex items-center">
                    <Car className="w-3.5 h-3.5 mr-1 text-amber-800" />
                    <span>Dados de Transporte & Frotas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-slate-500">Tipo Operador:</span> <strong>{selectedUserForDetail.transporterData.operatorType}</strong></div>
                    <div><span className="text-slate-500">Frota:</span> <strong>{selectedUserForDetail.transporterData.fleetSize} veículos</strong></div>
                    <div><span className="text-slate-500">Rotas:</span> <strong>{selectedUserForDetail.transporterData.operatingCorridors.join(', ')}</strong></div>
                    <div><span className="text-slate-500">Capacidade:</span> <strong className="font-mono">{selectedUserForDetail.transporterData.maxPayloadKg} kg</strong></div>
                  </div>
                </div>
              )}

              {/* Section 3: Uploaded Documents in Dossier */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">
                  Documentos Anexados ({selectedUserForDetail.documents?.length || 0})
                </div>
                {(!selectedUserForDetail.documents || selectedUserForDetail.documents.length === 0) ? (
                  <div className="text-slate-400 text-[11px] py-1">Nenhum documento submetido até ao momento.</div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedUserForDetail.documents.map(doc => (
                      <div key={doc.id} className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-[11px]">{doc.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{doc.fileName} ({doc.fileSizeKb} KB) • {doc.uploadDate}</div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${doc.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'REJEITADO' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                            {doc.status}
                          </span>
                          {doc.status !== 'APROVADO' && (
                            <button
                              type="button"
                              onClick={() => updateDocumentStatus(selectedUserForDetail.id, doc.id, 'APROVADO')}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[9px] cursor-pointer"
                            >
                              ✓ Aprovar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Support Actions & Notes */}
              <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
                <div className="font-extrabold text-blue-950 text-xs flex items-center justify-between">
                  <span>Registo de Atendimento & Suporte</span>
                  <button
                    type="button"
                    onClick={handleEscalateCase}
                    className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-bold cursor-pointer"
                  >
                    ↑ Escalar para Administração
                  </button>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={supportNoteInput}
                    onChange={e => setSupportNoteInput(e.target.value)}
                    placeholder="Adicionar nota de conferência ou parecer técnico..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSupportNote}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-[11px] cursor-pointer"
                  >
                    Registar Nota
                  </button>
                </div>
              </div>

              {/* Adjust Trust Level */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900 text-xs">Ajustar Nível de Confiança AO MARKET Trust:</div>
                <div className="flex space-x-1.5">
                  {([1, 2, 3, 4, 5] as VerificationLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        updateUserVerificationLevel(selectedUserForDetail.id, lvl);
                        setSelectedUserForDetail({ ...selectedUserForDetail, verificationLevel: lvl });
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer ${
                        selectedUserForDetail.verificationLevel === lvl
                          ? 'bg-amber-500 text-black shadow-xs border border-amber-400'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Nível {lvl}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: Document Rejection Reason */}
      {rejectionModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3 text-xs">
            <div className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Rejeitar Documento: {rejectionModalDoc.docLabel}</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Especifique o motivo claro da rejeição para que o utilizador saiba o que deve corrigir.
            </p>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Motivo da Rejeição:</label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectionModalDoc(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDocRejection}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold cursor-pointer"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Request Additional Documents */}
      {showRequestDocsModal && selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3 text-xs">
            <div className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Solicitar Documentação Adicional</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              O estado da conta será alterado para <strong className="text-orange-800">Documentação Pendente</strong> e o utilizador receberá instruções no seu painel.
            </p>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Lista de Documentos Faltantes (separados por vírgula):</label>
              <input
                type="text"
                value={missingDocsInput}
                onChange={e => setMissingDocsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Mensagem de Orientação:</label>
              <textarea
                rows={2}
                value={requestNotesInput}
                onChange={e => setRequestNotesInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRequestDocsModal(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSendDocsRequest}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl cursor-pointer border border-amber-400"
              >
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
