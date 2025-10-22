import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '@/services/profile.service';

export interface UpdateProfileData {
  personal_email?: string;
  nationality?: string;
  gender?: string;
  marital?: string;
  birthday?: string;
  address?: string;
  temp_address?: string;
  phone?: string;
  expertise?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await profileService.updateProfile(data);
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};
