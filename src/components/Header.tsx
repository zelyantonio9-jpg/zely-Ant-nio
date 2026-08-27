import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  MessageSquare, 
  ChevronDown, 
  MapPin, 
  FileDown, 
  FileText,
  ShieldCheck,
  Building2,
  Truck,
  Sprout,
  Store,
  LogOut,
  Sparkles,
  Home,
  LayoutGrid,
  Tag,
  ShieldAlert,
  Menu,
  X,
  ShoppingCart
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { Logo } from './Logo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  onOpenArchitecture: () => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenDocCenter?: () => void;
  onOpenTeamManagement?: () => void;
  onOpenSecurityAuditor?: () => void;
  onOpenAdminSecretModal?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
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
  onOpenAdminSecretModal,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) => {
  const { 
    currentUser, 
    cart, 
    notifications, 
    markNotificationAsRead, 
    logout, 
    isAuthenticated,
    selectedProvince,
    setSelectedProvince,
    formatKz
  } = useMarket();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getRoleNamePt = (role: string) => {
    switch (role) {
      case 'producer': return 'Produtor / Cooperativa';
      case 'merchant': return 'Comerciante Grossista';
      case 'driver': return 'Transportador Rodoviário';
      case 'buyer': return 'Comprador Final';
      case 'admin': return 'Supervisão Soberana';
      case 'support': return 'Mesa de Apoio';
      case 'company_admin': return 'Diretor de Empresa';
      case 'company_user': return 'Equipa da Empresa';
      default: return 'Cidadão';
    }
  };

  const generateOfficialPdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(10, 37, 64); // #0A2540
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('REPÚBLICA DE ANGOLA • AO MARKET', 14, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Plataforma Soberana de Comércio Eletrónico e Escoamento Agro-Industrial', 14, 22);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Sumário Executivo e Diretrizes Operacionais', 14, 38);

    autoTable(doc, {
      startY: 44,
      head: [['Componente', 'Especificação', 'Enquadramento Legal / Técnico']],
      body: [
        ['Identidade Soberana', 'AO MARKET - O Teu Mercado Online em Angola', 'Produção Nacional'],
        ['Câmara de Custódia', 'Retenção temporária até confirmação física', 'BNA / Multicaixa Express'],
        ['Logística & Rastreio', 'Bolsa de fretes com dupla validação PIN OTP', 'Corredores Rodoviários Nacionais'],
        ['Proteção Social', 'Integração formal com base contributiva', 'Decreto Presidencial 227/18 • INSS/PREI'],
        ['Cobertura Geográfica', '18 Províncias de Angola integradas', 'Polos Agrícolas & Centrais Logísticas']
      ],
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255] },
      styles: { fontSize: 9 }
    });

    doc.save('AO_MARKET_Documento_Oficial_2026.pdf');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('marketplace');
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Official Logo: AO MARKET with 5-clicks Admin Trigger */}
          <Logo 
            onClick={() => setActiveTab('home')}
            onSecretAdminTrigger={onOpenAdminSecretModal}
            size="md" 
            variant="header" 
          />

          {/* Integrated Search Bar: AOA / Pesquisar produtos... */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl hidden md:flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-[#FF6B00] rounded-full transition overflow-hidden pl-4 pr-1.5 py-1 shadow-2xs"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              id="search-input-header"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="AOA / Pesquisar produtos, categorias, produtores..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden py-1.5"
            />

            {/* Quick Currency indicator */}
            <div className="px-2 py-0.5 mr-2 rounded-md bg-slate-200/70 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              AOA
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs rounded-full transition shrink-0 cursor-pointer shadow-xs"
            >
              Buscar
            </button>
          </form>

          {/* Right Action Icons: Province Filter, Cart, Notifications, Login/User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Province Selector Dropdown */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100/90 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <select
                id="header-province-filter"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Angola (18 Províncias)</option>
                {ANGOLA_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Cart Icon & Counter */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:text-[#FF6B00] hover:bg-orange-50 rounded-full transition cursor-pointer"
              title="Carrinho de Compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF6B00] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="header-notif-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-700 hover:text-[#FF6B00] hover:bg-orange-50 rounded-full transition cursor-pointer"
                title="Notificações do Ecossistema"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">
                      Notificações do Sistema ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        Não existem notificações recentes.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3.5 text-xs transition cursor-pointer ${n.read ? 'bg-white opacity-70' : 'bg-orange-50/50 hover:bg-orange-50 font-medium'}`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <strong className="text-slate-900">{n.title}</strong>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login Gateway */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="header-user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[#FF6B00] font-semibold">
                      {getRoleNamePt(currentUser.role)}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown User Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900 text-sm truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.phone || currentUser.email}</p>
                      <div className="mt-1 flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Nível {currentUser.verificationLevel} • {currentUser.badge || 'Certificado'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {onOpenDocCenter && (
                        <button
                          onClick={() => { setShowUserMenu(false); onOpenDocCenter(); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Centro de Documentos</span>
                        </button>
                      )}

                      {onOpenTeamManagement && currentUser.entityType === 'EMPRESA' && (
                        <button
                          onClick={() => { setShowUserMenu(false); onOpenTeamManagement(); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          <span>Gestão de Equipa Empresarial</span>
                        </button>
                      )}

                      {onOpenSecurityAuditor && currentUser.role === 'admin' && (
                        <button
                          onClick={() => { setShowUserMenu(false); onOpenSecurityAuditor(); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                          <span>Auditoria de Segurança</span>
                        </button>
                      )}

                      <button
                        onClick={generateOfficialPdf}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                      >
                        <FileDown className="w-4 h-4 text-[#FF6B00]" />
                        <span>Descarregar Certificado Oficial</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Encerrar Sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('LOGIN')}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#0A2540] hover:text-[#FF6B00] transition cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => onOpenAuth('REGISTER')}
                  className="px-4 py-1.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer"
                >
                  Registar
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-700 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar if viewport is small */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-2.5 flex md:hidden items-center bg-slate-100 border border-slate-200 rounded-full px-3 py-1"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="AOA / Pesquisar produtos em Angola..."
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-hidden py-1"
          />
          <button type="submit" className="text-xs font-bold text-[#FF6B00]">Buscar</button>
        </form>
      </div>

      {/* 2. Secondary Quick Bar: Top Market Categories & Navigation Links */}
      <div className="bg-[#0A2540] text-white text-xs font-semibold px-4 py-2 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full transition cursor-pointer ${activeTab === 'home' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full transition cursor-pointer ${activeTab === 'marketplace' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mercado Nacional</span>
            </button>

            <button
              onClick={() => setActiveTab('producer')}
              className={`flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full transition cursor-pointer ${activeTab === 'producer' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Produtores</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant')}
              className={`flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full transition cursor-pointer ${activeTab === 'merchant' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Comerciantes B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full transition cursor-pointer ${activeTab === 'logistics' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>AO Logistics</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenAssistant}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente Soberano IA</span>
              <span className="sm:hidden">IA</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="text-slate-300 hover:text-white text-[11px] underline underline-offset-2 transition cursor-pointer"
            >
              Especificação Técnica
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};
