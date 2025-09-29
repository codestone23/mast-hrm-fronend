// Cookie management utilities
export class CookieManager {
  // Lấy cookie value
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  // Set cookie
  static setCookie(
    name: string, 
    value: string, 
    options: {
      days?: number;
      path?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      httpOnly?: boolean;
    } = {}
  ): void {
    if (typeof document === 'undefined') return;
    
    const {
      days = 7,
      path = '/',
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
      httpOnly = false,
    } = options;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieString = [
      `${name}=${value}`,
      `expires=${expires.toUTCString()}`,
      `path=${path}`,
      secure ? 'secure' : '',
      `samesite=${sameSite}`,
      httpOnly ? 'httponly' : '',
    ].filter(Boolean).join('; ');
    
    document.cookie = cookieString;
  }

  // Xóa cookie
  static deleteCookie(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }

  // Xóa tất cả cookies
  static clearAllCookies(): void {
    if (typeof document === 'undefined') return;
    
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      this.deleteCookie(name);
    });
  }

  // Kiểm tra cookie có tồn tại không
  static hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  // Lấy tất cả cookies
  static getAllCookies(): Record<string, string> {
    if (typeof document === 'undefined') return {};
    
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }
}

export default CookieManager;
