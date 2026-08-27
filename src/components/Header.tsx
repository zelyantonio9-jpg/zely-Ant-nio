import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  MessageSquare, 
  User, 
  Menu, 
  Truck, 
  Sprout, 
  Store, 
  ChevronDown,
  ShieldCheck, 
  FileDown, 
  FileText,
  LogOut,
  CheckCircle2,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { generateOfficialPdf } from '../utils/generatePdfDoc';
import { getRoleNamePt, isTabAllowedForRole } from '../utils/rolePermissions';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  onOpenArchitecture: () => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenDocCenter?: () => void;
  onOpenTeamManagement?: () => void;
  onOpenSecurityAuditor?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAssistant,
  onOpenArchitecture,
  onOpenAuth,
  onOpenDocCenter,
  onOpenTeamManagement,
  onOpenSecurityAuditor,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) => {
  const { 
    currentUser, 
    isAuthenticated,
    logout,
    cart, 
    selectedProvince, 
    setSelectedProvince, 
    notifications, 
    markNotificationAsRead 
  } = useMarket();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('marketplace');
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Main Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Official Logo: AO MARKET */}
          <Logo 
            onClick={() => setActiveTab('home')} 
            size="md" 
            variant="header" 
          />

          {/* Integrated Search Bar with Province Selector & Search Button */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-slate-400 rounded-xl transition overflow-hidden pl-3.5 pr-1.5 py-1"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              id="search-input-header"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produtos, serviços e fornecedores..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden py-1.5"
            />

            {/* Integrated Province Dropdown */}
            <div className="h-6 w-px bg-slate-200 mx-2 shrink-0"></div>
            <div className="relative shrink-0 flex items-center pr-2">
              <select
                id="header-province-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden appearance-none cursor-pointer pr-4"
              >
                <option value="todas">Todas as Províncias</option>
                {ANGOLA_PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
            </div>

            {/* Dark Search Button */}
            <button
              type="submit"
              className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg flex items-center justify-center transition shrink-0 ml-1 cursor-pointer"
              title="Executar pesquisa"
            >
              <Search className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Right Action Icons: Mensagens, Carrinho, Perfil/Entrar */}
          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            
            {/* Mensagens / Notificações (with Gold Badge '2') */}
            <div className="relative">
              <button
                id="btn-toggle-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col sm:flex-row items-center sm:space-x-1.5 text-slate-700 hover:text-slate-900 transition relative cursor-pointer group"
                title="Mensagens e Notificações"
              >
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount > 0 ? unreadCount : '2'}
                  </span>
                </div>
                <span className="text-xs font-semibold hidden sm:inline text-slate-800">Mensagens</span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div 
                  id="notifications-popover" 
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-50 text-slate-800"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Mensagens & Notificações</span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                      {notifications.length} ativas
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Sem novas mensagens.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            n.read ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-slate-900 border border-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span className="text-amber-900 font-bold text-[11px]">{n.title}</span>
                            <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Carrinho */}
            <button
              id="btn-open-cart-header"
              onClick={onOpenCart}
              className="flex flex-col sm:flex-row items-center sm:space-x-1.5 text-slate-700 hover:text-slate-900 transition cursor-pointer group"
              title="Abrir Carrinho de Compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden sm:inline text-slate-800">Carrinho</span>
            </button>

            {/* Perfil / Entrar */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1.5 text-slate-800 hover:text-slate-950 transition cursor-pointer font-semibold text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center text-xs font-bold">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs text-slate-800">
                    <div className="p-2.5 border-b border-slate-100 mb-1">
                      <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {getRoleNamePt(currentUser.role)}
                      </div>
                    </div>

                    {currentUser.role === 'producer' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('producer');
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>Painel do Produtor</span>
                      </button>
                    )}

                    {currentUser.role === 'merchant' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('merchant');
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>Painel do Comerciante (RFQ)</span>
                      </button>
                    )}

                    {currentUser.role === 'driver' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('logistics');
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Bolsa de Cargas (AO Logistics)</span>
                      </button>
                    )}

                    {currentUser.role === 'buyer' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('marketplace');
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <span>Catálogo & Encomendas</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('social_protection');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>INSS & Benefícios</span>
                    </button>

                    {onOpenDocCenter && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenDocCenter();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Documentos & Verificação</span>
                      </button>
                    )}

                    {(currentUser.entityType === 'EMPRESA' || currentUser.activeProfiles?.includes('EMPRESA') || (currentUser.companyTeamMembers && currentUser.companyTeamMembers.length > 0)) && onOpenTeamManagement && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenTeamManagement();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span>Equipa & RBAC</span>
                      </button>
                    )}

                    {onOpenSecurityAuditor && currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenSecurityAuditor();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-amber-50 text-amber-800 flex items-center space-x-2 transition cursor-pointer font-bold"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Auditoria & Testes RBAC</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-red-50 text-red-600 flex items-center space-x-2 transition cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-header-login"
                onClick={() => onOpenAuth('LOGIN')}
                className="flex flex-col sm:flex-row items-center sm:space-x-1.5 text-slate-700 hover:text-slate-900 transition cursor-pointer"
              >
                <User className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-semibold hidden sm:inline text-slate-800">Perfil/Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              id="search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produtos, serviços e fornecedores..."
              className="w-full pl-9 pr-10 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:bg-white focus:border-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <button
              type="submit"
              className="w-7 h-7 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center absolute right-1.5"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Sub-navigation Bar: Adapted to Authorized Profile */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar py-0.5">
            {(!isAuthenticated || currentUser.role === 'admin' || currentUser.role === 'buyer' || currentUser.role === 'merchant' || currentUser.role === 'producer') && (
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center space-x-1.5 font-semibold transition cursor-pointer hover:text-slate-900 whitespace-nowrap ${
                  activeTab === 'marketplace' ? 'text-amber-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Menu className="w-4 h-4 text-slate-700" />
                <span>Catálogo Nacional (Produtos)</span>
              </button>
            )}

            {(!isAuthenticated || currentUser.role === 'admin' || currentUser.role === 'producer') && (
              <button
                onClick={() => setActiveTab('producer')}
                className={`flex items-center space-x-1.5 font-semibold transition cursor-pointer hover:text-slate-900 whitespace-nowrap ${
                  activeTab === 'producer' ? 'text-amber-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{isAuthenticated ? 'Meu Painel de Produtor' : 'Área do Produtor'}</span>
              </button>
            )}

            {(!isAuthenticated || currentUser.role === 'admin' || currentUser.role === 'merchant') && (
              <button
                onClick={() => setActiveTab('merchant')}
                className={`flex items-center space-x-1.5 font-semibold transition cursor-pointer hover:text-slate-900 whitespace-nowrap ${
                  activeTab === 'merchant' ? 'text-amber-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span>{isAuthenticated ? 'Cotações & Compras B2B (RFQ)' : 'Grossista & Comerciante (RFQ)'}</span>
              </button>
            )}

            {(!isAuthenticated || currentUser.role === 'admin' || currentUser.role === 'driver') && (
              <button
                onClick={() => setActiveTab('logistics')}
                className={`flex items-center space-x-1.5 font-semibold transition cursor-pointer hover:text-slate-900 whitespace-nowrap ${
                  activeTab === 'logistics' ? 'text-amber-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{isAuthenticated ? 'Minha Bolsa de Fretes (Logística)' : 'Soluções Logísticas (Transporte)'}</span>
              </button>
            )}

            {isAuthenticated && (currentUser.role === 'producer' || currentUser.role === 'driver') && (
              <button
                onClick={() => setActiveTab('social_protection')}
                className={`flex items-center space-x-1.5 font-semibold transition cursor-pointer hover:text-slate-900 whitespace-nowrap ${
                  activeTab === 'social_protection' ? 'text-amber-600 font-bold' : 'text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>INSS & Benefícios</span>
              </button>
            )}
          </div>

          {/* Quick PDF & Spec & RBAC shortcut */}
          <div className="hidden lg:flex items-center space-x-3">
            {onOpenSecurityAuditor && currentUser.role === 'admin' && (
              <>
                <button
                  onClick={onOpenSecurityAuditor}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auditoria RBAC</span>
                </button>
                <span className="text-slate-200">|</span>
              </>
            )}
            <button
              onClick={generateOfficialPdf}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Documentação Oficial (PDF)</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={onOpenArchitecture}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Especificação</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

