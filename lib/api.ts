import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.129.1:8080/api'; // Your Spring Boot backend

// Types matching your backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  role: 'EMPLOYER' | 'CLEANER';
  avatarUrl?: string;
  location?: string;
  phoneVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: UserResponse;
  expiresAt: string;
}

export interface CleanerProfile {
  id: string;
  userId: string;
  available: boolean;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
  description?: string;
  services?: string[];
  // Add other fields according to your CleanerProfile entity
}

class ZelareApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  // Token management
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // === AUTHENTICATION METHODS ===

  async register(userData: {
    phoneNumber: string;
    fullName: string;
    role: 'EMPLOYER' | 'CLEANER';
  }): Promise<ApiResponse<string>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async sendOtp(phoneNumber: string): Promise<ApiResponse<string>> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOtp(phoneNumber: string, otpCode: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otpCode }),
    });
    
    // Store token if verification is successful
    if (response.success && response.data.token) {
      await this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<string>> {
    try {
      const response = await this.request<string>('/auth/logout', {
        method: 'POST',
      });
      await this.removeToken();
      return response;
    } catch (error) {
      // Even if there's an error, remove local token
      await this.removeToken();
      throw error;
    }
  }

  // === USER METHODS ===

  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    return this.request('/user/profile');
  }

  async updateProfile(profileData: {
    fullName?: string;
    email?: string;
    location?: string;
    avatarUrl?: string;
  }): Promise<ApiResponse<UserResponse>> {
    // Filter out undefined values to send only defined fields
    const cleanData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value !== undefined)
    );
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(cleanData),
    });
  }

  // === CLEANER METHODS ===

  async getAvailableCleaners(): Promise<ApiResponse<CleanerProfile[]>> {
    return this.request('/cleaner/available');
  }

  async getCleanerProfile(): Promise<ApiResponse<CleanerProfile>> {
    return this.request('/cleaner/profile');
  }

  async updateCleanerAvailability(isAvailable: boolean): Promise<ApiResponse<string>> {
    return this.request('/cleaner/availability', {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  }

  // === UTILITY METHODS ===

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;
    
    try {
      const response = await this.getCurrentUser();
      return response.success;
    } catch (error) {
      await this.removeToken(); // Invalid token
      return false;
    }
  }
}

export const zelareApi = new ZelareApiService();