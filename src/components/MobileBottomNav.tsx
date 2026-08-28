import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Sprout, 
  Store, 
  Truck, 
  ShoppingCart, 
  Sparkles,
  Scale
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  onOpenRules?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAssistant,
  onOpenRules
}) => {
  const { cart, currentUser, isAuthenticated } = useMarket();
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic portal tab according to user profile
  const getDynamicPortalTab = () => {
    if (!isAuthenticated) return { tab: 'marketplace', label: 'Comprar', icon: ShoppingBag };
    switch (currentUser.role) {
      case 'producer':
        return { tab: 'producer', label: 'Colheitas', icon: Sprout };
      case 'merchant':
        return { tab: 'merchant', label: 'Grossista', icon: Store };
      case 'driver':
        return { tab: 'logistics', label: 'Cargas', icon: Truck };
      case 'admin':
      case 'support':
        return { tab: 'admin', label: 'Supervisão', icon: Scale };
      default:
        return { tab: 'producer', label: 'Vender', icon: Sprout };
    }
  };

  const portalInfo = getDynamicPortalTab();
  const PortalIcon = portalInfo.icon;

  return (
    <nav 
      id="mobile-bottom-nav" 
      aria-label="Navegação móvel inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Início */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            activeTab === 'home' 
              ? 'text-[#FF6B00] font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Início</span>
        </button>

        {/* 2. Mercado */}
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            activeTab === 'marketplace' 
              ? 'text-[#FF6B00] font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {activeTab === 'marketplace' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Mercado</span>
        </button>

        {/* 3. Portal do Perfil / Vender */}
        <button
          onClick={() => setActiveTab(portalInfo.tab)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer min-w-[56px] ${
            activeTab === portalInfo.tab 
              ? 'text-[#FF6B00] font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <PortalIcon className="w-5 h-5 text-emerald-600" />
            {activeTab === portalInfo.tab && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{portalInfo.label}</span>
        </button>

        {/* 4. Carrinho */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer min-w-[56px]"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Carrinho</span>
        </button>

        {/* 5. Assistente IA */}
        <button
          onClick={onOpenAssistant}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-amber-600 hover:text-amber-700 font-semibold transition cursor-pointer min-w-[56px]"
        >
          <div className="p-1 rounded-full bg-amber-100/80 text-amber-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">IA</span>
        </button>

      </div>
    </nav>
  );
};
