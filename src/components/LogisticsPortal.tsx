import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Navigation,
  CheckCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const LogisticsPortal: React.FC = () => {
  const { 
    currentUser,
    registeredUsers,
    freightLoads, 
    orders, 
    acceptFreightLoad, 
    confirmDeliveryWithOtp, 
    advanceOrderStatus, 
    formatKz 
  } = useMarket();

  const registeredDrivers = registeredUsers.filter(
    u => u.role === 'driver' || u.role === 'logistics_company' || u.activeProfiles?.includes('TRANSPORTER')
  );

  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    currentUser.role === 'driver' ? currentUser.id : (registeredDrivers[0]?.id || currentUser.id)
  );
  const [activeTab, setActiveTab] = useState<'available' | 'my_trips'>('available');
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpMessages, setOtpMessages] = useState<Record<string, { success: boolean; msg: string }>>({});

  const availableLoads = freightLoads.filter(l => l.status === 'PENDING_ACCEPTANCE');
  const activeTrips = orders.filter(o => 
    o.status === 'DRIVER_ASSIGNED' || 
    o.status === 'PICKED_UP' || 
    o.status === 'IN_TRANSIT' || 
    o.status === 'DELIVERED'
  );

  const handleOtpChange = (orderId: string, val: string) => {
    setOtpInputs(prev => ({ ...prev, [orderId]: val }));
  };

  const handleConfirmOtp = (orderId: string) => {
    const code = otpInputs[orderId] || '';
    const result = confirmDeliveryWithOtp(orderId, code);
    setOtpMessages(prev => ({
      ...prev,
      [orderId]: { success: result.success, msg: result.message }
    }));
  };

  return (
    <div id="logistics-portal" className="space-y-6">
      {/* Header Logística */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Portal de Transportes e Logística</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Escoamento e Rotas Nacionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Aceite pedidos de transporte interprovincial e confirme entregas com o código PIN seguro do destinatário.
          </p>
        </div>

        {/* Seletor de Transportador */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 shrink-0">
          <label className="text-slate-500 font-semibold block text-[11px]">Motorista / Transportador ativo:</label>
          {registeredDrivers.length > 0 ? (
            <select
              value={selectedDriverId}
              onChange={e => setSelectedDriverId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-slate-500 cursor-pointer"
            >
              {registeredDrivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.province.toUpperCase()})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-slate-800 font-medium">
              {currentUser.name} (Sessão Atual)
            </div>
          )}
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'available'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Cargas Disponíveis ({availableLoads.length})
        </button>

        <button
          onClick={() => setActiveTab('my_trips')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'my_trips'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Viagens em Curso ({activeTrips.length})
        </button>
      </div>

      {/* Cargas Disponíveis */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableLoads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-xs space-y-2 shadow-xs">
              <Package className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Nenhuma carga a aguardar frete no momento.</p>
              <p className="text-slate-500 text-[11px]">Quando novos pedidos forem emitidos com opção de frete, aparecerão aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableLoads.map(load => (
                <div key={load.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-slate-500 text-[11px]">Ref: {load.id}</span>
                    <span className="text-base font-bold text-slate-900 font-mono">{formatKz(load.suggestedFreightAOA)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                      <div>
                        <span className="text-slate-500 text-[11px]">Origem: </span>
                        <strong className="text-slate-900">{load.originMunicipality}, {load.originProvince}</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <div>
                        <span className="text-slate-500 text-[11px]">Destino: </span>
                        <strong className="text-slate-900">{load.destinationMunicipality}, {load.destinationProvince}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>{load.cargoDescription}</span>
                    <span className="font-mono font-bold text-slate-900">{load.distanceKm} km</span>
                  </div>

                  <button
                    onClick={() => acceptFreightLoad(load.id, selectedDriverId)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-xs"
                  >
                    Aceitar Transporte deste Lote
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Viagens Ativas e Validação */}
      {activeTab === 'my_trips' && (
        <div className="space-y-4">
          {activeTrips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-xs space-y-2 shadow-xs">
              <Navigation className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Nenhuma viagem em andamento.</p>
            </div>
          ) : (
            activeTrips.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900">Ordem #{order.id}</span>
                    <span className="ml-2 text-slate-500">Destinatário: <strong className="text-slate-900">{order.buyerName}</strong></span>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold">
                    Estado: {order.status}
                  </span>
                </div>

                {/* Ações do Fluxo de Transporte */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => advanceOrderStatus(order.id, 'PICKED_UP')}
                    disabled={order.status !== 'DRIVER_ASSIGNED'}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-semibold rounded-lg border border-slate-200 text-xs transition cursor-pointer"
                  >
                    1. Confirmar Carga na Origem
                  </button>

                  <button
                    onClick={() => advanceOrderStatus(order.id, 'IN_TRANSIT')}
                    disabled={order.status !== 'PICKED_UP'}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-semibold rounded-lg border border-slate-200 text-xs transition cursor-pointer"
                  >
                    2. Iniciar Viagem na Rota
                  </button>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="PIN do Cliente (4 dígitos)"
                      value={otpInputs[order.id] || ''}
                      onChange={e => handleOtpChange(order.id, e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 font-mono text-center font-bold text-xs rounded-lg py-2 focus:outline-none focus:border-slate-500"
                    />
                    <button
                      onClick={() => handleConfirmOtp(order.id)}
                      className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      Validar Entrega
                    </button>
                  </div>
                </div>

                {/* Mensagem de Feedback */}
                {otpMessages[order.id] && (
                  <div className={`p-3 rounded-lg text-xs font-semibold ${
                    otpMessages[order.id].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {otpMessages[order.id].msg}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

