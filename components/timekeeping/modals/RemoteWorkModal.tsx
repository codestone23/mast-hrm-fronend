import React, { useState } from 'react';
import { Modal, Input, Button, Select, DatePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';

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
    title: '',
    workDate: selectedDate,
    duration: 'FULL_DAY',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast } = useToast();

  const durations = [
    { value: 'FULL_DAY', label: 'Cả ngày' },
    { value: 'MORNING', label: 'Buổi sáng' },
    { value: 'AFTERNOON', label: 'Buổi chiều' }
  ];

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

      await timekeepingService.createRemoteWorkRequest(payload);
      showSuccessToast('Tạo đơn xin làm việc từ xa thành công!');
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
            disabled={isLoading || !formData.title.trim() || !formData.reason.trim()}
          >
            {isLoading ? 'Đang xử lý...' : 'Tạo đơn'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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
      </ModalContent>
    </Modal>
  );
};

export default RemoteWorkModal;
