import React, { useEffect, useState } from 'react';
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
import { useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';

interface PaidLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

interface PaidLeaveFormData {
  title: string;
  leaveType: 'PAID' | 'UNPAID';
  duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
  workDate: Date | null;
  reason: string;
}

const PaidLeaveModal: React.FC<PaidLeaveModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  requestId,
  requestType
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!requestId && !!requestType;
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const { data: userData } = useAppSelector((state) => state.user);
  const [showInsufficientQuotaModal, setShowInsufficientQuotaModal] = useState(false);

  const annualLeaveQuota = userData?.annual_leave_quota || 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PaidLeaveFormData>({
    defaultValues: {
      title: '',
      leaveType: 'PAID',
      duration: 'FULL_DAY',
      workDate: selectedDate ? new Date(selectedDate) : null,
      reason: ''
    },
  });

  const leaveTypes = [
    { value: 'PAID', label: 'Nghỉ phép có lương' },
    { value: 'UNPAID', label: 'Nghỉ phép không lương' }
  ];

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

  // Create day off request mutation
  const createDayOffMutation = useMutation({
    mutationFn: (payload: {
      work_date: string;
      duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
      title: string;
      type: 'PAID' | 'UNPAID';
      reason: string;
    }) => timekeepingService.createDayOffRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequestsStats'] });
      queryClient.invalidateQueries({ queryKey: ['time-sheets'] });
      showSuccessToast('Tạo đơn xin nghỉ phép thành công!');
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
          leaveType: ((requestData as { type?: 'PAID' | 'UNPAID' }).type || 'PAID') as 'PAID' | 'UNPAID',
          duration: (requestData.duration as 'FULL_DAY' | 'MORNING' | 'AFTERNOON') || 'FULL_DAY',
          workDate: requestData.work_date ? new Date(requestData.work_date) : new Date(selectedDate),
          reason: requestData.reason || ''
        });
      } else if (!isEdit) {
        reset({
          title: '',
          leaveType: 'PAID',
          duration: 'FULL_DAY',
          workDate: selectedDate ? new Date(selectedDate) : null,
          reason: ''
        });
      }
    }
  }, [isOpen, isEdit, requestData, selectedDate, reset]);

  // Tính số giờ phép cần sử dụng
  const getRequiredLeaveHours = (duration: string) => {
    switch (duration) {
      case 'FULL_DAY':
        return 8;
      case 'MORNING':
      case 'AFTERNOON':
        return 4;
      default:
        return 8;
    }
  };

  const onSubmit = (data: PaidLeaveFormData) => {
    if (!data.workDate) {
      showErrorToast('Vui lòng chọn ngày nghỉ');
      return;
    }

    // Kiểm tra số giờ phép còn lại nếu là nghỉ có lương
    if (data.leaveType === 'PAID') {
      const requiredHours = getRequiredLeaveHours(data.duration);
      if (annualLeaveQuota < requiredHours) {
        setShowInsufficientQuotaModal(true);
        return;
      }
    }

    const payload = {
      work_date: format(data.workDate, 'yyyy-MM-dd'),
      duration: data.duration,
      title: data.title,
      type: data.leaveType,
      reason: data.reason,
    };

    if (isEdit && requestId && requestType) {
      const updatePayload: UpdateRequestPayload = {
        work_date: format(data.workDate, 'yyyy-MM-dd'),
        title: data.title,
        reason: data.reason,
        duration: data.duration,
        type: data.leaveType
      };
      
      updateRequestMutation.mutate(
        { type: requestType, id: String(requestId), payload: updatePayload },
        {
          onSuccess: () => {
            showSuccessToast('Cập nhật đơn xin nghỉ phép thành công!');
            handleClose();
          },
          onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            showErrorToast(errorMessage);
          },
        }
      );
    } else {
      createDayOffMutation.mutate(payload);
    }
  };

  const handleClose = () => {
    reset({
      title: '',
      leaveType: 'PAID',
      duration: 'FULL_DAY',
      workDate: selectedDate ? new Date(selectedDate) : null,
      reason: ''
    });
    setShowInsufficientQuotaModal(false);
    onClose();
  };

  const duration = watch('duration');
  const leaveType = watch('leaveType');
  const workDate = watch('workDate');
  const isLoading = createDayOffMutation.isPending || updateRequestMutation.isPending;
  const isFetching = isLoadingRequest;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "Chỉnh sửa đơn nghỉ phép" : "Đăng ký nghỉ phép"}
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
            <>
              <InfoBanner>
                Số giờ phép còn lại: {annualLeaveQuota} giờ
              </InfoBanner>
              
              <FormSection>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormGrid>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Input
                        label="Tiêu đề"
                        {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                        placeholder="Nhập tiêu đề đơn xin nghỉ phép"
                        required
                        disabled={isLoading}
                        error={errors.title?.message}
                      />
                    </div>
                    
                    <Select
                      label="Loại nghỉ phép"
                      value={leaveType}
                      onChange={(value: string | number) => setValue('leaveType', value as 'PAID' | 'UNPAID')}
                      options={leaveTypes}
                      placeholder="Chọn loại nghỉ phép"
                      required
                      disabled={isLoading}
                    />
                    
                    <Select
                      label="Thời gian nghỉ"
                      value={duration}
                      onChange={(value: string | number) => setValue('duration', value as 'FULL_DAY' | 'MORNING' | 'AFTERNOON')}
                      options={durations}
                      placeholder="Chọn thời gian nghỉ"
                      required
                      disabled={isLoading}
                    />
                    
                    <DatePicker
                      label="Ngày nghỉ"
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
                        placeholder="Nhập lý do nghỉ phép..."
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

      {/* Modal cảnh báo không đủ giờ phép */}
      <Modal
        isOpen={showInsufficientQuotaModal}
        onClose={() => setShowInsufficientQuotaModal(false)}
        title="Không đủ giờ phép"
        size="sm"
        footer={
          <>
            <Button 
              variant="ghost" 
              onClick={() => setShowInsufficientQuotaModal(false)}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowInsufficientQuotaModal(false);
                setValue('leaveType', 'UNPAID');
              }}
            >
              Chuyển sang nghỉ không lương
            </Button>
          </>
        }
      >
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: '#ef4444' }}>
            Bạn không đủ giờ phép để xin nghỉ có lương.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            Số giờ phép còn lại: <strong>{annualLeaveQuota} giờ</strong>
          </p>
          <p>
            Số giờ cần sử dụng: <strong>{getRequiredLeaveHours(duration)} giờ</strong>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default PaidLeaveModal;
