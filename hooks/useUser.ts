import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchUserData, loadUserFromStorage, clearUser, updateUser } from '@/store/slices/userSlice';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, isInitialized } = useAppSelector((state) => state.user);

  const refreshUser = () => {
    dispatch(fetchUserData());
  };

  const clearUserData = () => {
    dispatch(clearUser());
  };

  const updateUserData = (userData: Partial<typeof data>) => {
    if (userData) {
      dispatch(updateUser(userData));
    }
  };

  return {
    user: data,
    isLoading,
    error,
    isInitialized,
    refreshUser,
    clearUserData,
    updateUserData,
  };
};
