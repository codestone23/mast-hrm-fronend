import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker, TimePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import requestsService from '@/services/requests.service';
import { useQueryClient } from '@tanstack/react-query';

interface ForgotTimekeepingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
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
  const [formData, setFormData] = useState({
    title: '',
    applicationDate: selectedDate,
    checkinTime: '08:00',
    checkoutTime: '17:30',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Fetch request data when in edit mode
  useEffect(() => {
    if (isOpen && isEdit && requestId && requestType) {
      setIsFetching(true);
      requestsService.getRequestById(requestType, String(requestId))
        .then((request) => {
          setFormData({
            title: request.title || '',
            applicationDate: request.work_date || selectedDate,
            checkinTime: request.start_time || '08:00',
            checkoutTime: request.end_time || '17:30',
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
        applicationDate: selectedDate,
        checkinTime: '08:00',
        checkoutTime: '17:30',
        reason: ''
      });
    }
  }, [isOpen, isEdit, requestId, requestType, selectedDate, showErrorToast]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (isEdit && requestId && requestType) {
        await requestsService.updateRequest(requestType, String(requestId), {
          title: formData.title,
          work_date: formData.applicationDate,
          start_time: formData.checkinTime,
          end_time: formData.checkoutTime,
          reason: formData.reason
        });
        showSuccessToast('Cập nhật đơn quên chấm công thành công!');
        queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      } else {
        // Simulate API call for create
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccessToast('Đăng ký quên chấm công thành công!');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting forgot timekeeping request:', error);
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
      title={isEdit ? "Chỉnh sửa đơn quên chấm công" : "Đăng ký quên chấm công"}
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
            disabled={isLoading || isFetching || !formData.reason}
          >
            {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isFetching && <div style={{ padding: '1rem', textAlign: 'center' }}>Đang tải thông tin...</div>}
        
        {!isFetching && (
          <>
            <InfoBanner>
              <div>Chọn giờ checkin checkout để sửa thông tin chấm công của bạn</div>
              <div>Số đề xuất được thực hiện trong tháng: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>3</span></div>
            </InfoBanner>
            
            <FormSection>
          <FormGrid>
            <Input
              label="Tên tiêu đề"
              value={formData.title}
              placeholder="Nhập tên tiêu đề"
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={isLoading}
            />
            
            <DatePicker
              label="Ngày áp dụng"
              value={formData.applicationDate}
              onChange={(value) => handleInputChange('applicationDate', value ? value.toISOString().split('T')[0] : '')}
              required
              disabled={isLoading}
            />
            
            <TimePicker
              label="Thời gian checkin"
              value={formData.checkinTime}
              onChange={(value) => handleInputChange('checkinTime', value)}
              required
              disabled={isLoading}
            />
            
            <TimePicker
              label="Thời gian checkout"
              value={formData.checkoutTime}
              onChange={(value) => handleInputChange('checkoutTime', value)}
              required
              disabled={isLoading}
            />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do quên chấm công..."
                required
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
        </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ForgotTimekeepingModal;
