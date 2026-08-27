import React from 'react';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sprout, 
  Store, 
  Check,
  Building2,
  Lock,
  ChevronRight,
  Package
} from 'lucide-react';
import heroImage from '../assets/images/angola_logistics_agri_hero_1787064893300.jpg';
import { useMarket } from '../context/MarketContext';
import { getDefaultTabForRole, isTabAllowedForRole } from '../utils/rolePermissions';

interface HomePageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  onNavigate,
  onOpenAuth
}) => {
  const { currentUser, isAuthenticated, products, formatKz, setSelectedProvince } = useMarket();
  const myPortalTab = getDefaultTabForRole(currentUser.role);

  const featuredProducts = products.slice(0, 4);

  const majorProvinces = [
    { name: 'Huambo', key: 'huambo', label: 'Milho, Batata e Cereais', count: '142 lotes' },
    { name: 'Cuanza Sul', key: 'cuanza_sul', label: 'Tomate, Café e Hortícolas', count: '98 lotes' },
    { name: 'Benguela', key: 'benguela', label: 'Pesca, Sal e Frutícolas', count: '115 lotes' },
    { name: 'Huíla', key: 'huila', label: 'Bovinos, Batata e Cereais', count: '84 lotes' },
    { name: 'Uíge', key: 'uige', label: 'Café, Mandioca e Feijão', count: '76 lotes' },
    { name: 'Malanje', key: 'malanje', label: 'Mandioca, Algodão e Grãos', count: '63 lotes' }
  ];

  return (
    <div id="homepage-view" className="space-y-10 pb-12">
      
      {/* 1. HERO COMERCIAL REAL: O que é o AO MARKET e o que posso fazer aqui */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Coluna Esquerda: Mensagem Clara e Ações Principais */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                Mercado Nacional de Comércio e Logística de Angola
              </span>
              
              <h1 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                Compre e venda em Angola.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Encontre produtos agrícolas, industriais e serviços de transporte rodoviário num só lugar. Compre direto da fonte com pagamento protegido por custódia e entrega confirmada por código.
              </p>
            </div>

            {/* 3 AÇÕES PRINCIPAIS */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                O que pretende fazer?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Ação 1: Comprar */}
                <button
                  id="btn-home-action-buy"
                  onClick={() => onNavigate('marketplace')}
                  className="flex flex-col items-start p-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition font-medium border border-amber-600 shadow-xs cursor-pointer text-left"
                >
                  <ShoppingBag className="w-5 h-5 mb-2 text-slate-950" />
                  <span className="text-sm font-bold">Comprar produtos</span>
                  <span className="text-[11px] text-slate-900 opacity-80 mt-0.5">Ver catálogo com preços</span>
                </button>

                {/* Ação 2: Vender */}
                <button
                  id="btn-home-action-sell"
                  onClick={() => {
                    if (isAuthenticated && currentUser.role === 'producer') {
                      onNavigate('producer');
                    } else if (isAuthenticated) {
                      onNavigate('marketplace');
                    } else {
                      onOpenAuth('REGISTER');
                    }
                  }}
                  className="flex flex-col items-start p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition font-medium border border-slate-900 shadow-xs cursor-pointer text-left"
                >
                  <Sprout className="w-5 h-5 mb-2 text-amber-400" />
                  <span className="text-sm font-bold">Vender produtos</span>
                  <span className="text-[11px] text-slate-300 mt-0.5">Publicar colheitas e lotes</span>
                </button>

                {/* Ação 3: Transportar */}
                <button
                  id="btn-home-action-transport"
                  onClick={() => {
                    if (isAuthenticated && (currentUser.role === 'driver' || currentUser.role === 'logistics_company')) {
                      onNavigate('logistics');
                    } else {
                      onNavigate('logistics');
                    }
                  }}
                  className="flex flex-col items-start p-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl transition font-medium border border-slate-300 shadow-xs cursor-pointer text-left"
                >
                  <Truck className="w-5 h-5 mb-2 text-slate-700" />
                  <span className="text-sm font-bold">Transportar</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Cargas nos corredores</span>
                </button>
              </div>
            </div>

            {/* Garantias Reais de Comércio */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">Pagamento em custódia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="text-[11px] font-medium">18 Províncias</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">Produtores verificados</span>
              </div>
            </div>

          </div>

          {/* Coluna Direita: Imagem Real de Comércio e Produção Nacional */}
          <div className="lg:col-span-5 bg-slate-100 relative min-h-[260px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-200">
            <img 
              src={heroImage} 
              alt="Armazém e transporte de produtos agrícolas em Angola" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-xs text-white p-3 rounded-xl border border-white/10 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-400 block text-xs">Corredores Nacionais</span>
                <span className="text-[11px] text-slate-300">Ligação direta das fazendas aos mercados de Luanda e litoral</span>
              </div>
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
            </div>
          </div>

        </div>
      </section>

      {/* 2. PRODUTOS RECENTES NO MERCADO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
              Produtos disponíveis no mercado
            </h2>
            <p className="text-xs text-slate-500">
              Lotes agrícolas e industriais prontos para envio imediato ou agendamento
            </p>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('marketplace')}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Imagem do Produto */}
                <div className="aspect-4/3 bg-slate-100 relative">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    <span>{product.originMunicipality} · {product.originProvince}</span>
                  </div>
                </div>

                {/* Dados Comerciais do Produto */}
                <div className="p-3.5 space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {product.producerName}
                  </div>
                  
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                    {product.title}
                  </h3>

                  <div className="pt-1 flex items-baseline justify-between">
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {formatKz(product.price)}
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal">por {product.unit}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-emerald-700 font-medium">Disponível</span>
                    <span>Stock: {product.availableStock}</span>
                  </div>
                </div>
              </div>

              {/* Ação */}
              <div className="p-3 pt-0">
                <button
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 transition text-center"
                >
                  Ver produto
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMO FUNCIONA O COMÉRCIO NO AO MARKET */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-900">
            Como funciona o comércio seguro
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Processo transparente que protege produtores, compradores e transportadores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passo 1 */}
          <div className="space-y-2 border-l-2 border-amber-500 pl-4">
            <span className="text-xs font-bold text-amber-700 uppercase">1. Negociação e Pedido</span>
            <h3 className="text-sm font-bold text-slate-900">Escolha o produto ou emita cotação</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulte preços por unidade ou emita pedidos de cotação em grande volume diretamente com os produtores rurais e cooperativas.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
            <span className="text-xs font-bold text-emerald-700 uppercase">2. Pagamento Protegido</span>
            <h3 className="text-sm font-bold text-slate-900">Valor guardado em custódia</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O comprador paga via Multicaixa Express ou transferência. O valor fica retido com segurança até a receção física dos produtos.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="space-y-2 border-l-2 border-blue-500 pl-4">
            <span className="text-xs font-bold text-blue-700 uppercase">3. Transporte e Confirmação</span>
            <h3 className="text-sm font-bold text-slate-900">Validação por código PIN</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O transportador recolhe o lote na fazenda e entrega no destino. Apenas após a digitação do código de entrega o pagamento é libertado ao vendedor.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRINCIPAIS PROVÍNCIAS PRODUTORAS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Compre por província de origem
            </h2>
            <p className="text-xs text-slate-500">
              Conecte-se aos principais polos de produção agrícola e pesqueira
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
              className="bg-white border border-slate-200 hover:border-amber-400 p-3.5 rounded-xl text-left transition shadow-xs hover:shadow-sm cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs group-hover:text-amber-700">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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

    </div>
  );
};

