import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  UserCheck, 
  LogOut, 
  Home, 
  Sprout, 
  Store, 
  Truck, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ECOSYSTEM_TABS, TabId, getRoleNamePt, getDefaultTabForRole } from '../utils/rolePermissions';

interface RestrictedAccessViewProps {
  targetTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
}

export const RestrictedAccessView: React.FC<RestrictedAccessViewProps> = ({
  targetTab,
  onNavigate,
  onOpenAuth
}) => {
  const { currentUser, isAuthenticated, logout } = useMarket();
  const tabConfig = ECOSYSTEM_TABS[targetTab as TabId];

  const targetTitle = tabConfig?.label || 'Área Restrita';
  const targetNotice = tabConfig?.roleSpecificNotice || 'Este módulo possui restrições estritas de acesso por perfil institucional.';
  const currentRoleName = getRoleNamePt(currentUser.role);
  const myHomeTab = getDefaultTabForRole(currentUser.role);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-6 sm:p-10 space-y-6">
        
        {/* Badge / Lock Graphic */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Isolamento Estrito de Perfil Institucional</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
            Acesso Restrito: {targetTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            {targetNotice}
          </p>
        </div>

        {/* Status Comparison Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">O seu Perfil Ativo:</span>
            {isAuthenticated ? (
              <span className="font-bold text-slate-900 flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentRoleName} ({currentUser.name})</span>
              </span>
            ) : (
              <span className="font-bold text-slate-700 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                Visitante Não Autenticado
              </span>
            )}
          </div>

          <div className="flex items-start space-x-2 text-slate-600 text-[11px] leading-relaxed pt-1">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Por diretiva de segurança económica e segregação de funções do <strong>AO MARKET</strong>, um perfil não pode aceder nem visualizar os painéis de controlo operacionais de outros intervenientes da cadeia produtiva.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => onNavigate(myHomeTab)}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Voltar ao Meu Painel ({currentRoleName})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  logout();
                  onOpenAuth('LOGIN');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Trocar de Conta / Perfil</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('LOGIN')}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Entrar com Conta Autorizada</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuth('REGISTER')}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Criar Novo Registo</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Ir para Início</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
