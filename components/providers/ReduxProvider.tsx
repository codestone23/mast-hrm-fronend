'use client';

import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store';
import { loadUserFromStorage, fetchUserData } from '@/store/slices/userSlice';
import LocalStorageUtil, { LOCAL_KEY } from '@/utils/LocalStorageUtil';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  useEffect(() => {
    const initializeUser = async () => {
      // Try to load from localStorage first
      const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
      
      if (userData) {
        // If have data in localStorage, load it
        await store.dispatch(loadUserFromStorage());
      } else {
        // If no data in localStorage, fetch from API
        // Try to call API regardless of authService check
        try {
          await store.dispatch(fetchUserData()).unwrap();
        } catch (error) {
          console.error('ReduxProvider: Failed to fetch user data:', error);
        }
      }
    };

    initializeUser();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
