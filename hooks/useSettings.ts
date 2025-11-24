import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import settingsService, { Skill, Language, Level, Position, ListParams } from '@/services/settings.service';
import { useToast } from '@/hooks/useToast';

// Skills
export const useSkills = (params?: ListParams) => {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => settingsService.getSkills(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSkillsInfinite = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['skills', 'infinite', search],
    queryFn: ({ pageParam = 1 }) => 
      settingsService.getSkills({ page: pageParam as number, limit: 10, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || lastPage.pagination?.page || 1;
      const currentPage = lastPage.pagination?.current_page || lastPage.pagination?.page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useSkillDetail = (skillId: string | number | null) => {
  return useQuery({
    queryKey: ['skill', skillId],
    queryFn: () => settingsService.getDetailSkill(skillId!),
    enabled: !!skillId,
  });
};

export const useSkillMutations = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (skill: { name: string; position_id: number }) => 
      settingsService.createSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      showSuccessToast('Kỹ năng đã được tạo thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi tạo kỹ năng';
      showErrorToast(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { name: string; position_id: number } }) => 
      settingsService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skill'] });
      showSuccessToast('Kỹ năng đã được cập nhật thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kỹ năng';
      showErrorToast(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => settingsService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      showSuccessToast('Kỹ năng đã được xóa thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa kỹ năng';
      showErrorToast(errorMessage);
    },
  });

  return {
    createSkill: createMutation.mutate,
    updateSkill: updateMutation.mutate,
    deleteSkill: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Languages
export const useLanguages = (params?: ListParams) => {
  return useQuery({
    queryKey: ['languages', params],
    queryFn: () => settingsService.getLanguages(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLanguagesInfinite = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['languages', 'infinite', search],
    queryFn: ({ pageParam = 1 }) => 
      settingsService.getLanguages({ page: pageParam as number, limit: 10, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || lastPage.pagination?.page || 1;
      const currentPage = lastPage.pagination?.current_page || lastPage.pagination?.page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useLanguageDetail = (languageId: string | number | null) => {
  return useQuery({
    queryKey: ['language', languageId],
    queryFn: () => settingsService.getDetailLanguage(languageId!),
    enabled: !!languageId,
  });
};

export const useLanguageMutations = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (language: { name: string; code: string; description?: string }) => 
      settingsService.createLanguage(language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      showSuccessToast('Ngôn ngữ đã được tạo thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi tạo ngôn ngữ';
      showErrorToast(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { name: string; code: string; description?: string } }) => 
      settingsService.updateLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      queryClient.invalidateQueries({ queryKey: ['language'] });
      showSuccessToast('Ngôn ngữ đã được cập nhật thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ngôn ngữ';
      showErrorToast(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => settingsService.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      showSuccessToast('Ngôn ngữ đã được xóa thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa ngôn ngữ';
      showErrorToast(errorMessage);
    },
  });

  return {
    createLanguage: createMutation.mutate,
    updateLanguage: updateMutation.mutate,
    deleteLanguage: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Levels
export const useLevels = (params?: ListParams) => {
  return useQuery({
    queryKey: ['levels', params],
    queryFn: () => settingsService.getLevels(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLevelsInfinite = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['levels', 'infinite', search],
    queryFn: ({ pageParam = 1 }) => 
      settingsService.getLevels({ page: pageParam as number, limit: 10, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || lastPage.pagination?.page || 1;
      const currentPage = lastPage.pagination?.current_page || lastPage.pagination?.page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useLevelDetail = (levelId: string | number | null) => {
  return useQuery({
    queryKey: ['level', levelId],
    queryFn: () => settingsService.getDetailLevel(levelId!),
    enabled: !!levelId,
  });
};

export const useLevelMutations = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (level: { name: string; level: number; description?: string }) => 
      settingsService.createLevel(level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      showSuccessToast('Cấp độ đã được tạo thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi tạo cấp độ';
      showErrorToast(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { name: string; level: number; description?: string } }) => 
      settingsService.updateLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      queryClient.invalidateQueries({ queryKey: ['level'] });
      showSuccessToast('Cấp độ đã được cập nhật thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật cấp độ';
      showErrorToast(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => settingsService.deleteLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      showSuccessToast('Cấp độ đã được xóa thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa cấp độ';
      showErrorToast(errorMessage);
    },
  });

  return {
    createLevel: createMutation.mutate,
    updateLevel: updateMutation.mutate,
    deleteLevel: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Positions
export const usePositions = (params?: ListParams) => {
  return useQuery({
    queryKey: ['positions', params],
    queryFn: () => settingsService.getPositions(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePositionsInfinite = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['positions', 'infinite', search],
    queryFn: ({ pageParam = 1 }) => 
      settingsService.getPositions({ page: pageParam as number, limit: 10, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || lastPage.pagination?.page || 1;
      const currentPage = lastPage.pagination?.current_page || lastPage.pagination?.page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const usePositionDetail = (positionId: string | number | null) => {
  return useQuery({
    queryKey: ['position', positionId],
    queryFn: () => settingsService.getDetailPosition(positionId!),
    enabled: !!positionId,
  });
};

export const usePositionMutations = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (position: { name: string; level_id?: number; description?: string }) => 
      settingsService.createPosition(position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      showSuccessToast('Vị trí đã được tạo thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi tạo vị trí';
      showErrorToast(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: { name: string; level_id?: number; description?: string } }) => 
      settingsService.updatePosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['position'] });
      showSuccessToast('Vị trí đã được cập nhật thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vị trí';
      showErrorToast(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => settingsService.deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      showSuccessToast('Vị trí đã được xóa thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa vị trí';
      showErrorToast(errorMessage);
    },
  });

  return {
    createPosition: createMutation.mutate,
    updatePosition: updateMutation.mutate,
    deletePosition: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

