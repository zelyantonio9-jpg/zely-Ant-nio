import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building, 
  ArrowRight, 
  Lock, 
  Plus, 
  Minus 
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES, calculateFreightEstimate } from '../data/angolaGeoData';
import { PaymentMethod, Order } from '../types';
import { Logo } from './Logo';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartWeightKg, 
    createOrder, 
    formatKz,
    currentUser 
  } = useMarket();

  const [step, setStep] = useState<'CART' | 'CHECKOUT'>('CART');
  const [destinationProvince, setDestinationProvince] = useState<string>(currentUser.province || 'luanda');
  const [destinationMunicipality, setDestinationMunicipality] = useState<string>(currentUser.municipality || 'Talatona');
  const [destinationAddress, setDestinationAddress] = useState<string>(currentUser.address || 'Rua Principal');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('Favor ligar ao chegar ao portão.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MULTICAIXA_EXPRESS');
  const [phoneForExpress, setPhoneForExpress] = useState<string>(currentUser.phone || '+244 928 111 222');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const originProvince = cart[0]?.product.originProvince || 'huambo';
  const freightEst = calculateFreightEstimate(originProvince, destinationProvince, cartWeightKg);
  const serviceFee = Math.round(cartSubtotal * 0.015);
  const totalAmount = cartSubtotal + freightEst.estimatedCostAOA + serviceFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        destinationProvince,
        destinationMunicipality,
        destinationAddress,
        paymentMethod,
        deliveryNotes
      });
      setIsProcessing(false);
      onOrderCreated(order);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="cart-checkout-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 p-5 sm:p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Logo size="sm" variant="badge" />
            <div>
              <h2 className="text-base font-display font-extrabold text-slate-900">
                {step === 'CART' ? 'O Seu Carrinho de Compras' : 'AO PAY • Pagamento Sob Custódia Segura'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === 'CART' ? `${cart.length} itens selecionados` : 'Transação 100% protegida por AO Protect'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="py-10 text-center space-y-2.5">
            <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-700">O seu carrinho está vazio</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Explore o catálogo nacional e adicione produtos agrícolas e industriais direto dos produtores.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition border border-amber-400 cursor-pointer shadow-xs"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : step === 'CART' ? (
          /* STEP 1: CART REVIEW */
          <div className="space-y-3 text-xs">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              {cart.map(item => (
                <div key={item.product.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.product.title}</h4>
                      <div className="text-[11px] text-slate-500">
                        Origem: {item.product.originMunicipality} • <span className="font-mono font-bold text-slate-800">{formatKz(item.product.price)}</span> / {item.product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Price */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right shrink-0 min-w-[80px]">
                      <div className="font-bold text-slate-900 text-xs font-mono">
                        {formatKz(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[10px] text-red-600 hover:text-red-700 flex items-center justify-end mt-0.5 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5 mr-0.5" /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Weight estimation */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos Produtos:</span>
                <strong className="text-slate-900 font-mono">{formatKz(cartSubtotal)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Peso Total Estimado:</span>
                <strong className="text-slate-900 font-mono">{cartWeightKg} kg</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frete Rodoviário Estimado (AO Logistics):</span>
                <strong className="text-amber-800 font-mono font-bold">{formatKz(freightEst.estimatedCostAOA)}</strong>
              </div>
            </div>

            <button
              id="btn-proceed-to-checkout"
              onClick={() => setStep('CHECKOUT')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer border border-amber-400"
            >
              <span>Avançar para Pagamento & Morada de Entrega</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* STEP 2: CHECKOUT & AO PAY */
          <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-xs">
            {/* Delivery Address Details */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 flex items-center text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-600 mr-1" />
                Morada de Destino em Angola:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Província:</label>
                  <select
                    value={destinationProvince}
                    onChange={(e) => setDestinationProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                  >
                    {ANGOLA_PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Município:</label>
                  <input
                    type="text"
                    required
                    value={destinationMunicipality}
                    onChange={(e) => setDestinationMunicipality(e.target.value)}
                    placeholder="Ex: Talatona, Viana, Cazenga..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rua / Ponto de Referência:</label>
                <input
                  type="text"
                  required
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Ex: Bairro Benfica, Rua 12, Próximo ao Colégio"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Payment Method Selector (AO PAY) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="font-bold text-slate-900 flex items-center justify-between text-xs">
                <span className="flex items-center">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  Método de Pagamento (AO PAY):
                </span>
                <span className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md font-mono font-bold">
                  Custódia Segura
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-2 ${
                  paymentMethod === 'MULTICAIXA_EXPRESS' ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-400' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === 'MULTICAIXA_EXPRESS'}
                    onChange={() => setPaymentMethod('MULTICAIXA_EXPRESS')}
                    className="mt-0.5 text-amber-500 accent-amber-500"
                  />
                  <div>
                    <div className="text-slate-900 font-bold flex items-center text-xs">
                      <Smartphone className="w-3 h-3 text-amber-600 mr-1" />
                      Multicaixa Express
                    </div>
                    <div className="text-[10px] text-slate-500">Notificação direta no telemóvel</div>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-2 ${
                  paymentMethod === 'TRANSFERENCIA_BANCARIA' ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-400' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === 'TRANSFERENCIA_BANCARIA'}
                    onChange={() => setPaymentMethod('TRANSFERENCIA_BANCARIA')}
                    className="mt-0.5 text-amber-500 accent-amber-500"
                  />
                  <div>
                    <div className="text-slate-900 font-bold flex items-center text-xs">
                      <Building className="w-3 h-3 text-blue-600 mr-1" />
                      Transferência Bancária (IBAN)
                    </div>
                    <div className="text-[10px] text-slate-500">BAI, BFA, BIC, Standard Bank</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'MULTICAIXA_EXPRESS' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-slate-700 font-semibold text-[11px]">
                    Número de Telemóvel associado ao Multicaixa Express:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneForExpress}
                    onChange={(e) => setPhoneForExpress(e.target.value)}
                    placeholder="+244 9XX XXX XXX"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">Receberá a solicitação de autorização no app MCX.</span>
                </div>
              )}
            </div>

            {/* Escrow guarantee notice */}
            <div className="bg-amber-50/70 text-slate-800 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center text-xs">
                <Lock className="w-3.5 h-3.5 mr-1 text-amber-700" />
                Como funciona a Custódia AO Protect:
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                O seu pagamento de <strong className="text-slate-900 font-mono">{formatKz(totalAmount)}</strong> fica retido e seguro. O vendedor e o motorista só recebem o montante quando você confirmar a receção da mercadoria através do seu <strong className="text-slate-900">PIN OTP de entrega</strong>.
              </p>
            </div>

            {/* Order Totals */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Mercadorias:</span>
                <span className="font-mono text-slate-900">{formatKz(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frete Rodoviário AO Logistics ({freightEst.distanceKm} km):</span>
                <span className="font-mono text-slate-900">{formatKz(freightEst.estimatedCostAOA)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxa de Proteção & Custódia (1.5%):</span>
                <span className="font-mono text-slate-900">{formatKz(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-display font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-amber-800 font-mono">{formatKz(totalAmount)}</span>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep('CART')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold rounded-xl cursor-pointer text-center"
              >
                Voltar ao Carrinho
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processando AO PAY...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Confirmar Pagamento ({formatKz(totalAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
