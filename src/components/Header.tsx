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
  ShoppingCart,
  Scale
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
  onOpenRules?: () => void;
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
  onOpenRules,
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
      {/* 1. Main Navigation Bar matching reference image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Official Logo: AO MARKET with 5-clicks Admin Trigger */}
          <Logo 
            onClick={() => setActiveTab('home')}
            onSecretAdminTrigger={onOpenAdminSecretModal}
            size="md" 
            variant="header" 
          />

          {/* Right Navigation Menu: Home, Categorias, Ofertas, Conta, Carrinho */}
          <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium text-slate-700">
            
            {/* Home Link with active indicator */}
            <button
              onClick={() => setActiveTab('home')}
              className={`relative flex flex-col items-center group cursor-pointer transition ${
                activeTab === 'home' ? 'text-[#FF6B00] font-bold' : 'text-slate-700 hover:text-[#FF6B00]'
              }`}
            >
              <div className="flex items-center space-x-1.5 py-1">
                <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#FF6B00]' : 'text-slate-600'}`} />
                <span>Home</span>
              </div>
              {activeTab === 'home' && (
                <span className="w-8 h-0.5 bg-[#FF6B00] rounded-full" />
              )}
            </button>

            {/* Categorias */}
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-1.5 py-1 transition cursor-pointer ${
                activeTab === 'marketplace' ? 'text-[#FF6B00] font-bold' : 'text-slate-700 hover:text-[#FF6B00]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-slate-600 hover:text-[#FF6B00]" />
              <span>Categorias</span>
            </button>

            {/* Ofertas */}
            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center space-x-1.5 py-1 text-slate-700 hover:text-[#FF6B00] transition cursor-pointer"
            >
              <Tag className="w-4 h-4 text-slate-600 hover:text-[#FF6B00]" />
              <span>Ofertas</span>
            </button>

            {/* Conta / User Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  id="header-user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1.5 py-1 text-slate-700 hover:text-[#FF6B00] transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('LOGIN')}
                  className="flex items-center space-x-1.5 py-1 text-slate-700 hover:text-[#FF6B00] transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Conta</span>
                </button>
              )}

              {/* Dropdown User Menu */}
              {showUserMenu && isAuthenticated && (
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
                    <button
                      onClick={() => { setShowUserMenu(false); setActiveTab(currentUser.role === 'producer' ? 'producer' : currentUser.role === 'merchant' ? 'merchant' : 'marketplace'); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span>Meu Painel ({getRoleNamePt(currentUser.role)})</span>
                    </button>

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

                    {onOpenRules && (
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenRules(); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 cursor-pointer"
                      >
                        <Scale className="w-4 h-4 text-emerald-600" />
                        <span>Regras & Governação (14 Regras)</span>
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

            {/* Carrinho with Orange notification Badge */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center space-x-1.5 py-1 text-slate-700 hover:text-[#FF6B00] transition cursor-pointer"
              title="Carrinho de Compras"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-slate-600" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                    {totalCartCount}
                  </span>
                )}
                {totalCartCount === 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                    0
                  </span>
                )}
              </div>
              <span>Carrinho</span>
            </button>

          </nav>

          {/* Mobile Right Icons (Cart + Hamburger) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:text-[#FF6B00] transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 min-w-[16px] h-4 bg-[#FF6B00] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {totalCartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* 2. Search Bar Row matching reference image */}
        <div className="mt-3 flex items-center gap-3">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 relative flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-slate-400 rounded-lg transition px-3.5 py-2 shadow-2xs"
          >
            <input
              id="search-input-header"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="AOA/Pesquisar produtos..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden pr-8"
            />
            <button type="submit" className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Orange Cart Button on the right of search bar */}
          <button
            onClick={onOpenCart}
            className="w-10 h-10 sm:w-11 sm:h-10 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white rounded-lg flex items-center justify-center shadow-xs transition cursor-pointer shrink-0"
            title="Abrir Carrinho"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 2. Secondary Quick Bar: Top Market Categories & Navigation Links */}
      <div className="bg-[#0A2540] text-white text-xs font-semibold px-4 py-2 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition cursor-pointer whitespace-nowrap ${activeTab === 'home' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition cursor-pointer whitespace-nowrap ${activeTab === 'marketplace' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mercado</span>
            </button>

            <button
              onClick={() => setActiveTab('producer')}
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition cursor-pointer whitespace-nowrap ${activeTab === 'producer' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Produtores</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant')}
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition cursor-pointer whitespace-nowrap ${activeTab === 'merchant' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Comerciantes B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition cursor-pointer whitespace-nowrap ${activeTab === 'logistics' ? 'bg-[#FF6B00] text-white' : 'text-slate-200 hover:text-white'}`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>AO Logistics</span>
            </button>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={onOpenAssistant}
              className="flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold shadow-xs hover:opacity-90 transition cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente Soberano IA</span>
              <span className="sm:hidden">IA</span>
            </button>

            {onOpenRules && (
              <button
                onClick={onOpenRules}
                className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 text-[11px] font-semibold transition cursor-pointer whitespace-nowrap"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Regras & Governação</span>
                <span className="sm:hidden">Regras</span>
              </button>
            )}

            <button
              onClick={onOpenArchitecture}
              className="text-slate-300 hover:text-white text-[11px] underline underline-offset-2 transition cursor-pointer whitespace-nowrap"
            >
              Doc Técnica
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer when mobileMenuOpen is TRUE */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[108px] z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
            
            {/* User identification or Login block */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.phone || currentUser.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {getRoleNamePt(currentUser.role)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-[11px] text-slate-600">Nível de Confiança: <strong>{currentUser.verificationLevel}</strong></span>
                    <button
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="text-red-600 font-bold text-xs flex items-center space-x-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">Aceda à sua conta ou cadastre a sua atividade:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('LOGIN'); }}
                      className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition text-center"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('REGISTER'); }}
                      className="py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs rounded-xl transition text-center shadow-xs"
                    >
                      Criar Conta
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Province Selector for Mobile */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Filtrar por Província</span>
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="todas">Angola (Todas as 18 Províncias)</option>
                {ANGOLA_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Módulos do Ecossistema</p>
              
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'home' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <Home className="w-4 h-4" />
                  <span>Início</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'marketplace' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Mercado Nacional</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('producer'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'producer' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Painel do Produtor</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('merchant'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'merchant' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Comércio Grossista B2B</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('logistics'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'logistics' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>AO Logistics (Bolsa de Cargas)</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('social_protection'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'social_protection' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proteção Social INSS / PREI</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('disputes'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${activeTab === 'disputes' ? 'bg-orange-50 text-[#FF6B00]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>Câmara AO Protect & Disputas</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>
            </div>

            {/* Quick Tools & Documentation */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAssistant(); }}
                className="p-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-900 rounded-xl flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Assistente IA</span>
              </button>

              {onOpenRules && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRules(); }}
                  className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center space-x-2"
                >
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>14 Regras</span>
                </button>
              )}

              {onOpenDocCenter && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDocCenter(); }}
                  className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documentos</span>
                </button>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); generateOfficialPdf(); }}
                className="p-2.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl flex items-center space-x-2"
              >
                <FileDown className="w-4 h-4 text-slate-600" />
                <span>Certificado PDF</span>
              </button>
            </div>

          </div>
          
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

    </header>
  );
};
