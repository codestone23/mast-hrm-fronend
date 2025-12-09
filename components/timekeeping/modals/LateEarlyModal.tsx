import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button, Select, DatePicker, Loading } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestDetail, useUpdateRequest } from '@/hooks/useRequests';
import { UpdateRequestPayload } from '@/services/requests.service';
import { format } from 'date-fns';

interface LateEarlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

interface LateEarlyFormData {
  title: string;
  workDate: Date | null;
  requestType: 'LATE' | 'EARLY' | 'BOTH';
  lateMinutes: number;
  earlyMinutes: number;
  reason: string;
}

const LateEarlyModal: React.FC<LateEarlyModalProps> = ({
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
  } = useForm<LateEarlyFormData>({
    defaultValues: {
      title: '',
      workDate: selectedDate ? new Date(selectedDate) : null,
      requestType: 'LATE',
      lateMinutes: 0,
      earlyMinutes: 0,
      reason: ''
    },
  });

  const requestTypes = [
    { value: 'LATE', label: 'Đi muộn' },
    { value: 'EARLY', label: 'Về sớm' },
    { value: 'BOTH', label: 'Cả đi muộn và về sớm' }
  ];

  // Fetch request data when in edit mode using useQuery
  const shouldFetchRequest = isOpen && isEdit && !!requestId && !!requestType;
  const { data: requestData, isLoading: isLoadingRequest } = useRequestDetail(
    requestType || '',
    String(requestId || ''),
    { enabled: shouldFetchRequest }
  );

  // Create late/early request mutation
  const createLateEarlyMutation = useMutation({
    mutationFn: (payload: {
      work_date: string;
      request_type: 'LATE' | 'EARLY' | 'BOTH';
      title: string;
      late_minutes: number;
      early_minutes: number;
      reason: string;
    }) => timekeepingService.createLateEarlyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequestsStats'] });
      queryClient.invalidateQueries({ queryKey: ['time-sheets'] });
      showSuccessToast('Tạo đơn xin đi muộn/về sớm thành công!');
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
        // Determine request type based on late_minutes and early_minutes
        let reqType: 'LATE' | 'EARLY' | 'BOTH' = 'LATE';
        if (requestData.late_minutes && requestData.late_minutes > 0 && requestData.early_minutes && requestData.early_minutes > 0) {
          reqType = 'BOTH';
        } else if (requestData.early_minutes && requestData.early_minutes > 0) {
          reqType = 'EARLY';
        }

        reset({
          title: requestData.title || '',
          workDate: requestData.work_date ? new Date(requestData.work_date) : new Date(selectedDate),
          requestType: reqType,
          lateMinutes: requestData.late_minutes || 0,
          earlyMinutes: requestData.early_minutes || 0,
          reason: requestData.reason || ''
        });
      } else if (!isEdit) {
        reset({
          title: '',
          workDate: selectedDate ? new Date(selectedDate) : null,
          requestType: 'LATE',
          lateMinutes: 0,
          earlyMinutes: 0,
          reason: ''
        });
      }
    }
  }, [isOpen, isEdit, requestData, selectedDate, reset]);

  const onSubmit = (data: LateEarlyFormData) => {
    if (!data.workDate) {
      showErrorToast('Vui lòng chọn ngày áp dụng');
      return;
    }

    if (data.requestType === 'LATE' && data.lateMinutes <= 0) {
      showErrorToast('Vui lòng nhập số phút đi muộn');
      return;
    }

    if (data.requestType === 'EARLY' && data.earlyMinutes <= 0) {
      showErrorToast('Vui lòng nhập số phút về sớm');
      return;
    }

    if (data.requestType === 'BOTH' && (data.lateMinutes <= 0 || data.earlyMinutes <= 0)) {
      showErrorToast('Vui lòng nhập số phút đi muộn và về sớm');
      return;
    }

    const payload = {
      work_date: format(data.workDate, 'yyyy-MM-dd'),
      request_type: data.requestType,
      title: data.title,
      late_minutes: data.lateMinutes,
      early_minutes: data.earlyMinutes,
      reason: data.reason
    };

    if (isEdit && requestId && requestType) {
      const updatePayload: UpdateRequestPayload = {
        work_date: format(data.workDate, 'yyyy-MM-dd'),
        title: data.title,
        late_minutes: data.lateMinutes,
        early_minutes: data.earlyMinutes,
        reason: data.reason
      };
      
      updateRequestMutation.mutate(
        { type: requestType, id: String(requestId), payload: updatePayload },
        {
          onSuccess: () => {
            showSuccessToast('Cập nhật đơn xin đi muộn/về sớm thành công!');
            handleClose();
          },
          onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            showErrorToast(errorMessage);
          },
        }
      );
    } else {
      createLateEarlyMutation.mutate(payload);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      workDate: selectedDate ? new Date(selectedDate) : null,
      requestType: 'LATE',
      lateMinutes: 0,
      earlyMinutes: 0,
      reason: ''
    });
    onClose();
  };

  const requestTypeValue = watch('requestType');
  const workDate = watch('workDate');
  const lateMinutes = watch('lateMinutes');
  const earlyMinutes = watch('earlyMinutes');
  const isLoading = createLateEarlyMutation.isPending || updateRequestMutation.isPending;
  const isFetching = isLoadingRequest;

  const isFormValid = () => {
    const title = watch('title');
    const reason = watch('reason');
    if (!title?.trim() || !reason?.trim()) return false;
    
    if (requestTypeValue === 'LATE' && lateMinutes <= 0) return false;
    if (requestTypeValue === 'EARLY' && earlyMinutes <= 0) return false;
    if (requestTypeValue === 'BOTH' && (lateMinutes <= 0 || earlyMinutes <= 0)) return false;
    
    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn đi muộn/về sớm" : "Đăng ký đi muộn/về sớm"}
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
            disabled={isLoading || isFetching || !isFormValid()}
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
          <>
            <InfoBanner>
              Số phút còn lại có thể đăng ký: 120 phút
            </InfoBanner>
            
            <FormSection>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Tiêu đề"
                      {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                      placeholder="Nhập tiêu đề đơn xin đi muộn/về sớm"
                      required
                      disabled={isLoading}
                      error={errors.title?.message}
                    />
                  </div>
                  
                  <Select
                    label="Loại yêu cầu"
                    value={requestTypeValue}
                    onChange={(value: string | number) => setValue('requestType', value as 'LATE' | 'EARLY' | 'BOTH')}
                    options={requestTypes}
                    placeholder="Chọn loại yêu cầu"
                    required
                    disabled={isLoading}
                  />
                  
                  <DatePicker
                    label="Ngày áp dụng"
                    value={workDate}
                    onChange={(value) => setValue('workDate', value)}
                    required
                    disabled={isLoading}
                    error={errors.workDate?.message}
                  />
                  
                  {(requestTypeValue === 'LATE' || requestTypeValue === 'BOTH') && (
                    <Input
                      label="Số phút đi muộn"
                      type="number"
                      {...register('lateMinutes', {
                        required: requestTypeValue === 'LATE' || requestTypeValue === 'BOTH' ? 'Vui lòng nhập số phút đi muộn' : false,
                        min: { value: 1, message: 'Số phút phải lớn hơn 0' },
                        max: { value: 120, message: 'Số phút không được vượt quá 120' },
                        valueAsNumber: true
                      })}
                      placeholder="Nhập số phút đi muộn"
                      required
                      disabled={isLoading}
                      error={errors.lateMinutes?.message}
                      min="1"
                      max="120"
                    />
                  )}
                  
                  {(requestTypeValue === 'EARLY' || requestTypeValue === 'BOTH') && (
                    <Input
                      label="Số phút về sớm"
                      type="number"
                      {...register('earlyMinutes', {
                        required: requestTypeValue === 'EARLY' || requestTypeValue === 'BOTH' ? 'Vui lòng nhập số phút về sớm' : false,
                        min: { value: 1, message: 'Số phút phải lớn hơn 0' },
                        max: { value: 120, message: 'Số phút không được vượt quá 120' },
                        valueAsNumber: true
                      })}
                      placeholder="Nhập số phút về sớm"
                      required
                      disabled={isLoading}
                      error={errors.earlyMinutes?.message}
                      min="1"
                      max="120"
                    />
                  )}
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Lý do"
                      {...register('reason', { required: 'Vui lòng nhập lý do' })}
                      placeholder="Nhập lý do đi muộn/về sớm..."
                      required
                      disabled={isLoading}
                      error={errors.reason?.message}
                    />
                  </div>
                </FormGrid>
              </form>
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LateEarlyModal;
