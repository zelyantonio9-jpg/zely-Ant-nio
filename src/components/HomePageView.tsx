import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
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
  Award
} from 'lucide-react';

interface HomePageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenCart,
  onOpenAssistant
}) => {
  const { products, formatKz, setSelectedProvince, isAuthenticated, currentUser } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Available interactive categories matching reference design
  const visualCategories = [
    { id: 'todos', name: 'Todos os Produtos', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
    { id: 'moda_beleza', name: 'Moda & Beleza', icon: Shirt, color: 'text-pink-600 bg-pink-50' },
    { id: 'eletronicos', name: 'Eletrónicos', icon: Smartphone, color: 'text-blue-600 bg-blue-50' },
    { id: 'lar_decoracao', name: 'Lar & Decoração', icon: HomeIcon, color: 'text-amber-600 bg-amber-50' },
    { id: 'alimentos_frescos', name: 'Alimentos Frescos', icon: Apple, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'artesanato_ao', name: 'Artesanato AO', icon: Palette, color: 'text-purple-600 bg-purple-50' }
  ];

  // Filter products based on selected visual category
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

  const majorProvinces = [
    { key: 'Luanda', name: 'Luanda', count: '1.240 lotes', label: 'Capital & Litoral' },
    { key: 'Huambo', name: 'Huambo', count: '890 lotes', label: 'Planalto Central' },
    { key: 'Bengo', name: 'Bengo', count: '450 lotes', label: 'Vale do Dande' },
    { key: 'Cuanza Sul', name: 'Cuanza Sul', count: '620 lotes', label: 'Amboim & Cela' },
    { key: 'Huíla', name: 'Huíla', count: '510 lotes', label: 'Pecuária & Frutícolas' },
    { key: 'Moxico', name: 'Moxico', count: '280 lotes', label: 'Artesanato & Mel' }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. HERO BANNER SOBERANO (Design Vetorial Institucional sem imagens mock) */}
      <section 
        id="hero-banner-section" 
        className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-[#081225] text-white group"
      >
        {/* Sovereign Geometric Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-slate-900/60 to-[#081225]" />
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative min-h-[360px] sm:min-h-[420px] w-full flex items-center p-6 sm:p-10 lg:p-12">
          
          {/* Banner Floating Flag & Live Status */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-lg text-white text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🇦🇴 Angola Online • 18 Províncias Integradas</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-5">
            
            {/* National Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#FF6B00] text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Plataforma Nacional de Comércio Agro-Industrial</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              AO Market: <br className="hidden sm:inline" />
              <span className="text-[#FF6B00]">O Teu Mercado Online</span> em Angola!
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-xl">
              Compra e Vende com Facilidade, Segurança, Pagamento Protegido por Custódia Regulada e Logística em todo o Território Nacional.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                id="btn-hero-start-shopping"
                onClick={() => onNavigate('marketplace')}
                className="inline-flex items-center space-x-2.5 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-95 text-white font-black text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>COMEÇAR A COMPRAR</span>
              </button>

              <button
                id="btn-hero-producer-access"
                onClick={() => onNavigate('producer')}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Vender Colheitas</span>
              </button>
            </div>

            {/* 3 Pillar Micro Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-slate-300 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Custódia BNA / EMIS</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Rastreio de Frota com OTP</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Fotos Reais de Produtores</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR (Moda & Beleza, Eletrónicos, Lar & Decoração, Alimentos Frescos, Artesanato AO) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Explorar por Categorias
          </h2>
          <button 
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-[#FF6B00] hover:text-[#E05E00] flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
          {visualCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                  isSelected 
                    ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md scale-102' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DESTAQUES DA SEMANA (Com slider e badges de preço laranja vibrante) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-1.5 bg-[#FF6B00] rounded-full"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#0A2540] tracking-tight">
                DESTAQUES DA SEMANA
              </h2>
              <p className="text-xs text-slate-500">
                Produtos cadastrados com envio direto e preço de produtor/distribuidor
              </p>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollSlider('left')}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 transition shadow-xs cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 transition shadow-xs cursor-pointer"
              title="Seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Products Slider / Grid */}
        <div 
          id="featured-products-slider"
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x scroll-smooth"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('marketplace')}
              className="min-w-[240px] sm:min-w-[270px] max-w-[290px] bg-white border border-slate-200/90 hover:border-[#FF6B00]/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group snap-start shrink-0"
            >
              <div>
                {/* Product Image */}
                <div className="aspect-4/3 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center">
                      <Sprout className="w-8 h-8 text-emerald-600 mb-1" />
                      <span className="text-[10px] font-bold text-slate-600">Foto Real a Carregar</span>
                      <span className="text-[9px] text-slate-400 font-medium">Origem: {product.originProvince}</span>
                    </div>
                  )}

                  {/* Province Tag */}
                  <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1 shadow-sm">
                    <MapPin className="w-2.5 h-2.5 text-[#FF6B00]" />
                    <span>{product.originProvince}</span>
                  </div>

                  {/* Produced in Angola Badge */}
                  {product.isProducedInAngola && (
                    <div className="absolute top-2 right-2 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      Feito em AO
                    </div>
                  )}

                  {/* Price Tag Pill in Orange */}
                  <div className="absolute bottom-2 right-2 bg-[#FF6B00] text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md font-mono tracking-tight">
                    {formatKz(product.price)}
                  </div>
                </div>

                {/* Commercial Content */}
                <div className="p-3.5 space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-medium truncate flex items-center space-x-1">
                    <span>{product.producerName}</span>
                    <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 inline" />
                  </div>
                  
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#FF6B00] transition">
                    {product.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span className="text-slate-400">Unidade: <strong className="text-slate-700">{product.unit}</strong></span>
                    <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                      Em Stock ({product.availableStock})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('marketplace');
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-[#FF6B00] text-slate-800 hover:text-white font-bold text-xs rounded-xl border border-slate-200 hover:border-[#FF6B00] transition-colors duration-200 flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar Agora</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROVÍNCIAS DE ORIGEM & POLOS PRODUTIVOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-[#0A2540]">
              Compre por Província de Origem
            </h2>
            <p className="text-xs text-slate-500">
              Conecte-se diretamente aos centros produtivos de Angola sem intermediários
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {majorProvinces.map((prov) => (
            <button
              key={prov.key}
              onClick={() => {
                setSelectedProvince(prov.key);
                onNavigate('marketplace');
              }}
              className="bg-white border border-slate-200 hover:border-[#FF6B00] p-3.5 rounded-2xl text-left transition shadow-xs hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs group-hover:text-[#FF6B00]">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span className="truncate">{prov.name}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                {prov.label}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1.5">
                {prov.count}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. PILARES DE SEGURANÇA E COMÉRCIO DIGITAL (AO PROTECT & INSS) */}
      <section className="bg-gradient-to-br from-[#0A2540] to-[#061726] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Infraestrutura Soberana de Comércio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            Como o AO MARKET protege as tuas transações
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Arquitetura em conformidade com o Banco Nacional de Angola (BNA), PREI e Instituto Nacional de Segurança Social (INSS).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pilar 1 */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Pagamento em Custódia</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O valor pago via Multicaixa Express fica retido em câmara segura até a entrega ser validada pelo comprador.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Logística com PIN OTP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cada viagem gera um código secreto OTP. O transportador apenas finaliza a rota quando o destinatário confirma.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-white">INSS & Formalização</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Produtores e motoristas formalizados acumulam benefícios sociais e proteção para suas famílias no âmbito do PREI.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
