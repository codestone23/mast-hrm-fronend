import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button, DatePicker, TimePicker, Loading } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestDetail, useUpdateRequest } from '@/hooks/useRequests';
import { UpdateRequestPayload } from '@/services/requests.service';
import { timekeepingService } from '@/services/timekeeping.service';
import { format } from 'date-fns';

interface ForgotTimekeepingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

interface ForgotTimekeepingFormData {
  title: string;
  applicationDate: Date | null;
  checkinTime: string;
  checkoutTime: string;
  reason: string;
}

const ForgotTimekeepingModal: React.FC<ForgotTimekeepingModalProps> = ({
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
  } = useForm<ForgotTimekeepingFormData>({
    defaultValues: {
      title: '',
      applicationDate: selectedDate ? new Date(selectedDate) : null,
      checkinTime: '08:00',
      checkoutTime: '17:30',
      reason: ''
    },
  });

  // Fetch request data when in edit mode using useQuery
  const shouldFetchRequest = isOpen && isEdit && !!requestId && !!requestType;
  const { data: requestData, isLoading: isLoadingRequest } = useRequestDetail(
    requestType || '',
    String(requestId || ''),
    { enabled: shouldFetchRequest }
  );

  // Create forgot timekeeping request mutation
  const createForgotTimekeepingMutation = useMutation({
    mutationFn: (payload: {
      work_date: string;
      checkin_time: string;
      checkout_time: string;
      title: string;
      reason: string;
    }) => timekeepingService.createForgotTimekeepingRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequestsStats'] });
      queryClient.invalidateQueries({ queryKey: ['time-sheets'] });
      showSuccessToast('Đăng ký quên chấm công thành công!');
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
          applicationDate: requestData.work_date ? new Date(requestData.work_date) : new Date(selectedDate),
          checkinTime: requestData.start_time || '08:00',
          checkoutTime: requestData.end_time || '17:30',
          reason: requestData.reason || ''
        });
      } else if (!isEdit) {
        reset({
          title: '',
          applicationDate: selectedDate ? new Date(selectedDate) : null,
          checkinTime: '08:00',
          checkoutTime: '17:30',
          reason: ''
        });
      }
    }
  }, [isOpen, isEdit, requestData, selectedDate, reset]);

  const onSubmit = (data: ForgotTimekeepingFormData) => {
    if (!data.applicationDate) {
      showErrorToast('Vui lòng chọn ngày áp dụng');
      return;
    }

    if (isEdit && requestId && requestType) {
      const updatePayload: UpdateRequestPayload = {
        title: data.title,
        work_date: format(data.applicationDate, 'yyyy-MM-dd'),
        start_time: data.checkinTime,
        end_time: data.checkoutTime,
        reason: data.reason
      };
      
      updateRequestMutation.mutate(
        { type: requestType, id: String(requestId), payload: updatePayload },
        {
          onSuccess: () => {
            showSuccessToast('Cập nhật đơn quên chấm công thành công!');
            handleClose();
          },
          onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            showErrorToast(errorMessage);
          },
        }
      );
    } else {
      const payload = {
        work_date: format(data.applicationDate, 'yyyy-MM-dd'),
        checkin_time: data.checkinTime,
        checkout_time: data.checkoutTime,
        title: data.title,
        reason: data.reason
      };
      createForgotTimekeepingMutation.mutate(payload);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      applicationDate: selectedDate ? new Date(selectedDate) : null,
      checkinTime: '08:00',
      checkoutTime: '17:30',
      reason: ''
    });
    onClose();
  };

  const applicationDate = watch('applicationDate');
  const isLoading = createForgotTimekeepingMutation.isPending || updateRequestMutation.isPending;
  const isFetching = isLoadingRequest;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn quên chấm công" : "Đăng ký quên chấm công"}
      size="lg"
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
            {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm'}
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
              <div>Chọn giờ checkin checkout để sửa thông tin chấm công của bạn</div>
              <div>Số yêu cầu được thực hiện trong tháng: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>3</span></div>
            </InfoBanner>
            
            <FormSection>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Tên tiêu đề"
                      {...register('title')}
                      placeholder="Nhập tên tiêu đề"
                      disabled={isLoading}
                      error={errors.title?.message}
                    />
                  </div>
                  
                  <DatePicker
                    label="Ngày áp dụng"
                    value={applicationDate}
                    onChange={(value) => setValue('applicationDate', value)}
                    required
                    disabled={isLoading}
                    error={errors.applicationDate?.message}
                  />
                  
                  <TimePicker
                    label="Thời gian checkin"
                    value={watch('checkinTime')}
                    onChange={(value) => setValue('checkinTime', value)}
                    required
                    disabled={isLoading}
                  />
                  
                  <TimePicker
                    label="Thời gian checkout"
                    value={watch('checkoutTime')}
                    onChange={(value) => setValue('checkoutTime', value)}
                    required
                    disabled={isLoading}
                  />
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="Lý do"
                      {...register('reason', { required: 'Vui lòng nhập lý do' })}
                      placeholder="Nhập lý do quên chấm công..."
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

export default ForgotTimekeepingModal;
