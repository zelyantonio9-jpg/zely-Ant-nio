import React from 'react';
import { 
  Truck, 
  MapPin, 
  AlertTriangle, 
  KeyRound, 
  Phone
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Order, OrderStatus } from '../types';
import { Logo } from './Logo';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDispute: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenDispute
}) => {
  const { formatKz } = useMarket();

  if (!isOpen || !order) return null;

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'PAID', label: 'Pago (Custódia)' },
    { key: 'ACCEPTED', label: 'Aceite pelo Produtor' },
    { key: 'PREPARING', label: 'Preparação do Lote' },
    { key: 'DRIVER_ASSIGNED', label: 'Transportador Alocado' },
    { key: 'PICKED_UP', label: 'Carga Recolhida' },
    { key: 'IN_TRANSIT', label: 'Em Trânsito Rodoviário' },
    { key: 'DELIVERED', label: 'Entregue (Validação PIN)' },
    { key: 'COMPLETED', label: 'Fundos Libertados' }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="order-tracking-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 p-5 sm:p-6 space-y-4"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Logo size="sm" variant="badge" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md">
                  {order.id}
                </span>
                <span className="text-[11px] text-slate-500">{order.createdAt}</span>
              </div>
              <h2 className="text-base font-display font-bold text-slate-900 mt-1">
                Rastreamento em Tempo Real AO Logistics
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Secret Delivery PIN OTP Box (CRITICAL SECURITY PIN) */}
        <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 text-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center justify-center sm:justify-start">
              <KeyRound className="w-4 h-4 mr-1 text-amber-700" />
              Código Secreto de Entrega (PIN OTP)
            </div>
            <div className="text-[11px] text-slate-600">
              Apenas entregue este código ao motorista quando receber e conferir a sua mercadoria intacta.
            </div>
          </div>

          <div className="bg-white text-slate-900 font-mono text-xl font-black px-4 py-2 rounded-xl tracking-widest border border-amber-300 shadow-xs shrink-0">
            #{order.deliveryOtpCode}
          </div>
        </div>

        {/* State Machine Progress Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-[11px] font-bold text-slate-800">Progresso do Pedido & Transporte:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {statusSteps.map((step, idx) => {
              const isPast = currentStepIndex >= idx;
              const isCurrent = order.status === step.key;
              return (
                <div 
                  key={step.key}
                  className={`p-2 rounded-xl border text-center transition ${
                    isCurrent
                      ? 'bg-amber-500 text-black font-extrabold border-amber-400 shadow-xs'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="text-[9px] font-mono">{isPast ? '✓' : idx + 1}</div>
                  <div className="text-[10px] leading-tight mt-0.5">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Driver and Logistics Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center">
              <Truck className="w-3.5 h-3.5 text-amber-600 mr-1" />
              Transportador Alocado:
            </div>
            <div className="text-slate-900 font-semibold">{order.driverName || 'Domingos Simão (Tio Domingos)'}</div>
            <div className="text-slate-500">Matrícula do Veículo: <strong className="text-slate-800 font-mono">{order.vehiclePlate || 'LD-44-88-GG'}</strong></div>
            <div className="text-slate-500 flex items-center pt-0.5">
              <Phone className="w-3 h-3 text-emerald-600 mr-1" />
              <span className="font-mono text-slate-800 font-bold">{order.driverPhone || '+244 944 555 666'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              Destino de Entrega:
            </div>
            <div className="text-slate-900 font-semibold">{order.destinationMunicipality}, Província do {order.destinationProvince.replace('_', ' ')}</div>
            <div className="text-slate-500 truncate">{order.destinationAddress}</div>
            <div className="text-slate-500 pt-0.5">Total da Encomenda: <strong className="text-slate-900 font-mono font-bold">{formatKz(order.total)}</strong></div>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-800">Histórico de Eventos & Auditoria:</div>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl max-h-36 overflow-y-auto text-xs bg-slate-50">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="p-2.5 flex items-start space-x-2 hover:bg-white transition">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{event.status}</span>
                    <span className="text-[10px] text-slate-400 font-normal font-mono">{event.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onOpenDispute(order);
              onClose();
            }}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Abrir Disputa no AO Protect</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
