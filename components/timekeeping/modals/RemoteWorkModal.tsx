import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button, Select, DatePicker, Loading } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestDetail, useUpdateRequest } from '@/hooks/useRequests';
import { UpdateRequestPayload } from '@/services/requests.service';
import { format } from 'date-fns';

interface RemoteWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

interface RemoteWorkFormData {
  title: string;
  workDate: Date | null;
  duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
  reason: string;
}

const RemoteWorkModal: React.FC<RemoteWorkModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  requestId,
  requestType
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!requestId && !!requestType;
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RemoteWorkFormData>({
    defaultValues: {
      title: '',
      workDate: selectedDate ? new Date(selectedDate) : null,
      duration: 'FULL_DAY',
      reason: ''
    },
  });

  const durations = [
    { value: 'FULL_DAY', label: 'Cả ngày' },
    { value: 'MORNING', label: 'Buổi sáng' },
    { value: 'AFTERNOON', label: 'Buổi chiều' }
  ];

  // Fetch request data when in edit mode using useQuery
  const shouldFetchRequest = isOpen && isEdit && !!requestId && !!requestType;
  const { data: requestData, isLoading: isLoadingRequest } = useRequestDetail(
    requestType || '',
    String(requestId || ''),
    { enabled: shouldFetchRequest }
  );

  // Create remote work request mutation
  const createRemoteWorkMutation = useMutation({
    mutationFn: (payload: {
      work_date: string;
      remote_type: 'REMOTE' | 'HYBRID';
      title: string;
      reason: string;
      duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
    }) => timekeepingService.createRemoteWorkRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['my-requests-stats'] });
      queryClient.invalidateQueries({ queryKey: ['time-sheets'] });
      showSuccessToast('Tạo đơn xin làm việc từ xa thành công!');
      handleClose();
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      showErrorToast(errorMessage);
    },
  });

  // Update request mutation
  const updateRequestMutation = useUpdateRequest();

  // Update form data when request data is loaded or when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEdit && requestData) {
        reset({
          title: requestData.title || '',
          workDate: requestData.work_date ? new Date(requestData.work_date) : new Date(selectedDate),
          duration: (requestData.duration as 'FULL_DAY' | 'MORNING' | 'AFTERNOON') || 'FULL_DAY',
          reason: requestData.reason || ''
        });
      } else if (!isEdit) {
        reset({
          title: '',
          workDate: selectedDate ? new Date(selectedDate) : null,
          duration: 'FULL_DAY',
          reason: ''
        });
      }
    }
  }, [isOpen, isEdit, requestData, selectedDate, reset]);

  const onSubmit = (data: RemoteWorkFormData) => {
    if (!data.workDate) {
      showErrorToast('Vui lòng chọn ngày làm việc');
      return;
    }

    const payload = {
      work_date: format(data.workDate, 'yyyy-MM-dd'),
      remote_type: 'REMOTE' as 'REMOTE' | 'HYBRID',
      title: data.title,
      reason: data.reason,
      duration: data.duration
    };

    if (isEdit && requestId && requestType) {
      const updatePayload: UpdateRequestPayload = {
        work_date: format(data.workDate, 'yyyy-MM-dd'),
        title: data.title,
        reason: data.reason,
        duration: data.duration
      };
      
      updateRequestMutation.mutate(
        { type: requestType, id: String(requestId), payload: updatePayload },
        {
          onSuccess: () => {
            showSuccessToast('Cập nhật đơn xin làm việc từ xa thành công!');
            handleClose();
          },
          onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            showErrorToast(errorMessage);
          },
        }
      );
    } else {
      createRemoteWorkMutation.mutate(payload);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      workDate: selectedDate ? new Date(selectedDate) : null,
      duration: 'FULL_DAY',
      reason: ''
    });
    onClose();
  };

  const workDate = watch('workDate');
  const isLoading = createRemoteWorkMutation.isPending || updateRequestMutation.isPending;
  const isFetching = isLoadingRequest;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn làm việc từ xa" : "Đăng ký làm việc từ xa"}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading || isFetching}
          >
            {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo đơn'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {isFetching && (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <Loading />
          </div>
        )}
        
        {!isFetching && (
          <FormSection>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGrid>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input
                    label="Tiêu đề"
                    {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                    placeholder="Nhập tiêu đề đơn xin làm việc từ xa"
                    required
                    disabled={isLoading}
                    error={errors.title?.message}
                  />
                </div>
              
                <Select
                  label="Thời gian làm việc"
                  value={watch('duration')}
                  onChange={(value: string | number) => setValue('duration', value as 'FULL_DAY' | 'MORNING' | 'AFTERNOON')}
                  options={durations}
                  placeholder="Chọn thời gian làm việc"
                  required
                  disabled={isLoading}
                />
                
                <DatePicker
                  label="Ngày làm việc"
                  value={workDate}
                  onChange={(value) => setValue('workDate', value)}
                  required
                  disabled={isLoading}
                  error={errors.workDate?.message}
                />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input
                    label="Lý do"
                    {...register('reason', { required: 'Vui lòng nhập lý do' })}
                    placeholder="Nhập lý do làm việc từ xa..."
                    required
                    disabled={isLoading}
                    error={errors.reason?.message}
                  />
                </div>
              </FormGrid>
            </form>
          </FormSection>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RemoteWorkModal;
