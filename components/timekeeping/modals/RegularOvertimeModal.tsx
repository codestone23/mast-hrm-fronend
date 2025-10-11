import React, { useState } from 'react';
import { Modal, Input, Button, Select, DatePicker, TimePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';

interface RegularOvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const RegularOvertimeModal: React.FC<RegularOvertimeModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    proposalName: 'Làm thêm giờ dự án ACMS',
    project: '',
    approver: '',
    applicationDate: selectedDate,
    startTime: '19:00',
    endTime: '21:00',
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

  const projects = [
    { value: 'project1', label: 'Dự án ACMS' },
    { value: 'project2', label: 'Dự án HRM' },
    { value: 'project3', label: 'Dự án CRM' }
  ];

  const handleSubmit = async () => {
    if (!formData.approver) {
      setError('Vui lòng chọn người phê duyệt');
      return;
    }

    if (!formData.project) {
      setError('Vui lòng chọn dự án');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('Đăng ký OT ngày thường thành công!');
      onClose();
    } catch (error) {
      console.error('Error submitting regular overtime request:', error);
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
      title="Đăng ký làm thêm giờ ngày thường"
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
            disabled={isLoading || !formData.approver || !formData.project}
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
              label="Dự án"
              value={formData.project}
              onChange={(value: string | number) => handleInputChange('project', value.toString())}
              options={projects}
              placeholder="Chọn dự án"
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
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default RegularOvertimeModal;
