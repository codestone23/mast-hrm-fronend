import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import TokenManager from '@/utils/token';
import { User } from "@/constants/types";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { convertUserToUserProfile } from "@/store/slices/userSlice";
import { clearDivisions } from "@/store/slices/divisionSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      if (authService.isAuthenticated()) {
        try {
          const fullUserData = await authService.getCurrentUser();
          if (fullUserData) {
            const userProfile = convertUserToUserProfile(fullUserData);
            LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
            setAuthState({
              user: fullUserData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        } catch (apiError) {
          console.error('Error fetching user from API:', apiError);
          // Fallback: lấy từ token nếu API call thất bại
        }

        const userFromToken = authService.getCurrentUserFromToken();
        if (userFromToken) {
          setAuthState({
            user: userFromToken as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
      }

      const newToken = await authService.refreshTokenIfNeeded();
      
      if (newToken) {
        // Sau khi refresh token, fetch user từ API
        try {
          const fullUserData = await authService.getCurrentUser();
          if (fullUserData) {
            const userProfile = convertUserToUserProfile(fullUserData);
            LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
            setAuthState({
              user: fullUserData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        } catch (apiError) {
          console.error('Error fetching user after token refresh:', apiError);
        }

        // Fallback: lấy từ token
        const userFromToken = authService.getCurrentUserFromToken();
        setAuthState({
          user: userFromToken as User,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Có lỗi xảy ra khi khởi tạo xác thực',
      });
    }
  }, []);
  

  // Đăng nhập
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login({ email, password });
      
      if (response) {
        const { access_token, refresh_token } = response;
        // Lưu tokens
        TokenManager.setTokens(access_token, refresh_token);
        
        // Fetch full user data từ API thay vì chỉ lấy từ token
        try {
          const fullUserData = await authService.getCurrentUser();
          if (fullUserData) {
            const userProfile = convertUserToUserProfile(fullUserData);
            LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
            setAuthState({
              user: fullUserData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Fallback: lấy từ token nếu API call thất bại
            const userFromToken = authService.getCurrentUserFromToken();
            setAuthState({
              user: userFromToken as User,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (userError) {
          console.error('Error fetching user after login:', userError);
          // Fallback: lấy từ token nếu API call thất bại
          const userFromToken = authService.getCurrentUserFromToken();
          setAuthState({
            user: userFromToken as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
        
        return { success: true, data: response };
      } else {
        throw new Error('Đăng nhập thất bại');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      TokenManager.clearTokens();
      LocalStorageUtil.removeItem(LOCAL_KEY.USER);
      LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
      LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
      dispatch(clearDivisions());
      
      await authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Vẫn xóa state local dù API call thất bại
      dispatch(clearDivisions());
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [dispatch]);

  // Làm mới thông tin user
  const refreshUser = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
        }));
        return;
      }

      const response = await authService.getCurrentUser();
      
      if (response) { 
        const userProfile = convertUserToUserProfile(response);
        LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
        setAuthState(prev => ({
          ...prev,
          user: response,
          isAuthenticated: true,
        }));
      }
    } catch (error) {
      await logout();
    }
  }, []);

  // Kiểm tra token sắp hết hạn và refresh nếu cần
  const checkAndRefreshToken = useCallback(async () => {
    try {
      if (authService.isTokenExpiringSoon(5)) { // 5 phút trước khi hết hạn
        const newToken = await authService.refreshTokenIfNeeded();
        
        if (newToken) {
          const userFromToken = authService.getCurrentUserFromToken();
          setAuthState(prev => ({
            ...prev,
            user: userFromToken as User,
            isAuthenticated: true,
          }));
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking/refreshing token:', error);
    }
  }, []);

  // Khởi tạo khi component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Kiểm tra token định kỳ
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, checkAndRefreshToken]);

  // Lắng nghe storage events để sync giữa các tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]);

  return {
    ...authState,
    login,
    logout,
    refreshUser,
    checkAndRefreshToken,
  };
};

export default useAuth;
