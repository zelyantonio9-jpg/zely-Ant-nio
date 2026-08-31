import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
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
import { LegalAndGovernanceModal, LegalDocTab } from './components/LegalAndGovernanceModal';
import { ProductBacklogModal } from './components/ProductBacklogModal';
import { RestrictedAccessView } from './components/RestrictedAccessView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { isTabAllowedForRole, getDefaultTabForRole } from './utils/rolePermissions';
import { Logo } from './components/Logo';
import { Order } from './types';
import { Truck, ShieldCheck, KeyRound, Sparkles, MapPin, CheckCircle2, Award, Building2, ShieldAlert, MessageCircle, Scale } from 'lucide-react';

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
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalDocTab>('terms');
  const [isDocCenterOpen, setIsDocCenterOpen] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [isSecurityAuditorOpen, setIsSecurityAuditorOpen] = useState(false);
  const [isBacklogOpen, setIsBacklogOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  const handleOpenLegal = (tab: LegalDocTab = 'terms') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

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
        onOpenRules={() => handleOpenLegal('governance')}
        onOpenDocCenter={() => setIsDocCenterOpen(true)}
        onOpenTeamManagement={() => setIsTeamManagementOpen(true)}
        onOpenSecurityAuditor={currentUser.role === 'admin' ? () => setIsSecurityAuditorOpen(true) : undefined}
        onOpenAdminSecretModal={() => setIsAdminSecretModalOpen(true)}
        onOpenBacklog={() => setIsBacklogOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        {activeTab === 'home' && (
          <HomePageView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={handleOpenAuth}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenRules={() => handleOpenLegal('governance')}
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
        onOpenLegal={handleOpenLegal}
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
        onOpenLegal={handleOpenLegal}
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

      {/* Official Legal & Ecosystem Governance Modal (Termos, Privacidade e 14 Regras) */}
      <LegalAndGovernanceModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
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
      <Footer
        onNavigate={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLegal={handleOpenLegal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdminSecretModal={() => setIsAdminSecretModalOpen(true)}
        onOpenBacklog={() => setIsBacklogOpen(true)}
      />

      {/* Official Product Backlog Modal (Excel / CSV View & Download) */}
      <ProductBacklogModal
        isOpen={isBacklogOpen}
        onClose={() => setIsBacklogOpen(false)}
      />

      {/* Mobile Bottom Bar for native app-like UX on small screens */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenRules={() => handleOpenLegal('governance')}
      />
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
