const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    preferredLanguage?: string;
    community?: string;
    zipCode?: string;
  }) {
    return this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request<{ message: string; user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Claims endpoints
  async getClaims(params?: {
    page?: number;
    limit?: number;
    status?: string;
    verdict?: string;
    language?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      claims: any[];
      pagination: any;
    }>(`/claims?${queryParams.toString()}`);
  }

  async getClaim(id: string) {
    return this.request<{ claim: any }>(`/claims/${id}`);
  }

  async submitClaim(claimData: {
    claim: string;
    language: string;
    community?: string;
  }) {
    return this.request<{ message: string; claim: any }>('/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  async getTrendingClaims() {
    return this.request<{ trendingClaims: any[] }>('/claims/trending');
  }

  async submitClaimFeedback(id: string, feedback: {
    rating?: number;
    comment?: string;
  }) {
    return this.request<{ message: string }>(`/claims/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async trackClaimShare(id: string) {
    return this.request<{ message: string }>(`/claims/${id}/share`, {
      method: 'POST',
    });
  }

  // Translations endpoints
  async getTranslations(params?: {
    page?: number;
    limit?: number;
    language?: string;
    category?: string;
    search?: string;
    verified?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      translations: any[];
      pagination: any;
    }>(`/translations?${queryParams.toString()}`);
  }

  async getTranslation(id: string) {
    return this.request<{ translation: any }>(`/translations/${id}`);
  }

  async getTranslationCategories() {
    return this.request<{ categories: any[] }>('/translations/categories');
  }

  async getTranslationStats() {
    return this.request<{ stats: any }>('/translations/stats/overview');
  }

  async submitTranslationFeedback(id: string, feedback: {
    helpful: boolean;
    comment?: string;
  }) {
    return this.request<{ message: string }>(`/translations/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  // Organizer endpoints
  async getOrganizerDashboard() {
    return this.request<{
      stats: any;
      topQuestions: any[];
      recentClaims: any[];
      analyticsData: any[];
    }>('/organizers/dashboard');
  }

  async getOrganizerClaims(params?: {
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      claims: any[];
      pagination: any;
    }>(`/organizers/claims?${queryParams.toString()}`);
  }

  async getContentLibrary() {
    return this.request<{ contentLibrary: any[] }>('/organizers/content-library');
  }

  async getAnalytics() {
    return this.request<{
      misinformationTopics: any[];
      languageStats: any[];
      communityEngagement: any[];
    }>('/organizers/analytics');
  }

  async reviewClaim(id: string, reviewData: {
    status: string;
    verdict?: string;
    explanation?: string;
    sources?: any[];
    priority?: string;
  }) {
    return this.request<{ message: string; claim: any }>(`/claims/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  // Ambassador endpoints
  async getAmbassadorToolkit() {
    return this.request<{
      user: any;
      leaderboard: any[];
      contentPacks: any[];
      trainingModules: any[];
    }>('/ambassadors/toolkit');
  }

  async trackContentDownload(contentId: number, contentType: string) {
    return this.request<{
      message: string;
      pointsAwarded: number;
      totalPoints: number;
    }>('/ambassadors/content/download', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType }),
    });
  }

  async sendInvitations(invitations: {
    emails: string[];
    message?: string;
  }) {
    return this.request<{
      message: string;
      pointsAwarded: number;
      totalPoints: number;
    }>('/ambassadors/invite', {
      method: 'POST',
      body: JSON.stringify(invitations),
    });
  }

  async submitSupportRequest(request: {
    subject: string;
    message: string;
    priority: string;
  }) {
    return this.request<{
      message: string;
      ticketId: string;
      estimatedResponse: string;
    }>('/ambassadors/support-request', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // User endpoints
  async getAmbassadorLeaderboard() {
    return this.request<{ ambassadors: any[] }>('/users/ambassadors/leaderboard');
  }

  async updateTrainingProgress(progress: {
    module: string;
    completed: boolean;
    progress: number;
  }) {
    return this.request<{
      message: string;
      trainingProgress: any[];
    }>('/users/training-progress', {
      method: 'PUT',
      body: JSON.stringify(progress),
    });
  }

  async updatePreferences(preferences: {
    notifications?: any;
    accessibility?: any;
  }) {
    return this.request<{
      message: string;
      preferences: any;
    }>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Help endpoints
  async getFAQ() {
    return this.request<{ faqData: any[] }>('/help/faq');
  }

  async getSMSShortcodes() {
    return this.request<{ smsShortcodes: any[] }>('/help/sms-shortcodes');
  }

  async getLanguages() {
    return this.request<{ languages: any[] }>('/help/languages');
  }

  async getPollingLocation(zipCode: string) {
    return this.request<{ pollingLocation: any }>(`/help/polling-location?zipCode=${zipCode}`);
  }

  async submitContactForm(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    language?: string;
  }) {
    return this.request<{
      message: string;
      ticketId: string;
      estimatedResponse: string;
    }>('/help/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Logout
  logout() {
    this.setToken(null);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;