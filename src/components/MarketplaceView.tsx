import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  ShoppingBag, 
  Star, 
  Truck, 
  Layers, 
  Filter, 
  Info, 
  Check, 
  Building2, 
  X,
  Sprout,
  Image as ImageIcon
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Product } from '../types';
import { ANGOLA_PROVINCES, calculateFreightEstimate } from '../data/angolaGeoData';

interface MarketplaceViewProps {
  searchQuery: string;
  onOpenCart: () => void;
  onSelectProductForRfq?: (product: Product) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  searchQuery,
  onOpenCart,
  onSelectProductForRfq
}) => {
  const { 
    products, 
    addToCart, 
    formatKz, 
    selectedProvince, 
    setSelectedProvince,
    lowDataMode 
  } = useMarket();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [onlyMadeInAngola, setOnlyMadeInAngola] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [simulatedDestProvince, setSimulatedDestProvince] = useState<string>('luanda');

  const categories: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todos os produtos' },
    { id: 'moda_beleza', label: 'Moda & Beleza' },
    { id: 'eletronicos', label: 'Eletrónicos' },
    { id: 'lar_decoracao', label: 'Lar & Decoração' },
    { id: 'alimentos_frescos', label: 'Alimentos Frescos' },
    { id: 'graos_cereais', label: 'Grãos e Cereais' },
    { id: 'artesanato_ao', label: 'Artesanato AO' },
    { id: 'transformacao_nacional', label: 'Café & Processados' },
    { id: 'pesca_mariscos', label: 'Pescado e Marisco' }
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchProv = p.originProvince.toLowerCase().includes(q);
      const matchMun = p.originMunicipality.toLowerCase().includes(q);
      const matchProd = p.producerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchProv && !matchMun && !matchProd) return false;
    }

    // Category filter
    if (selectedCategory !== 'todos') {
      if (selectedCategory === 'alimentos_frescos') {
        if (p.category !== 'alimentos_frescos' && p.category !== 'agricultura_frescos') return false;
      } else if (selectedCategory === 'artesanato_ao') {
        if (p.category !== 'artesanato_ao' && p.category !== 'artesanato_utilidades') return false;
      } else if (p.category !== selectedCategory) {
        return false;
      }
    }

    // Province filter
    if (selectedProvince !== 'todas' && p.originProvince.toLowerCase() !== selectedProvince.toLowerCase()) {
      return false;
    }

    // Made in Angola filter
    if (onlyMadeInAngola && !p.isProducedInAngola) {
      return false;
    }

    return true;
  });

  return (
    <div id="marketplace-view" className="space-y-6">
      {/* Header Comercial Simples e Direto */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Catálogo de Produtos em Angola
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Compre diretamente de produtores, cooperativas e fábricas nacionais com transporte e liquidação protegida.
          </p>
        </div>

        {/* Informação Resumida */}
        <div className="flex items-center space-x-3 text-xs bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto">
          <span className="text-slate-500 font-medium">Produtos listados:</span>
          <span className="font-bold text-slate-900 font-mono text-sm">{products.length}</span>
        </div>
      </div>

      {/* Barra de Filtros e Categorias */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Categorias em Abas */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filtros secundários: Província e Feito em Angola */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Seletor de Província */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Província:</span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="bg-white border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                <option value="todas">Todas as 18 Províncias</option>
                {ANGOLA_PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Feito em Angola */}
            <label className="flex items-center text-slate-700 font-medium cursor-pointer space-x-1.5 select-none">
              <input
                type="checkbox"
                checked={onlyMadeInAngola}
                onChange={(e) => setOnlyMadeInAngola(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
              />
              <span>Apenas Feito em Angola</span>
            </label>
          </div>

          <div className="text-slate-500 text-xs">
            A mostrar <strong className="text-slate-900 font-mono">{filteredProducts.length}</strong> produtos
          </div>
        </div>
      </div>

      {/* Grelha de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs">
          {products.length === 0 ? (
            <>
              <Sprout className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Não existem produtos disponíveis.</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                O catálogo está pronto para receber produtos publicados por produtores rurais, cooperativas e comerciantes certificados.
              </p>
            </>
          ) : (
            <>
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Nenhum produto encontrado para estes filtros</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente selecionar "Todas as 18 Províncias" ou escolher outra categoria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedProvince('todas');
                  setOnlyMadeInAngola(false);
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Ver todos os produtos
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-sm"
              >
                <div>
                  {/* Foto do Produto */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center">
                        <Sprout className="w-8 h-8 text-emerald-600 mb-1" />
                        <span className="text-[10px] font-bold text-slate-600">Sem foto real do produtor</span>
                        <span className="text-[9px] text-slate-400 font-medium">Origem: {product.originProvince}</span>
                      </div>
                    )}

                    {/* Localização da Fazenda/Fábrica */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{product.originMunicipality} · {product.originProvince}</span>
                    </div>

                    {product.isProducedInAngola && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        Produção Nacional
                      </div>
                    )}
                  </div>

                  {/* Informações Comerciais */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 truncate" title={product.producerName}>
                        {product.producerName}
                      </span>
                      {product.rating > 0 && product.reviewCount > 0 ? (
                        <div className="flex items-center text-slate-700 space-x-1 text-xs">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="font-bold">{product.rating}</span>
                          <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 font-medium px-1.5 py-0.5 rounded">
                          Lote Novo
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {product.title}
                    </h3>

                    {/* Preço e Unidade */}
                    <div className="pt-1 flex items-baseline justify-between">
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {formatKz(product.price)}
                      </div>
                      <span className="text-xs text-slate-500 font-normal">por {product.unit}</span>
                    </div>

                    {/* Stock e Pedido Mínimo */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>Stock: <strong className="text-slate-800 font-mono">{product.availableStock}</strong></span>
                      <span>Mínimo: <strong className="text-slate-800 font-mono">{product.minOrderQuantity}</strong> {product.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveModalProduct(product);
                      setModalQty(product.minOrderQuantity || 1);
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    Ver detalhes
                  </button>

                  <button
                    id={`btn-add-cart-${product.id}`}
                    onClick={() => addToCart(product, product.minOrderQuantity || 1)}
                    className="w-full py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes do Produto & Simulador de Frete */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            id="product-detail-modal"
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 text-slate-900 relative p-5 sm:p-6 space-y-4"
          >
            {/* Fechar */}
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabeçalho */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-600">
                  {activeModalProduct.farmOrFactoryName}
                </span>
                {activeModalProduct.isProducedInAngola && (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Feito em Angola
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                {activeModalProduct.title}
              </h2>
            </div>

            {/* Grelha de Detalhes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-4/3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {activeModalProduct.images && activeModalProduct.images[0] ? (
                  <img
                    src={activeModalProduct.images[0]}
                    alt={activeModalProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                    <Sprout className="w-12 h-12 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Sem foto enviada pelo produtor</span>
                    <span className="text-[11px] text-slate-400">Origem: {activeModalProduct.originMunicipality}, {activeModalProduct.originProvince}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 text-xs leading-relaxed">
                  {activeModalProduct.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Localização de Origem:</span>
                    <strong className="text-slate-900">{activeModalProduct.originMunicipality}, {activeModalProduct.originProvince}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fornecedor / Produtor:</span>
                    <strong className="text-slate-900">{activeModalProduct.producerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Peso por unidade:</span>
                    <strong className="text-slate-900 font-mono">{activeModalProduct.weightKgPerUnit} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stock disponível:</span>
                    <strong className="text-slate-900 font-mono">{activeModalProduct.availableStock} {activeModalProduct.unit}</strong>
                  </div>
                </div>

                {/* Preço e Quantidade */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Preço por {activeModalProduct.unit}:</span>
                    <span className="text-base font-bold text-slate-900 font-mono">{formatKz(activeModalProduct.price)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <label className="text-xs font-semibold text-slate-700">Quantidade a encomendar:</label>
                    <input
                      type="number"
                      min={activeModalProduct.minOrderQuantity || 1}
                      max={activeModalProduct.availableStock}
                      value={modalQty}
                      onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 text-xs text-right font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Simulador Rodoviário de Frete */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center">
                  <Truck className="w-4 h-4 mr-1.5 text-slate-700" />
                  Estimativa de Frete Rodoviário
                </span>
                <span className="text-slate-500 font-normal">Cálculo de rota interprovincial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">Entregar em:</label>
                  <select
                    value={simulatedDestProvince}
                    onChange={(e) => setSimulatedDestProvince(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer"
                  >
                    {ANGOLA_PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const totalSimWeight = (activeModalProduct.weightKgPerUnit || 1) * modalQty;
                  const est = calculateFreightEstimate(
                    activeModalProduct.originProvince,
                    simulatedDestProvince,
                    totalSimWeight,
                    activeModalProduct.requiresRefrigeration
                  );
                  return (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col justify-center">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Frete estimado:</span>
                        <strong className="text-slate-900 font-mono font-bold">{formatKz(est.estimatedCostAOA)}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {est.distanceKm} km · {est.transitDays} dia(s) · {est.suggestedVehicle}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Ações Finais do Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div>
                <div className="text-[11px] text-slate-500">Total dos produtos ({modalQty} {activeModalProduct.unit}):</div>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {formatKz(activeModalProduct.price * modalQty)}
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                {onSelectProductForRfq && (
                  <button
                    onClick={() => {
                      onSelectProductForRfq(activeModalProduct);
                      setActiveModalProduct(null);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Pedir Cotação
                  </button>
                )}

                <button
                  onClick={() => {
                    addToCart(activeModalProduct, modalQty);
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer border border-amber-600 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
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

