import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  User, 
  Building2, 
  Headphones, 
  ShieldCheck, 
  BarChart3, 
  Shield, 
  X,
  ChevronDown,
  Sprout,
  Store,
  ShoppingBag,
  Award
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { UserProfile, ActorProfileType, UserRole } from '../types';
import { Logo } from './Logo';

import registerTrucksImg from '../assets/images/angola_warehouse_docks_register_1787065219011.jpg';
import loginTruckImg from '../assets/images/angola_highway_truck_login_1787065194361.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN',
  onSuccess
}) => {
  const { login, registerEnhancedUser } = useMarket();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  
  // Registration state
  const [selectedProfile, setSelectedProfile] = useState<ActorProfileType>('PRODUCER');
  const [accountType, setAccountType] = useState<'EMPRESA' | 'PESSOA'>('EMPRESA');
  const [companyName, setCompanyName] = useState('');
  const [personName, setPersonName] = useState('');
  const [nif, setNif] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('luanda');
  const [selectedMunicipality, setSelectedMunicipality] = useState('Luanda');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Municipalities for selected province
  const currentProvinceData = ANGOLA_PROVINCES.find(p => p.id === selectedProvinceId) || ANGOLA_PROVINCES[0];

  if (!isOpen) return null;

  const handleProvinceChange = (provId: string) => {
    setSelectedProvinceId(provId);
    const prov = ANGOLA_PROVINCES.find(p => p.id === provId);
    if (prov && prov.municipalities.length > 0) {
      setSelectedMunicipality(prov.municipalities[0]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Por favor introduza o seu Email, NIF ou Telefone.');
      return;
    }

    const success = login(loginEmail);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setLoginError('Credenciais não encontradas. Por favor verifique os dados ou crie uma nova conta.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const targetName = accountType === 'EMPRESA' ? companyName : personName;

    if (!targetName.trim()) {
      setRegError(accountType === 'EMPRESA' ? 'Por favor insira o Nome da Empresa.' : 'Por favor insira o seu Nome Completo.');
      return;
    }
    if (!nif.trim()) {
      setRegError('Por favor insira o NIF ou Nº de Identificação.');
      return;
    }
    if (!email.trim()) {
      setRegError('Por favor insira um email válido.');
      return;
    }
    if (!password || password.length < 6) {
      setRegError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setRegError('As senhas não coincidem.');
      return;
    }
    if (!acceptTerms) {
      setRegError('Por favor aceite os Termos de Uso e Política de Privacidade.');
      return;
    }

    let role: UserRole = 'producer';
    if (selectedProfile === 'PRODUCER') role = 'producer';
    else if (selectedProfile === 'MERCHANT') role = 'merchant';
    else if (selectedProfile === 'TRANSPORTER') role = 'driver';
    else if (selectedProfile === 'BUYER') role = 'buyer';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: targetName,
      companyName: accountType === 'EMPRESA' ? targetName : undefined,
      nif: nif,
      phone: phone.startsWith('+244') ? phone : `+244 ${phone}`,
      email: email,
      role: role,
      activeProfiles: [selectedProfile],
      entityType: accountType === 'EMPRESA' ? 'EMPRESA' : 'PESSOA_SINGULAR',
      verificationLevel: 2,
      isFormalized: true,
      inssNumber: `INSS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      province: currentProvinceData.name,
      municipality: selectedMunicipality,
      address: `${selectedMunicipality}, ${currentProvinceData.name}`,
      reputationScore: 5.0,
      completedTransactions: 0,
      fulfillmentRate: 100,
      avgResponseTimeMin: 15,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    registerEnhancedUser(newUser);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8">
      
      {/* Top Modal Container */}
      <div className="w-full max-w-6xl space-y-4 my-auto">
        
        {/* Top Floating App Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Official Logo */}
          <Logo size="md" variant="header" />

          {/* Switch Mode & Close Action */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs">
            {mode === 'REGISTER' ? (
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="hidden sm:inline">Já tem uma conta?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setLoginError('');
                    setRegError('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-800 font-bold transition cursor-pointer hover:bg-slate-50"
                >
                  Entrar
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="hidden sm:inline">Ainda não tem conta?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setLoginError('');
                    setRegError('');
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-800 font-bold transition cursor-pointer hover:bg-slate-50"
                >
                  Cadastrar
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
              title="Fechar janela"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Card Split Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: DARK BRAND PANEL (Changes per mode)           */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-[#0b0f19] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            
            {/* Top Content */}
            <div className="space-y-6 relative z-10">
              {mode === 'REGISTER' ? (
                <>
                  <span className="text-xs font-bold text-amber-400 tracking-wider block">
                    Junte-se ao AO MARKET
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                    Crie sua conta e <span className="text-amber-400">conecte-se a novas oportunidades.</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    Cadastre-se gratuitamente e faça parte da maior plataforma de conexão da cadeia produtiva e logística de Angola.
                  </p>

                  {/* 4 Trust Points */}
                  <div className="space-y-3.5 pt-2 text-xs text-slate-200 font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Acesso a milhares de fornecedores verificados</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Negociações seguras e transparentes</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Entregas certificadas em todo país</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Headphones className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Suporte dedicado para o seu negócio</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-amber-400 tracking-wider block">
                    Bem-vindo de volta!
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                    Acesse sua conta e continue <span className="text-amber-400">expandindo seus negócios.</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    Conecte-se ao AO MARKET e tenha acesso a um mundo de oportunidades.
                  </p>

                  {/* 4 Login Points */}
                  <div className="space-y-3.5 pt-2 text-xs text-slate-200 font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Gerencie seus pedidos e cotações</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Acompanhe entregas em tempo real</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Negocie com segurança</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>Relatórios e análises exclusivas</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Image Panel */}
            <div className="mt-8 pt-4 relative rounded-xl overflow-hidden shadow-lg border border-white/10">
              <img 
                src={mode === 'REGISTER' ? registerTrucksImg : loginTruckImg} 
                alt="AO MARKET Transporte e Logística" 
                className="w-full h-44 sm:h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent"></div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: FORMS (Register or Login)                   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            
            {mode === 'REGISTER' ? (
              /* ================= REGISTER FORM ================= */
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900">
                    Criar conta
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preencha os dados abaixo para começar
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {regError}
                  </div>
                )}

                {/* Step 1: Profile Selector */}
                <div className="space-y-2">
                  <label className="block text-slate-800 font-bold text-xs">
                    1. Qual é o seu Perfil Principal de Atuação?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Produtor */}
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('PRODUCER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedProfile === 'PRODUCER'
                          ? 'border-emerald-500 bg-emerald-50 text-slate-900 ring-2 ring-emerald-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                          <Sprout className="w-4 h-4" />
                        </div>
                        {selectedProfile === 'PRODUCER' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Produtor Rural</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Fazenda / Agrícola</div>
                      </div>
                    </button>

                    {/* Comerciante */}
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('MERCHANT')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedProfile === 'MERCHANT'
                          ? 'border-amber-500 bg-amber-50 text-slate-900 ring-2 ring-amber-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                          <Store className="w-4 h-4" />
                        </div>
                        {selectedProfile === 'MERCHANT' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Comerciante</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Grossista / B2B</div>
                      </div>
                    </button>

                    {/* Transportador */}
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('TRANSPORTER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedProfile === 'TRANSPORTER'
                          ? 'border-blue-500 bg-blue-50 text-slate-900 ring-2 ring-blue-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                          <Truck className="w-4 h-4" />
                        </div>
                        {selectedProfile === 'TRANSPORTER' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Transportador</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Frotas & Cargas</div>
                      </div>
                    </button>

                    {/* Comprador */}
                    <button
                      type="button"
                      onClick={() => setSelectedProfile('BUYER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedProfile === 'BUYER'
                          ? 'border-purple-500 bg-purple-50 text-slate-900 ring-2 ring-purple-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        {selectedProfile === 'BUYER' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Comprador</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Consumidor & Geral</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Step 2: Account Type Selector (Empresa vs Pessoa) */}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-bold text-xs">
                    2. Natureza Jurídica:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('EMPRESA')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3 ${
                        accountType === 'EMPRESA'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${accountType === 'EMPRESA' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">Empresa / Cooperativa</div>
                        <div className={`text-[10px] mt-1 leading-none ${accountType === 'EMPRESA' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Pessoa Coletiva ou Associação
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('PESSOA')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3 ${
                        accountType === 'PESSOA'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${accountType === 'PESSOA' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">Pessoa Singular</div>
                        <div className={`text-[10px] mt-1 leading-none ${accountType === 'PESSOA' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Produtor Familiar ou Individual
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  
                  {/* Row 1: Name & NIF */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {accountType === 'EMPRESA' ? 'Nome da Empresa' : 'Nome Completo'}
                      </label>
                      <input
                        type="text"
                        required
                        value={accountType === 'EMPRESA' ? companyName : personName}
                        onChange={e => accountType === 'EMPRESA' ? setCompanyName(e.target.value) : setPersonName(e.target.value)}
                        placeholder={accountType === 'EMPRESA' ? 'Ex.: Empresa Lda' : 'Ex.: João Manuel'}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        NIF
                      </label>
                      <input
                        type="text"
                        required
                        value={nif}
                        onChange={e => setNif(e.target.value)}
                        placeholder="Ex.: 5001234567"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {accountType === 'EMPRESA' ? 'Email institucional' : 'Email pessoal'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="contato@empresa.co.ao"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Telefone
                      </label>
                      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition">
                        <div className="px-2.5 py-2.5 bg-slate-50 border-r border-slate-200 flex items-center space-x-1 shrink-0 text-xs text-slate-700 font-semibold">
                          <span>🇦🇴</span>
                          <span>+244</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="912 345 678"
                          className="w-full px-3 py-2.5 bg-transparent text-slate-900 text-xs focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Crie uma senha segura"
                          className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Confirme sua senha"
                          className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Province & Municipality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Província
                      </label>
                      <div className="relative">
                        <select
                          value={selectedProvinceId}
                          onChange={e => handleProvinceChange(e.target.value)}
                          className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                        >
                          {ANGOLA_PROVINCES.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Município
                      </label>
                      <div className="relative">
                        <select
                          value={selectedMunicipality}
                          onChange={e => setSelectedMunicipality(e.target.value)}
                          className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                        >
                          {currentProvinceData.municipalities.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center space-x-2 text-[11px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={e => setAcceptTerms(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600 w-4 h-4"
                      />
                      <span>
                        Aceito os <span className="text-amber-600 font-semibold hover:underline">Termos de Uso</span> e a <span className="text-amber-600 font-semibold hover:underline">Política de Privacidade</span>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer pt-3"
                  >
                    <span>Criar conta como {selectedProfile === 'PRODUCER' ? 'Produtor Rural' : selectedProfile === 'MERCHANT' ? 'Comerciante' : selectedProfile === 'TRANSPORTER' ? 'Transportador' : 'Comprador'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Social Divider */}
                  <div className="relative py-2 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <span className="relative px-3 bg-white text-[11px] text-slate-400 font-medium">
                      ou cadastre-se com
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        login('admin@aomarket.ao');
                        onClose();
                      }}
                      className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 transition cursor-pointer shadow-2xs"
                    >
                      {/* Google G Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        login('admin@aomarket.ao');
                        onClose();
                      }}
                      className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 transition cursor-pointer shadow-2xs"
                    >
                      {/* Microsoft 4-square icon */}
                      <svg className="w-4 h-4" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                      <span>Microsoft</span>
                    </button>
                  </div>

                </form>
              </div>
            ) : (
              /* ================= LOGIN FORM ================= */
              <div className="space-y-6 my-auto">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900">
                    Entrar
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Digite seus dados para acessar sua conta
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  
                  {/* Email */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="seuemail@empresa.co.ao"
                        className="w-full pl-3.5 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full pl-3.5 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600 w-4 h-4"
                      />
                      <span>Lembrar-me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert('Para redefinir a palavra-passe, contacte o suporte oficial AO MARKET.')}
                      className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Social Divider */}
                  <div className="relative py-2 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <span className="relative px-3 bg-white text-[11px] text-slate-400 font-medium">
                      ou entre com
                    </span>
                  </div>

                  {/* Quick Persona Demo Switcher */}
                  <div className="pt-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Acesso Rápido por Persona:</span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">5 Personas</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          login('produtor.huambo@fazenda.ao');
                          onClose();
                        }}
                        className="p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Sprout className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 text-[11px] truncate">Produtor Rural</div>
                          <div className="text-[9px] text-slate-500 truncate">Fazenda Boa Esperança</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          login('comerciante@kero.co.ao');
                          onClose();
                        }}
                        className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 text-[11px] truncate">Comerciante Grossista</div>
                          <div className="text-[9px] text-slate-500 truncate">Grossista Kero Angola</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          login('compras@superluanda.co.ao');
                          onClose();
                        }}
                        className="p-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 text-[11px] truncate">Comprador</div>
                          <div className="text-[9px] text-slate-500 truncate">Supermercados Luanda</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          login('logistica@express.co.ao');
                          onClose();
                        }}
                        className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                          <Truck className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 text-[11px] truncate">Transportadora</div>
                          <div className="text-[9px] text-slate-500 truncate">Kwanza Express</div>
                        </div>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        login('admin@aomarket.ao');
                        onClose();
                      }}
                      className="w-full mt-1.5 p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-left transition flex items-center justify-between cursor-pointer border border-slate-800"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                          🛡️
                        </div>
                        <div>
                          <div className="font-bold text-amber-400 text-[11px]">Administrador Nacional</div>
                          <div className="text-[9px] text-slate-300">Direção de Supervisão e Gestão Geral</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-amber-300">
                        Admin Master
                      </span>
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM TRUST BAR (Dark rounded container with 4 points)   */}
        {/* ========================================================= */}
        <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 p-4 sm:p-5 text-white shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 100% Seguro */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">100% Seguro</div>
                <div className="text-[10px] text-slate-400">Seus dados protegidos com tecnologia avançada</div>
              </div>
            </div>

            {/* Verificação Rápida */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verificação Rápida</div>
                <div className="text-[10px] text-slate-400">
                  {mode === 'REGISTER' ? 'Cadastro validado em poucos minutos' : 'Acesso validado em segundos'}
                </div>
              </div>
            </div>

            {/* Suporte Dedicado */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Suporte Dedicado</div>
                <div className="text-[10px] text-slate-400">Equipe pronta para ajudar você</div>
              </div>
            </div>

            {/* Confiança Garantida */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Confiança Garantida</div>
                <div className="text-[10px] text-slate-400">Plataforma usada por empresas em Angola</div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 px-2 gap-2">
          <div>
            © 2026 AO MARKET. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-4">
            <button type="button" className="hover:text-slate-200 transition">Termos de Uso</button>
            <button type="button" className="hover:text-slate-200 transition">Política de Privacidade</button>
          </div>
        </div>

      </div>

    </div>
  );
};
