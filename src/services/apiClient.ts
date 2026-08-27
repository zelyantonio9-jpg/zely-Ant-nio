import { 
  UserProfile, 
  Product, 
  Order, 
  FreightLoad, 
  ChatMessage, 
  DisintermediationAlert, 
  SecurityAuditEntry, 
  SecurityTestCase, 
  SecurityTestResult,
  OrderStatus 
} from '../types';

class ApiClient {
  private currentUserId: string = '';

  public setAuthToken(userId: string) {
    this.currentUserId = userId;
  }

  public getAuthToken(): string {
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.currentUserId) {
      headers.set('Authorization', `Bearer ${this.currentUserId}`);
      headers.set('x-user-id', this.currentUserId);
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    const res = await fetch(endpoint, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorObj = new Error(data.error || `HTTP error ${res.status}`);
      (errorObj as any).status = res.status;
      (errorObj as any).errorCode = data.errorCode;
      (errorObj as any).payload = data;
      throw errorObj;
    }

    return data as T;
  }

  // Auth & Profiles
  async getMe(): Promise<{ authenticated: boolean; user?: UserProfile; permissions: string[] }> {
    return this.request('/api/auth/me');
  }

  async login(identifier: string): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const data = await this.request<{ success: boolean; user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
    if (data.token) {
      this.setAuthToken(data.token);
    }
    return data;
  }

  async register(userData: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const data = await this.request<{ success: boolean; user: UserProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) {
      this.setAuthToken(data.token);
    }
    return data;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    return this.request('/api/auth/users');
  }

  async updateUserStatus(userId: string, status: string, reason?: string): Promise<{ success: boolean; user: UserProfile }> {
    return this.request(`/api/auth/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason })
    });
  }

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/auth/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request('/api/products');
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return this.request(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/products/${productId}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request('/api/orders');
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request(`/api/orders/${orderId}`);
  }

  async createOrder(orderData: any): Promise<Order> {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(orderId: string, nextStatus: OrderStatus, description?: string): Promise<{ success: boolean; order: Order }> {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ nextStatus, description })
    });
  }

  // Transport
  async getFreightLoads(): Promise<FreightLoad[]> {
    return this.request('/api/transport/freights');
  }

  async acceptFreightLoad(loadId: string): Promise<{ success: boolean; load: FreightLoad; order?: Order }> {
    return this.request(`/api/transport/freights/${loadId}/accept`, {
      method: 'POST'
    });
  }

  // Chat & Disintermediation
  async getChatMessages(conversationId?: string): Promise<ChatMessage[]> {
    const url = conversationId ? `/api/chat/messages?conversationId=${conversationId}` : '/api/chat/messages';
    return this.request(url);
  }

  async sendChatMessage(data: { recipientId: string; recipientName?: string; text: string; conversationId?: string; orderId?: string }): Promise<{ success: boolean; message: ChatMessage; flagged: boolean; alertDetails?: any }> {
    return this.request('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getFlaggedAlerts(): Promise<DisintermediationAlert[]> {
    return this.request('/api/chat/flagged-alerts');
  }

  // Company Team Multi-Tenant
  async getCompanyTeam(companyId: string): Promise<UserProfile[]> {
    return this.request(`/api/company/${companyId}/team`);
  }

  // Security Audit & Penetration Test Suite
  async getAuditLogs(): Promise<SecurityAuditEntry[]> {
    return this.request('/api/admin/audit-logs');
  }

  async getSecurityTestCatalog(): Promise<SecurityTestCase[]> {
    return this.request('/api/security/test-suite/catalog');
  }

  async runSecurityTestSuite(): Promise<{
    timestamp: string;
    totalTests: number;
    passedCount: number;
    failedCount: number;
    results: SecurityTestResult[];
  }> {
    return this.request('/api/security/test-suite/run', {
      method: 'POST'
    });
  }
}

export const api = new ApiClient();
