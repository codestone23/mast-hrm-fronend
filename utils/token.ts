// Token management utilities
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    httpOnly: false, // Cần false để client có thể đọc
  };

  // Lấy cookie value
  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  // Set cookie
  private static setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieString = [
      `${name}=${value}`,
      `expires=${expires.toUTCString()}`,
      `path=${this.COOKIE_OPTIONS.path}`,
      this.COOKIE_OPTIONS.secure ? 'secure' : '',
      `samesite=${this.COOKIE_OPTIONS.sameSite}`,
    ].filter(Boolean).join('; ');
    
    document.cookie = cookieString;
  }

  // Xóa cookie
  private static deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.COOKIE_OPTIONS.path};`;
  }

  // Lấy access token
  static getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken?: string): void {
    this.setCookie(this.ACCESS_TOKEN_KEY, accessToken, 1/24);
    
    // Refresh token - 7 ngày
    if (refreshToken) {
      this.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, 7);
    }
  }

  // Xóa tất cả tokens
  static clearTokens(): void {
    this.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
  }

  // Kiểm tra token có tồn tại không
  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  // Kiểm tra token có hết hạn không (basic check)
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return (payload.exp as number) < currentTime;
    } catch {
      return true; // Nếu không parse được thì coi như expired
    }
  }

  // Kiểm tra access token có hết hạn không
  static isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return this.isTokenExpired(token);
  }

  // Lấy thông tin từ token (payload)
  static getTokenPayload(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // Lấy thông tin user từ access token
  static getUserFromToken(): Record<string, unknown> | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const payload = this.getTokenPayload(token);
    return (payload?.user as Record<string, unknown>) || null;
  }

  // Kiểm tra token có hợp lệ không
  static isValidToken(token: string): boolean {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      const payload = this.getTokenPayload(token);
      return !!(payload && typeof payload === 'object');
    } catch {
      return false;
    }
  }

  // Lấy thời gian hết hạn của token
  static getTokenExpiration(token: string): Date | null {
    try {
      const payload = this.getTokenPayload(token);
      if (!payload || !payload.exp) return null;
      
      return new Date((payload.exp as number) * 1000);
    } catch {
      return null;
    }
  }

  // Kiểm tra token sắp hết hạn (trong vòng 5 phút)
  static isTokenExpiringSoon(token: string, minutes: number = 5): boolean {
    try {
      const payload = this.getTokenPayload(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Date.now() / 1000;
      const expirationTime = payload.exp as number;
      const timeUntilExpiry = expirationTime - currentTime;
      
      return timeUntilExpiry < (minutes * 60);
    } catch {
      return true;
    }
  }

  // Làm mới token tự động nếu cần
  static async refreshTokenIfNeeded(): Promise<string | null> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      return null;
    }

    // Nếu access token chưa hết hạn, trả về token hiện tại
    if (!this.isAccessTokenExpired()) {
      return accessToken;
    }

    // Nếu refresh token cũng hết hạn, xóa tất cả
    if (this.isTokenExpired(refreshToken)) {
      this.clearTokens();
      return null;
    }

    // Thực hiện refresh token thông qua API route
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Quan trọng để gửi cookies
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;
      
      this.setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return null;
    }
  }
}

export default TokenManager;
