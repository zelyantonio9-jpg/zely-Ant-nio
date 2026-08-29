import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X, 
  Database, 
  KeyRound, 
  AlertCircle,
  Sparkles,
  Server
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Logo } from './Logo';

interface AdminSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminSecretModal: React.FC<AdminSecretModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { registeredUsers, loginAsAdminDirect } = useMarket();
  const [email, setEmail] = useState('admin@aomarket.ao');
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Direct Admin access verification
      const success = await loginAsAdminDirect(email, accessKey);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Credenciais administrativas inválidas. Verifique o email ou código de acesso.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao conectar à área administrativa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b101c] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-display font-black text-lg text-white tracking-tight">
                  Área do Administrador
                </h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FF6B00] text-white rounded-md tracking-wider">
                  Root
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Acesso de Gestão Nacional & Conexão Firebase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Secret Gateway Notice */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-start space-x-3 text-xs">
          <Database className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200 block">
              Portal de Gestão & Administração
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Desbloqueado com 5 cliques no logótipo. Permite gerir utilizadores reais, validar documentação cadastral e monitorizar a base de dados Firestore em tempo real.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email Admin */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Email do Administrador
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@aomarket.ao"
                className="w-full px-3.5 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition"
              />
            </div>
          </div>

          {/* Access Key / Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">
                Chave Mestre de Acesso
              </label>
              <span className="text-[10px] text-slate-400">
                Padrão: <code className="text-[#FF6B00] font-mono">admin2026</code>
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
                placeholder="Introduza a chave de administrador ou deixe em branco"
                className="w-full pl-3.5 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-600/30 transition flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>A autenticar na consola...</span>
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Entrar na Consola Administrativa</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Database Status Indicator */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase Firestore: Conectado</span>
          </div>
          <span className="font-mono text-slate-500">ai-studio-aomarket</span>
        </div>

      </div>
    </div>
  );
};
