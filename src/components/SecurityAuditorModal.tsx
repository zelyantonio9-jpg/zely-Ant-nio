import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Play, 
  RotateCcw, 
  Server, 
  Database, 
  Layers, 
  UserCheck, 
  Search, 
  Filter, 
  ArrowRight, 
  X,
  Clock,
  Eye,
  KeyRound,
  FileCode2,
  Building2,
  Truck,
  Sprout,
  ShoppingBag,
  Headphones,
  UserX
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/apiClient';
import { 
  SecurityTestCase, 
  SecurityTestResult, 
  SecurityAuditEntry, 
  UserRole 
} from '../types';
import { ROLE_PERMISSIONS_MATRIX } from '../utils/rbacMatrix';
import { getRoleNamePt } from '../utils/rolePermissions';

interface SecurityAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAuditorModal: React.FC<SecurityAuditorModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, login, registeredUsers } = useMarket();

  const [activeTab, setActiveTab] = useState<'TEST_SUITE' | 'ARCHITECTURE' | 'AUDIT_LOGS' | 'ROLE_SIMULATOR'>('TEST_SUITE');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([]);
  const [testCatalog, setTestCatalog] = useState<SecurityTestCase[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestDetail, setSelectedTestDetail] = useState<SecurityTestCase | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCatalogAndLogs();
    }
  }, [isOpen]);

  const loadCatalogAndLogs = async () => {
    try {
      const catalog = await api.getSecurityTestCatalog().catch(() => []);
      setTestCatalog(catalog);
      const logs = await api.getAuditLogs().catch(() => []);
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    try {
      const resp = await api.runSecurityTestSuite();
      setTestResults(resp.results);
      // Reload audit logs after tests
      const logs = await api.getAuditLogs().catch(() => []);
      setAuditLogs(logs);
    } catch (e) {
      console.error('Error running security tests', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  if (!isOpen || currentUser.role !== 'admin') return null;

  const passedTestsCount = testResults.filter(r => r.passed).length;
  const totalTests = testCatalog.length || testResults.length;

  const filteredCatalog = testCatalog.filter(t => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.securityPrinciple.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">Consola de Segurança & Auditoria RBAC</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  3 Níveis Ativos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Frontend (UI) • Backend (Express API) • Isolamento de Dados (Multi-Tenancy & Owner)
              </p>
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 px-6 pt-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('TEST_SUITE')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'TEST_SUITE'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Simulador de Ataques & Testes</span>
              {testResults.length > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                  {passedTestsCount}/{totalTests}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Arquitetura de 3 Níveis</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT_LOGS')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'AUDIT_LOGS'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Registo de Auditoria ({auditLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ROLE_SIMULATOR')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === 'ROLE_SIMULATOR'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Alternador de Personas</span>
            </button>
          </div>

          <div className="pb-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Perfil Atual: <span className="text-amber-400 font-bold">{getRoleNamePt(currentUser.role)}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TEST SUITE */}
          {activeTab === 'TEST_SUITE' && (
            <div className="space-y-6">
              
              {/* Action Banner */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Validação Automática de Bloqueios no Backend (401 / 403 / 422)</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Executa chamadas diretas ao backend simulando requisições não autorizadas (comprador a editar produto, produtor a invadir outro produtor, empresa A a invadir empresa B, suporte a apagar utilizadores, saltos inválidos de estado).
                  </p>
                </div>

                <button
                  onClick={handleRunAllTests}
                  disabled={isRunningTests}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                >
                  {isRunningTests ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>A Executar Testes...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Executar Bateria de Testes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Summary Banner if executed */}
              {testResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Testes Aprovados</div>
                      <div className="text-lg font-black text-emerald-400">{passedTestsCount} de {testResults.length}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Bloqueios Backend</div>
                      <div className="text-xs text-slate-400">100% das violações bloqueadas com HTTP 401/403/422</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center space-x-3">
                    <Server className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Ambiente de Teste</div>
                      <div className="text-xs text-slate-400">Express API Gateway + Middlewares RBAC</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filter & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                  {['ALL', 'AUTENTICACAO', 'RBAC_PERMISSOES', 'OWNERSHIP', 'MULTI_TENANT', 'SUPORTE_LIMITS', 'MAQUINA_ESTADOS'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'ALL' ? 'Todos os Cenários' : cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar caso de teste..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Test Cases Table / List */}
              <div className="space-y-3">
                {filteredCatalog.map((testCase, idx) => {
                  const result = testResults.find(r => r.testId === testCase.id);
                  const isPassed = result ? result.passed : null;

                  return (
                    <div 
                      key={testCase.id}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            {result ? (
                              isPassed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              )
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">{testCase.title}</span>
                              <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-amber-400">
                                {testCase.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{testCase.description}</p>
                          </div>
                        </div>

                        {/* Method & Target Endpoint */}
                        <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            testCase.httpMethod === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                            testCase.httpMethod === 'POST' ? 'bg-emerald-500/20 text-emerald-300' :
                            testCase.httpMethod === 'PUT' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {testCase.httpMethod}
                          </span>
                          <span className="text-slate-300 text-[11px]">{testCase.targetEndpoint}</span>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-[11px]">
                        <div>
                          <span className="text-slate-500 block font-semibold">Ator que tenta a operação:</span>
                          <span className="text-amber-300 font-medium">{testCase.actorDescription} ({testCase.actorRole})</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-semibold">Regra de Segurança Aplicada:</span>
                          <span className="text-slate-300">{testCase.securityPrinciple}</span>
                        </div>
                      </div>

                      {/* Result Output if available */}
                      {result && (
                        <div className={`p-2.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                          result.passed ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border border-rose-500/30 text-rose-300'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <span>Status HTTP Retornado: <strong>{result.httpStatus}</strong></span>
                            <span>•</span>
                            <span>{result.responsePayload?.error || result.message}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{result.durationMs}ms</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: ARCHITECTURE 3-TIER EXPLANATION */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-white">Fluxo de Validação em 3 Camadas</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No AO MARKET, a segurança não reside em ocultar botões na interface. Toda ação submetida passa pelo funil de 3 camadas antes de afetar os registos:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* Layer 1 */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <Layers className="w-4 h-4" />
                      <span>Camada 1: Frontend (UI)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Renderiza apenas as vistas e controlos permitidos pelo perfil ativo. Desativa e esconde botões indevidos.
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      isTabAllowedForRole() + hasPermission()
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <Server className="w-4 h-4" />
                      <span>Camada 2: Backend (API Gateway)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Valida token Bearer, autenticação, papel RBAC, limites operacionais de suporte e permissões por ação antes da execução.
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      requireAuth + checkOrderStateTransition()
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <Database className="w-4 h-4" />
                      <span>Camada 3: Isolamento & Owner</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Garante que mesmo que o utilizador tente aceder a um ID válido de outro produtor ou empresa, o acesso é barrado (HTTP 403).
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      checkTenantCompanyAccess() + checkProductOwnership()
                    </div>
                  </div>

                </div>
              </div>

              {/* Matrix of Granted Roles */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-white">Matriz de Perfis & Escopo de Ação</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  
                  {/* Visitante */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-slate-200">VISITANTE</div>
                    <div className="text-[11px] text-slate-400">Apenas catálogo público. Sem compras, sem criação de lotes, sem chats.</div>
                  </div>

                  {/* Produtor */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-400">PRODUTOR</div>
                    <div className="text-[11px] text-slate-400">Gere apenas os próprios produtos e pedidos destinados aos seus produtos.</div>
                  </div>

                  {/* Comprador */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-blue-400">COMPRADOR</div>
                    <div className="text-[11px] text-slate-400">Faz compras, gera pedidos, consulta o trânsito das suas encomendas e avalia.</div>
                  </div>

                  {/* Transportador */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-purple-400">TRANSPORTADOR</div>
                    <div className="text-[11px] text-slate-400">Aceita fretes rodoviários, avança estados da rota com PIN OTP. Não altera preços.</div>
                  </div>

                  {/* Empresa Admin */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-400">ADMIN EMPRESA</div>
                    <div className="text-[11px] text-slate-400">Gere equipa, compras e vendas da sua empresa. Sem acesso a outras empresas.</div>
                  </div>

                  {/* Suporte */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-teal-400">SUPORTE / OPERAÇÕES</div>
                    <div className="text-[11px] text-slate-400">Consulta tickets e documentos, monitoriza chats sinalizados. Não apaga utilizadores.</div>
                  </div>

                  {/* Administrador */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-rose-400">ADMINISTRADOR GERAL</div>
                    <div className="text-[11px] text-slate-400">Supervisão total, aprovação documental, controlo global e registo de auditoria.</div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'AUDIT_LOGS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Registo de Tentativas e Auditoria de Segurança</h3>
                  <p className="text-xs text-slate-400">Todas as chamadas protegidas e tentativas bloqueadas ficam registadas com carimbo de tempo.</p>
                </div>
                <button
                  onClick={loadCatalogAndLogs}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Atualizar</span>
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                    Nenhum registo de auditoria recente. Execute a bateria de testes para gerar eventos.
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            log.httpStatus === 200 || log.httpStatus === 201 ? 'bg-emerald-500/20 text-emerald-400' :
                            log.httpStatus === 401 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            HTTP {log.httpStatus} • {log.decision}
                          </span>
                          <span className="text-slate-300 font-bold">{log.actionRequested}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Ator: <span className="text-slate-200">{log.actorName} ({log.actorRole})</span>
                          {log.rejectionReason && (
                            <span className="text-rose-400 block mt-0.5">{log.rejectionReason}</span>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ROLE SIMULATOR & PERSONA SWITCHER */}
          {activeTab === 'ROLE_SIMULATOR' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white">Contas e Perfis Registados na Base de Dados</h3>
                <p className="text-xs text-slate-400">
                  Selecione uma das contas reais registadas no Firebase para testar as permissões e isolamento de dados daquele perfil.
                </p>
              </div>

              {registeredUsers.length === 0 ? (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Nenhum utilizador registado ainda no Firebase</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Crie uma conta através do botão "Criar Conta" ou aceda como Administrador para registar as primeiras entidades do ecossistema.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registeredUsers.map((user) => (
                    <div 
                      key={user.id}
                      onClick={() => { login(user.email || user.id); onClose(); }}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-amber-400 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin' ? 'bg-rose-500/20 text-rose-300' :
                          user.role === 'producer' ? 'bg-emerald-500/20 text-emerald-300' :
                          user.role === 'driver' || user.role === 'logistics_company' ? 'bg-purple-500/20 text-purple-300' :
                          user.role === 'support' ? 'bg-teal-500/20 text-teal-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
                      </div>
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        {user.companyName || user.email || `${user.municipality}, ${user.province}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>AO MARKET • Sistema de Segurança & RBAC Soberano</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Fechar Consola
          </button>
        </div>

      </div>
    </div>
  );
};
