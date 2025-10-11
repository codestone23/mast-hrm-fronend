import axiosInstance from '@/lib/axios';
import TokenManager from '@/utils/token';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types/api';
import { User } from "@/constants/types";

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('auth/login', credentials, {
      withCredentials: true,
    });
  
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post('auth/register', userData);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post('auth/logout');
      return response.data;
    } finally {
      TokenManager.clearTokens();
    }
  }

  async refreshToken(refreshData: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await axiosInstance.post('auth/refresh', refreshData);
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      TokenManager.setTokens(accessToken, refreshToken);
    }
    
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/forgot-password', data);
    return response.data;
  }
  
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/reset-password', data);
    return response.data;
  }

  async verifyOTP(otp: string, email: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/verify-otp', { otp, email });
    return response.data;
  }

  async resendOTP(email: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/resend-otp', { email });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.post('auth/me');
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/change-password', data);
    return response.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post('auth/verify-email', { token });
    return response.data;
  }

  isAuthenticated(): boolean {
    return TokenManager.hasTokens() && !TokenManager.isAccessTokenExpired();
  }

  getCurrentUserFromToken(): unknown {
    return TokenManager.getUserFromToken();
  }

  async refreshTokenIfNeeded(): Promise<string | null> {
    return await TokenManager.refreshTokenIfNeeded();
  }

  clearTokens(): void {
    TokenManager.clearTokens();
  }

  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = TokenManager.getAccessToken();
    if (!token) return true;
    return TokenManager.isTokenExpiringSoon(token, minutes);
  }
}

export const authService = new AuthService();
export default authService;
