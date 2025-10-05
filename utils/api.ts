import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';

// Helper function to extract data from API response
export const extractApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      message: (data as any)?.message || `HTTP Error ${status}`,
      code: (data as any)?.code || status.toString(),
      field: (data as any)?.field,
      details: (data as any)?.details,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Other error
    return {
      message: error.message || 'Có lỗi không xác định xảy ra',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// Helper function to create query string from object
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// Helper function to format date for API
export const formatDateForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper function to format datetime for API
export const formatDateTimeForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString(); // ISO 8601 format
};

// Helper function to parse API date
export const parseApiDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number (Vietnamese format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(chars.length));
  }
  return result;
};

// Helper function to debounce API calls
export const debounce = <T extends (...args: any[]) => any>( 
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Helper function to throttle API calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Helper function to retry API calls
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

// Helper function to check if error is network error
export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && error.request;
};

// Helper function to check if error is server error
export const isServerError = (error: AxiosError): boolean => {
  return error.response ? error.response.status >= 500 : false;
};

// Helper function to check if error is client error
export const isClientError = (error: AxiosError): boolean => {
  return error.response ? error.response.status >= 400 && error.response.status < 500 : false;
};

// Helper function to get error message for display
export const getErrorMessage = (error: AxiosError): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

// Helper function to check if response is successful
export const isSuccessfulResponse = (response: AxiosResponse): boolean => {
  return response.status >= 200 && response.status < 300;
};
