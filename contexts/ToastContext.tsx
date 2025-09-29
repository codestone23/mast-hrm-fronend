'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, JSX } from 'react';
import ToastContainer from '@/components/ui/ToastContainer';
import { ToastData, ToastType, ToastAction } from '@/components/ui/Toast';

interface ToastContextType {
  // Basic toast methods
  showToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // Convenience methods
  success: (message: string, title?: string, options?: Partial<ToastData>) => string;
  error: (message: string, title?: string, options?: Partial<ToastData>) => string;
  warning: (message: string, title?: string, options?: Partial<ToastData>) => string;
  info: (message: string, title?: string, options?: Partial<ToastData>) => string;
  
  // Confirmation toast
  confirm: (
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    title?: string,
    options?: Partial<ToastData>
  ) => string;
  
  // Promise-based toast
  promiseToast: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: Partial<ToastData>
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5 
}): JSX.Element => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = generateId();
    const newToast: ToastData = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      // Keep only the last maxToasts
      return updated.slice(-maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((
    message: string, 
    title?: string, 
    options?: Partial<ToastData>
  ): string => {
    return showToast({
      type: 'success',
      title: title || '',
      message,
      ...options,
    });
  }, [showToast]);

  const error = useCallback((
    message: string, 
    title?: string, 
    options?: Partial<ToastData>
  ): string => {
    return showToast({
      type: 'error',
      title: title || '', 
      message,
      duration: 7000, // Longer duration for errors
      ...options,
    });
  }, [showToast]);

  const warning = useCallback((
    message: string, 
    title?: string, 
    options?: Partial<ToastData>
  ): string => {
    return showToast({
      type: 'warning',
      title: title || 'Cảnh báo',
      message,
      duration: 6000,
      ...options,
    });
  }, [showToast]);

  const info = useCallback((
    message: string, 
    title?: string, 
    options?: Partial<ToastData>
  ): string => {
    return showToast({
      type: 'info',
      title: title || 'Thông tin',
      message,
      ...options,
    });
  }, [showToast]);

  // Confirmation toast
  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string,
    options?: Partial<ToastData>
  ): string => {
    const actions: ToastAction[] = [
      {
        label: 'Hủy',
        onClick: () => {
          onCancel?.();
          removeToast(generateId());
        },
        variant: 'secondary',
      },
      {
        label: 'Xác nhận',
        onClick: () => {
          onConfirm();
          removeToast(generateId());
        },
        variant: 'primary',
      },
    ];

    return showToast({
      type: 'info',
      title: title || 'Xác nhận',
      message,
      actions,
      persistent: true,
      ...options,
    });
  }, [showToast, removeToast]);
  // Promise-based toast
  const promiseToast = useCallback(async <T,>(
    promiseToResolve: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: Partial<ToastData>
  ): Promise<T> => {
    const loadingId = showToast({
      type: 'info',
      title: messages.loading || 'Đang xử lý',
      message: messages.loading,
      persistent: true,
      ...options,
    });

    try {
      const result = await promiseToResolve;
      removeToast(loadingId);
      success(messages.success, undefined, options);
      return result;
    } catch (err) {
      removeToast(loadingId);
      const errorMessage = err instanceof Error ? err.message : messages.error;
      error(errorMessage, undefined, options);
      throw err;
    }
  }, [showToast, removeToast, success, error]);

  const contextValue: ToastContextType = {
    showToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    confirm,
    promiseToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
