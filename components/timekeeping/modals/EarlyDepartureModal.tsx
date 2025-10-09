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

interface EarlyDepartureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const EarlyDepartureModal: React.FC<EarlyDepartureModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    proposalName: 'Đau bụng',
    approver: '',
    applicationDate: selectedDate,
    earlyTime: '17:00',
    registeredMinutes: '30'
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
      
      showSuccessToast('Đăng ký về sớm thành công!');
      onClose();
    } catch (error) {
      console.error('Error submitting early departure request:', error);
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
      title="Đăng ký về sớm"
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
          Số phút còn lại có thể đăng ký: 120 phút
        </InfoBanner>
        
        <FormSection>
          <FormGrid>
            <Input
              label="Tên đề xuất"
              value={formData.proposalName}
              onChange={(e) => handleInputChange('proposalName', e.target.value)}
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
              label="Thời gian về sớm"
              value={formData.earlyTime}
              onChange={(value) => handleInputChange('earlyTime', value)}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Số phút đăng ký"
              value={formData.registeredMinutes}
              onChange={(e) => handleInputChange('registeredMinutes', e.target.value)}
              disabled
              style={{ backgroundColor: '#f9fafb' }}
            />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value=""
                onChange={() => {}}
                placeholder="Nhập lý do về sớm..."
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default EarlyDepartureModal;
