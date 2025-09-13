const API_BASE_URL = 'http://localhost:5001';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error: Unable to connect to server');
    }
  }

  // Dashboard API
  async getDashboardData() {
    return this.request('/admin/dashboard');
  }

  // Users API
  async getUsers(page = 1, perPage = 10) {
    return this.request(`/admin/users?page=${page}&per_page=${perPage}`);
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }) {
    return this.request('/admin/users', {
      method: 'PUT',
      body: JSON.stringify({ id: userId, ...userData }),
    });
  }

  async deleteUser(userId: number) {
    return this.request(`/admin/users?id=${userId}`, {
      method: 'DELETE',
    });
  }

  // Plans API
  async getPlans() {
    return this.request('/admin/plans');
  }

  async createPlan(planData: {
    name: string;
    description: string;
    monthly_price: number;
    monthly_quota_gb: number;
    is_active: boolean;
  }) {
    return this.request('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(planId: number, planData: {
    name?: string;
    description?: string;
    monthly_price?: number;
    monthly_quota_gb?: number;
    is_active?: boolean;
  }) {
    return this.request('/admin/plans', {
      method: 'PUT',
      body: JSON.stringify({ id: planId, ...planData }),
    });
  }

  async deletePlan(planId: number) {
    return this.request(`/admin/plans?id=${planId}`, {
      method: 'DELETE',
    });
  }

  // Subscriptions API
  async getSubscriptions() {
    return this.request('/admin/subscriptions');
  }

  // Analytics API
  async getAnalytics() {
    return this.request('/admin/analytics');
  }

  // Alerts API
  async getAlerts() {
    return this.request('/admin/alerts');
  }

  async markAlertAsRead(alertId: number) {
    return this.request('/admin/alerts', {
      method: 'PUT',
      body: JSON.stringify({ id: alertId }),
    });
  }

  // Login API
  async login(credentials: { email: string; password: string }) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Discount Management API
  async getDiscounts(page = 1, perPage = 10) {
    return this.request(`/admin/discounts?page=${page}&per_page=${perPage}`);
  }

  async createDiscount(discountData: {
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_amount?: number;
    max_discount?: number;
    usage_limit?: number;
    is_active: boolean;
    valid_from?: string;
    valid_until?: string;
    plan_id?: number;
  }) {
    return this.request('/admin/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  }

  async updateDiscount(discountId: number, discountData: {
    code?: string;
    description?: string;
    discount_type?: string;
    discount_value?: number;
    min_amount?: number;
    max_discount?: number;
    usage_limit?: number;
    is_active?: boolean;
    valid_from?: string;
    valid_until?: string;
    plan_id?: number;
  }) {
    return this.request('/admin/discounts', {
      method: 'PUT',
      body: JSON.stringify({ id: discountId, ...discountData }),
    });
  }

  async deleteDiscount(discountId: number) {
    return this.request(`/admin/discounts?id=${discountId}`, {
      method: 'DELETE',
    });
  }

  // Enhanced User Management API
  async getDetailedUsers(page = 1, perPage = 10, search = '', role = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search }),
      ...(role && { role }),
    });
    return this.request(`/admin/users/detailed?${params}`);
  }

  // Enhanced Analytics API
  async getDetailedAnalytics() {
    return this.request('/admin/analytics/detailed');
  }
}

export const apiService = new ApiService();
