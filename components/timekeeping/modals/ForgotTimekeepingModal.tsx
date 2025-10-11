import React, { useState } from 'react';
import { Modal, Input, Button, Select, DatePicker, TimePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';

interface ForgotTimekeepingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const ForgotTimekeepingModal: React.FC<ForgotTimekeepingModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    title: 'Quên checkout ngày 05/05/2021',
    approver: '',
    applicationDate: selectedDate,
    checkinTime: '08:00',
    checkoutTime: '13:30',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast } = useToast();

  const approvers = [
    { value: 'manager1', label: 'Nguyễn Văn A - Trưởng phòng' },
    { value: 'manager2', label: 'Trần Thị B - Phó giám đốc' },
    { value: 'manager3', label: 'Lê Văn C - Giám đốc' }
  ];

  const handleSubmit = async () => {
    if (!formData.approver) {
      setError('Vui lòng chọn người phê duyệt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('Đăng ký quên chấm công thành công!');
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
      title="Đăng ký quên chấm công"
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
            disabled={isLoading || !formData.approver}
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <InfoBanner>
          <div>Chọn giờ checkin checkout để sửa thông tin chấm công của bạn</div>
          <div>Số đề xuất được thực hiện trong tháng: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>3</span></div>
        </InfoBanner>
        
        <FormSection>
          <FormGrid>
            <Input
              label="Tên tiêu đề"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={isLoading}
            />
            
            <Select
              label="Chọn người phê duyệt"
              value={formData.approver}
              onChange={(value: string | number) => handleInputChange('approver', value.toString())}
              options={approvers}
              placeholder="Chọn người phê duyệt"
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
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default ForgotTimekeepingModal;
