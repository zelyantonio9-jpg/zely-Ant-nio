import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Eye, 
  Download, 
  AlertTriangle,
  Info,
  HelpCircle,
  Building,
  User,
  Truck,
  Sprout,
  Loader2
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { uploadRealFileToStorage } from '../services/storageService';
import { 
  UserDocument, 
  DocumentVerificationStatus, 
  DocumentTypeEnum,
  AccountRegistrationStatus 
} from '../types';
import { getAccountStatusBadge } from '../utils/rolePermissions';

interface DocumentVerificationCenterProps {
  onClose?: () => void;
}

export const DocumentVerificationCenter: React.FC<DocumentVerificationCenterProps> = ({ onClose }) => {
  const { 
    currentUser, 
    uploadUserDocument, 
    replaceUserDocument 
  } = useMarket();

  const [selectedDocToReplace, setSelectedDocToReplace] = useState<UserDocument | null>(null);
  const [selectedDocToUpload, setSelectedDocToUpload] = useState<DocumentTypeEnum | null>(null);
  const [uploadingState, setUploadingState] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'HISTORY'>('DOCUMENTS');

  const statusBadge = getAccountStatusBadge(currentUser.accountStatus || 'ATIVO');

  // List of relevant documents for this user's profile
  const getRequiredDocsForProfile = (): { type: DocumentTypeEnum; label: string; description: string; mandatory: boolean }[] => {
    const list: { type: DocumentTypeEnum; label: string; description: string; mandatory: boolean }[] = [
      {
        type: 'BI',
        label: 'Bilhete de Identidade (BI)',
        description: 'Cópia clara e legível do titular ou representante legal',
        mandatory: true
      },
      {
        type: 'NIF',
        label: 'Comprovativo de NIF',
        description: 'Declaração oficial da AGT de Número de Identificação Fiscal',
        mandatory: currentUser.isFormalized || currentUser.entityType === 'EMPRESA'
      }
    ];

    if (currentUser.role === 'producer' || currentUser.activeProfiles?.includes('PRODUCER')) {
      list.push(
        {
          type: 'TITULO_EXPLORACAO_TERRA',
          label: 'Título de Exploração de Terra ou Atestado de Produtor',
          description: 'Declaração da Administração Municipal, Soba ou Título de Concessão',
          mandatory: false
        },
        {
          type: 'COMPROVATIVO_INSS',
          label: 'Comprovativo de Inscrição INSS',
          description: 'Cartão de Segurado ou Guia de Pagamento',
          mandatory: false
        }
      );
    }

    if (currentUser.role === 'driver' || currentUser.role === 'logistics_company' || currentUser.activeProfiles?.includes('TRANSPORTER')) {
      list.push(
        {
          type: 'CARTA_CONDUCAO',
          label: 'Carta de Condução Profissional',
          description: 'Carta de condução válida com categoria de pesados',
          mandatory: true
        },
        {
          type: 'LIVRETE_VEICULO',
          label: 'Livrete / Título de Registo de Propriedade',
          description: 'Documentação do veículo afeto ao transporte',
          mandatory: true
        },
        {
          type: 'SEGURO_AUTOMOVEL',
          label: 'Apólice de Seguro Automóvel',
          description: 'Comprovativo de seguro obrigatório de responsabilidade civil',
          mandatory: false
        },
        {
          type: 'INSPECAO_TECNICA',
          label: 'Certificado de Inspeção Técnica Periódica',
          description: 'Comprovativo de inspeção válida',
          mandatory: false
        }
      );
    }

    if (currentUser.entityType === 'EMPRESA' || currentUser.activeProfiles?.includes('EMPRESA') || currentUser.companyName) {
      list.push(
        {
          type: 'CERTIDAO_REGISTO_COMERCIAL',
          label: 'Certidão Comercial / Publicação em DR',
          description: 'Certidão de Registo Comercial emitida pelo Guiché Único ou Conservatória',
          mandatory: true
        },
        {
          type: 'ALVARA_COMERCIAL',
          label: 'Alvará Comercial / Licença de Atividade',
          description: 'Licenciamento para exercício de atividade comercial ou industrial',
          mandatory: false
        },
        {
          type: 'COMPROVATIVO_BANCARIO',
          label: 'Comprovativo de IBAN Bancário',
          description: 'Extrato ou declaração bancária com titular e IBAN',
          mandatory: false
        }
      );
    }

    return list;
  };

  const requiredDocs = getRequiredDocsForProfile();
  const currentDocs = currentUser.documents || [];

  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [docErrorMessage, setDocErrorMessage] = useState<string>('');

  const handleRealUpload = async (docType: DocumentTypeEnum, label: string, file: File) => {
    if (!file) return;
    setUploadingDocType(docType);
    setDocErrorMessage('');

    try {
      const uploadResult = await uploadRealFileToStorage(file, 'documents');
      uploadUserDocument(currentUser.id, {
        documentType: docType,
        label,
        fileName: uploadResult.name || file.name,
        fileSizeKb: Math.round((uploadResult.size || file.size) / 1024),
        fileMimeType: uploadResult.type || file.type,
        fileUrl: uploadResult.url,
        storageRef: uploadResult.fullPath
      });
      setSelectedDocToUpload(null);
    } catch (err: any) {
      console.error('Falha no upload do documento real:', err);
      setDocErrorMessage(`Erro ao carregar ficheiro para ${label}: ${err.message || 'Falha na ligação ao Firebase'}`);
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleRealReplace = async (docId: string, file: File) => {
    if (!file) return;
    setUploadingDocType(docId);
    setDocErrorMessage('');

    try {
      const uploadResult = await uploadRealFileToStorage(file, 'documents');
      replaceUserDocument(currentUser.id, docId, {
        fileName: uploadResult.name || file.name,
        fileSizeKb: Math.round((uploadResult.size || file.size) / 1024),
        fileMimeType: uploadResult.type || file.type
      });
      setSelectedDocToReplace(null);
    } catch (err: any) {
      console.error('Falha na substituição do documento real:', err);
      setDocErrorMessage(`Erro ao substituir ficheiro: ${err.message || 'Falha na ligação ao Firebase'}`);
    } finally {
      setUploadingDocType(null);
    }
  };

  const getDocStatusBadge = (status?: DocumentVerificationStatus) => {
    switch (status) {
      case 'APROVADO':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Aprovado
          </span>
        );
      case 'EM_ANALISE':
      case 'ENVIADO':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold flex items-center">
            <Clock className="w-3 h-3 mr-1 text-amber-600" /> Em Análise
          </span>
        );
      case 'REJEITADO':
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-[10px] font-bold flex items-center">
            <XCircle className="w-3 h-3 mr-1 text-red-600" /> Rejeitado
          </span>
        );
      case 'EXPIRADO':
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-bold flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1 text-slate-500" /> Expirado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-medium flex items-center">
            Não Enviado
          </span>
        );
    }
  };

  return (
    <div id="document-verification-center" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-slate-900">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>Centro de Documentação & Verificação Progressiva</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Gestão de conformidade regulatória, credenciais de identidade e níveis de confiança
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}>
            {statusBadge.label}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Account Status Alert Banner */}
      {currentUser.accountStatus === 'DOCUMENTACAO_PENDENTE' && (
        <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-start space-x-3 text-xs text-orange-900">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-extrabold text-orange-950">Ação Necessária: Documentação Pendente</div>
            <p className="text-[11px] text-orange-800">
              {currentUser.accountStatusReason || 'Existem documentos necessários para aumentar a capacidade de negociação da sua conta.'}
            </p>
            {currentUser.missingDocuments && currentUser.missingDocuments.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {currentUser.missingDocuments.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-orange-100 border border-orange-300 text-orange-900 rounded-md text-[10px] font-bold">
                    • {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {currentUser.accountStatus === 'EM_ANALISE' && (
        <div className="p-3.5 bg-amber-50 border-b border-amber-200 flex items-center space-x-3 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <div>
            <strong>Em Análise pela Supervisão:</strong> Os seus documentos estão a ser conferidos pela equipa de auditoria do AO MARKET. Será notificado assim que aprovados.
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 p-2 bg-slate-50 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'DOCUMENTS'
              ? 'bg-amber-500 text-black shadow-xs font-extrabold border border-amber-400'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Documentos ({currentDocs.length} submetidos)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'OVERVIEW'
              ? 'bg-amber-500 text-black shadow-xs font-extrabold border border-amber-400'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Nível de Confiança ({currentUser.verificationLevel}/5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('HISTORY')}
          className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'HISTORY'
              ? 'bg-amber-500 text-black shadow-xs font-extrabold border border-amber-400'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Histórico de Auditoria ({currentUser.auditLogs?.length || 0})</span>
        </button>
      </div>

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Dossiê Documental da Entidade
              </div>
              <p className="text-slate-500 text-[11px]">
                Submeta e mantenha os seus documentos atualizados para operações de alto volume
              </p>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Perfil: <strong className="text-slate-900">{currentUser.role.toUpperCase()}</strong> ({currentUser.entityType || 'PESSOA_SINGULAR'})
            </div>
          </div>

          {docErrorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{docErrorMessage}</span>
            </div>
          )}

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {requiredDocs.map(req => {
              const uploaded = currentDocs.find(d => d.documentType === req.type);
              const isUploadingThis = uploadingDocType === req.type || (uploaded && uploadingDocType === uploaded.id);

              return (
                <div key={req.type} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{req.label}</span>
                        {req.mandatory && (
                          <span className="text-[9px] bg-red-50 text-red-800 border border-red-200 px-1.5 py-0.2 rounded font-bold">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px]">{req.description}</p>
                      
                      {uploaded && (
                        <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center space-x-2">
                          <span>Ficheiro: <strong className="text-slate-700">{uploaded.fileName}</strong> ({uploaded.fileSizeKb} KB)</span>
                          <span>• Enviado a {uploaded.uploadDate}</span>
                        </div>
                      )}

                      {/* Rejection notice */}
                      {uploaded?.status === 'REJEITADO' && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] mt-1.5">
                          <strong>Motivo da Rejeição:</strong> {uploaded.rejectionReason || 'Documento ilegível, incompleto ou expirado.'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {getDocStatusBadge(uploaded?.status)}

                    {!uploaded && (
                      <label className={`px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer border border-amber-400 shadow-xs ${isUploadingThis ? 'opacity-60 cursor-wait' : ''}`}>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          disabled={uploadingDocType !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleRealUpload(req.type, req.label, file);
                          }}
                          className="hidden"
                        />
                        {isUploadingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{isUploadingThis ? 'A enviar...' : 'Enviar Ficheiro'}</span>
                      </label>
                    )}

                    {uploaded && uploaded.status === 'REJEITADO' && (
                      <label className={`px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs ${isUploadingThis ? 'opacity-60 cursor-wait' : ''}`}>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          disabled={uploadingDocType !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleRealReplace(uploaded.id, file);
                          }}
                          className="hidden"
                        />
                        {isUploadingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        <span>{isUploadingThis ? 'A substituir...' : 'Substituir'}</span>
                      </label>
                    )}

                    {uploaded && uploaded.status === 'APROVADO' && (
                      <span className="text-[10px] text-emerald-700 font-bold font-mono">
                        ✓ Certificado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB CONTENT: TRUST OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm text-amber-950">
                  Nível {currentUser.verificationLevel} de Confiança Soberana
                </div>
                <p className="text-amber-800 text-xs mt-0.5">
                  {currentUser.trustBadge?.levelTitle || 'Perfil Auditado AO MARKET'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black font-mono text-lg flex items-center justify-center border-2 border-amber-400 shadow-xs">
                {currentUser.verificationLevel}/5
              </div>
            </div>

            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full transition-all"
                style={{ width: `${(currentUser.verificationLevel / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="font-bold text-slate-900 text-xs flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                <span>Critérios Validados</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>• Telemóvel angolano (+244) validado com OTP</li>
                <li>• Localização geográfica ({currentUser.province}) registada</li>
                {currentUser.biNumber && <li>• Bilhete de Identidade associado ({currentUser.biNumber})</li>}
                {currentUser.nif && <li>• NIF declarado ({currentUser.nif})</li>}
                {currentUser.isFormalized && <li>• Enquadramento fiscal formalizado</li>}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="font-bold text-slate-900 text-xs flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                <span>Próximos Benefícios</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>• Selo de Fornecedor / Comprador Certificado Nível 5</li>
                <li>• Acesso prioritário a contratos de fornecimento do Estado</li>
                <li>• Redução de taxas de custódia AO Protect</li>
                <li>• Emissão de faturas certificadas automáticas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY & AUDIT LOGS */}
      {activeTab === 'HISTORY' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Registo de Auditoria Imutável
          </div>

          {(!currentUser.auditLogs || currentUser.auditLogs.length === 0) ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Nenhuma alteração de estado registada até ao momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
              {currentUser.auditLogs.map(log => (
                <div key={log.id} className="p-3 flex items-start justify-between gap-2 hover:bg-slate-50/70 transition">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-xs">{log.action}</div>
                    {log.notes && (
                      <div className="text-[11px] text-slate-600">{log.notes}</div>
                    )}
                    <div className="text-[10px] text-slate-400">
                      Efetuado por: <strong className="text-slate-700">{log.performedBy}</strong> ({log.userRole})
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString('pt-PT')} {new Date(log.timestamp).toLocaleTimeString('pt-PT').slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
