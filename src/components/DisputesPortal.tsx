import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { DisputeRecord } from '../types';
import { Logo } from './Logo';

export const DisputesPortal: React.FC = () => {
  const { disputes, orders, openDispute, resolveDispute, formatKz, currentUser } = useMarket();

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [reason, setReason] = useState<DisputeRecord['reason']>('DISCREPANCIA_QUALIDADE');
  const [description, setDescription] = useState<string>('');
  const [showOpenForm, setShowOpenForm] = useState<boolean>(false);

  const eligibleOrders = orders.filter(o => o.buyerId === currentUser.id && o.status !== 'CANCELLED');

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return;

    openDispute({
      orderId: order.id,
      complainantRole: 'BUYER',
      complainantName: currentUser.name,
      reason,
      description,
      evidenceUrls: [],
      escrowHeldAmountAOA: order.total
    });

    setShowOpenForm(false);
    setDescription('');
  };

  return (
    <div id="disputes-portal" className="space-y-4">
      {/* Sovereign Mediation Chamber Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Logo size="lg" variant="badge" className="hidden sm:inline-flex shrink-0 mt-1" />
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                <Scale className="w-4 h-4 text-amber-700" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                AO PROTECT • CÂMARA DE CUSTÓDIA BANCÁRIA E MEDIAÇÃO COMERCIAL
              </span>
            </div>

            <h1 className="text-xl font-display font-extrabold text-slate-900">
              Sistema de Proteção e Liquidação de Controvérsias
            </h1>

            <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
              Todos os pagamentos realizados no AO MARKET permanecem sob custódia bancária (Escrow) até à receção física do lote pelo comprador e validação do PIN OTP. Em caso de divergência de qualidade ou quantidade, a mediação é conduzida com perícia técnica.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOpenForm(!showOpenForm)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-2 shrink-0 cursor-pointer border border-amber-300"
        >
          <AlertTriangle className="w-4 h-4 text-black" />
          <span>Instaurar Processo de Mediação</span>
        </button>
      </div>

      {/* Open Dispute Form */}
      {showOpenForm && (
        <form 
          onSubmit={handleOpenDispute}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-300 space-y-4 shadow-md text-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <Scale className="w-4 h-4 text-amber-600 mr-2" />
              Abertura de Processo de Mediação no AO Protect
            </h2>
            <button
              type="button"
              onClick={() => setShowOpenForm(false)}
              className="text-slate-600 hover:text-slate-900 text-xs px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Ordem Objeto de Mediação:</label>
              <select
                required
                value={selectedOrderId}
                onChange={e => setSelectedOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="">Selecione a ordem de compra...</option>
                {eligibleOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    #{o.id} - {formatKz(o.total)} ({o.destinationProvince})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-semibold">Motivo Principal:</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as DisputeRecord['reason'])}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="DISCREPANCIA_QUALIDADE">Discrepância ou Qualidade Inadequada</option>
                <option value="QUANTIDADE_INCORRETA">Quantidade Incorreta / Divergente do Manifesto</option>
                <option value="PRODUTO_DANIFICADO">Produto Danificado / Avariado no Transporte</option>
                <option value="ATRASO_GRAVE">Atraso Grave na Entrega Rodoviária</option>
                <option value="NAO_RECEBIDO">Mercadoria Não Recebida</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 block mb-1 font-semibold">Fundamentação e Descrição dos Factos:</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente a não conformidade verificada na descarga..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl text-xs shadow-xs cursor-pointer border border-amber-300"
            >
              Submeter Processo à Mediação
            </button>
          </div>
        </form>
      )}

      {/* Disputes List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Processos em Tramitação na Câmara AO Protect ({disputes.length})
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">Decisões vinculativas</span>
        </div>

        {disputes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <p>Nenhum processo de disputa ou mediação aberto. Todas as ordens estão conformes.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {disputes.map(disp => (
              <div key={disp.id} className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-800">{disp.id}</span>
                    <span className="text-slate-500">Ordem: <strong className="text-slate-900">#{disp.orderId}</strong></span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    disp.status === 'EM_ANALISE' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {disp.status}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">{disp.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="text-slate-600">
                    Montante em Custódia Retida: <strong className="text-slate-900 font-mono">{formatKz(disp.escrowHeldAmountAOA)}</strong>
                  </div>

                  {disp.status === 'EM_ANALISE' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => resolveDispute(disp.id, 'REFUND', 'Reembolso integral emitido após perícia.')}
                        className="px-3 py-1 bg-[#cf102d] hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Reembolsar Comprador
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'RELEASE', 'Lote validado e fundos transferidos ao produtor.')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Libertar ao Vendedor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
