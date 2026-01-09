import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Button, Select, DatePicker, TimePicker, Loading } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestDetail, useUpdateRequest } from '@/hooks/useRequests';
import { UpdateRequestPayload } from '@/services/requests.service';

interface RegularOvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

interface OvertimeFormData {
  title: string;
  workDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

const RegularOvertimeModal: React.FC<RegularOvertimeModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  requestId,
  requestType
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!requestId && !!requestType;
  const [formData, setFormData] = useState<OvertimeFormData>({
    title: '',
    workDate: selectedDate,
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  // Fetch request data when in edit mode using useQuery
  const shouldFetchRequest = isOpen && isEdit && !!requestId && !!requestType;
  const { data: requestData, isLoading: isLoadingRequest } = useRequestDetail(
    requestType || '',
    String(requestId || ''),
    { enabled: shouldFetchRequest }
  );

  // Create overtime request mutation
  const createOvertimeMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      work_date: string;
      start_time: string;
      end_time: string;
      reason: string;
    }) => timekeepingService.createOvertimeRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequestsStats'] });
      queryClient.invalidateQueries({ queryKey: ['time-sheets'] });
      showSuccessToast('Tạo đơn xin làm thêm giờ thành công!');
      handleClose();
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    },
  });

  // Update request mutation
  const updateRequestMutation = useUpdateRequest();

  // Update form data when request data is loaded or when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEdit && requestData) {
        setFormData({
          title: requestData.title || '',
          workDate: requestData.work_date || selectedDate,
          startTime: requestData.start_time || '',
          endTime: requestData.end_time || '',
          reason: requestData.reason || ''
        });
      } else if (!isEdit) {
        // Reset form when creating new request
        setFormData({
          title: '',
          workDate: selectedDate,
          startTime: '',
          endTime: '',
          reason: ''
        });
      }
      setError('');
    }
  }, [isOpen, isEdit, requestData, selectedDate]);

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return false;
    }

    if (!formData.reason.trim()) {
      setError('Vui lòng nhập lý do');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setError('');

    const payload = {
      title: formData.title,
      work_date: formData.workDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      reason: formData.reason
    };

    if (isEdit && requestId && requestType) {
      const updatePayload: UpdateRequestPayload = {
        title: formData.title,
        work_date: formData.workDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        reason: formData.reason
      };
      
      updateRequestMutation.mutate(
        { type: requestType, id: String(requestId), payload: updatePayload },
        {
          onSuccess: () => {
            showSuccessToast('Cập nhật đơn xin làm thêm giờ thành công!');
            handleClose();
          },
          onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            setError(errorMessage);
          },
        }
      );
    } else {
      createOvertimeMutation.mutate(payload);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({
      title: '',
      workDate: selectedDate,
      startTime: '',
      endTime: '',
      reason: ''
    });
    onClose();
  };

  const handleInputChange = (field: keyof OvertimeFormData, value: string) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isLoading = createOvertimeMutation.isPending || updateRequestMutation.isPending;
  const isFetching = isLoadingRequest;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn làm thêm giờ" : "Đăng ký làm thêm giờ ngày thường"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || isFetching || !formData.title.trim() || !formData.reason.trim()}
          >
            {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo đơn'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isFetching && (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <Loading />
          </div>
        )}
        
        {!isFetching && (
          <FormSection>
            <FormGrid>
              <div style={{ gridColumn: '1 / -1' }}>
                <Input
                  label="Tiêu đề"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề đơn xin làm thêm giờ"
                  required
                  disabled={isLoading}
                />
              </div>

              <DatePicker
                label="Ngày làm thêm giờ"
                value={formData.workDate ? new Date(formData.workDate) : null}
                onChange={(value) => handleInputChange('workDate', value ? value.toISOString().split('T')[0] : '')}
                required
                disabled={isLoading}
              />
              
              <TimePicker
                label="Thời gian bắt đầu"
                value={formData.startTime}
                onChange={(value) => handleInputChange('startTime', value)}
                required
                disabled={isLoading}
              />
              
              <TimePicker
                label="Thời gian kết thúc"
                value={formData.endTime}
                onChange={(value) => handleInputChange('endTime', value)}
                required
                disabled={isLoading}
              />
              
              <div style={{ gridColumn: '1 / -1' }}>
                <Input
                  label="Lý do"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Nhập lý do làm thêm giờ..."
                  required
                  disabled={isLoading}
                />
              </div>
            </FormGrid>
          </FormSection>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegularOvertimeModal;
