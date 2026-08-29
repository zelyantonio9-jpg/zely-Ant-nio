import React from 'react';
import { 
  ShoppingBag, 
  Sprout, 
  Truck, 
  Scale, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Award, 
  Building2, 
  CreditCard, 
  ArrowUpRight, 
  ChevronRight,
  HeartHandshake,
  ShieldAlert,
  ArrowUp,
  Globe
} from 'lucide-react';
import { Logo } from './Logo';
import { useMarket } from '../context/MarketContext';
import { LegalDocTab } from './LegalAndGovernanceModal';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  onOpenAssistant: () => void;
  onOpenLegal: (tab: LegalDocTab) => void;
  onOpenCart?: () => void;
  onOpenAdminSecretModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenAssistant,
  onOpenLegal,
  onOpenCart,
  onOpenAdminSecretModal
}) => {
  const { products, currentUser, isAuthenticated } = useMarket();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSellerAreaClick = () => {
    if (!isAuthenticated) {
      onOpenAuth('LOGIN');
      return;
    }
    if (currentUser.role === 'producer') {
      onNavigate('producer');
    } else if (currentUser.role === 'merchant') {
      onNavigate('merchant');
    } else if (currentUser.role === 'transporter') {
      onNavigate('logistics');
    } else {
      onNavigate('producer');
    }
  };

  const handleBecomeSellerClick = () => {
    if (!isAuthenticated) {
      onOpenAuth('REGISTER');
    } else {
      // If already logged in, take them to producer portal to register harvest
      onNavigate('producer');
    }
  };

  return (
    <footer 
      id="main-app-footer"
      className="bg-[#0a192f] text-slate-200 border-t border-slate-800 relative z-10 transition-colors"
    >
      {/* Top Value Proposition & Trust Ribbon */}
      <div className="border-b border-slate-800/80 bg-[#071324]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Custódia Protegida</span>
                <span className="text-slate-400 text-[11px]">Pagamento 100% garantido</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Logística Nacional</span>
                <span className="text-slate-400 text-[11px]">Rotas em 21 províncias</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Origem Verificada</span>
                <span className="text-slate-400 text-[11px]">Produtores com NIF e B.I.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white block">Assistência 24/7</span>
                <span className="text-slate-400 text-[11px]">AO Assist & Apoio Oficial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Brand, Description & Social */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-4">
            <Logo 
              variant="footer" 
              onClick={() => {
                onNavigate('home');
                scrollToTop();
              }}
              onSecretAdminTrigger={onOpenAdminSecretModal} 
            />
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma oficial de comércio agro-industrial e escoamento mercantil de Angola. Conectamos cooperativas rurais, grossistas e transportadores rodoviários certificados com câmara de custódia financeira e proteção social.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{products.length} lotes ativos no catálogo</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
                <span>Escrow AO Protect Ativo</span>
              </span>
            </div>

            {/* Contacts and Channels */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:suporte@aomarket.ao" className="hover:text-amber-400 transition">
                  suporte@aomarket.ao
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400">Luanda • Huambo • Benguela • Huíla</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Canais Institucionais
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href="https://www.linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  title="LinkedIn AO MARKET"
                >
                  <span className="font-bold text-xs">in</span>
                </a>
                <a 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  title="Facebook AO MARKET"
                >
                  <span className="font-bold text-xs">fb</span>
                </a>
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  title="Instagram AO MARKET"
                >
                  <span className="font-bold text-xs">ig</span>
                </a>
                <button
                  onClick={onOpenAssistant}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                  title="Abrir AO Assist para atendimento imediato"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat IA 24/7</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Comprar */}
          <div className="space-y-3">
            <span className="font-extrabold text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Comprar</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { onNavigate('marketplace'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Catálogo de Produtos</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('marketplace'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Categorias & Colheitas</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('marketplace'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Ofertas & Lotes a Granel</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('producer'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Produtores Verificados</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('merchant'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Cotações Grossistas (RFQ)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Vender & Operar */}
          <div className="space-y-3">
            <span className="font-extrabold text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              <span>Vender</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={handleBecomeSellerClick}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left font-semibold text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Tornar-se Vendedor</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={handleSellerAreaClick}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Área do Vendedor / Produtor</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('merchant'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Painel do Comerciante B2B</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('logistics'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Bolsa de Fretes AO Logistics</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('social_protection'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Formalização & INSS Angola</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Ajuda & Legal */}
          <div className="space-y-3">
            <span className="font-extrabold text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Ajuda & Legal</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onOpenAssistant}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Central de Ajuda (AO Assist)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('disputes'); scrollToTop(); }}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Mediação & Reclamações</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-terms"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Termos e Condições</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-privacy"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Política de Privacidade (APD)</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-governance"
                  onClick={() => onOpenLegal('governance')}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left font-bold text-amber-400"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Regras e Governação (14 Regras)</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-returns"
                  onClick={() => onOpenLegal('returns')}
                  className="hover:text-amber-400 transition flex items-center space-x-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Política de Devoluções</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Methods & Institutional Badges Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Payment Methods */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Métodos de Pagamento Oficiais:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-[11px] font-bold text-white flex items-center space-x-1.5 shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Multicaixa Express (EMIS)</span>
              </div>
              <div className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-[11px] font-bold text-white flex items-center space-x-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Transferência BNA</span>
              </div>
              <div className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-[11px] font-bold text-white flex items-center space-x-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Carteira AO PAY</span>
              </div>
            </div>
          </div>

          {/* Institutional Compliance Indicators */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS 256-bit Encriptado</span>
            </span>
            <span className="px-2.5 py-1 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300 flex items-center space-x-1">
              <Scale className="w-3 h-3 text-amber-400" />
              <span>Lei n.º 22/11 APD</span>
            </span>
          </div>
        </div>

        {/* Bottom Legal, Dynamic Year Copyright & Back-to-top */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {currentYear} AO MARKET — República de Angola. Plataforma Nacional de Comércio Agro-Industrial e Logística Rodoviária.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition cursor-pointer"
            >
              Termos
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition cursor-pointer"
            >
              Privacidade
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('returns')}
              className="hover:text-white transition cursor-pointer"
            >
              Devoluções
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal('governance')}
              className="text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer"
            >
              Regras & Governação
            </button>

            <button
              onClick={scrollToTop}
              className="ml-2 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer"
              title="Voltar ao topo da página"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
