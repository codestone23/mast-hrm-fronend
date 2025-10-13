import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker, TimePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';

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
    title: '',
    projectId: '',
    workDate: selectedDate,
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast } = useToast();

  const [projects, setProjects] = useState<Array<{value: string, label: string}>>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await timekeepingService.getProjects();
        const projectOptions = response.data.map(project => ({
          value: project.id.toString(),
          label: project.name
        }));
        setProjects(projectOptions);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to hardcoded projects if API fails
        setProjects([
          { value: '1', label: 'Dự án ACME' },
          { value: '2', label: 'Dự án HRM' },
          { value: '3', label: 'Dự án CRM' },
          { value: '4', label: 'Dự án ERP' },
          { value: '5', label: 'Dự án Mobile App' }
        ]);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.projectId) {
      setError('Vui lòng chọn dự án');
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
        title: formData.title,
        project_id: parseInt(formData.projectId),
        work_date: formData.workDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        reason: formData.reason
      };

      await timekeepingService.createOvertimeRequest(payload);
      showSuccessToast('Tạo đơn xin làm thêm giờ thành công!');
      onClose();
    } catch (error) {
      console.error('Error submitting overtime request:', error);
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
            disabled={isLoading || !formData.title.trim() || !formData.projectId || !formData.reason.trim()}
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
              placeholder="Nhập tiêu đề đơn xin làm thêm giờ"
              required
              disabled={isLoading}
            />
            
            <Select
              label="Dự án"
              value={formData.projectId}
              onChange={(value: string | number) => handleInputChange('projectId', value.toString())}
              options={projects}
              placeholder="Chọn dự án"
              required
              disabled={isLoading}
            />
            
            <DatePicker
              label="Ngày làm thêm giờ"
              value={formData.workDate}
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
                placeholder="Nhập lý do làm thêm giờ..."
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

export default RegularOvertimeModal;
