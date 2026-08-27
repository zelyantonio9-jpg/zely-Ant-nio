import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Package, 
  Layers, 
  CheckCircle2, 
  Building2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { ProductCategory } from '../types';
import { RealImageUploader } from './RealImageUploader';

export const ProducerPortal: React.FC = () => {
  const { currentUser, products, addNewProduct, formatKz } = useMarket();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('graos_cereais');
  const [price, setPrice] = useState<number>(15000);
  const [unit, setUnit] = useState('saco 50kg');
  const [availableStock, setAvailableStock] = useState<number>(100);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(5);
  const [originProvince, setOriginProvince] = useState(currentUser.province || 'huambo');
  const [originMunicipality, setOriginMunicipality] = useState(currentUser.municipality || 'Bailundo');
  const [farmOrFactoryName, setFarmOrFactoryName] = useState(currentUser.companyName || 'Fazenda Agro-Produtiva');
  const [weightKgPerUnit, setWeightKgPerUnit] = useState<number>(50);
  const [volumeM3PerUnit, setVolumeM3PerUnit] = useState<number>(0.08);
  const [requiresRefrigeration, setRequiresRefrigeration] = useState(false);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [b2bTierMin, setB2bTierMin] = useState<number>(30);
  const [b2bTierPrice, setB2bTierPrice] = useState<number>(13500);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // My products
  const myProducts = products.filter(p => p.producerId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
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
      farmOrFactoryName,
      isProducedInAngola: true,
      images: uploadedImages.length > 0 ? uploadedImages : [],
      producerId: currentUser.id,
      producerName: currentUser.name,
      producerVerification: currentUser.verificationLevel,
      b2bBulkPricing: b2bTierMin > 0 ? [{ minQuantity: b2bTierMin, pricePerUnit: b2bTierPrice }] : undefined,
      harvestDate,
      weightKgPerUnit,
      volumeM3PerUnit,
      requiresRefrigeration
    });

    setShowAddForm(false);
    setTitle('');
    setDescription('');
    setUploadedImages([]);
  };

  return (
    <div id="producer-portal" className="space-y-6">
      {/* Header do Produtor */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Painel do Produtor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Gestão de Produtos e Colheitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Publique a sua produção agrícola ou industrial, controle os stocks e atenda a pedidos de compradores e grossistas em todo o país.
          </p>
        </div>

        <button
          id="btn-show-add-product"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Novo Produto</span>
        </button>
      </div>

      {/* Identificação da Empresa / Produtor */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
            <Building2 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm flex items-center">
              {currentUser.name} {currentUser.companyName && `· ${currentUser.companyName}`}
              <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1.5" />
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              NIF: <span className="font-mono text-slate-800 font-medium">{currentUser.nif}</span> · Localização: <span className="capitalize text-slate-800 font-medium">{currentUser.municipality}, {currentUser.province}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
            Conta Verificada (Nível {currentUser.verificationLevel})
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium">
            Taxa de entrega: {currentUser.fulfillmentRate}%
          </span>
        </div>
      </div>

      {/* Formulário de Adicionar Produto */}
      {showAddForm && (
        <form 
          id="add-product-form"
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-300 space-y-4 shadow-sm text-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Cadastrar Novo Produto ou Lote
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-700 block mb-1 font-semibold">Nome do Produto / Lote:</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Milho Branco Nacional em Grão (Saco 50kg)"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Categoria:</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none cursor-pointer"
              >
                <option value="graos_cereais">Grãos e Cereais</option>
                <option value="agricultura_frescos">Hortícolas e Frutas</option>
                <option value="transformacao_nacional">Café e Processados</option>
                <option value="pesca_mariscos">Pescado e Marisco</option>
                <option value="materiais_construcao">Materiais de Construção</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-700 block mb-1 font-semibold">Descrição do Produto:</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Indique detalhes sobre a colheita, embalagem, qualidade e prazos..."
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Preço Unitário (Kz):</label>
              <input
                type="number"
                min="100"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Unidade de Venda:</label>
              <input
                type="text"
                required
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="Ex: saco 50kg, caixa 25kg, tonelada"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Stock Disponível:</label>
              <input
                type="number"
                min="1"
                required
                value={availableStock}
                onChange={e => setAvailableStock(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Província:</label>
              <select
                value={originProvince}
                onChange={e => setOriginProvince(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none cursor-pointer"
              >
                {ANGOLA_PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Município / Local de Carga:</label>
              <input
                type="text"
                required
                value={originMunicipality}
                onChange={e => setOriginMunicipality(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Peso por Unidade (kg):</label>
              <input
                type="number"
                min="1"
                required
                value={weightKgPerUnit}
                onChange={e => setWeightKgPerUnit(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:border-slate-500 focus:outline-none"
              />
            </div>

            {/* Real Image Uploader connecting directly to Firebase Storage */}
            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <RealImageUploader
                label="Fotografias Reais do Lote / Colheita (Firebase Storage)"
                helperText="Carregue fotos reais tiradas diretamente no campo, fazenda ou armazém para verificação e transparência"
                folder="products"
                multiple={true}
                maxFiles={4}
                initialImages={uploadedImages}
                onImagesChange={setUploadedImages}
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Publicar Produto com Fotos Reais
            </button>
          </div>
        </form>
      )}

      {/* Lista de Produtos Cadastrados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Os Seus Produtos Cadastrados ({myProducts.length})
            </h2>
          </div>
        </div>

        {myProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs space-y-2">
            <p>Nenhum produto registado até ao momento.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
            >
              Cadastrar Primeiro Produto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myProducts.map(prod => (
              <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                <div className="flex items-center space-x-3">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Sprout className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-2">
                      <span>{prod.title}</span>
                      {prod.images && prod.images.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold rounded">
                          {prod.images.length} {prod.images.length === 1 ? 'foto real' : 'fotos reais'}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {prod.originMunicipality}, {prod.originProvince} · Stock: <strong className="text-slate-800 font-mono">{prod.availableStock} {prod.unit}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <div className="text-sm font-bold text-slate-900 font-mono">{formatKz(prod.price)}</div>
                    <div className="text-[11px] text-slate-500">por {prod.unit}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                    Ativo
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

