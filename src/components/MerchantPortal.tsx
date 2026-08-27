import React, { useState } from 'react';
import { 
  Store, 
  Layers, 
  FileText, 
  Send, 
  Building2
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { Product } from '../types';
import { Logo } from './Logo';

interface MerchantPortalProps {
  onSelectProductForRfq?: Product;
}

export const MerchantPortal: React.FC<MerchantPortalProps> = ({ onSelectProductForRfq }) => {
  const { currentUser, rfqs, products, createRfq, respondToRfq, formatKz } = useMarket();

  const [selectedProductId, setSelectedProductId] = useState<string>(onSelectProductForRfq?.id || products[0]?.id || '');
  const [requestedQuantity, setRequestedQuantity] = useState<number>(50);
  const [targetPriceAOA, setTargetPriceAOA] = useState<number>(14000);
  const [destinationProvince, setDestinationProvince] = useState<string>('luanda');
  const [destinationMunicipality, setDestinationMunicipality] = useState<string>('Viana');
  const [notes, setNotes] = useState<string>('');
  const [responsePriceInput, setResponsePriceInput] = useState<Record<string, number>>({});

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

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

  return (
    <div id="merchant-portal" className="space-y-4">
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
                PORTAL INSTITUCIONAL B2B • CENTRAIS DE COMPRAS & GRANDES SUPERFÍCIES
              </span>
            </div>

            <h1 className="text-xl font-display font-extrabold text-slate-900">
              Cotações em Grande Volume (RFQ) & Abastecimento Direto
            </h1>

            <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
              Canal de contratação em grande escala para cadeias de retalho, hotelaria, moageiras e indústrias transformadoras. Negocie preços de atacado diretamente com as cooperativas agrícolas com contrato de fornecimento e custódia AO Protect.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs shrink-0 flex items-center space-x-2.5 shadow-xs">
          <Building2 className="w-5 h-5 text-amber-700" />
          <div>
            <div className="font-bold text-slate-900">{currentUser.companyName || 'Empresa Compradora B2B'}</div>
            <div className="text-[10px] text-emerald-700 font-mono font-semibold">NIF: {currentUser.nif || '5401928371'}</div>
          </div>
        </div>
      </div>

      {/* RFQ Form & Live List */}
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
    </div>
  );
};
