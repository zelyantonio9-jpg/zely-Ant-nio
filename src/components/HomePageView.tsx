import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Product } from '../types';
import { calculateFreightEstimate, ANGOLA_PROVINCES } from '../data/angolaGeoData';
import heroBannerImg from '../assets/images/ao_market_hero_banner_1787848409262.jpg';
import { 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Truck, 
  ChevronLeft, 
  ChevronRight, 
  Smartphone, 
  Shirt, 
  Home as HomeIcon, 
  Apple, 
  Palette,
  CheckCircle2,
  Lock,
  Percent,
  Search,
  Building2,
  Users,
  Sprout,
  TrendingUp,
  Award,
  Scale,
  FileCheck,
  X,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';

interface HomePageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  onOpenRules?: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenCart,
  onOpenAssistant,
  onOpenRules
}) => {
  const { products, formatKz, setSelectedProvince, addToCart } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  
  // Real active product modal state
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [destProvince, setDestProvince] = useState<string>('luanda');

  // Categories matching reference image
  const visualCategories = [
    { id: 'moda_beleza', name: 'Moda & Beleza' },
    { id: 'eletronicos', name: 'Eletrónicos' },
    { id: 'lar_decoracao', name: 'Lar & Decoração' },
    { id: 'alimentos_frescos', name: 'Alimentos Frescos' },
    { id: 'artesanato_ao', name: 'Artesanato AO' }
  ];

  // Filter products based on selected category
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'alimentos_frescos') {
      return p.category === 'alimentos_frescos' || p.category === 'agricultura_frescos' || p.category === 'graos_cereais';
    }
    if (selectedCategory === 'artesanato_ao') {
      return p.category === 'artesanato_ao' || p.category === 'artesanato_utilidades';
    }
    return p.category === selectedCategory;
  });

  const scrollSlider = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-products-slider');
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenProduct = (product: Product) => {
    setActiveProductModal(product);
    setModalQty(product.minOrderQuantity || 1);
  };

  const formatPriceBadge = (price: number) => {
    if (price < 1000) {
      return `${price.toFixed(2).replace('.', ',')} AOA`;
    }
    return `${price.toLocaleString('pt-AO')} AOA`;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. HERO BANNER PRINCIPAL (Exata referência 1:1) */}
      <section 
        id="hero-banner-section" 
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] flex flex-col justify-center"
      >
        {/* Real Panoramic Background Image */}
        <img 
          src={heroBannerImg}
          alt="AO Market - O Teu Mercado Online em Angola"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle gradient overlay for pristine text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent" />

        {/* Angola Flag in Top-Right Corner */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 shadow-md rounded overflow-hidden border border-black/20">
          <div className="w-9 h-6 sm:w-12 sm:h-8 flex flex-col relative bg-[#C8102E]">
            {/* Top Red Half */}
            <div className="h-1/2 bg-[#C8102E]" />
            {/* Bottom Black Half */}
            <div className="h-1/2 bg-black" />
            {/* Angola Yellow Gear & Machete & Star Emblem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-dashed border-[#FFD100] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#FFD100] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 px-5 sm:px-10 lg:px-14 py-8 sm:py-12 max-w-2xl space-y-3 sm:space-y-4">
          
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            AO Market: <span className="text-[#FF6B00]">O Teu Mercado</span> <br className="hidden sm:inline" />
            <span className="text-[#FF6B00]">Online</span> em Angola!
          </h1>

          {/* Subtitle */}
          <p className="text-white/95 text-xs sm:text-sm lg:text-base font-medium leading-relaxed max-w-lg drop-shadow-xs">
            Compra e Vende com Facilidade, Segurança e Entrega Rápida em todo o País.
          </p>

          {/* Orange CTA Button */}
          <div className="pt-2">
            <button
              id="btn-hero-start-shopping"
              onClick={() => onNavigate('marketplace')}
              className="inline-flex items-center justify-center space-x-2 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all duration-150 cursor-pointer text-center"
            >
              <span>COMEÇAR A COMPRAR</span>
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </section>

      {/* 2. FLOATING CATEGORY BAR (Moda & Beleza, Eletrónicos, Lar & Decoração, Alimentos Frescos, Artesanato AO) */}
      <section className="w-full">
        <div className="bg-[#0B2545] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-md flex items-center justify-between overflow-x-auto no-scrollbar gap-1.5 sm:gap-2">
          {visualCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'todos' : cat.id)}
                className={`flex-1 min-w-[120px] sm:min-w-0 py-2.5 px-3 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected 
                    ? 'bg-[#FF6B00] text-white shadow-xs' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DESTAQUES DA SEMANA (Carregamento 100% Dinâmico de Produtos Reais da Base de Dados) */}
      <section className="space-y-3 sm:space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight flex items-center">
              DESTAQUES DA SEMANA
            </h2>
            {/* Orange Underline beneath DESTAQUES */}
            <div className="h-0.5 w-24 bg-[#FF6B00] rounded-full mt-1" />
          </div>

          {/* Carousel Arrows in Orange */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => scrollSlider('left')}
              className="w-7 h-7 rounded-full border border-orange-200 hover:border-[#FF6B00] bg-white flex items-center justify-center text-[#FF6B00] hover:bg-orange-50 transition cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-7 h-7 rounded-full border border-orange-200 hover:border-[#FF6B00] bg-white flex items-center justify-center text-[#FF6B00] hover:bg-orange-50 transition cursor-pointer"
              title="Seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Products Grid / Carousel */}
        {filteredProducts.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
            <Sprout className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Nenhum produto cadastrado nesta categoria.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Apresentando apenas produtos reais ativos no catálogo oficial do AO MARKET.
            </p>
            {selectedCategory !== 'todos' && (
              <button
                onClick={() => setSelectedCategory('todos')}
                className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        ) : (
          <div 
            id="featured-products-slider"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleOpenProduct(product)}
                className="bg-white border border-slate-200 hover:border-[#FF6B00] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Product Card Image with Top-Left Orange Price Badge */}
                  <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
                        <Sprout className="w-6 h-6 text-emerald-600 mb-1" />
                        <span className="text-[10px] font-bold text-slate-600">Produto Real</span>
                      </div>
                    )}

                    {/* Top-Left Vibrant Orange Price Badge (Exact 1:1 match) */}
                    <div className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-xs font-mono">
                      {formatPriceBadge(product.price)}
                    </div>
                  </div>

                  {/* Real Product Metadata */}
                  <div className="p-2.5 sm:p-3 space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#FF6B00] transition">
                      {product.title}
                    </h3>
                    
                    <div className="text-[11px] text-slate-500 truncate">
                      {product.producerName || product.originMunicipality}
                    </div>

                    <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                      <span>Origem: {product.originProvince}</span>
                      <span className="font-semibold text-emerald-600">{product.availableStock} disp.</span>
                    </div>
                  </div>
                </div>

                {/* Footer Quick Action */}
                <div className="p-2.5 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProduct(product);
                    }}
                    className="w-full py-1.5 bg-slate-50 hover:bg-[#FF6B00] text-slate-700 hover:text-white font-bold text-[11px] rounded-lg border border-slate-200 hover:border-[#FF6B00] transition cursor-pointer text-center"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Sovereign Chat/Assistant Button (Bottom Right matching reference image) */}
      <button
        onClick={onOpenAssistant}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-150 cursor-pointer"
        title="Assistente AO Market"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* REAL PRODUCT DETAIL MODAL (Opens on click for any product) */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="pr-4">
                <span className="text-[10px] font-bold uppercase text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded">
                  {activeProductModal.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeProductModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveProductModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Real Picture & Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                {activeProductModal.images && activeProductModal.images[0] ? (
                  <img
                    src={activeProductModal.images[0]}
                    alt={activeProductModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-[#FF6B00] text-white text-xs font-black px-2.5 py-1 rounded-md font-mono">
                  {formatPriceBadge(activeProductModal.price)}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {activeProductModal.description}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fornecedor:</span>
                    <strong className="text-slate-900">{activeProductModal.producerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Localidade:</span>
                    <strong className="text-slate-900">{activeProductModal.originMunicipality}, {activeProductModal.originProvince}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stock Real:</span>
                    <strong className="text-slate-900 font-mono">{activeProductModal.availableStock} {activeProductModal.unit}</strong>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Quantidade:</span>
                  <input
                    type="number"
                    min={1}
                    max={activeProductModal.availableStock}
                    value={modalQty}
                    onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-right font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Freight Simulator */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Cotação de Frete Rodoviário</span>
                </span>
                <span className="text-[10px] text-slate-500">Rede Nacional</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={destProvince}
                  onChange={(e) => setDestProvince(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer"
                >
                  {ANGOLA_PROVINCES.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                {(() => {
                  const est = calculateFreightEstimate(
                    activeProductModal.originProvince,
                    destProvince,
                    (activeProductModal.weightKgPerUnit || 1) * modalQty,
                    activeProductModal.requiresRefrigeration
                  );
                  return (
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-xs">{formatKz(est.estimatedCostAOA)}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <div className="text-[10px] text-slate-500">Total:</div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {formatKz(activeProductModal.price * modalQty)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    addToCart(activeProductModal, modalQty);
                    setActiveProductModal(null);
                    onOpenCart();
                  }}
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
