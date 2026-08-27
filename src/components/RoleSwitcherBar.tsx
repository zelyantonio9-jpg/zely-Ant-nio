import React from 'react';
import { 
  Home,
  ShoppingBag, 
  Sprout, 
  Store, 
  Truck, 
  ShieldCheck, 
  Scale, 
  LayoutDashboard,
  UserCheck,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { UserRole } from '../types';
import { isTabAllowedForRole, getRoleNamePt } from '../utils/rolePermissions';

interface RoleSwitcherBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSecurityAuditor?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ activeTab, setActiveTab, onOpenSecurityAuditor }) => {
  const { currentUser, isAuthenticated, orders, freightLoads, disputes, rfqs } = useMarket();

  const pendingLoadsCount = freightLoads.filter(l => l.status === 'PENDING_ACCEPTANCE').length;
  const openDisputesCount = disputes.filter(d => d.status === 'EM_ANALISE').length;
  const activeRfqsCount = rfqs.filter(r => r.status === 'ABERTO' || r.status === 'RESPONDIDO').length;

  // Master definition of tabs
  const allTabs = [
    {
      id: 'home',
      label: 'Início',
      sub: 'Visão Geral',
      icon: Home,
      badge: null
    },
    {
      id: 'marketplace',
      label: 'Catálogo Nacional',
      sub: 'Comprar & Preços',
      icon: ShoppingBag,
      badge: null
    },
    {
      id: 'producer',
      label: 'Produtor Rural',
      sub: 'Gestão de Colheitas & Lotes',
      icon: Sprout,
      badge: null
    },
    {
      id: 'merchant',
      label: 'Comerciante & Grossista',
      sub: 'Cotações em Grande Escala (RFQ)',
      icon: Store,
      badge: activeRfqsCount > 0 && isAuthenticated ? `${activeRfqsCount} RFQ` : null
    },
    {
      id: 'logistics',
      label: 'AO Logistics',
      sub: 'Bolsa de Fretes Rodoviários',
      icon: Truck,
      badge: pendingLoadsCount > 0 && isAuthenticated ? `${pendingLoadsCount}` : null
    },
    {
      id: 'social_protection',
      label: 'Garantia & INSS',
      sub: 'Proteção & Benefícios',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: 'disputes',
      label: 'AO Protect Mediação',
      sub: 'Resolução de Litígios',
      icon: Scale,
      badge: openDisputesCount > 0 ? `${openDisputesCount}` : null
    },
    {
      id: 'admin',
      label: 'Supervisão Nacional',
      sub: 'Painel Administrativo',
      icon: LayoutDashboard,
      badge: 'Admin'
    }
  ];

  // Filter strictly according to profile permissions
  const visibleTabs = allTabs.filter(tab => {
    if (isAuthenticated) {
      // If admin, show all
      if (currentUser.role === 'admin') return true;
      // Filter by strict permission
      return isTabAllowedForRole(tab.id, currentUser.role, true);
    } else {
      // Unauthenticated: only public exploration tabs
      return ['home', 'marketplace', 'social_protection'].includes(tab.id);
    }
  });

  return (
    <div id="role-switcher-container" className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Active Profile Info Badge (Strict Isolation Guarantee) */}
        <div className="flex items-center space-x-2 shrink-0">
          {isAuthenticated ? (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0A2540] text-white text-xs shadow-xs border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div className="flex items-center space-x-1.5 font-medium">
                <span className="text-slate-400 text-[11px]">Perfil Ativo:</span>
                <span className="font-bold text-[#FF6B00]">{getRoleNamePt(currentUser.role)}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 truncate max-w-[140px] sm:max-w-[200px]">{currentUser.name}</span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="text-[11px] font-semibold text-slate-700">Modo Público • Faça Login para Acesso ao Seu Perfil</span>
            </div>
          )}

          {onOpenSecurityAuditor && currentUser.role === 'admin' && (
            <button
              onClick={onOpenSecurityAuditor}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-900 text-[11px] font-bold border border-orange-300 transition cursor-pointer shadow-2xs"
              title="Abrir Consola de Segurança e Auditoria RBAC"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Auditoria RBAC</span>
            </button>
          )}
        </div>

        {/* Authorized Profile Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-left shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B00] text-white font-black shadow-md border border-[#FF6B00]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#FF6B00] border border-orange-100'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold tracking-tight whitespace-nowrap leading-tight">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded whitespace-nowrap ${
                        isActive ? 'bg-[#0A2540] text-white' : 'bg-[#cf102d] text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
