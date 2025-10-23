import { useState, useCallback } from 'react';
import { uploadService } from '@/services/upload.service';

interface UseImageUploadOptions {
  folder?: string;
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

interface UseImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
  uploadAvatar: (file: File) => Promise<string | null>;
  clearError: () => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}): UseImageUploadReturn => {
  const { folder = 'images', onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file
      const validation = uploadService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const imageUrl = await uploadService.uploadImage(file, folder);
      onSuccess?.(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi upload ảnh';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [folder, onSuccess, onError]);

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file
      const validation = uploadService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const imageUrl = await uploadService.uploadAvatar(file);
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
    uploadImage,
    uploadAvatar,
    clearError,
  };
};
