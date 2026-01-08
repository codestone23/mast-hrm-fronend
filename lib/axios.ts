import ROUTERS from "@/config/router";
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Cấu hình base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13322';

// let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Hàm xử lý queue khi refresh token hoàn thành
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Hàm refresh token
const refreshToken = async (): Promise<string | null> => {
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
    
    if (data.success && data.data) {
      const { accessToken } = data.data;
      return accessToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    // Xóa cookies khi refresh thất bại
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = ROUTERS.AUTH.LOGIN;
    }
    throw error;
  }
};

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      let accessToken = null;
      
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access_token' && value) {
          accessToken = value;
          break;
        }
      }
      
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     // Nếu đang refresh token, thêm request vào queue
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject });
    //     }).then(() => {
    //       // Không cần thêm token vào header vì sử dụng cookies
    //       return axiosInstance(originalRequest);
    //     }).catch((err) => {
    //       return Promise.reject(err);
    //     });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const newToken = await refreshToken();
    //     processQueue(null, newToken);
        
    //     // Không cần thêm token vào header vì sử dụng cookies
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     processQueue(refreshError, null);
    //     return Promise.reject(refreshError);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
