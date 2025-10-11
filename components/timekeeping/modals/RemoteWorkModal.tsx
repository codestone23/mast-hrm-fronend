import React, { useState } from 'react';
import { Modal, Input, Button, Select, DatePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';

interface RemoteWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const RemoteWorkModal: React.FC<RemoteWorkModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    proposalName: 'Làm việc từ xa chống dịch covid',
    approver: '',
    applicationDate: selectedDate,
    morningShift: true,
    afternoonShift: false,
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

    if (!formData.morningShift && !formData.afternoonShift) {
      setError('Vui lòng chọn ít nhất một ca làm việc');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('Đăng ký làm việc từ xa thành công!');
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

  const handleInputChange = (field: string, value: string | boolean) => {
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
      title="Đăng ký làm việc từ xa"
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
            disabled={isLoading || !formData.approver || (!formData.morningShift && !formData.afternoonShift)}
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Ca làm việc
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.morningShift}
                    onChange={(e) => handleInputChange('morningShift', e.target.checked)}
                    disabled={isLoading}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Ca sáng</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.afternoonShift}
                    onChange={(e) => handleInputChange('afternoonShift', e.target.checked)}
                    disabled={isLoading}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Ca chiều</span>
                </label>
              </div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do làm việc từ xa..."
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default RemoteWorkModal;
