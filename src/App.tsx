import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { HomePageView } from './components/HomePageView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProducerPortal } from './components/ProducerPortal';
import { MerchantPortal } from './components/MerchantPortal';
import { LogisticsPortal } from './components/LogisticsPortal';
import { SocialProtectionPortal } from './components/SocialProtectionPortal';
import { DisputesPortal } from './components/DisputesPortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { AdminSecretModal } from './components/AdminSecretModal';
import { CartAndCheckoutModal } from './components/CartAndCheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ArchitectureDocModal } from './components/ArchitectureDocModal';
import { DocumentVerificationCenter } from './components/DocumentVerificationCenter';
import { CompanyTeamManagement } from './components/CompanyTeamManagement';
import { SecurityAuditorModal } from './components/SecurityAuditorModal';
import { RestrictedAccessView } from './components/RestrictedAccessView';
import { isTabAllowedForRole, getDefaultTabForRole } from './utils/rolePermissions';
import { Logo } from './components/Logo';
import { Order } from './types';
import { Truck, ShieldCheck, KeyRound, Sparkles, MapPin, CheckCircle2, Award, Building2, ShieldAlert, MessageCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { orders, currentUser, isAuthenticated, formatKz } = useMarket();

  // Homepage is the default first screen
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isAdminSecretModalOpen, setIsAdminSecretModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isDocCenterOpen, setIsDocCenterOpen] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [isSecurityAuditorOpen, setIsSecurityAuditorOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Active tracking order (only for authenticated user who is involved in the order or admin)
  const activeInTransitOrder = isAuthenticated 
    ? orders.find(o => 
        (o.status === 'IN_TRANSIT' || o.status === 'DRIVER_ASSIGNED' || o.status === 'PICKED_UP') &&
        (currentUser.role === 'admin' || o.buyerId === currentUser.id || o.driverId === currentUser.id || o.producerId === currentUser.id)
      )
    : null;

  const handleOpenAuth = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenDispute = (order: Order) => {
    setActiveTab('disputes');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-500 selection:text-black font-sans">
      {/* Sovereign Header with Search, Province Filter, Auth & Low Data Mode */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenDocCenter={() => setIsDocCenterOpen(true)}
        onOpenTeamManagement={() => setIsTeamManagementOpen(true)}
        onOpenSecurityAuditor={currentUser.role === 'admin' ? () => setIsSecurityAuditorOpen(true) : undefined}
        onOpenAdminSecretModal={() => setIsAdminSecretModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Role and Ecosystem Pillar Switcher */}
      <RoleSwitcherBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSecurityAuditor={currentUser.role === 'admin' ? () => setIsSecurityAuditorOpen(true) : undefined}
      />

      {/* Active Trip / Delivery Quick Status Bar (Floating Context) */}
      {activeInTransitOrder && activeTab !== 'logistics' && (
        <div className="bg-amber-50 text-slate-900 border-b border-amber-200 px-4 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong className="text-slate-900">Carga em Trânsito:</strong> Pedido #{activeInTransitOrder.id} ({activeInTransitOrder.items[0]?.title}) com o transportador <strong className="text-slate-900">{activeInTransitOrder.driverName || 'Transportador Certificado'}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white px-3 py-1 rounded-lg border border-amber-300 font-mono text-xs text-amber-800 font-bold shadow-xs">
                PIN OTP de Entrega: <strong className="text-amber-700">#{activeInTransitOrder.deliveryOtpCode}</strong>
              </div>

              <button
                onClick={() => setTrackedOrder(activeInTransitOrder)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg transition text-xs shadow-xs cursor-pointer"
              >
                Rastrear no Corredor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Body View with Strict Profile Isolation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomePageView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={handleOpenAuth}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          isTabAllowedForRole('marketplace', currentUser.role, isAuthenticated) ? (
            <MarketplaceView
              searchQuery={searchQuery}
              onOpenCart={() => setIsCartOpen(true)}
              onSelectProductForRfq={() => setActiveTab('merchant')}
            />
          ) : (
            <RestrictedAccessView
              targetTab="marketplace"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeTab === 'producer' && (
          isTabAllowedForRole('producer', currentUser.role, isAuthenticated) ? (
            <ProducerPortal />
          ) : (
            <RestrictedAccessView
              targetTab="producer"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeTab === 'merchant' && (
          isTabAllowedForRole('merchant', currentUser.role, isAuthenticated) ? (
            <MerchantPortal />
          ) : (
            <RestrictedAccessView
              targetTab="merchant"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeTab === 'logistics' && (
          isTabAllowedForRole('logistics', currentUser.role, isAuthenticated) ? (
            <LogisticsPortal />
          ) : (
            <RestrictedAccessView
              targetTab="logistics"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeTab === 'social_protection' && (
          <SocialProtectionPortal />
        )}

        {activeTab === 'disputes' && (
          isTabAllowedForRole('disputes', currentUser.role, isAuthenticated) ? (
            <DisputesPortal />
          ) : (
            <RestrictedAccessView
              targetTab="disputes"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeTab === 'admin' && (
          isTabAllowedForRole('admin', currentUser.role, isAuthenticated) ? (
            <AdminPortal />
          ) : (
            <RestrictedAccessView
              targetTab="admin"
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}
      </main>

      {/* Auth Modal (Cadastro e Login Oficial) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          setTimeout(() => {
            const saved = localStorage.getItem('ao_market_current_user');
            if (saved) {
              const u = JSON.parse(saved);
              if (u?.role) {
                setActiveTab(getDefaultTabForRole(u.role));
              }
            }
          }, 50);
        }}
      />

      {/* Admin Secret Gateway Modal (5 clicks on logo) */}
      <AdminSecretModal
        isOpen={isAdminSecretModalOpen}
        onClose={() => setIsAdminSecretModalOpen(false)}
        onSuccess={() => {
          setActiveTab('admin');
        }}
      />

      {/* Checkout and Cart Modal */}
      <CartAndCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderCreated={(order) => setTrackedOrder(order)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        order={trackedOrder}
        isOpen={!!trackedOrder}
        onClose={() => setTrackedOrder(null)}
        onOpenDispute={handleOpenDispute}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Architecture and Institutional Framework Spec Modal */}
      <ArchitectureDocModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Document Verification & Trust Center Modal */}
      {isDocCenterOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-3xl w-full max-h-[92vh] overflow-y-auto">
            <DocumentVerificationCenter onClose={() => setIsDocCenterOpen(false)} />
          </div>
        </div>
      )}

      {/* Company Team Management Modal */}
      {isTeamManagementOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-3xl w-full max-h-[92vh] overflow-y-auto">
            <CompanyTeamManagement onClose={() => setIsTeamManagementOpen(false)} />
          </div>
        </div>
      )}

      {/* Security Auditor Modal (RBAC Penetration & Architecture Validator) */}
      {currentUser.role === 'admin' && (
        <SecurityAuditorModal
          isOpen={isSecurityAuditorOpen}
          onClose={() => setIsSecurityAuditorOpen(false)}
        />
      )}

      {/* Floating Orange Chat / AI Assistant Support Action Button */}
      <button
        id="btn-floating-support-chat"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-orange-600/40 hover:scale-108 transition-all duration-200 cursor-pointer flex items-center justify-center group"
        title="Assistente Virtual & Suporte AO MARKET"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out font-bold text-xs">
          Suporte Online
        </span>
      </button>

      {/* Comprehensive Sovereign Angolan Ecosystem Footer */}
      <footer className="bg-[#0b101c] border-t border-[#1e293b] text-[#94a3b8] text-xs py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1e293b]">
            {/* Column 1 */}
            <div className="space-y-3">
              <Logo 
                variant="footer" 
                onClick={() => setActiveTab('home')}
                onSecretAdminTrigger={() => setIsAdminSecretModalOpen(true)} 
              />
              <p className="text-[#94a3b8] text-xs leading-relaxed pt-1">
                Plataforma oficial que estrutura o escoamento agro-industrial da República de Angola: conectando cooperativas, transportadores rodoviários certificados e centrais de distribuição com custódia regulada e proteção social.
              </p>
              {currentUser.role === 'admin' && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsSecurityAuditorOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold border border-slate-700 transition cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auditoria de Segurança & RBAC (3 Níveis)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Column 2 */}
            <div className="space-y-2.5">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                Pilares do Ecossistema
              </span>
              <ul className="space-y-2 text-[#94a3b8]">
                <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition">Catálogo Nacional de Produtos</button></li>
                <li><button onClick={() => setActiveTab('producer')} className="hover:text-white transition">Registo de Colheitas & Produtores</button></li>
                <li><button onClick={() => setActiveTab('merchant')} className="hover:text-white transition">Cotações Grossistas (RFQ)</button></li>
                <li><button onClick={() => setActiveTab('logistics')} className="hover:text-white transition">Bolsa de Fretes AO Logistics</button></li>
                <li><button onClick={() => setActiveTab('social_protection')} className="hover:text-white transition">Proteção Social & INSS</button></li>
                <li><button onClick={() => setActiveTab('disputes')} className="hover:text-white transition">Mediação Segura AO Protect</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-2.5">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                Garantias & Conformidade
              </span>
              <ul className="space-y-2 text-[#94a3b8]">
                <li className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Custódia Regulada (BNA / EMIS)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Rastreio de Frota Nacional</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Registo Oficial no INSS</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Validação de NIF com AGT</span>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                Cobertura Territorial
              </span>
              <p className="text-[#94a3b8] text-xs">
                Operação ativa em 18 províncias e 164 municípios com rotas rodoviárias integradas.
              </p>
              <div className="p-3 bg-[#050914] rounded-xl border border-[#1e293b] space-y-1">
                <div className="text-[11px] text-white font-semibold flex items-center justify-between">
                  <span>Conexão Cloud Firebase</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Sincronização em Tempo Real Ativa
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748b] text-[11px]">
            <div>
              © 2026 AO MARKET — República de Angola. Plataforma Nacional de Comércio Agro-Industrial e Logística Rodoviária.
            </div>
            <div className="flex items-center space-x-4">
              <span>Luanda • Huambo • Benguela • Huíla</span>
              <span>•</span>
              <button 
                onClick={() => setIsArchitectureOpen(true)}
                className="text-[#94a3b8] hover:text-white underline cursor-pointer"
              >
                Manual de Arquitetura Soberana
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MarketProvider>
      <MainAppContent />
    </MarketProvider>
  );
};

export default App;
