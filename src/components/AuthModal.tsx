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
  Award,
  Globe,
  Radio
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { UserProfile, ActorProfileType, UserRole } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
  onSuccess?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'governance') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN',
  onSuccess,
  onOpenLegal
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

  if (!isOpen) return null;

  const currentProvinceData = ANGOLA_PROVINCES.find(p => p.id === selectedProvinceId) || ANGOLA_PROVINCES[0];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Por favor introduza o seu email ou telemóvel registado.');
      return;
    }

    const success = login(loginEmail);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setLoginError('Conta não encontrada com estes dados. Crie uma nova conta ou verifique o email.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const displayName = accountType === 'EMPRESA' ? companyName.trim() : personName.trim();
    if (!displayName) {
      setRegError(accountType === 'EMPRESA' ? 'Por favor insira a Denominação Social da Empresa.' : 'Por favor insira o Nome Completo.');
      return;
    }

    if (!email.trim() || !phone.trim() || !nif.trim()) {
      setRegError('Preencha todos os campos obrigatórios (Email, Telefone e NIF).');
      return;
    }

    if (password.length < 6) {
      setRegError('A palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setRegError('As palavras-passe não coincidem.');
      return;
    }

    if (!acceptTerms) {
      setRegError('Deve aceitar os Termos de Uso e Política de Privacidade da plataforma AO MARKET.');
      return;
    }

    // Role mapping from Actor Profile
    let mappedRole: UserRole = 'producer';
    if (selectedProfile === 'MERCHANT') mappedRole = 'merchant';
    if (selectedProfile === 'TRANSPORTER') mappedRole = 'driver';
    if (selectedProfile === 'BUYER') mappedRole = 'buyer';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: displayName,
      companyName: accountType === 'EMPRESA' ? displayName : undefined,
      email: email.trim().toLowerCase(),
      phone: phone.startsWith('+244') ? phone : `+244 ${phone.trim()}`,
      nif: nif.trim(),
      role: mappedRole,
      entityType: accountType === 'EMPRESA' ? 'EMPRESA' : 'PESSOA_SINGULAR',
      activeProfiles: [selectedProfile],
      verificationLevel: 2,
      isFormalized: true,
      inssNumber: `INSS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      province: currentProvinceData.name,
      municipality: selectedMunicipality,
      address: `${selectedMunicipality}, ${currentProvinceData.name}`,
      badge: selectedProfile === 'MERCHANT' ? 'Comerciante Certificado' : selectedProfile === 'PRODUCER' ? 'Produtor Verificado' : selectedProfile === 'TRANSPORTER' ? 'Transportador Oficial' : 'Comprador Verificado',
      merchantData: selectedProfile === 'MERCHANT' ? {
        businessType: 'GROSSISTA',
        merchantTypes: ['GROSSISTA', 'RETALHISTA'],
        hasPhysicalStore: true,
        storeAddress: `${selectedMunicipality}, ${currentProvinceData.name}`,
        hasWarehouse: true,
        warehouseCapacityM3: 500,
        offersColdStorage: false
      } : undefined,
      producerData: selectedProfile === 'PRODUCER' ? {
        producerType: accountType === 'EMPRESA' ? 'FAZENDA' : 'AGRICULTOR',
        farmName: displayName,
        activityCategory: 'AGRICULTURA',
        mainCropsOrProducts: ['Milho', 'Mandioca', 'Hortícolas'],
        annualCapacityQty: 50,
        annualCapacityUnit: 'TONELADAS'
      } : undefined,
      transporterData: selectedProfile === 'TRANSPORTER' ? {
        operatorType: accountType === 'EMPRESA' ? 'EMPRESA_TRANSPORTES' : 'MOTORISTA_INDEPENDENTE',
        fleetSize: 1,
        vehicles: [{
          id: `veh_${Date.now()}`,
          vehicleType: 'CAMIAO_3_5T',
          brandModel: 'Mitsubishi Canter',
          licensePlate: 'LD-88-21-AO',
          year: 2022,
          payloadCapacityKg: 3500,
          volumeCapacityM3: 15,
          hasRefrigeration: false,
          technicalInspectionValid: true
        }],
        operatingCorridors: [`${currentProvinceData.name} - Luanda`],
        maxPayloadKg: 3500,
        offersColdChain: false
      } : undefined,
      buyerData: selectedProfile === 'BUYER' ? {
        buyerType: accountType === 'EMPRESA' ? 'EMPRESA_TRANSFORMADORA' : 'CONSUMIDOR_FINAL',
        preferredCategories: ['Produtos agrícolas', 'Produtos transformados']
      } : undefined,
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
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Acesso a milhares de compradores e produtores</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Logística integrada em todo o território nacional</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Pagamentos 100% seguros com custódia regulada</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Suporte especializado e acompanhamento contínuo</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-amber-400 tracking-wider block">
                    Bem-vindo de volta
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                    Conectando o mercado <span className="text-amber-400">de ponta a ponta.</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    Acesse sua conta para gerenciar seus pedidos, cotações, cargas e produtos em tempo real com máxima segurança.
                  </p>

                  {/* 4 Feature Items */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-white font-bold">Gestão Completa</strong>
                        <span className="text-slate-400 text-[11px]">Acompanhe suas transações e métricas em tempo real.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-white font-bold">Rede Logística</strong>
                        <span className="text-slate-400 text-[11px]">Bolsa de fretes interligada nas 21 províncias (326 municípios).</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-white font-bold">Proteção & Segurança</strong>
                        <span className="text-slate-400 text-[11px]">Transações garantidas por custódia bancária segura.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block text-white font-bold">Atendimento Prioritário</strong>
                        <span className="text-slate-400 text-[11px]">Mesa de apoio e assistência 24/7.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Institutional Info Card in Dark Panel */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="relative rounded-2xl p-4 bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    {mode === 'REGISTER' ? 'Rede Logística & Agrícola' : 'Ambiente Seguro de Transação'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {mode === 'REGISTER' 
                    ? 'Interligação em tempo real com o banco de dados oficial do AO MARKET e verificação documental.' 
                    : 'Acesso seguro autenticado via Firebase com isolamento estrito de permissões.'}
                </p>
                <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-400">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Cobertura nas 21 Províncias e 326 Municípios de Angola</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: INTERACTIVE FORM                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            
            {mode === 'REGISTER' ? (
              /* ================= REGISTRATION FORM ================= */
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900">
                    Criar Conta
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecione o seu perfil de atuação no AO MARKET
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {regError}
                  </div>
                )}

                {/* 4 Persona Options */}
                <div>
                  <label className="block text-slate-700 font-semibold text-xs mb-2">
                    Tipo de Perfil
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'PRODUCER', label: 'Produtor', desc: 'Agrícola e Pecuário', icon: Sprout },
                      { id: 'MERCHANT', label: 'Comerciante', desc: 'Grossista e Retalhista', icon: Store },
                      { id: 'TRANSPORTER', label: 'Transportadora', desc: 'Logística de Fretes', icon: Truck },
                      { id: 'BUYER', label: 'Comprador', desc: 'Supermercado e Final', icon: ShoppingBag }
                    ].map((p) => {
                      const Icon = p.icon;
                      const isSelected = selectedProfile === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProfile(p.id as ActorProfileType)}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col items-start justify-between min-h-[90px] cursor-pointer ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-md font-bold' 
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-black/15 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold leading-tight">{p.label}</div>
                            <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                              {p.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tipo de Entidade: Empresa vs Pessoa Singular */}
                <div>
                  <label className="block text-slate-700 font-semibold text-xs mb-2">
                    Natureza Cadastral
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('EMPRESA')}
                      className={`p-3 rounded-xl border flex items-center space-x-3 transition cursor-pointer text-left ${
                        accountType === 'EMPRESA' 
                          ? 'border-slate-900 bg-slate-900 text-white font-bold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${accountType === 'EMPRESA' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">Empresa / Sociedade</div>
                        <div className={`text-[10px] mt-1 leading-none ${accountType === 'EMPRESA' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Cooperativa, Lda ou S.A.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('PESSOA')}
                      className={`p-3 rounded-xl border flex items-center space-x-3 transition cursor-pointer text-left ${
                        accountType === 'PESSOA' 
                          ? 'border-slate-900 bg-slate-900 text-white font-bold' 
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
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
                        placeholder={accountType === 'EMPRESA' ? 'Ex.: Fazenda Kwanza Lda' : 'Ex.: João Manuel'}
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
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Confirmar Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repita sua senha"
                          className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Province and Municipality Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Província de Localização
                      </label>
                      <select
                        value={selectedProvinceId}
                        onChange={e => {
                          const pId = e.target.value;
                          setSelectedProvinceId(pId);
                          const pObj = ANGOLA_PROVINCES.find(p => p.id === pId);
                          if (pObj && pObj.municipalities.length > 0) {
                            setSelectedMunicipality(pObj.municipalities[0]);
                          }
                        }}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500"
                      >
                        {ANGOLA_PROVINCES.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Município
                      </label>
                      <select
                        value={selectedMunicipality}
                        onChange={e => setSelectedMunicipality(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:border-amber-500"
                      >
                        {currentProvinceData.municipalities.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms & Privacy */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={e => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                      />
                      <span className="leading-snug">
                        Li e concordo com os{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenLegal) onOpenLegal('terms');
                          }}
                          className="font-extrabold text-amber-900 hover:underline cursor-pointer"
                        >
                          Termos & Condições
                        </button>{' '}
                        e a{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenLegal) onOpenLegal('privacy');
                          }}
                          className="font-extrabold text-amber-900 hover:underline cursor-pointer"
                        >
                          Política de Privacidade
                        </button>{' '}
                        do AO MARKET.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer mt-3"
                  >
                    <span>Concluir Cadastro</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

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
                    Digite seus dados cadastrados para aceder à sua conta no AO MARKET
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
                      Email ou Telemóvel
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="seuemail@empresa.co.ao ou +244 9xx xxx xxx"
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
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-500">
                    Não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('REGISTER')}
                      className="text-amber-600 hover:text-amber-700 font-bold underline"
                    >
                      Criar nova conta gratuitamente
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
