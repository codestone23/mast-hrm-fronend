import { useMutation, useQueryClient } from '@tanstack/react-query';
import projectService, { ProjectCreateRequest, ProjectUpdateRequest } from '@/services/project.service';
import { useToast } from './useToast';

export const useProjectMutation = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Tạo project mới
  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectCreateRequest) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      showSuccessToast('Dự án đã được tạo thành công!');
    },
    onError: (error: unknown) => {
      console.error('Error creating project:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi tạo dự án';
      showErrorToast(errorMessage);
    },
  });

  // Cập nhật project
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdateRequest }) => 
      projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      showSuccessToast('Dự án đã được cập nhật thành công!');
    },
    onError: (error: unknown) => {
      console.error('Error updating project:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật dự án';
      showErrorToast(errorMessage);
    },
  });

  // Xóa project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      showSuccessToast('Dự án đã được xóa thành công!');
    },
    onError: (error: unknown) => {
      console.error('Error deleting project:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa dự án';
      showErrorToast(errorMessage);
    },
  });

  return {
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    isPending: createProjectMutation.isPending || updateProjectMutation.isPending || deleteProjectMutation.isPending,
  };
};
