import React, { useState } from 'react';
import { 
  Store, 
  Layers, 
  FileText, 
  Send, 
  Building2,
  Plus,
  Package,
  CheckCircle2,
  X,
  TrendingUp,
  ShoppingBag,
  Clock,
  Sparkles,
  MapPin,
  Trash2,
  Edit3,
  Boxes,
  Truck
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { Product, ProductCategory } from '../types';
import { Logo } from './Logo';
import { RealImageUploader } from './RealImageUploader';

interface MerchantPortalProps {
  onSelectProductForRfq?: Product;
}

export const MerchantPortal: React.FC<MerchantPortalProps> = ({ onSelectProductForRfq }) => {
  const { 
    currentUser, 
    rfqs, 
    products, 
    orders,
    createRfq, 
    respondToRfq, 
    addNewProduct,
    updateProductStock,
    deleteProduct,
    formatKz 
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'produtos' | 'rfq' | 'encomendas'>('produtos');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for Merchant's Product
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('graos_cereais');
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState('Saco 50kg');
  const [availableStock, setAvailableStock] = useState<number>(100);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(5);
  const [originProvince, setOriginProvince] = useState(currentUser.province || 'luanda');
  const [originMunicipality, setOriginMunicipality] = useState(currentUser.municipality || 'Viana');
  const [farmOrFactoryName, setFarmOrFactoryName] = useState(currentUser.companyName || currentUser.name || '');
  const [weightKgPerUnit, setWeightKgPerUnit] = useState<number>(50);
  const [volumeM3PerUnit, setVolumeM3PerUnit] = useState<number>(0.08);
  const [requiresRefrigeration, setRequiresRefrigeration] = useState(false);
  const [b2bTierMin, setB2bTierMin] = useState<number>(20);
  const [b2bTierPrice, setB2bTierPrice] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [quickStockEditId, setQuickStockEditId] = useState<string | null>(null);
  const [quickStockVal, setQuickStockVal] = useState<number>(0);

  // RFQ State
  const [selectedProductId, setSelectedProductId] = useState<string>(onSelectProductForRfq?.id || products[0]?.id || '');
  const [requestedQuantity, setRequestedQuantity] = useState<number>(50);
  const [targetPriceAOA, setTargetPriceAOA] = useState<number>(14000);
  const [destinationProvince, setDestinationProvince] = useState<string>('luanda');
  const [destinationMunicipality, setDestinationMunicipality] = useState<string>('Viana');
  const [notes, setNotes] = useState<string>('');
  const [responsePriceInput, setResponsePriceInput] = useState<Record<string, number>>({});

  // Products published by this merchant
  const myMerchantProducts = products.filter(p => p.producerId === currentUser.id);

  // Orders received for products belonging to this merchant
  const merchantProductIds = new Set(myMerchantProducts.map(p => p.id));
  const myReceivedOrders = orders.filter(o => 
    o.items.some(item => merchantProductIds.has(item.productId))
  );

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNewProduct({
      title,
      description,
      category,
      price,
      unit,
      availableStock,
      minOrderQuantity,
      originProvince,
      originMunicipality,
      farmOrFactoryName: farmOrFactoryName || currentUser.companyName || currentUser.name,
      isProducedInAngola: true,
      images: uploadedImages.length > 0 ? uploadedImages : [],
      producerId: currentUser.id,
      producerName: currentUser.companyName || currentUser.name,
      producerVerification: currentUser.verificationLevel,
      b2bBulkPricing: b2bTierMin > 0 && b2bTierPrice > 0 ? [{ minQuantity: b2bTierMin, pricePerUnit: b2bTierPrice }] : undefined,
      weightKgPerUnit,
      volumeM3PerUnit,
      requiresRefrigeration
    });

    setShowAddForm(false);
    setTitle('');
    setDescription('');
    setUploadedImages([]);
  };

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    createRfq({
      merchantId: currentUser.id,
      merchantName: currentUser.companyName || currentUser.name,
      producerId: selectedProduct.producerId,
      producerName: selectedProduct.producerName,
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      requestedQuantity,
      targetPriceAOA: targetPriceAOA > 0 ? targetPriceAOA : undefined,
      destinationProvince,
      destinationMunicipality,
      notes
    });

    setNotes('');
  };

  const handleResponsePriceChange = (rfqId: string, val: number) => {
    setResponsePriceInput(prev => ({ ...prev, [rfqId]: val }));
  };

  const handleSendQuoteResponse = (rfqId: string) => {
    const price = responsePriceInput[rfqId] || 0;
    if (price <= 0) return;
    respondToRfq(rfqId, price);
  };

  const currentProvinceData = ANGOLA_PROVINCES.find(p => p.id === originProvince);
  const availableMunicipalities = currentProvinceData?.municipalities || ['Sede'];

  return (
    <div id="merchant-portal" className="space-y-5">
      {/* Sovereign Merchant Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Logo size="lg" variant="badge" className="hidden sm:inline-flex shrink-0 mt-1" />
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                <Store className="w-4 h-4 text-amber-700" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                PORTAL DO COMERCIANTE & GROSSISTA • VENDAS & ABASTECIMENTO B2B
              </span>
            </div>

            <h1 className="text-xl font-display font-extrabold text-slate-900">
              Vendas de Armazém, Publicação de Negócios e Cotações B2B
            </h1>

            <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
              Como comerciante no AO MARKET, você pode <strong>vender e publicar os seus lotes de armazém e loja</strong> para retalhistas e consumidores, bem como <strong>comprar em grande escala (RFQ)</strong> diretamente das cooperativas agrárias com garantia de custódia.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs shrink-0 flex items-center space-x-3 shadow-xs">
          <Building2 className="w-6 h-6 text-amber-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900 text-sm">{currentUser.companyName || currentUser.name}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>NIF: <strong className="font-mono text-slate-800">{currentUser.nif || '5401928371'}</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Nível {currentUser.verificationLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Produtos Publicados à Venda</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{myMerchantProducts.length} itens</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Cotações B2B (RFQs)</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{rfqs.length} ativas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Encomendas de Clientes</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{myReceivedOrders.length} recebidas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('produtos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'produtos'
              ? 'bg-[#FF6B00] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Meus Produtos & Negócios à Venda ({myMerchantProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rfq')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'rfq'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Cotações B2B & Atacado (RFQ) ({rfqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('encomendas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'encomendas'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Encomendas Recebidas ({myReceivedOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: MEUS PRODUTOS & VENDAS */}
      {activeTab === 'produtos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Catálogo de Venda do Comerciante / Armazém
              </h2>
              <p className="text-slate-600 text-xs">
                Publique os seus produtos e estoques para que retalhistas, empresas e consumidores possam comprar online com entrega ou recolha.
              </p>
            </div>

            <button
              type="button"
              id="btn-merchant-add-product"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs transition flex items-center space-x-2 cursor-pointer shadow-xs shrink-0 border border-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Novo Produto / Negócio</span>
            </button>
          </div>

          {/* Form to Publish New Merchant Product */}
          {showAddForm && (
            <form 
              onSubmit={handlePublishProduct}
              className="bg-white p-6 rounded-2xl border border-amber-300 ring-2 ring-amber-400/20 space-y-4 shadow-sm text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Cadastrar Produto / Lote de Armazém ou Loja
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 block mb-1 font-semibold">Nome do Produto / Lote Comercial:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Arroz Agulha Nacional (Saco 25kg) ou Feijão Manteiga Fardo"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Categoria:</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="graos_cereais">Grãos e Cereais</option>
                    <option value="agricultura_frescos">Hortícolas e Frutas</option>
                    <option value="transformacao_nacional">Produtos Processados & Mercearia</option>
                    <option value="pesca_mariscos">Pescado e Marisco</option>
                    <option value="materiais_construcao">Materiais de Construção & Outros</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="text-slate-700 block mb-1 font-semibold">Descrição Comercial do Produto:</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Indique detalhes sobre a origem, tipo de saco/embalagem, condições de armazenamento e entrega..."
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Preço Unitário de Venda (Kz):</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={price || ''}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="Ex: 24000"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Unidade de Medida:</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Saco 50kg">Saco (50 Kg)</option>
                    <option value="Saco 25kg">Saco (25 Kg)</option>
                    <option value="Caixa">Caixa</option>
                    <option value="Grade">Grade</option>
                    <option value="Fardo">Fardo</option>
                    <option value="Tonelada">Tonelada (1.000 Kg)</option>
                    <option value="Kg">Quilograma (Kg)</option>
                    <option value="Litro">Litro</option>
                    <option value="Dúzia">Dúzia</option>
                    <option value="Unidade">Unidade</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Estoque Disponível:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={availableStock || ''}
                    onChange={e => setAvailableStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Qtd Mínima por Pedido:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minOrderQuantity}
                    onChange={e => setMinOrderQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Província do Armazém / Loja:</label>
                  <select
                    value={originProvince}
                    onChange={e => {
                      const newProv = e.target.value;
                      setOriginProvince(newProv);
                      const pData = ANGOLA_PROVINCES.find(p => p.id === newProv);
                      setOriginMunicipality(pData?.municipalities[0] || 'Sede');
                    }}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {ANGOLA_PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Município:</label>
                  <select
                    value={originMunicipality}
                    onChange={e => setOriginMunicipality(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {availableMunicipalities.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Nome da Loja / Armazém Comercial:</label>
                  <input
                    type="text"
                    value={farmOrFactoryName}
                    onChange={e => setFarmOrFactoryName(e.target.value)}
                    placeholder="Ex: Armazéns Kwanza Sul - Viana"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Qtd Mínima para Preço B2B (Atacado):</label>
                  <input
                    type="number"
                    min="0"
                    value={b2bTierMin || ''}
                    onChange={e => setB2bTierMin(Number(e.target.value))}
                    placeholder="Ex: 20 unidades"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Preço B2B por Atacado (Kz/un):</label>
                  <input
                    type="number"
                    min="0"
                    value={b2bTierPrice || ''}
                    onChange={e => setB2bTierPrice(Number(e.target.value))}
                    placeholder="Ex: 21500 (desconto de volume)"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <RealImageUploader
                    label="Fotografias Reais do Produto / Armazém (Máx 4)"
                    images={uploadedImages}
                    onImagesChange={setUploadedImages}
                    maxImages={4}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publicar no Catálogo Nacional</span>
                </button>
              </div>
            </form>
          )}

          {/* Published Products Grid */}
          {myMerchantProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Ainda não tem produtos publicados à venda.</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Clique no botão <strong>Publicar Novo Produto / Negócio</strong> acima para cadastrar os lotes de alimentos, mercadorias e produtos do seu armazém.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMerchantProducts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {p.category.toUpperCase().replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                        title="Remover Produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden relative">
                      {p.images && p.images.length > 0 ? (
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
                        {p.originMunicipality}, {p.originProvince}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Preço de Venda:</span>
                        <strong className="text-slate-900 font-mono text-sm">{formatKz(p.price)} / {p.unit}</strong>
                      </div>
                      {p.b2bBulkPricing && p.b2bBulkPricing.length > 0 && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                          <span>Atacado (≥{p.b2bBulkPricing[0].minQuantity} un):</span>
                          <span className="font-mono">{formatKz(p.b2bBulkPricing[0].pricePerUnit)} / un</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Estoque Atual:</span>
                        <span className={`font-mono font-bold ${p.availableStock > 10 ? 'text-slate-800' : 'text-rose-600'}`}>
                          {p.availableStock} {p.unit}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock quick management footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    {quickStockEditId === p.id ? (
                      <div className="flex items-center space-x-1.5 w-full">
                        <input
                          type="number"
                          value={quickStockVal}
                          onChange={e => setQuickStockVal(Number(e.target.value))}
                          className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateProductStock(p.id, quickStockVal);
                            setQuickStockEditId(null);
                          }}
                          className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickStockEditId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-slate-500">Ajuste Rápido:</span>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, Math.max(0, p.availableStock - 5))}
                            className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono text-[11px]"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, p.availableStock + 10)}
                            className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-mono text-[11px]"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickStockEditId(p.id);
                              setQuickStockVal(p.availableStock);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            title="Editar estoque exato"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RFQ BOARD */}
      {activeTab === 'rfq' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* RFQ Creation Form */}
          <form 
            onSubmit={handleCreateRfq}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs shadow-xs"
          >
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Emitir Pedido de Cotação B2B (RFQ)
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Produto / Lote Desejado:</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  disabled={products.length === 0}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer disabled:opacity-60"
                >
                  {products.length > 0 ? (
                    products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.originProvince})
                      </option>
                    ))
                  ) : (
                    <option value="">Aguardando publicação de produtos no catálogo...</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Qtd Desejada:</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={requestedQuantity}
                    onChange={e => setRequestedQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Preço Alvo (Kz):</label>
                  <input
                    type="number"
                    value={targetPriceAOA}
                    onChange={e => setTargetPriceAOA(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Província de Descarga:</label>
                  <select
                    value={destinationProvince}
                    onChange={e => setDestinationProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-2.5 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {ANGOLA_PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Município:</label>
                  <input
                    type="text"
                    required
                    value={destinationMunicipality}
                    onChange={e => setDestinationMunicipality(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Especificações Adicionais:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Frequência de entrega pretendida, embalagem paletizada, requisitos de humidade..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer border border-amber-300"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Enviar Pedido de Cotação ao Produtor</span>
              </button>
            </div>
          </form>

          {/* RFQ Board */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 text-amber-600 mr-2" />
                Registo de Pedidos de Cotação B2B ({rfqs.length})
              </h2>
              <span className="text-[11px] text-slate-500">Negociação Direta</span>
            </div>

            {rfqs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Nenhuma cotação B2B solicitada no momento.</p>
                <p className="text-[11px] text-slate-400">Utilize o formulário ao lado para solicitar preços de atacado para a sua rede comercial.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rfqs.map(rfq => (
                  <div key={rfq.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-800">{rfq.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        rfq.status === 'RESPONDIDO' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">{rfq.productTitle}</div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                      <span>Quantidade: <strong className="text-slate-900 font-mono">{rfq.requestedQuantity} un</strong></span>
                      <span>Destino: <strong className="text-slate-900">{rfq.destinationMunicipality}, {rfq.destinationProvince}</strong></span>
                      {rfq.targetPriceAOA && (
                        <span>Preço Alvo: <strong className="text-slate-900 font-mono">{formatKz(rfq.targetPriceAOA)}</strong></span>
                      )}
                    </div>

                    {rfq.status === 'ABERTO' && (
                      <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Propor Preço Unitário (Kz)"
                          value={responsePriceInput[rfq.id] || ''}
                          onChange={e => handleResponsePriceChange(rfq.id, Number(e.target.value))}
                          className="bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-mono w-48 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendQuoteResponse(rfq.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                        >
                          Enviar Proposta
                        </button>
                      </div>
                    )}

                    {rfq.quotedPriceAOA && (
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                        <span>Proposta Aceite pelo Produtor:</span>
                        <strong className="text-sm font-mono font-black text-emerald-800">{formatKz(rfq.quotedPriceAOA)} / un</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ENCOMENDAS RECEBIDAS */}
      {activeTab === 'encomendas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Encomendas e Vendas dos Meus Produtos ({myReceivedOrders.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">Liquidação sob Custódia AO Protect</span>
          </div>

          {myReceivedOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Ainda não recebeu pedidos para os seus produtos.</div>
              <p className="text-xs text-slate-400">
                Assim que compradores ou retalhistas encomendarem itens do seu estoque de armazém, eles aparecerão aqui com status de custódia.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReceivedOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-800">{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-900 font-semibold">
                      Comprador: {order.buyerName} ({order.destinationMunicipality}, {order.destinationProvince})
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Itens encomendados: {order.items.map(i => `${i.productTitle} (${i.quantity}x)`).join(', ')}
                    </div>
                    <div className="text-slate-900 font-bold font-mono">
                      Total: {formatKz(order.totalAOA)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

