import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';
import requestsService from '@/services/requests.service';
import { useQueryClient } from '@tanstack/react-query';

interface RemoteWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
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
  const [formData, setFormData] = useState({
    title: '',
    workDate: selectedDate,
    duration: 'FULL_DAY',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const durations = [
    { value: 'FULL_DAY', label: 'Cả ngày' },
    { value: 'MORNING', label: 'Buổi sáng' },
    { value: 'AFTERNOON', label: 'Buổi chiều' }
  ];

  // Fetch request data when in edit mode
  useEffect(() => {
    if (isOpen && isEdit && requestId && requestType) {
      setIsFetching(true);
      requestsService.getRequestById(requestType, String(requestId))
        .then((request) => {
          setFormData({
            title: request.title || '',
            workDate: request.work_date || selectedDate,
            duration: request.duration || 'FULL_DAY',
            reason: request.reason || ''
          });
        })
        .catch((err) => {
          console.error('Error fetching request:', err);
          showErrorToast('Không thể tải thông tin đề xuất');
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else if (isOpen && !isEdit) {
      // Reset form when creating new request
      setFormData({
        title: '',
        workDate: selectedDate,
        duration: 'FULL_DAY',
        reason: ''
      });
    }
  }, [isOpen, isEdit, requestId, requestType, selectedDate, showErrorToast]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        work_date: formData.workDate,
        remote_type: 'REMOTE' as 'REMOTE' | 'HYBRID',
        title: formData.title,
        reason: formData.reason,
        duration: formData.duration as 'FULL_DAY' | 'MORNING' | 'AFTERNOON'
      };

      if (isEdit && requestId && requestType) {
        await requestsService.updateRequest(requestType, String(requestId), payload);
        showSuccessToast('Cập nhật đơn xin làm việc từ xa thành công!');
        queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      } else {
        await timekeepingService.createRemoteWorkRequest(payload);
        showSuccessToast('Tạo đơn xin làm việc từ xa thành công!');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting remote work request:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        {isFetching && <div style={{ padding: '1rem', textAlign: 'center' }}>Đang tải thông tin...</div>}
        
        {!isFetching && (
          <FormSection>
            <FormGrid>
              <Input
                label="Tiêu đề"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nhập tiêu đề đơn xin làm việc từ xa"
                required
                disabled={isLoading}
              />
            
            <Select
              label="Thời gian làm việc"
              value={formData.duration}
              onChange={(value: string | number) => handleInputChange('duration', value.toString())}
              options={durations}
              placeholder="Chọn thời gian làm việc"
              required
              disabled={isLoading}
            />
            
            <DatePicker
              label="Ngày làm việc"
              value={formData.workDate}
              onChange={(value) => handleInputChange('workDate', value ? value.toISOString().split('T')[0] : '')}
              required
              disabled={isLoading}
            />
            
            {/* Comment lại phần người phê duyệt vì API chưa có */}
            {/* <Select
              label="Chọn người phê duyệt"
              value={formData.approver}
              onChange={(value: string | number) => handleInputChange('approver', value.toString())}
              options={approvers}
              placeholder="Chọn người phê duyệt"
              required
              disabled={isLoading}
            /> */}
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do làm việc từ xa..."
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

export default RemoteWorkModal;
