import { useState, useCallback } from 'react';
import profileService from '@/services/profile.service';

interface UseImageUploadOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

interface UseImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadAvatar: (file: File) => Promise<string | null>;
  clearError: () => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}): UseImageUploadReturn => {
  const { onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Use profileService to upload avatar
      const imageUrl = await profileService.uploadAvatarFile(file);
      onSuccess?.(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi upload avatar';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [onSuccess, onError]);

  return {
    isUploading,
    error,
    uploadAvatar,
    clearError,
  };
};
