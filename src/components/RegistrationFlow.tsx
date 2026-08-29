import React, { useState } from 'react';
import { 
  Sprout, 
  Store, 
  Truck, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Trash2, 
  AlertCircle,
  Phone,
  Mail,
  Lock,
  Calendar,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ANGOLA_PROVINCES } from '../data/angolaGeoData';
import { Logo } from './Logo';
import { 
  UserProfile, 
  ActorProfileType, 
  UserRole, 
  UserDocument, 
  VehicleType,
  FormalizationOption,
  InssOption,
  CompanyServiceType,
  CompanyTeamMember,
  AccountRegistrationStatus
} from '../types';

interface RegistrationFlowProps {
  onSuccess: (user: UserProfile) => void;
  onCancel: () => void;
  onSwitchToLogin: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'governance') => void;
}

type MainCategoryChoice = 'PRODUCER' | 'BUYER' | 'TRANSPORTER' | 'EMPRESA';

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  onSuccess,
  onCancel,
  onSwitchToLogin,
  onOpenLegal
}) => {
  const { registerEnhancedUser } = useMarket();

  // Multi-step (1 to 6)
  const [step, setStep] = useState<number>(1);

  // Step 1: Main Category Selection
  const [mainProfile, setMainProfile] = useState<MainCategoryChoice>('PRODUCER');

  // Step 1 sub-choices:
  const [buyerEntityType, setBuyerEntityType] = useState<'PESSOA_SINGULAR' | 'EMPRESA'>('PESSOA_SINGULAR');
  const [transporterKind, setTransporterKind] = useState<'MOTORISTA_INDEPENDENTE' | 'EMPRESA_TRANSPORTES'>('MOTORISTA_INDEPENDENTE');
  const [companyServices, setCompanyServices] = useState<CompanyServiceType[]>(['COMPRAR', 'VENDER']);

  // Step 2: Personal / Company Data
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+244 9');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [birthDate, setBirthDate] = useState<string>('');
  const [biNumber, setBiNumber] = useState<string>('');
  const [nif, setNif] = useState<string>('');
  const [repName, setRepName] = useState<string>('');
  const [repBi, setRepBi] = useState<string>('');
  const [repPhone, setRepPhone] = useState<string>('');

  // Step 3: Location
  const [provinceId, setProvinceId] = useState<string>('huambo');
  const [municipality, setMunicipality] = useState<string>('Bailundo');
  const [commune, setCommune] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [addressLine, setAddressLine] = useState<string>('');
  const [productionLocation, setProductionLocation] = useState<string>('');

  // Step 4: Activity Details
  const [producerActivity, setProducerActivity] = useState<'AGRICULTURA' | 'PECUARIA' | 'PESCA' | 'AQUICULTURA' | 'AGROPROCESSAMENTO' | 'ARTESANATO' | 'OUTRA'>('AGRICULTURA');
  const [producerFarmName, setProducerFarmName] = useState<string>('');
  const [producerProducts, setProducerProducts] = useState<string[]>(['Milho', 'Feijão']);
  const [customProductInput, setCustomProductInput] = useState<string>('');
  const [capacityQuantity, setCapacityQuantity] = useState<string>('50');
  const [capacityUnit, setCapacityUnit] = useState<'TONELADAS' | 'KG' | 'CABECAS' | 'CAIXAS' | 'SACOS'>('TONELADAS');
  const [harvestSeason, setHarvestSeason] = useState<string>('Abril a Agosto');
  
  // Formalization & INSS
  const [formalizationStatus, setFormalizationStatus] = useState<FormalizationOption>('SIM');
  const [bankName, setBankName] = useState<string>('BFA - Banco de Fomento Angola');
  const [iban, setIban] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [inssStatus, setInssStatus] = useState<InssOption>('SIM');
  const [inssNumber, setInssNumber] = useState<string>('');

  // Buyer activity
  const [buyerPurchases, setBuyerPurchases] = useState<string[]>(['Produtos agrícolas', 'Produtos transformados']);

  // Transporter activity
  const [vehType, setVehType] = useState<VehicleType>('CAMIAO_3_5T');
  const [vehBrand, setVehBrand] = useState<string>('Mitsubishi');
  const [vehModel, setVehModel] = useState<string>('Canter 3.5T');
  const [vehPlate, setVehPlate] = useState<string>('LD-45-90-HQ');
  const [vehPayloadKg, setVehPayloadKg] = useState<string>('3500');
  const [vehCargoType, setVehCargoType] = useState<string>('Produtos Agrícolas e Carga Geral');
  const [operatingRoutes, setOperatingRoutes] = useState<string[]>(['Huambo - Luanda', 'Benguela - Luanda']);

  // Step 5: Documents (Progressive)
  const [uploadedDocs, setUploadedDocs] = useState<UserDocument[]>([]);
  const [simulatedUploading, setSimulatedUploading] = useState<boolean>(false);

  // Step 6: OTP Verification
  const [generatedOtp] = useState<string>(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Validation errors
  const [stepError, setStepError] = useState<string>('');

  // Geographic data
  const currentProvinceData = ANGOLA_PROVINCES.find(p => p.id === provinceId) || ANGOLA_PROVINCES[0];

  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setter(list.filter(i => i !== item));
      }
    } else {
      setter([...list, item]);
    }
  };

  const handleAddCustomProduct = () => {
    if (customProductInput.trim() && !producerProducts.includes(customProductInput.trim())) {
      setProducerProducts([...producerProducts, customProductInput.trim()]);
      setCustomProductInput('');
    }
  };

  const handleUploadDoc = (docType: UserDocument['documentType'], label: string) => {
    setSimulatedUploading(true);
    setTimeout(() => {
      const newDoc: UserDocument = {
        id: `doc_${Date.now()}`,
        documentType: docType,
        label,
        fileName: `${label.toLowerCase().replace(/[\s/]/g, '_')}_${Date.now().toString().slice(-4)}.pdf`,
        fileSizeKb: Math.floor(450 + Math.random() * 1200),
        fileMimeType: 'application/pdf',
        uploadDate: new Date().toISOString().slice(0, 10),
        status: 'EM_ANALISE'
      };
      setUploadedDocs(prev => [...prev.filter(d => d.documentType !== docType), newDoc]);
      setSimulatedUploading(false);
    }, 600);
  };

  const handleRemoveDoc = (docId: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== docId));
  };

  // Step navigation validations
  const handleNextStep = () => {
    setStepError('');

    // STEP 1: Profile Choice
    if (step === 1) {
      if (mainProfile === 'EMPRESA' && companyServices.length === 0) {
        setStepError('Por favor selecione pelo menos uma atividade que a sua empresa pretende realizar.');
        return;
      }
      setStep(2);
      return;
    }

    // STEP 2: Identity & Contact Info
    if (step === 2) {
      const isCompanyProfile = mainProfile === 'EMPRESA' || (mainProfile === 'BUYER' && buyerEntityType === 'EMPRESA') || (mainProfile === 'TRANSPORTER' && transporterKind === 'EMPRESA_TRANSPORTES');

      if (isCompanyProfile) {
        if (!companyName.trim()) {
          setStepError('Por favor informe a Razão Social ou Denominação da Empresa.');
          return;
        }
        if (!nif.trim()) {
          setStepError('Por favor informe o Número de Identificação Fiscal (NIF) da Empresa.');
          return;
        }
        if (!repName.trim()) {
          setStepError('Por favor informe o Nome do Representante Legal.');
          return;
        }
      } else {
        if (!fullName.trim()) {
          setStepError('Por favor informe o seu Nome Completo.');
          return;
        }
      }

      if (!phone || phone.length < 9) {
        setStepError('Por favor informe um número de telemóvel angolano válido (+244).');
        return;
      }

      if (!email.includes('@')) {
        setStepError('Por favor informe um endereço de correio eletrónico (email) válido.');
        return;
      }

      if (password.length < 6) {
        setStepError('A palavra-passe deve ter pelo menos 6 caracteres.');
        return;
      }

      if (password !== confirmPassword) {
        setStepError('A confirmação da palavra-passe não coincide.');
        return;
      }

      setStep(3);
      return;
    }

    // STEP 3: Location
    if (step === 3) {
      if (!municipality.trim()) {
        setStepError('Por favor selecione ou indique o Município.');
        return;
      }
      setStep(4);
      return;
    }

    // STEP 4: Activity Details
    if (step === 4) {
      if (mainProfile === 'TRANSPORTER') {
        if (!vehPlate.trim()) {
          setStepError('Por favor informe a matrícula do veículo principal de transporte.');
          return;
        }
      }
      setStep(5);
      return;
    }

    // STEP 5: Progressive Documents
    if (step === 5) {
      setStep(6);
      return;
    }

    // STEP 6: OTP & Complete
    if (step === 6) {
      if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '123456') {
        setOtpError('Código de confirmação incorreto. Verifique o código simulado no ecrã.');
        return;
      }
      executeRegistration();
    }
  };

  const executeRegistration = () => {
    const isCompany = mainProfile === 'EMPRESA' || (mainProfile === 'BUYER' && buyerEntityType === 'EMPRESA') || (mainProfile === 'TRANSPORTER' && transporterKind === 'EMPRESA_TRANSPORTES');
    
    // Determine mapped role
    let mappedRole: UserRole = 'producer';
    if (mainProfile === 'BUYER') mappedRole = 'buyer';
    else if (mainProfile === 'TRANSPORTER') mappedRole = 'driver';
    else if (mainProfile === 'EMPRESA') {
      if (companyServices.includes('VENDER')) mappedRole = 'producer';
      else if (companyServices.includes('COMPRAR')) mappedRole = 'merchant';
      else mappedRole = 'logistics_company';
    }

    // Active profiles
    const activeProfiles: ActorProfileType[] = [];
    if (mainProfile === 'PRODUCER') activeProfiles.push('PRODUCER');
    if (mainProfile === 'BUYER') activeProfiles.push('BUYER');
    if (mainProfile === 'TRANSPORTER') activeProfiles.push('TRANSPORTER');
    if (mainProfile === 'EMPRESA') {
      activeProfiles.push('EMPRESA');
      if (companyServices.includes('COMPRAR')) activeProfiles.push('BUYER', 'MERCHANT');
      if (companyServices.includes('VENDER')) activeProfiles.push('PRODUCER');
      if (companyServices.includes('TRANSPORTAR')) activeProfiles.push('TRANSPORTER');
    }

    // Determine initial account status
    let initialAccountStatus: AccountRegistrationStatus = 'ATIVO';
    if (uploadedDocs.length > 0) {
      initialAccountStatus = 'EM_ANALISE';
    } else if (mainProfile === 'EMPRESA' || isCompany) {
      initialAccountStatus = 'DOCUMENTACAO_PENDENTE';
    }

    const defaultAddress = addressLine || `${locality || commune || municipality}, Província do ${currentProvinceData.name}`;
    const calculatedName = isCompany ? (companyName || fullName) : fullName;

    // Initial company team if company
    const initialTeam: CompanyTeamMember[] = isCompany ? [
      {
        id: `team_owner_${Date.now()}`,
        name: repName || calculatedName,
        email: email,
        phone: phone,
        role: 'ADMIN',
        status: 'ATIVO',
        permissions: ['FULL_ACCESS', 'MANAGE_USERS', 'APPROVE_ORDERS', 'FINANCIAL_CONTROL'],
        createdAt: new Date().toISOString().slice(0, 10)
      }
    ] : [];

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: calculatedName,
      companyName: isCompany ? companyName : (mainProfile === 'PRODUCER' ? (producerFarmName || `Exploração Agrícola ${fullName}`) : undefined),
      email,
      phone,
      role: mappedRole,
      entityType: isCompany ? 'EMPRESA' : 'PESSOA_SINGULAR',
      activeProfiles,
      province: provinceId,
      municipality,
      commune: commune || undefined,
      locality: locality || undefined,
      address: defaultAddress,
      birthDate: birthDate || undefined,
      biNumber: biNumber || repBi || undefined,
      nif: nif || undefined,
      
      // Account Status & Progressive Verification
      accountStatus: initialAccountStatus,
      accountStatusReason: uploadedDocs.length > 0 ? 'Documentos submetidos para conferência da equipa de supervisão' : 'Conta registada com sucesso no AO MARKET',
      missingDocuments: uploadedDocs.length === 0 ? ['Comprovativo de Identificação / NIF', 'Certidão ou Documento de Atividade'] : [],
      verificationLevel: uploadedDocs.length > 0 ? 3 : 2,
      isFormalized: formalizationStatus === 'SIM',
      formalizationStatus,
      inssNumber: inssStatus === 'SIM' ? (inssNumber || `INSS-${Math.floor(100000 + Math.random() * 900000)}-${provinceId.slice(0, 2).toUpperCase()}`) : undefined,
      inssEnrollmentStatus: inssStatus,

      // Company Extensions
      companyServices: mainProfile === 'EMPRESA' ? companyServices : undefined,
      companyTeamMembers: isCompany ? initialTeam : undefined,
      legalRepresentative: isCompany ? {
        name: repName,
        bi: repBi,
        phone: repPhone || phone,
        email
      } : undefined,

      bankDetails: bankName && iban ? {
        bankName,
        iban,
        accountHolder: accountHolder || calculatedName
      } : undefined,

      // Reputation & Stats
      reputationScore: 5.0,
      completedTransactions: 0,
      fulfillmentRate: 100,
      avgResponseTimeMin: 15,
      badge: mainProfile === 'PRODUCER' ? 'Produtor Registado' : mainProfile === 'TRANSPORTER' ? 'Transportador Registado' : mainProfile === 'EMPRESA' ? 'Empresa Registada' : 'Comprador Registado',
      joinedAt: new Date().toISOString().slice(0, 10),

      // Producer Details
      producerData: (mainProfile === 'PRODUCER' || (mainProfile === 'EMPRESA' && companyServices.includes('VENDER'))) ? {
        producerType: isCompany ? 'AGROINDUSTRIA' : 'AGRICULTOR',
        farmName: producerFarmName || (isCompany ? companyName : `Fazenda ${fullName}`),
        activityCategory: producerActivity,
        productionCategories: [producerActivity === 'AGRICULTURA' ? 'AGRICULTURA' : producerActivity === 'PECUARIA' ? 'PECUARIA' : producerActivity === 'PESCA' ? 'PESCA' : 'AGRICULTURA'],
        mainCropsOrProducts: producerProducts,
        landAreaHectares: 15,
        annualCapacityQty: parseFloat(capacityQuantity) || 50,
        annualCapacityUnit: capacityUnit,
        harvestSeason,
        hasStorageFacility: true,
        productionLocationDetails: productionLocation || defaultAddress
      } : undefined,

      // Merchant Details
      merchantData: (mainProfile === 'BUYER' && buyerEntityType === 'EMPRESA') || (mainProfile === 'EMPRESA' && companyServices.includes('COMPRAR')) ? {
        merchantTypes: ['GROSSISTA', 'DISTRIBUIDOR'],
        hasPhysicalStore: true,
        storeAddress: defaultAddress,
        hasWarehouse: true,
        warehouseCapacityM3: 500,
        hasColdChainStorage: false,
        commercialRegistryNumber: nif,
        b2bCreditTermsAccepted: true
      } : undefined,

      // Transporter Details
      transporterData: (mainProfile === 'TRANSPORTER' || (mainProfile === 'EMPRESA' && companyServices.includes('TRANSPORTAR'))) ? {
        operatorType: transporterKind,
        fleetSize: isCompany ? 3 : 1,
        operatingCorridors: operatingRoutes,
        preferredMunicipalities: [municipality],
        maxPayloadKg: parseFloat(vehPayloadKg) || 3500,
        offersColdChain: false,
        vehicles: [
          {
            id: `veh_${Date.now()}`,
            vehicleType: vehType,
            brandModel: `${vehBrand} ${vehModel}`,
            licensePlate: vehPlate,
            year: 2022,
            payloadCapacityKg: parseFloat(vehPayloadKg) || 3500,
            volumeCapacityM3: 16,
            cargoType: vehCargoType,
            hasRefrigeration: false,
            technicalInspectionValid: true
          }
        ]
      } : undefined,

      // Buyer Details
      buyerData: (mainProfile === 'BUYER' || (mainProfile === 'EMPRESA' && companyServices.includes('COMPRAR'))) ? {
        buyerType: isCompany ? 'EMPRESA_TRANSFORMADORA' : 'CONSUMIDOR_FINAL',
        preferredCategories: buyerPurchases,
        preferredDeliveryProvince: provinceId,
        defaultDeliveryAddress: defaultAddress
      } : undefined,

      documents: uploadedDocs,

      auditLogs: [
        {
          id: `audit_${Date.now()}`,
          action: 'Registo Inicial Criado',
          performedBy: calculatedName,
          userRole: mappedRole,
          timestamp: new Date().toISOString(),
          notes: 'Cadastro concluído através do fluxo com verificação OTP.'
        }
      ]
    };

    const saved = registerEnhancedUser(newProfile);
    onSuccess(saved);
  };

  return (
    <div id="registration-master-flow" className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700 shrink-0">
        <div className="flex items-center space-x-3">
          <Logo variant="badge" size="sm" />
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span>Registo de Identidade Digital</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                AO MARKET
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Passo {step} de 6 • {
                step === 1 ? 'Escolha do Perfil' :
                step === 2 ? 'Dados de Acesso & Identidade' :
                step === 3 ? 'Localização Geográfica' :
                step === 4 ? 'Atividade & Operação' :
                step === 5 ? 'Documentação Progressiva' : 'Verificação OTP & Ativação'
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-700/50 transition cursor-pointer text-xs font-bold"
        >
          ✕ Fechar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
          <span className={step >= 1 ? 'text-amber-800 font-bold' : ''}>1. Perfil</span>
          <span className={step >= 2 ? 'text-amber-800 font-bold' : ''}>2. Identidade</span>
          <span className={step >= 3 ? 'text-amber-800 font-bold' : ''}>3. Local</span>
          <span className={step >= 4 ? 'text-amber-800 font-bold' : ''}>4. Atividade</span>
          <span className={step >= 5 ? 'text-amber-800 font-bold' : ''}>5. Documentos</span>
          <span className={step >= 6 ? 'text-amber-800 font-bold' : ''}>6. Validação</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
        
        {stepError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="font-semibold">{stepError}</div>
          </div>
        )}

        {/* ========================================================
            ETAPA 1: ESCOLHA DO PERFIL
        ======================================================== */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center max-w-lg mx-auto mb-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Como pretende utilizar o AO MARKET?
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Selecione a opção que melhor descreve a sua atividade principal na plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Produtor */}
              <div 
                onClick={() => setMainProfile('PRODUCER')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  mainProfile === 'PRODUCER'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Quero vender / Sou Produtor</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Para agricultores familiares, pecuaristas, pescadores e cooperativas agrícolas.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-emerald-800 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Publicar lotes de colheita & vendas diretas
                </div>
              </div>

              {/* Option 2: Comprador */}
              <div 
                onClick={() => setMainProfile('BUYER')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  mainProfile === 'BUYER'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Quero comprar / Sou Comprador</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Para consumidores individuais, comerciantes, restaurantes ou empresas revendedoras.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-blue-800 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Compras seguras com AO Protect & RFQ B2B
                </div>
              </div>

              {/* Option 3: Transportador */}
              <div 
                onClick={() => setMainProfile('TRANSPORTER')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  mainProfile === 'TRANSPORTER'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Prestar fretes / Sou Transportador</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Para motoristas individuais e operadores de frotas rodoviárias interprovinciais.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-amber-900 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Bolsa de Cargas & Validação OTP
                </div>
              </div>

              {/* Option 4: Empresa Multi-Função */}
              <div 
                onClick={() => setMainProfile('EMPRESA')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  mainProfile === 'EMPRESA'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Sou uma Empresa (Multi-função)</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Para empresas que compram, vendem e/ou transportam numa conta única corporativa.
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-purple-800 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Gestão multiperfil & RBAC de equipa
                </div>
              </div>

            </div>

            {/* Sub-selector for Buyer: Singular vs Empresa */}
            {mainProfile === 'BUYER' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-slate-900 text-xs">É pessoa singular ou empresa?</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyerEntityType('PESSOA_SINGULAR')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs cursor-pointer transition border ${
                      buyerEntityType === 'PESSOA_SINGULAR'
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pessoa Singular (Consumidor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerEntityType('EMPRESA')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs cursor-pointer transition border ${
                      buyerEntityType === 'EMPRESA'
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Empresa / Grossista B2B
                  </button>
                </div>
              </div>
            )}

            {/* Sub-selector for Transporter: Individual vs Empresa */}
            {mainProfile === 'TRANSPORTER' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-slate-900 text-xs">Tipo de Transportador:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransporterKind('MOTORISTA_INDEPENDENTE')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs cursor-pointer transition border ${
                      transporterKind === 'MOTORISTA_INDEPENDENTE'
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Transportador Individual / Motorista
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransporterKind('EMPRESA_TRANSPORTES')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs cursor-pointer transition border ${
                      transporterKind === 'EMPRESA_TRANSPORTES'
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Empresa de Transportes / Frotista
                  </button>
                </div>
              </div>
            )}

            {/* Sub-selector for Empresa: Multi-Service Selection */}
            {mainProfile === 'EMPRESA' && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                <div>
                  <div className="font-extrabold text-purple-950 text-xs">
                    Quais serviços pretende utilizar no AO MARKET?
                  </div>
                  <p className="text-purple-800 text-[11px] mt-0.5">
                    Não é necessário criar contas separadas. Pode selecionar múltiplas funções para a mesma empresa:
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'COMPRAR' as CompanyServiceType, label: 'Comprar (B2B)', desc: 'Aquisição de matérias-primas e revenda' },
                    { id: 'VENDER' as CompanyServiceType, label: 'Vender (Produção)', desc: 'Comercialização de lotes industriais ou rurais' },
                    { id: 'TRANSPORTAR' as CompanyServiceType, label: 'Transportar', desc: 'Prestar serviços de frete com frota própria' }
                  ].map(srv => {
                    const isSelected = companyServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleArrayItem(companyServices, srv.id, setCompanyServices as any)}
                        className={`p-2.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-800 border-purple-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{srv.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <p className={`text-[10px] mt-1 ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                          {srv.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-2 text-[11px] text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Verificação Progressiva:</strong> Nesta primeira etapa criamos a sua conta com os dados essenciais. Os documentos comprobatórios poderão ser submetidos posteriormente de forma gradual.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ETAPA 2: DADOS DE ACESSO & IDENTIDADE
        ======================================================== */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {mainProfile === 'EMPRESA' || (mainProfile === 'BUYER' && buyerEntityType === 'EMPRESA') || (mainProfile === 'TRANSPORTER' && transporterKind === 'EMPRESA_TRANSPORTES')
                  ? 'Dados da Empresa & Representante Legal'
                  : 'Dados Pessoais & Contacto'
                }
              </h3>
              <p className="text-slate-500 text-[11px]">
                Preencha as informações para criação da credencial soberana de acesso.
              </p>
            </div>

            {/* If Enterprise */}
            {(mainProfile === 'EMPRESA' || (mainProfile === 'BUYER' && buyerEntityType === 'EMPRESA') || (mainProfile === 'TRANSPORTER' && transporterKind === 'EMPRESA_TRANSPORTES')) ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Razão Social / Denominação Comercial *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Ex: Fazendas do Sul, Lda."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">NIF da Empresa *</label>
                    <input
                      type="text"
                      value={nif}
                      onChange={e => setNif(e.target.value)}
                      placeholder="Ex: 5412345678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-900 text-xs">Representante Legal da Empresa:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium text-[11px] mb-0.5">Nome do Representante *</label>
                      <input
                        type="text"
                        value={repName}
                        onChange={e => setRepName(e.target.value)}
                        placeholder="Nome completo"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium text-[11px] mb-0.5">BI do Representante *</label>
                      <input
                        type="text"
                        value={repBi}
                        onChange={e => setRepBi(e.target.value)}
                        placeholder="001234567LA042"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium text-[11px] mb-0.5">Telefone Direto</label>
                      <input
                        type="text"
                        value={repPhone}
                        onChange={e => setRepPhone(e.target.value)}
                        placeholder="+244 9..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* If Singular Person */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ex: Manuel António da Silva"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Número do Bilhete de Identidade (BI)</label>
                    <input
                      type="text"
                      value={biNumber}
                      onChange={e => setBiNumber(e.target.value)}
                      placeholder="Ex: 004829104HA042"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Data de Nascimento</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">NIF Pessoal (se aplicável)</label>
                    <input
                      type="text"
                      value={nif}
                      onChange={e => setNif(e.target.value)}
                      placeholder="Ex: 004829104HA042"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Contact & Security Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Telemóvel Nacional (+244) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Receberá um código SMS de validação</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Correio Eletrónico (E-mail) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemplo@dominio.ao"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Palavra-passe Segura *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Confirmar Palavra-passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repita a palavra-passe"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ETAPA 3: LOCALIZAÇÃO GEOGRÁFICA
        ======================================================== */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Localização Geográfica em Angola
              </h3>
              <p className="text-slate-500 text-[11px]">
                Indique a província e município onde opera ou onde se localiza a sua atividade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Província de Angola *</label>
                <select
                  value={provinceId}
                  onChange={e => {
                    setProvinceId(e.target.value);
                    const pData = ANGOLA_PROVINCES.find(p => p.id === e.target.value);
                    if (pData && pData.municipalities.length > 0) {
                      setMunicipality(pData.municipalities[0]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-semibold text-slate-900"
                >
                  {ANGOLA_PROVINCES.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.region})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Município *</label>
                <select
                  value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-semibold text-slate-900"
                >
                  {currentProvinceData.municipalities.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Comuna (opcional)</label>
                <input
                  type="text"
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  placeholder="Ex: Comuna de Chiumbo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Localidade / Aldeia / Bairro</label>
                <input
                  type="text"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="Ex: Sector do Calonga"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Endereço Principal / Ponto de Referência</label>
              <input
                type="text"
                value={addressLine}
                onChange={e => setAddressLine(e.target.value)}
                placeholder="Ex: Estrada Nacional 250, Km 14, próximo à Administração Comunal"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            {mainProfile === 'PRODUCER' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Localização Específica da Produção / Fazenda</label>
                <input
                  type="text"
                  value={productionLocation}
                  onChange={e => setProductionLocation(e.target.value)}
                  placeholder="Ex: Vale do Rio Queve, Sector 4, Fazenda Boa Esperança"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ETAPA 4: ATIVIDADE & OPERAÇÃO
        ======================================================== */}
        {step === 4 && (
          <div className="space-y-4">
            
            {/* PRODUCER SPECIFIC FIELDS */}
            {(mainProfile === 'PRODUCER' || (mainProfile === 'EMPRESA' && companyServices.includes('VENDER'))) && (
              <div className="space-y-3 p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
                <div className="font-extrabold text-emerald-950 text-xs flex items-center">
                  <Sprout className="w-4 h-4 mr-1.5 text-emerald-700" />
                  <span>Especificações da Produção Rural</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Qual a sua atividade principal? *</label>
                    <select
                      value={producerActivity}
                      onChange={e => setProducerActivity(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 outline-none"
                    >
                      <option value="AGRICULTURA">Agricultura (Grãos, Tubérculos, Hortícolas)</option>
                      <option value="PECUARIA">Pecuária (Bovinos, Caprinos, Aves, Ovos)</option>
                      <option value="PESCA">Pesca Marítima ou Fluvial</option>
                      <option value="AQUICULTURA">Aquicultura (Criação de Peixe)</option>
                      <option value="AGROPROCESSAMENTO">Agroprocessamento / Transformação</option>
                      <option value="ARTESANATO">Artesanato Tradicional</option>
                      <option value="OUTRA">Outra Atividade Produtiva</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nome da Fazenda / Exploração</label>
                    <input
                      type="text"
                      value={producerFarmName}
                      onChange={e => setProducerFarmName(e.target.value)}
                      placeholder="Ex: Fazenda Boa Esperança"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Produtos que pretende vender no AO MARKET:</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {producerProducts.map(crop => (
                      <span key={crop} className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-[11px] flex items-center">
                        {crop}
                        <button
                          type="button"
                          onClick={() => setProducerProducts(producerProducts.filter(c => c !== crop))}
                          className="ml-1.5 text-emerald-700 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customProductInput}
                      onChange={e => setCustomProductInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomProduct(); } }}
                      placeholder="Adicionar produto (ex: Tomate, Batata-doce, Mandioca)"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomProduct}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Capacidade Estimada</label>
                    <input
                      type="number"
                      value={capacityQuantity}
                      onChange={e => setCapacityQuantity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Unidade de Venda</label>
                    <select
                      value={capacityUnit}
                      onChange={e => setCapacityUnit(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-bold"
                    >
                      <option value="TONELADAS">Toneladas (t)</option>
                      <option value="KG">Quilogramas (kg)</option>
                      <option value="SACOS">Sacos (50kg)</option>
                      <option value="CAIXAS">Caixas</option>
                      <option value="CABECAS">Cabeças (Gado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Época de Produção</label>
                    <input
                      type="text"
                      value={harvestSeason}
                      onChange={e => setHarvestSeason(e.target.value)}
                      placeholder="Ex: Março a Setembro"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FORMALIZATION & INSS SECTION (For Producers & General) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="font-extrabold text-slate-900 text-xs">
                Enquadramento Fiscal & Formalização
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Está Formalizado? *</label>
                  <select
                    value={formalizationStatus}
                    onChange={e => setFormalizationStatus(e.target.value as FormalizationOption)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold outline-none"
                  >
                    <option value="SIM">Sim (Possuo NIF / Empresa / Registo)</option>
                    <option value="EM_PROCESSO">Estou em processo de formalização</option>
                    <option value="NAO">Não (Produtor / Operador Informal)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {formalizationStatus === 'NAO' ? 'Pode comercializar e utilizar a plataforma sem bloqueio.' : 'Aumenta o nível de confiança para transações B2B.'}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Está Inscrito no INSS? *</label>
                  <select
                    value={inssStatus}
                    onChange={e => setInssStatus(e.target.value as InssOption)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold outline-none"
                  >
                    <option value="SIM">Sim (Tenho número de segurado)</option>
                    <option value="PROCESSO_EM_CURSO">Processo em curso no INSS</option>
                    <option value="NAO">Não estou inscrito</option>
                  </select>
                </div>
              </div>

              {inssStatus === 'SIM' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Número de Inscrição no INSS</label>
                  <input
                    type="text"
                    value={inssNumber}
                    onChange={e => setInssNumber(e.target.value)}
                    placeholder="Ex: 1098234-AO"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
              )}

              {formalizationStatus === 'SIM' && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-800 mb-1.5">Dados Bancários para Liquidações AO Protect (Opcional):</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        placeholder="Nome do Banco (ex: BFA, BAI)"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={iban}
                        onChange={e => setIban(e.target.value)}
                        placeholder="IBAN: AO06 0000 0000 0000 0000 0000 0"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BUYER SPECIFIC */}
            {(mainProfile === 'BUYER' || (mainProfile === 'EMPRESA' && companyServices.includes('COMPRAR'))) && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                <div className="font-extrabold text-blue-950 text-xs flex items-center">
                  <Store className="w-4 h-4 mr-1.5 text-blue-700" />
                  <span>O que pretende comprar no AO MARKET?</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Produtos agrícolas',
                    'Produtos pecuários',
                    'Pescado',
                    'Produtos transformados',
                    'Artesanato',
                    'Outros'
                  ].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleArrayItem(buyerPurchases, cat, setBuyerPurchases)}
                      className={`p-2 rounded-xl text-left font-bold text-xs cursor-pointer border transition flex items-center justify-between ${
                        buyerPurchases.includes(cat)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat}</span>
                      {buyerPurchases.includes(cat) && <Check className="w-3 h-3 text-white ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRANSPORTER SPECIFIC */}
            {(mainProfile === 'TRANSPORTER' || (mainProfile === 'EMPRESA' && companyServices.includes('TRANSPORTAR'))) && (
              <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <div className="font-extrabold text-amber-950 text-xs flex items-center">
                  <Truck className="w-4 h-4 mr-1.5 text-amber-800" />
                  <span>Dados do Veículo & Rotas Logísticas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tipo de Veículo</label>
                    <select
                      value={vehType}
                      onChange={e => setVehType(e.target.value as VehicleType)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-bold"
                    >
                      <option value="CANTER_LIGHT">Canter Ligeiro (até 3.5t)</option>
                      <option value="CAMIAO_3_5T">Camião Médio (3.5t a 10t)</option>
                      <option value="CAMIAO_PESADO">Camião Pesado (10t a 30t)</option>
                      <option value="CISTERNA">Camião Cisterna</option>
                      <option value="CARRINHA_PICKUP">Carrinha Pick-up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Marca / Modelo</label>
                    <input
                      type="text"
                      value={`${vehBrand} ${vehModel}`}
                      onChange={e => {
                        const parts = e.target.value.split(' ');
                        setVehBrand(parts[0] || 'Mitsubishi');
                        setVehModel(parts.slice(1).join(' ') || 'Canter');
                      }}
                      placeholder="Ex: Mitsubishi Canter"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Matrícula Nacional *</label>
                    <input
                      type="text"
                      value={vehPlate}
                      onChange={e => setVehPlate(e.target.value)}
                      placeholder="Ex: LD-45-90-HQ"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Capacidade de Carga (kg)</label>
                    <input
                      type="number"
                      value={vehPayloadKg}
                      onChange={e => setVehPayloadKg(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tipo de Mercadoria Habitual</label>
                    <input
                      type="text"
                      value={vehCargoType}
                      onChange={e => setVehCargoType(e.target.value)}
                      placeholder="Ex: Carga Geral e Produtos Hortícolas"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rotas Preferenciais de Atuação:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Huambo - Luanda', 'Benguela - Luanda', 'Huíla - Luanda', 'Malanje - Luanda', 'Cuanza Sul - Luanda', 'Uíge - Luanda'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleArrayItem(operatingRoutes, r, setOperatingRoutes)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer border ${
                          operatingRoutes.includes(r)
                            ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ETAPA 5: DOCUMENTAÇÃO PROGRESSIVA
        ======================================================== */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Documentação & Verificação Progressiva
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Pode anexar agora os documentos disponíveis ou adicioná-los mais tarde no seu painel.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-mono text-[10px] font-bold">
                Passo Opcional na Criação
              </span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-2 text-[11px] text-blue-900">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Aviso de Segurança:</strong> Não é obrigatório enviar todos os documentos para criar a conta. Conforme realizar transações de maior volume, a supervisão solicitará os comprovativos necessários.
              </div>
            </div>

            {/* List of recommended docs according to profile */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-800 text-xs">Documentos recomendados para o seu perfil:</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* BI */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Bilhete de Identidade (BI)</div>
                      <div className="text-[10px] text-slate-500">Cópia legível frente e verso</div>
                    </div>
                  </div>
                  {uploadedDocs.some(d => d.documentType === 'BI') ? (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={simulatedUploading}
                      onClick={() => handleUploadDoc('BI', 'Bilhete de Identidade')}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold cursor-pointer border border-amber-400"
                    >
                      {simulatedUploading ? 'A carregar...' : '+ Anexar'}
                    </button>
                  )}
                </div>

                {/* NIF / Certidão */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Comprovativo de NIF / Certidão</div>
                      <div className="text-[10px] text-slate-500">Documento AGT ou Diário da República</div>
                    </div>
                  </div>
                  {uploadedDocs.some(d => d.documentType === 'NIF' || d.documentType === 'CERTIDAO_REGISTO_COMERCIAL') ? (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={simulatedUploading}
                      onClick={() => handleUploadDoc('NIF', 'Comprovativo de NIF')}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold cursor-pointer border border-amber-400"
                    >
                      {simulatedUploading ? 'A carregar...' : '+ Anexar'}
                    </button>
                  )}
                </div>

                {/* Transporter: Carta de Condução / Livrete */}
                {mainProfile === 'TRANSPORTER' && (
                  <>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Carta de Condução Profissional</div>
                          <div className="text-[10px] text-slate-500">Categoria Pesados / Carga</div>
                        </div>
                      </div>
                      {uploadedDocs.some(d => d.documentType === 'CARTA_CONDUCAO') ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={simulatedUploading}
                          onClick={() => handleUploadDoc('CARTA_CONDUCAO', 'Carta de Condução')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold cursor-pointer border border-amber-400"
                        >
                          + Anexar
                        </button>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Livrete / Título do Veículo</div>
                          <div className="text-[10px] text-slate-500">Documento da viatura</div>
                        </div>
                      </div>
                      {uploadedDocs.some(d => d.documentType === 'LIVRETE_VEICULO') ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={simulatedUploading}
                          onClick={() => handleUploadDoc('LIVRETE_VEICULO', 'Livrete do Veículo')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold cursor-pointer border border-amber-400"
                        >
                          + Anexar
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* INSS Comprovativo */}
                {inssStatus === 'SIM' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Comprovativo INSS</div>
                        <div className="text-[10px] text-slate-500">Cartão de Segurado ou Declaração</div>
                      </div>
                    </div>
                    {uploadedDocs.some(d => d.documentType === 'COMPROVATIVO_INSS') ? (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Anexado
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={simulatedUploading}
                        onClick={() => handleUploadDoc('COMPROVATIVO_INSS', 'Comprovativo INSS')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold cursor-pointer border border-amber-400"
                      >
                        + Anexar
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Uploaded items list */}
            {uploadedDocs.length > 0 && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-950 text-xs flex items-center justify-between">
                  <span>Documentos Anexados ({uploadedDocs.length})</span>
                  <span className="text-[10px] text-emerald-800">Entrarão em auditoria após criação</span>
                </div>
                <div className="space-y-1.5">
                  {uploadedDocs.map(doc => (
                    <div key={doc.id} className="p-2 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-900">{doc.label}</span>
                        <span className="text-slate-400 font-mono text-[10px]">({doc.fileSizeKb} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ETAPA 6: VALIDAÇÃO OTP & CONCLUSÃO
        ======================================================== */}
        {step === 6 && (
          <div className="space-y-4 text-center max-w-md mx-auto py-2">
            <div className="w-14 h-14 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-800 shadow-xs">
              <Phone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Verificação de Contacto por Código OTP
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Enviámos um código de validação de 6 dígitos para o número <strong className="text-slate-900 font-mono">{phone}</strong> e para o e-mail <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>

            {/* Simulated SMS Box */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-700 text-left shadow-md">
              <div className="text-[10px] text-amber-400 font-bold flex items-center justify-between mb-1 font-mono">
                <span>[SMS SIMULADO AO MARKET]</span>
                <span>Agora</span>
              </div>
              <p className="text-xs text-slate-200 font-mono">
                "O seu código de ativação no AO MARKET é: <strong className="text-amber-400 text-sm">{generatedOtp}</strong>. Não partilhe este código."
              </p>
            </div>

            {otpError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold">
                {otpError}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-slate-700 font-bold text-xs">Insira o código de 6 dígitos:</label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value)}
                placeholder="Ex: 123456"
                className="w-48 mx-auto text-center px-4 py-2.5 bg-slate-50 border-2 border-amber-500 rounded-2xl focus:bg-white outline-none font-mono text-xl font-extrabold tracking-widest text-slate-900"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="text-[11px] text-amber-800 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Preencher automaticamente o código ({generatedOtp})</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 text-left space-y-2">
              <div>
                <strong>Pronto para Ativar:</strong> A sua conta receberá imediatamente Nível {uploadedDocs.length > 0 ? 3 : 2} de Confiança com acesso instantâneo ao ecossistema nacional.
              </div>
              <div className="text-[10px] text-slate-600 border-t border-emerald-200/80 pt-1.5 leading-snug">
                Ao concluir a ativação, declara que aceita os{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('terms')}
                  className="text-amber-900 font-extrabold hover:underline cursor-pointer"
                >
                  Termos & Condições
                </button>{' '}
                e a{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('privacy')}
                  className="text-amber-900 font-extrabold hover:underline cursor-pointer"
                >
                  Política de Privacidade
                </button>{' '}
                do AO MARKET.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setStepError(''); setStep(step - 1); }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-100 transition flex items-center space-x-1.5 cursor-pointer text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Já tenho conta? Entrar
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {step === 5 && (
            <button
              type="button"
              onClick={() => setStep(6)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition cursor-pointer text-xs"
            >
              Avançar sem Documentos
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs border border-amber-400 text-xs"
          >
            <span>{step === 6 ? 'Concluir & Ativar Conta' : 'Continuar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
