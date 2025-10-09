import React, { useState } from 'react';
import { Modal, Input, Button, Select, DatePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';

interface PaidLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const PaidLeaveModal: React.FC<PaidLeaveModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    proposalName: 'Nghỉ ốm ngày 05/05/2021',
    approver: '',
    applicationDate: selectedDate,
    morningShift: false,
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

  const timeSlots = [
    { id: '8-10', label: '8:00 - 10:00' },
    { id: '10-12', label: '10:00 - 12:00' },
    { id: '13-15', label: '13:30 - 15:30' },
    { id: '15-17', label: '15:30 - 17:30' }
  ];

  const handleSubmit = async () => {
    if (!formData.approver) {
      setError('Vui lòng chọn người phê duyệt');
      return;
    }

    if (!formData.morningShift && !formData.afternoonShift) {
      setError('Vui lòng chọn ít nhất một ca nghỉ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('Đăng ký nghỉ phép thành công!');
      onClose();
    } catch (error) {
      console.error('Error submitting paid leave request:', error);
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

  const handleTimeSlotChange = (slotId: string, checked: boolean) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [slotId]: checked
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đăng ký nghỉ phép"
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
        
        <InfoBanner>
          Số giờ phép còn lại: 40 giờ
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
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Ca xin nghỉ
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {timeSlots.map((slot) => (
                  <label key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData[slot.id as keyof typeof formData] as boolean}
                      onChange={(e) => handleTimeSlotChange(slot.id, e.target.checked)}
                      disabled={isLoading}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do nghỉ..."
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default PaidLeaveModal;
