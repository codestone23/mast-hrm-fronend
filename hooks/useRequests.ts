import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import requestsService, { Request, RequestParams, ApproveRejectPayload, UpdateRequestPayload } from '@/services/requests.service';
import { useToast } from '@/hooks/useToast';

export const useMyRequests = (params: RequestParams = {}) => {
  return useQuery({
    queryKey: ['myRequests', params],
    queryFn: () => requestsService.getMyRequests(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminRequests = (params: RequestParams = {}) => {
  return useQuery({
    queryKey: ['adminRequests', params],
    queryFn: () => requestsService.getRequestAdmin(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRequestDetail = (
  type: string,
  id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['requestDetail', type, id],
    queryFn: () => requestsService.getRequestById(type, id),
    enabled: options?.enabled !== undefined ? options.enabled : (!!type && !!id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => 
      requestsService.approveRequest(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['adminRequests'] });
      showToast({
        type: 'success',
        title: 'Duyệt request thành công',
        message: 'Duyệt request thành công',
      });
    },
    onError: (error: unknown) => {
      showToast({
        type: 'error',
        title: 'Có lỗi xảy ra khi duyệt request',
        message: 'Có lỗi xảy ra khi duyệt request',
      });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ type, id, payload }: { type: string; id: string; payload: ApproveRejectPayload }) => 
      requestsService.rejectRequest(type, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['adminRequests'] });
      showToast({
        type: 'success',
        title: 'Từ chối request thành công',
        message: 'Từ chối request thành công',
      });
    },
    onError: (error: unknown) => {
      showToast({
        type: 'error',
        title: 'Có lỗi xảy ra khi từ chối request',
        message: 'Có lỗi xảy ra khi từ chối request',
      });
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ type, id, payload }: { type: string; id: string; payload: UpdateRequestPayload }) =>
      requestsService.updateRequest(type, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['adminRequests'] });
      queryClient.invalidateQueries({ queryKey: ['requestDetail'] });
      showSuccessToast('Cập nhật đề xuất thành công!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đề xuất';
      showErrorToast(errorMessage);
    },
  });
};