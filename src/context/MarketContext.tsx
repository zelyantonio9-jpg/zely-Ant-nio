import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Order, 
  UserProfile, 
  FreightLoad, 
  B2BQuotationRequest, 
  DisputeRecord, 
  EcosystemNotification,
  UserRole,
  PaymentMethod,
  OrderStatus,
  UserDocument,
  DocumentVerificationStatus,
  VerificationLevel,
  AccountRegistrationStatus,
  ActorProfileType,
  CompanyTeamMember,
  RegistrationAuditLog,
  INSSValidationResult,
  INSSAuditLog
} from '../types';
import { calculateFreightEstimate } from '../data/angolaGeoData';
import { api } from '../services/apiClient';
import { FirestoreSyncService } from '../services/firestoreService';
import { INSSOfficialService } from '../services/inssService';
import { 
  hasPermission, 
  checkProductOwnership, 
  checkOrderStateTransition, 
  checkOrderAccess,
  checkTenantCompanyAccess
} from '../utils/rbacEngine';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface MarketContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  registeredUsers: UserProfile[];
  login: (identifier: string, role?: UserRole) => boolean;
  loginAsAdminDirect: (email: string, key?: string) => Promise<boolean>;
  registerUser: (userData: Partial<UserProfile> & { name: string; role: UserRole; phone: string; province: string; municipality: string }) => UserProfile;
  registerEnhancedUser: (profile: UserProfile) => UserProfile;
  addProfileToCurrentUser: (newProfile: ActorProfileType, profileSpecificData?: any) => void;
  uploadUserDocument: (userId: string, doc: Omit<UserDocument, 'id' | 'uploadDate' | 'status'>) => void;
  replaceUserDocument: (userId: string, docId: string, newFile: { fileName: string; fileSizeKb: number; fileMimeType: string }) => void;
  updateDocumentStatus: (userId: string, docId: string, status: DocumentVerificationStatus, reason?: string) => void;
  updateUserVerificationLevel: (userId: string, level: VerificationLevel) => void;
  updateAccountStatus: (userId: string, status: AccountRegistrationStatus, reason?: string, missingDocs?: string[]) => void;
  requestAdditionalDocuments: (userId: string, missingDocs: string[], notes: string) => void;
  addTeamMember: (companyUserId: string, member: Omit<CompanyTeamMember, 'id' | 'createdAt'>) => void;
  removeTeamMember: (companyUserId: string, memberId: string) => void;
  addAuditLog: (userId: string, action: string, notes?: string, previousStatus?: AccountRegistrationStatus, newStatus?: AccountRegistrationStatus) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  products: Product[];
  orders: Order[];
  freightLoads: FreightLoad[];
  rfqs: B2BQuotationRequest[];
  disputes: DisputeRecord[];
  notifications: EcosystemNotification[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartWeightKg: number;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  lowDataMode: boolean;
  setLowDataMode: (enabled: boolean) => void;
  createOrder: (data: {
    destinationProvince: string;
    destinationMunicipality: string;
    destinationAddress: string;
    paymentMethod: PaymentMethod;
    deliveryNotes?: string;
  }) => Order;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  confirmDeliveryWithOtp: (orderId: string, enteredOtp: string) => { success: boolean; message: string };
  addNewProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Product;
  updateProductStock: (productId: string, newStock: number) => void;
  acceptFreightLoad: (loadId: string, driverId: string) => void;
  createRfq: (rfqData: Omit<B2BQuotationRequest, 'id' | 'status' | 'createdAt'>) => void;
  respondToRfq: (rfqId: string, quotedPriceAOA: number) => void;
  openDispute: (data: Omit<DisputeRecord, 'id' | 'status' | 'createdAt'>) => void;
  resolveDispute: (disputeId: string, action: 'REFUND' | 'RELEASE', notes: string) => void;
  submitVerifiedReview: (productId: string, orderId: string, rating: number, comment: string) => { success: boolean; message: string };
  cancelOrderWithPolicy: (orderId: string, reason: string) => { success: boolean; message: string };
  blockSuspiciousEntity: (entityId: string, reason: string) => { success: boolean; message: string };
  formatKz: (val: number) => string;
  markNotificationAsRead: (notifId: string) => void;
  addNotification: (title: string, message: string, type: EcosystemNotification['type']) => void;
  validateInss: (query: string) => Promise<INSSValidationResult>;
  linkInssToProfile: (validationResult: INSSValidationResult, userConsent: boolean) => Promise<{ success: boolean; message: string }>;
  inssAuditLogs: INSSAuditLog[];
  refreshInssAuditLogs: () => Promise<void>;
  attemptInssModification: (payload: any) => Promise<any>;
  resetToOfficialData: () => void;
  clearAllTransactions: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_VERSION_KEY = 'ao_market_clean_prod_v6_real_firebase';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Utilizador Convidado',
  email: '',
  phone: '',
  role: 'buyer',
  entityType: 'PESSOA_SINGULAR',
  activeProfiles: ['BUYER'],
  province: 'Luanda',
  municipality: 'Luanda',
  address: '',
  verificationLevel: 1,
  isFormalized: false,
  reputationScore: 5.0,
  completedTransactions: 0,
  fulfillmentRate: 100,
  avgResponseTimeMin: 0,
  badge: 'Utilizador',
  joinedAt: new Date().toISOString().slice(0, 10)
};

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purge old test data versions immediately
  useEffect(() => {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (!currentVersion) {
      localStorage.removeItem('ao_market_products');
      localStorage.removeItem('ao_market_orders');
      localStorage.removeItem('ao_market_loads');
      localStorage.removeItem('ao_market_rfqs');
      localStorage.removeItem('ao_market_disputes');
      localStorage.removeItem('ao_market_cart');
      localStorage.removeItem('ao_market_users');
      localStorage.removeItem('ao_market_current_user');
      localStorage.removeItem('ao_market_is_authenticated');
      localStorage.setItem(STORAGE_VERSION_KEY, '6.0.0-clean-real-firebase');
    }
  }, []);

  // Registered Users pool
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ao_market_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Current User Profile & Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('ao_market_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_GUEST_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('ao_market_is_authenticated');
    return savedAuth !== null ? JSON.parse(savedAuth) : false;
  });

  const [selectedProvince, setSelectedProvince] = useState<string>('todas');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);

  // Entities with real cloud connection
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ao_market_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realOnly = parsed.filter((p: Product) => 
            p && p.id && 
            !p.id.startsWith('prod_milho') &&
            !p.id.startsWith('prod_soja') &&
            !p.id.startsWith('prod_mandioca') &&
            !p.id.startsWith('prod_cafe') &&
            !p.id.startsWith('prod_cimento') &&
            !p.id.startsWith('prod_feijao') &&
            !p.id.startsWith('prod_tomate') &&
            !p.id.startsWith('prod_banana') &&
            !p.id.startsWith('prod_carne') &&
            !p.id.startsWith('prod_peixe') &&
            !p.id.startsWith('prod_mel') &&
            !p.id.startsWith('prod_demo') &&
            !(p.images && p.images.some(img => typeof img === 'string' && (img.includes('unsplash.com') || img.includes('via.placeholder') || img.includes('picsum.photos'))))
          );
          return realOnly;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ao_market_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [freightLoads, setFreightLoads] = useState<FreightLoad[]>(() => {
    const saved = localStorage.getItem('ao_market_loads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [rfqs, setRfqs] = useState<B2BQuotationRequest[]>(() => {
    const saved = localStorage.getItem('ao_market_rfqs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem('ao_market_disputes');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ao_market_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<EcosystemNotification[]>([]);

  // Sync API Client token with active user
  useEffect(() => {
    if (currentUser && currentUser.id) {
      api.setAuthToken(currentUser.id);
    }
  }, [currentUser]);

  // Real-time Firestore synchronization
  useEffect(() => {
    // 1. Subscribe to Products
    const unsubProducts = FirestoreSyncService.subscribeToProducts((cloudProducts) => {
      setProducts(cloudProducts);
    });

    // 2. Subscribe to Orders
    const unsubOrders = FirestoreSyncService.subscribeToOrders((cloudOrders) => {
      setOrders(cloudOrders);
    });

    // 3. Subscribe to Users
    const unsubUsers = FirestoreSyncService.subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setRegisteredUsers(cloudUsers);
      }
    });

    // 4. Subscribe to Freight loads
    const unsubFreight = FirestoreSyncService.subscribeToFreightLoads((cloudLoads) => {
      setFreightLoads(cloudLoads);
    });

    // 5. Subscribe to RFQs
    const unsubRfqs = FirestoreSyncService.subscribeToRfqs((cloudRfqs) => {
      setRfqs(cloudRfqs);
    });

    // 6. Subscribe to Disputes
    const unsubDisputes = FirestoreSyncService.subscribeToDisputes((cloudDisputes) => {
      setDisputes(cloudDisputes);
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubUsers();
      unsubFreight();
      unsubRfqs();
      unsubDisputes();
    };
  }, []);

  // Sync to local storage for offline resilience
  useEffect(() => {
    localStorage.setItem('ao_market_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('ao_market_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ao_market_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ao_market_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ao_market_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ao_market_loads', JSON.stringify(freightLoads));
  }, [freightLoads]);

  useEffect(() => {
    localStorage.setItem('ao_market_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('ao_market_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('ao_market_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth Operations
  const login = (identifier: string, role?: UserRole): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const user = registeredUsers.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '') ||
      (u.nif && u.nif.toLowerCase() === cleanId) ||
      (u.biNumber && u.biNumber.toLowerCase() === cleanId) ||
      (role && u.role === role)
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      addNotification('Sessão Iniciada', `Bem-vindo(a), ${user.name}! Perfil ativo: ${user.role.toUpperCase()}.`, 'SECURITY');
      return true;
    }
    return false;
  };

  // Direct Admin login via 5-click secret gateway
  const loginAsAdminDirect = async (email: string, key?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    let adminUser = registeredUsers.find(u => u.role === 'admin' && (u.email.toLowerCase() === cleanEmail || cleanEmail === 'admin@aomarket.ao'));
    
    if (!adminUser) {
      adminUser = {
        id: 'usr_admin_master',
        name: 'Administração Geral AO MARKET',
        email: cleanEmail || 'admin@aomarket.ao',
        phone: '+244 923 000 000',
        role: 'admin',
        province: 'Luanda',
        municipality: 'Luanda',
        address: 'Edifício Kilamba, Eixo Viário, Luanda, Angola',
        companyName: 'AO MARKET Governação & Supervisão S.A.',
        nif: '5001928374',
        biNumber: '003928174LA042',
        isFormalized: true,
        verificationLevel: 5,
        rating: 5.0,
        reviewCount: 0,
        completedTransactions: 0,
        fulfillmentRate: 100,
        totalSalesAOA: 0,
        totalPurchasesAOA: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
        registrationStatus: 'ACTIVE',
        profileType: 'EMPRESA',
        actorType: 'BUYER',
        hasAcceptedTerms: true
      };
      setRegisteredUsers(prev => [...prev.filter(u => u.id !== adminUser!.id), adminUser!]);
    }
    
    setCurrentUser(adminUser);
    setIsAuthenticated(true);
    // Save admin profile to Firestore
    FirestoreSyncService.saveUser(adminUser);
    addNotification('Consola de Supervisão Desbloqueada', `Sessão administrativa iniciada para ${adminUser.name}.`, 'SECURITY');
    return true;
  };

  const registerUser = (userData: Partial<UserProfile> & { name: string; role: UserRole; phone: string; province: string; municipality: string }): UserProfile => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '.')}@aomarket.ao`,
      phone: userData.phone,
      role: userData.role,
      province: userData.province,
      municipality: userData.municipality,
      address: userData.address || `${userData.municipality}, Província do ${userData.province}`,
      verificationLevel: userData.isFormalized ? 4 : 2,
      isFormalized: !!userData.isFormalized,
      inssNumber: userData.inssNumber || (userData.isFormalized ? `INSS-${Math.floor(100000 + Math.random() * 900000)}-AO` : undefined),
      nif: userData.nif || `${Math.floor(5000000000 + Math.random() * 900000000)}`,
      biNumber: userData.biNumber || `00${Math.floor(1000000 + Math.random() * 9000000)}HA042`,
      reputationScore: 5.0,
      completedTransactions: 0,
      fulfillmentRate: 100,
      avgResponseTimeMin: 15,
      companyName: userData.companyName || (userData.role === 'producer' ? `Fazenda ${userData.name}` : undefined),
      joinedAt: new Date().toISOString().slice(0, 10),
      badge: userData.isFormalized ? 'Produtor Certificado Nível 4' : 'Novo Membro Registado'
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    // Real-time Firestore sync
    FirestoreSyncService.saveUser(newUser);

    addNotification(
      'Registo de Conta Concluído',
      `Conta criada para ${newUser.name} na Província do ${newUser.province}. Acesso institucional desbloqueado.`,
      'FORMALIZATION'
    );
    return newUser;
  };

  const registerEnhancedUser = (profile: UserProfile): UserProfile => {
    let trustLevel: VerificationLevel = profile.verificationLevel || 2;
    if (profile.documents && profile.documents.length > 0) {
      trustLevel = 3;
    }
    if (profile.documents && profile.documents.some(d => d.status === 'APROVADO')) {
      trustLevel = 4;
    }

    const enhancedUser: UserProfile = {
      ...profile,
      id: profile.id || `usr_${Date.now()}`,
      verificationLevel: trustLevel,
      joinedAt: profile.joinedAt || new Date().toISOString().slice(0, 10),
      reputationScore: profile.reputationScore || 5.0,
      completedTransactions: profile.completedTransactions || 0,
      fulfillmentRate: profile.fulfillmentRate || 100,
      avgResponseTimeMin: profile.avgResponseTimeMin || 15,
      trustBadge: profile.trustBadge || {
        currentLevel: trustLevel,
        levelTitle: trustLevel === 1 ? 'Conta Criada' : trustLevel === 2 ? 'Contacto Confirmado' : trustLevel === 3 ? 'Identidade Verificada' : 'Atividade Verificada',
        verifiedPoints: [
          `Telemóvel Nacional (+244) Validado`,
          `Localização Geográfica (${profile.province}) Registada`,
          ...(profile.biNumber ? ['Bilhete de Identidade Declarado'] : []),
          ...(profile.nif ? ['NIF Declarado'] : []),
          ...(profile.socialProtection?.status === 'INSCRITO' ? ['Regime INSS Informado'] : [])
        ],
        nextRequirements: ['Aguardar análise dos documentos pela supervisão institucional'],
        issuedAt: new Date().toISOString().slice(0, 10)
      }
    };

    setRegisteredUsers(prev => [enhancedUser, ...prev.filter(u => u.id !== enhancedUser.id)]);
    setCurrentUser(enhancedUser);
    setIsAuthenticated(true);
    // Real-time Firestore sync
    FirestoreSyncService.saveUser(enhancedUser);

    addNotification(
      'Identidade Digital Ativa',
      `Registo concluído com sucesso para ${enhancedUser.name}. Bem-vindo ao AO MARKET!`,
      'SECURITY'
    );
    return enhancedUser;
  };

  const addProfileToCurrentUser = (newProfile: ActorProfileType, profileSpecificData?: any) => {
    setCurrentUser(prev => {
      const existingProfiles = prev.activeProfiles || [
        prev.role === 'producer' ? 'PRODUCER' : prev.role === 'merchant' ? 'MERCHANT' : prev.role === 'driver' ? 'TRANSPORTER' : 'BUYER'
      ];
      const updatedProfiles = Array.from(new Set([...existingProfiles, newProfile])) as ActorProfileType[];

      let updatedUser = {
        ...prev,
        activeProfiles: updatedProfiles
      };

      if (newProfile === 'PRODUCER' && profileSpecificData) {
        updatedUser.producerData = profileSpecificData;
      } else if (newProfile === 'MERCHANT' && profileSpecificData) {
        updatedUser.merchantData = profileSpecificData;
      } else if (newProfile === 'TRANSPORTER' && profileSpecificData) {
        updatedUser.transporterData = profileSpecificData;
      } else if (newProfile === 'BUYER' && profileSpecificData) {
        updatedUser.buyerData = profileSpecificData;
      }

      setRegisteredUsers(rUsers => rUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      FirestoreSyncService.saveUser(updatedUser);
      return updatedUser;
    });

    addNotification('Novo Perfil de Atuação Ativado', `Adicionou com sucesso a modalidade ${newProfile} à sua conta.`, 'SECURITY');
  };

  const uploadUserDocument = (userId: string, docData: Omit<UserDocument, 'id' | 'uploadDate' | 'status'>) => {
    const newDoc: UserDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: 'EM_ANALISE'
    };

    const updater = (user: UserProfile): UserProfile => {
      const currentDocs = user.documents || [];
      const updatedDocs = [...currentDocs, newDoc];
      let newLevel = user.verificationLevel;
      if (newLevel < 3) newLevel = 3;

      const updated = {
        ...user,
        verificationLevel: newLevel,
        documents: updatedDocs
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }

    addAuditLog(userId, `Documento Submetido: ${newDoc.label}`, `Ficheiro: ${newDoc.fileName}`);
    addNotification('Documento Submetido', `O documento "${newDoc.label}" foi enviado e está em análise.`, 'SECURITY');
  };

  const replaceUserDocument = (userId: string, docId: string, newFile: { fileName: string; fileSizeKb: number; fileMimeType: string }) => {
    const updater = (user: UserProfile): UserProfile => {
      const currentDocs = user.documents || [];
      const updatedDocs = currentDocs.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            fileName: newFile.fileName,
            fileSizeKb: newFile.fileSizeKb,
            fileMimeType: newFile.fileMimeType,
            status: 'EM_ANALISE' as DocumentVerificationStatus,
            rejectionReason: undefined,
            uploadDate: new Date().toISOString().slice(0, 10)
          };
        }
        return d;
      });
      const updated = {
        ...user,
        documents: updatedDocs
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }

    addAuditLog(userId, 'Documento Reenviado para Análise', `Ficheiro: ${newFile.fileName}`);
    addNotification('Documento Reenviado', 'O documento atualizado foi submetido e está a ser analisado pela supervisão.', 'SECURITY');
  };

  const updateAccountStatus = (userId: string, status: AccountRegistrationStatus, reason?: string, missingDocs?: string[]) => {
    const updater = (user: UserProfile): UserProfile => {
      const prevStatus = user.accountStatus || 'PENDENTE';
      const newAudit: RegistrationAuditLog = {
        id: `audit_${Date.now()}`,
        action: `Estado da conta alterado para ${status}`,
        performedBy: currentUser?.name || 'Administração AO MARKET',
        userRole: currentUser?.role || 'admin',
        timestamp: new Date().toISOString(),
        notes: reason,
        previousStatus: prevStatus,
        newStatus: status
      };

      const updated = {
        ...user,
        accountStatus: status,
        accountStatusReason: reason || user.accountStatusReason,
        missingDocuments: missingDocs !== undefined ? missingDocs : user.missingDocuments,
        auditLogs: [newAudit, ...(user.auditLogs || [])]
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }

    addNotification(
      'Estado da Conta Atualizado',
      `O estado da conta foi alterado para: ${status}${reason ? ` (${reason})` : ''}.`,
      'SECURITY'
    );
  };

  const requestAdditionalDocuments = (userId: string, missingDocs: string[], notes: string) => {
    updateAccountStatus(userId, 'DOCUMENTACAO_PENDENTE', notes, missingDocs);
  };

  const addTeamMember = (companyUserId: string, member: Omit<CompanyTeamMember, 'id' | 'createdAt'>) => {
    const newMember: CompanyTeamMember = {
      ...member,
      id: `team_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const updater = (user: UserProfile): UserProfile => {
      const currentTeam = user.companyTeamMembers || [];
      const updated = {
        ...user,
        companyTeamMembers: [...currentTeam, newMember]
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === companyUserId ? updater(u) : u));
    if (currentUser.id === companyUserId) {
      setCurrentUser(prev => updater(prev));
    }

    addAuditLog(companyUserId, `Membro de Equipa Adicionado: ${member.name} (${member.role})`);
    addNotification('Membro de Equipa Adicionado', `${member.name} foi associado à equipa da empresa com perfil ${member.role}.`, 'SECURITY');
  };

  const removeTeamMember = (companyUserId: string, memberId: string) => {
    const updater = (user: UserProfile): UserProfile => {
      const currentTeam = user.companyTeamMembers || [];
      const updated = {
        ...user,
        companyTeamMembers: currentTeam.filter(m => m.id !== memberId)
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === companyUserId ? updater(u) : u));
    if (currentUser.id === companyUserId) {
      setCurrentUser(prev => updater(prev));
    }

    addAuditLog(companyUserId, `Membro de Equipa Removido: #${memberId}`);
  };

  const addAuditLog = (userId: string, action: string, notes?: string, previousStatus?: AccountRegistrationStatus, newStatus?: AccountRegistrationStatus) => {
    const newLog: RegistrationAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      performedBy: currentUser?.name || 'Sistema / Administrador',
      userRole: currentUser?.role || 'admin',
      timestamp: new Date().toISOString(),
      notes,
      previousStatus,
      newStatus
    };

    const updater = (user: UserProfile): UserProfile => {
      const updated = {
        ...user,
        auditLogs: [newLog, ...(user.auditLogs || [])]
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }
  };

  const updateDocumentStatus = (userId: string, docId: string, status: DocumentVerificationStatus, reason?: string) => {
    const updater = (user: UserProfile): UserProfile => {
      const currentDocs = user.documents || [];
      const updatedDocs = currentDocs.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status,
            rejectionReason: reason,
            verifiedAt: new Date().toISOString().slice(0, 10),
            verifiedBy: currentUser?.name || 'Supervisão Geral AO'
          };
        }
        return d;
      });

      const hasApprovedDocs = updatedDocs.some(d => d.status === 'APROVADO');
      let newLevel = user.verificationLevel;
      if (hasApprovedDocs && user.verificationLevel < 4) {
        newLevel = 4;
      }

      const allApproved = updatedDocs.length > 0 && updatedDocs.every(d => d.status === 'APROVADO');
      const nextAccStatus = allApproved && user.accountStatus === 'EM_ANALISE' ? 'ATIVO' : user.accountStatus;

      const newAudit: RegistrationAuditLog = {
        id: `audit_${Date.now()}`,
        action: `Documento #${docId} atualizado para ${status}`,
        performedBy: currentUser?.name || 'Supervisão Geral AO',
        userRole: currentUser?.role || 'admin',
        timestamp: new Date().toISOString(),
        notes: reason
      };

      const updated = {
        ...user,
        verificationLevel: newLevel,
        accountStatus: nextAccStatus,
        documents: updatedDocs,
        auditLogs: [newAudit, ...(user.auditLogs || [])]
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }

    addNotification(
      'Atualização de Documento',
      `Estado do documento atualizado para: ${status}.`,
      'SECURITY'
    );
  };

  const updateUserVerificationLevel = (userId: string, level: VerificationLevel) => {
    const updater = (user: UserProfile): UserProfile => {
      const updated = {
        ...user,
        verificationLevel: level,
        trustBadge: {
          currentLevel: level,
          levelTitle: level === 5 ? 'Histórico Soberano de Confiança' : level === 4 ? 'Atividade / Entidade Verificada' : level === 3 ? 'Identidade Verificada' : level === 2 ? 'Contacto Validado' : 'Conta Criada',
          verifiedPoints: user.trustBadge?.verifiedPoints || ['Validação Cadastral AO MARKET'],
          nextRequirements: level === 5 ? ['Manter excelência operacional'] : ['Completar auditoria documental'],
          issuedAt: new Date().toISOString().slice(0, 10)
        }
      };
      FirestoreSyncService.saveUser(updated);
      return updated;
    };

    setRegisteredUsers(prev => prev.map(u => u.id === userId ? updater(u) : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => updater(prev));
    }

    addNotification(
      'Nível de Confiança Atualizado',
      `O nível de confiança da conta foi atualizado para Nível ${level}.`,
      'SECURITY'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(DEFAULT_GUEST_USER);
    addNotification('Sessão Encerrada', 'Terminou a sua sessão no AO MARKET com segurança.', 'SECURITY');
  };

  const resetToOfficialData = async () => {
    setProducts([]);
    setOrders([]);
    setFreightLoads([]);
    setRfqs([]);
    setDisputes([]);
    setCart([]);
    setRegisteredUsers([]);
    setCurrentUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(false);
    
    // Clear Firestore
    await FirestoreSyncService.clearAllCloudData();

    localStorage.setItem('ao_market_products', JSON.stringify([]));
    localStorage.setItem('ao_market_orders', JSON.stringify([]));
    localStorage.setItem('ao_market_loads', JSON.stringify([]));
    localStorage.setItem('ao_market_rfqs', JSON.stringify([]));
    localStorage.setItem('ao_market_disputes', JSON.stringify([]));
    localStorage.setItem('ao_market_cart', JSON.stringify([]));
    localStorage.setItem('ao_market_users', JSON.stringify([]));
    localStorage.setItem('ao_market_current_user', JSON.stringify(DEFAULT_GUEST_USER));
    localStorage.setItem('ao_market_is_authenticated', JSON.stringify(false));
    addNotification('Base de Dados Limpa', 'Todos os dados foram resetados na base de dados Firebase.', 'SECURITY');
  };

  const clearAllTransactions = () => {
    setOrders([]);
    setFreightLoads([]);
    setRfqs([]);
    setDisputes([]);
    setCart([]);
    localStorage.setItem('ao_market_orders', JSON.stringify([]));
    localStorage.setItem('ao_market_loads', JSON.stringify([]));
    localStorage.setItem('ao_market_rfqs', JSON.stringify([]));
    localStorage.setItem('ao_market_disputes', JSON.stringify([]));
    localStorage.setItem('ao_market_cart', JSON.stringify([]));
    addNotification('Transações Limpas', 'Todas as ordens e fretes foram limpos.', 'ORDER');
  };

  const switchRole = (role: UserRole) => {
    const found = registeredUsers.find(p => p.role === role);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      addNotification('Perfil Selecionado', `Perfil ativo: ${found.name} (${found.role.toUpperCase()})`, 'SECURITY');
    } else {
      setCurrentUser(prev => ({
        ...prev,
        role,
        activeProfiles: Array.from(new Set([...(prev.activeProfiles || []), role === 'producer' ? 'PRODUCER' : role === 'merchant' ? 'MERCHANT' : role === 'driver' ? 'TRANSPORTER' : 'BUYER'])) as ActorProfileType[]
      }));
    }
  };

  const addNotification = (title: string, message: string, type: EcosystemNotification['type']) => {
    const newNotif: EcosystemNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: 'Agora'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addNotification('Produto Adicionado ao Carrinho', `${product.title} (${quantity} un)`, 'ORDER');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    let unitPrice = item.product.price;
    if (item.product.bulkPricingTiers && item.product.bulkPricingTiers.length > 0) {
      const tiers = [...item.product.bulkPricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
      for (const tier of tiers) {
        if (item.quantity >= tier.minQuantity) {
          unitPrice = tier.pricePerUnit;
          break;
        }
      }
    }
    return sum + (unitPrice * item.quantity);
  }, 0);

  const cartWeightKg = cart.reduce((sum, item) => {
    return sum + ((item.product.weightKgPerUnit || 1) * item.quantity);
  }, 0);

  const createOrder = (data: {
    destinationProvince: string;
    destinationMunicipality: string;
    destinationAddress: string;
    paymentMethod: PaymentMethod;
    deliveryNotes?: string;
  }): Order => {
    const orderItems = cart.map(item => {
      let unitPrice = item.product.price;
      if (item.product.bulkPricingTiers && item.product.bulkPricingTiers.length > 0) {
        const tiers = [...item.product.bulkPricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
        for (const tier of tiers) {
          if (item.quantity >= tier.minQuantity) {
            unitPrice = tier.pricePerUnit;
            break;
          }
        }
      }
      return {
        productId: item.product.id,
        title: item.product.title,
        price: unitPrice,
        quantity: item.quantity,
        unit: item.product.unit,
        weightKg: (item.product.weightKgPerUnit || 1) * item.quantity,
        image: item.product.images[0],
        producerId: item.product.producerId,
        producerName: item.product.producerName
      };
    });

    const primaryOriginProvince = cart[0]?.product.originProvince || 'huambo';
    const primaryOriginMunicipality = cart[0]?.product.originMunicipality || 'Bailundo';
    const primaryProducer = cart[0]?.product.producerName || 'Produtor Nacional Certificado';

    const freightEst = calculateFreightEstimate(primaryOriginProvince, data.destinationProvince, cartWeightKg);
    const serviceFee = Math.round(cartSubtotal * 0.015);
    const total = cartSubtotal + freightEst.estimatedCostAOA + serviceFee;

    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: `ORD-AO-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      items: orderItems,
      subtotal: cartSubtotal,
      freightCost: freightEst.estimatedCostAOA,
      serviceFee,
      total,
      status: 'PAID',
      paymentMethod: data.paymentMethod,
      paymentReference: `MCX-${Date.now().toString().slice(-6)}`,
      isPaymentEscrowed: true,
      destinationProvince: data.destinationProvince,
      destinationMunicipality: data.destinationMunicipality,
      destinationAddress: data.destinationAddress,
      deliveryNotes: data.deliveryNotes,
      pickupOtpCode: pickupOtp,
      deliveryOtpCode: deliveryOtp,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isB2B: cart.some(i => i.quantity >= 20),
      timeline: [
        {
          status: 'CREATED',
          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          description: 'Ordem de compra emitida na plataforma oficial AO MARKET.'
        },
        {
          status: 'PAID',
          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          description: `Pagamento de ${formatKz(total)} garantido sob custódia bancária regulada AO Protect.`
        }
      ]
    };

    const newFreightLoad: FreightLoad = {
      id: `CARGA-${primaryOriginProvince.slice(0, 2).toUpperCase()}-${data.destinationProvince.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: newOrder.id,
      originProvince: primaryOriginProvince,
      originMunicipality: primaryOriginMunicipality,
      originAddress: `${primaryProducer} (Ponto de Embarque)`,
      destinationProvince: data.destinationProvince,
      destinationMunicipality: data.destinationMunicipality,
      destinationAddress: data.destinationAddress,
      cargoDescription: `${orderItems.length} lote(s) agro-industriais (${cartWeightKg} kg)`,
      totalWeightKg: cartWeightKg,
      totalVolumeM3: cartWeightKg * 0.003,
      requiresColdChain: cart.some(i => i.product.requiresRefrigeration),
      recommendedVehicle: cartWeightKg > 1000 ? 'CAMIAO_3_5T' : (cartWeightKg > 100 ? 'CARRINHA_CANTER' : 'MOTO_KUPAPATA'),
      suggestedFreightAOA: freightEst.estimatedCostAOA,
      distanceKm: freightEst.distanceKm,
      status: 'PENDING_ACCEPTANCE',
      urgency: 'NORMAL',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setOrders(prev => [newOrder, ...prev]);
    setFreightLoads(prev => [newFreightLoad, ...prev]);
    clearCart();

    // Sync directly to Firebase Firestore
    FirestoreSyncService.saveOrder(newOrder);
    FirestoreSyncService.saveFreightLoad(newFreightLoad);

    addNotification(
      'Ordem Registada & Carga Alocada',
      `Ordem #${newOrder.id} no valor de ${formatKz(total)}. AO Logistics já notificou os transportadores certificados.`,
      'ORDER'
    );

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (currentUser.role !== 'admin') {
      const transCheck = checkOrderStateTransition(currentUser, targetOrder, nextStatus);
      if (!transCheck.allowed) {
        addNotification('Transição Bloqueada (RBAC)', transCheck.reason || `Não está autorizado a alterar o estado para ${nextStatus}.`, 'SECURITY');
        return;
      }
    }

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const descMap: Record<OrderStatus, string> = {
        CREATED: 'Ordem emitida no sistema.',
        PAYMENT_PENDING: 'Aguardando confirmação bancária.',
        PAID: 'Fundos retidos em custódia regulada AO Protect.',
        ACCEPTED: 'Produtor confirmou o lote e iniciou preparação.',
        PREPARING: 'Produtos em fase de pesagem, rotulagem e controlo de qualidade.',
        READY_FOR_PICKUP: 'Carga pronta no armazém/fazenda para recolha.',
        DRIVER_ASSIGNED: 'Transportador certificado alocado para a rota.',
        PICKED_UP: `Carga recolhida mediante validação do PIN #${order.pickupOtpCode}.`,
        IN_TRANSIT: 'Carga em circulação no corredor rodoviário com rastreio ativo.',
        DELIVERED: `Entrega concluída. PIN #${order.deliveryOtpCode} validado com sucesso.`,
        COMPLETED: 'Transação liquidada. Fundos transferidos ao produtor e transportador.',
        DISPUTED: 'Disputa instaurada. Pagamento sob mediação AO Protect.',
        CANCELLED: 'Ordem cancelada.',
        REFUNDED: 'Montante reembolsado integralmente ao comprador.'
      };

      const newTimeline = [
        ...order.timeline,
        {
          status: nextStatus,
          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          description: descMap[nextStatus] || `Estado atualizado para ${nextStatus}`
        }
      ];

      const updatedOrder: Order = {
        ...order,
        status: nextStatus,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        timeline: newTimeline
      };

      // Sync updated order to Firestore
      FirestoreSyncService.saveOrder(updatedOrder);

      return updatedOrder;
    }));

    addNotification(
      `Atualização da Ordem #${orderId}`,
      `Estado: ${nextStatus}.`,
      'DELIVERY'
    );
  };

  const confirmDeliveryWithOtp = (orderId: string, enteredOtp: string): { success: boolean; message: string } => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Ordem não encontrada.' };

    if (order.deliveryOtpCode.trim() !== enteredOtp.trim()) {
      return { success: false, message: 'Código PIN OTP incorreto. Solicite o código ao comprador no ato da entrega física.' };
    }

    advanceOrderStatus(orderId, 'DELIVERED');
    setTimeout(() => {
      advanceOrderStatus(orderId, 'COMPLETED');
    }, 1200);

    return { success: true, message: 'Entrega confirmada com sucesso! Fundos da custódia libertados ao produtor e pontuação de confiança creditada.' };
  };

  const addNewProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Product => {
    const allowed = hasPermission(currentUser, 'products:create');
    if (!allowed) {
      addNotification('Ação Bloqueada (RBAC)', 'O seu perfil não tem permissão para cadastrar produtos.', 'SECURITY');
      throw new Error('Sem permissão para cadastrar produtos.');
    }

    const newProd: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      producerId: currentUser.id,
      producerName: currentUser.name,
      rating: 5.0,
      reviewCount: 1
    };
    setProducts(prev => [newProd, ...prev]);
    // Save to real Firestore
    FirestoreSyncService.saveProduct(newProd);

    addNotification('Novo Lote Registado', `${newProd.title} (${newProd.availableStock} ${newProd.unit}) publicado com sucesso.`, 'ORDER');
    return newProd;
  };

  const updateProductStock = (productId: string, newStock: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const ownerCheck = checkProductOwnership(currentUser, product, 'stock');
      if (!ownerCheck.allowed) {
        addNotification('Acesso Negado (RBAC)', ownerCheck.reason || 'Não pode alterar o stock de produtos de outro produtor.', 'SECURITY');
        return;
      }
      const updated = { ...product, availableStock: newStock };
      FirestoreSyncService.saveProduct(updated);
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, availableStock: newStock } : p));
  };

  const acceptFreightLoad = (loadId: string, driverId: string) => {
    const driver = registeredUsers.find(d => d.id === driverId) || currentUser;
    const driverName = driver.name || 'Transportador Autorizado';
    const driverPhone = driver.phone || '+244 923 000 000';
    const vehiclePlate = driver.transporterData?.vehicles?.[0]?.licensePlate || 'LD-AO-2024';

    setFreightLoads(prev => prev.map(load => {
      if (load.id !== loadId) return load;
      const updatedLoad = {
        ...load,
        status: 'ASSIGNED' as const
      };
      FirestoreSyncService.saveFreightLoad(updatedLoad);
      return updatedLoad;
    }));

    const load = freightLoads.find(l => l.id === loadId);
    if (load) {
      setOrders(prev => prev.map(o => {
        if (o.id !== load.orderId) return o;
        const updatedOrder = {
          ...o,
          driverId: driver.id,
          driverName: driverName,
          driverPhone: driverPhone,
          vehiclePlate: vehiclePlate,
          status: 'DRIVER_ASSIGNED' as const
        };
        FirestoreSyncService.saveOrder(updatedOrder);
        return updatedOrder;
      }));
      advanceOrderStatus(load.orderId, 'DRIVER_ASSIGNED');
    }

    addNotification(
      'Carga Aceite no AO Logistics',
      `Transportador ${driverName} aceitou o frete de ${formatKz(load?.suggestedFreightAOA || 0)}.`,
      'DELIVERY'
    );
  };

  const createRfq = (rfqData: Omit<B2BQuotationRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRfq: B2BQuotationRequest = {
      ...rfqData,
      id: `RFQ-AO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ABERTO',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setRfqs(prev => [newRfq, ...prev]);
    FirestoreSyncService.saveRFQ(newRfq);
    addNotification('Pedido de Cotação B2B Submetido', `Cotação para ${newRfq.requestedQuantity} unidades de "${newRfq.productTitle}".`, 'B2B');
  };

  const respondToRfq = (rfqId: string, quotedPriceAOA: number) => {
    setRfqs(prev => prev.map(r => {
      if (r.id !== rfqId) return r;
      const updated = { ...r, status: 'RESPONDIDO' as const, quotedPriceAOA };
      FirestoreSyncService.saveRFQ(updated);
      return updated;
    }));
    addNotification('Cotação Respondida', `Preço proposto de ${formatKz(quotedPriceAOA)} por unidade.`, 'B2B');
  };

  const openDispute = (data: Omit<DisputeRecord, 'id' | 'status' | 'createdAt'>) => {
    const newDisp: DisputeRecord = {
      ...data,
      id: `DISP-AO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'EM_ANALISE',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setDisputes(prev => [newDisp, ...prev]);
    FirestoreSyncService.saveDispute(newDisp);
    advanceOrderStatus(data.orderId, 'DISPUTED');
    addNotification('Processo de Mediação Aberto no AO Protect', `Ordem #${data.orderId} entrou em conferência. Custódia retida preventivamente.`, 'SECURITY');
  };

  const resolveDispute = (disputeId: string, action: 'REFUND' | 'RELEASE', notes: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    const nextStatus = action === 'REFUND' ? 'RESOLVIDO_REEMBOLSO' : 'RESOLVIDO_LIBERACAO';
    setDisputes(prev => prev.map(d => {
      if (d.id !== disputeId) return d;
      const updated = { ...d, status: nextStatus as any, resolutionNotes: notes };
      FirestoreSyncService.saveDispute(updated);
      return updated;
    }));

    if (action === 'REFUND') {
      advanceOrderStatus(dispute.orderId, 'REFUNDED');
      addNotification('Disputa Resolvida', `Reembolso de ${formatKz(dispute.escrowHeldAmountAOA)} emitido ao comprador.`, 'SECURITY');
    } else {
      advanceOrderStatus(dispute.orderId, 'COMPLETED');
      addNotification('Disputa Resolvida', `Fundos de ${formatKz(dispute.escrowHeldAmountAOA)} libertados ao produtor/vendedor.`, 'SECURITY');
    }
  };

  const submitVerifiedReview = (productId: string, orderId: string, rating: number, comment: string): { success: boolean; message: string } => {
    if (!isAuthenticated) {
      return { success: false, message: 'Autenticação necessária para avaliar produtos.' };
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Regra de Avaliações: Apenas utilizadores que participaram numa transação podem avaliar.' };
    }

    if (order.buyerId !== currentUser.id && currentUser.role !== 'admin') {
      return { success: false, message: 'Regra de Avaliações: Apenas o comprador desta ordem tem legitimidade para avaliar.' };
    }

    if (order.status !== 'DELIVERED' && order.status !== 'COMPLETED') {
      return { success: false, message: 'Regra de Avaliações: O produto só pode ser avaliado após a receção física confirmada da encomenda.' };
    }

    const hasItem = order.items.some(item => item.product.id === productId);
    if (!hasItem) {
      return { success: false, message: 'Este produto não faz parte dos itens desta encomenda.' };
    }

    // Update product rating
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const prevTotal = p.rating * p.reviewCount;
      const newCount = p.reviewCount + 1;
      const newRating = Number(((prevTotal + rating) / newCount).toFixed(1));
      const updated = { ...p, rating: newRating, reviewCount: newCount };
      FirestoreSyncService.saveProduct(updated);
      return updated;
    }));

    addAuditLog(currentUser.id, 'REVIEW_SUBMITTED', `Avaliação verificada submetida com sucesso para o produto ${productId} (Ordem #${orderId}, Classificação: ${rating} estrelas)`);
    addNotification('Avaliação Registada', 'A sua avaliação foi verificada e associada com sucesso ao produto.', 'ORDER');
    return { success: true, message: 'Avaliação verificada registada com sucesso!' };
  };

  const cancelOrderWithPolicy = (orderId: string, reason: string): { success: boolean; message: string } => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Ordem não encontrada.' };

    const isParty = order.buyerId === currentUser.id || order.producerId === currentUser.id || currentUser.role === 'admin';
    if (!isParty) {
      return { success: false, message: 'Sem permissão para cancelar este pedido.' };
    }

    // Rule 11: Cancelamentos e reembolsos específicos por estado
    if (order.status === 'CREATED' || order.status === 'PAYMENT_PENDING' || order.status === 'PAID' || order.status === 'ACCEPTED') {
      advanceOrderStatus(orderId, 'CANCELLED');
      setTimeout(() => advanceOrderStatus(orderId, 'REFUNDED'), 500);
      addAuditLog(currentUser.id, 'ORDER_CANCELLED_AUTOMATIC', `Cancelamento aprovado em fase pré-expedição. Ordem: #${orderId}. Motivo: ${reason}`);
      return { success: true, message: 'Pedido cancelado com sucesso. O montante sob custódia foi reembolsado na totalidade.' };
    }

    if (order.status === 'PICKED_UP' || order.status === 'IN_TRANSIT' || order.status === 'DRIVER_ASSIGNED') {
      return { 
        success: false, 
        message: 'A carga já se encontra despachada em transporte rodoviário. O cancelamento requer abertura de processo de mediação na câmara AO Protect.' 
      };
    }

    if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
      return { 
        success: false, 
        message: 'Mercadoria já entregue. Para não conformidade de produto, instaure uma reclamação no AO Protect.' 
      };
    }

    return { success: false, message: 'Estado do pedido não permite cancelamento direto.' };
  };

  const blockSuspiciousEntity = (entityId: string, reason: string): { success: boolean; message: string } => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'support') {
      return { success: false, message: 'Apenas a Supervisão Oficial pode emitir bloqueios preventivos.' };
    }

    updateAccountStatus(entityId, 'SUSPENSO', reason);
    addAuditLog(entityId, 'FRAUD_SUSPENSION', `Entidade ${entityId} bloqueada preventivamente por suspeita de fraude/desintermediação. Motivo: ${reason}`);
    addNotification('Bloqueio Preventivo Emitido', `A conta ${entityId} foi suspensa para proteção do ecossistema.`, 'SECURITY');
    return { success: true, message: `Entidade ${entityId} suspensa preventivamente com sucesso.` };
  };

  // INSS
  const [inssAuditLogs, setInssAuditLogs] = useState<INSSAuditLog[]>(() => INSSOfficialService.getAuditLogs());

  const refreshInssAuditLogs = async () => {
    try {
      const logs = await api.getINSSAuditLogs();
      setInssAuditLogs(logs);
    } catch {
      setInssAuditLogs(INSSOfficialService.getAuditLogs());
    }
  };

  const validateInss = async (query: string): Promise<INSSValidationResult> => {
    return await api.validateINSS(query);
  };

  const linkInssToProfile = async (validationResult: INSSValidationResult, userConsent: boolean): Promise<{ success: boolean; message: string }> => {
    return await api.linkINSSProfile(validationResult, userConsent);
  };

  const attemptInssModification = async (payload: any): Promise<any> => {
    try {
      return await api.attemptINSSModification(payload);
    } catch (err: any) {
      refreshInssAuditLogs();
      throw err;
    }
  };

  const formatKz = (val: number): string => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(val).replace('AOA', 'Kz');
  };

  return (
    <MarketContext.Provider value={{
      currentUser,
      isAuthenticated,
      registeredUsers,
      login,
      loginAsAdminDirect,
      registerUser,
      registerEnhancedUser,
      addProfileToCurrentUser,
      uploadUserDocument,
      replaceUserDocument,
      updateDocumentStatus,
      updateUserVerificationLevel,
      updateAccountStatus,
      requestAdditionalDocuments,
      addTeamMember,
      removeTeamMember,
      addAuditLog,
      logout,
      switchRole,
      products,
      orders,
      freightLoads,
      rfqs,
      disputes,
      notifications,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartWeightKg,
      selectedProvince,
      setSelectedProvince,
      lowDataMode,
      setLowDataMode,
      createOrder,
      advanceOrderStatus,
      confirmDeliveryWithOtp,
      addNewProduct,
      updateProductStock,
      acceptFreightLoad,
      createRfq,
      respondToRfq,
      openDispute,
      resolveDispute,
      submitVerifiedReview,
      cancelOrderWithPolicy,
      blockSuspiciousEntity,
      formatKz,
      markNotificationAsRead,
      addNotification,
      validateInss,
      linkInssToProfile,
      inssAuditLogs,
      refreshInssAuditLogs,
      attemptInssModification,
      resetToOfficialData,
      clearAllTransactions
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
