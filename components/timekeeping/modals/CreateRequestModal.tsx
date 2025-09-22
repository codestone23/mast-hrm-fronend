"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Clock, Type, AlignLeft, CheckCircle, User } from 'lucide-react';
import { Modal, Input, Button, Select } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage
} from './modalStyles';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: RequestData) => void;
}

interface RequestData {
  id: string;
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const requestTypeOptions = [
    { value: 'leave', label: 'Xin nghỉ phép' },
    { value: 'sick_leave', label: 'Nghỉ ốm' },
    { value: 'personal_leave', label: 'Nghỉ việc riêng' },
    { value: 'maternity_leave', label: 'Nghỉ thai sản' },
    { value: 'overtime', label: 'Đăng ký làm thêm giờ' },
    { value: 'remote_work', label: 'Làm việc từ xa' },
    { value: 'late_arrival', label: 'Đi muộn' },
    { value: 'early_departure', label: 'Về sớm' },
    { value: 'forgot_checkin', label: 'Quên chấm công' },
    { value: 'business_trip', label: 'Công tác' },
    { value: 'other', label: 'Khác' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setError(''); // Clear error on input change
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const needsTimeRange = (type: string) => {
    return ['overtime', 'late_arrival', 'early_departure', 'forgot_checkin'].includes(type);
  };

  const needsEndDate = (type: string) => {
    return ['leave', 'sick_leave', 'personal_leave', 'maternity_leave', 'remote_work', 'business_trip'].includes(type);
  };

  const handleSubmit = async () => {
    if (!formData.type) {
      setError('Vui lòng chọn loại yêu cầu');
      return;
    }
    if (!formData.title) {
      setError('Vui lòng nhập tiêu đề yêu cầu');
      return;
    }
    if (!formData.startDate) {
      setError('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (needsEndDate(formData.type) && !formData.endDate) {
      setError('Vui lòng chọn ngày kết thúc');
      return;
    }
    if (needsTimeRange(formData.type) && (!formData.startTime || !formData.endTime)) {
      setError('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }
    if (!formData.reason) {
      setError('Vui lòng nhập lý do');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const requestData: RequestData = {
        id: `request_${Date.now()}`,
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      setSuccess(true);
      if (onSave) {
        onSave(requestData);
      }
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: '',
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      reason: ''
    });
    setError('');
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const isSubmitDisabled = isLoading || !formData.type || !formData.title || !formData.startDate || !formData.reason;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo yêu cầu"
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
            disabled={isSubmitDisabled}
          >
            Gửi yêu cầu
          </Button>
        </>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <CheckCircle size={24} style={{ marginRight: '0.5rem' }} />
            Yêu cầu đã được gửi thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <h4>Thông tin yêu cầu</h4>
              <FormGrid>
                <Select
                  label="Loại yêu cầu"
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', String(value))}
                  options={requestTypeOptions}
                  placeholder="Chọn loại yêu cầu"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Tiêu đề yêu cầu"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  icon={<Type size={16} />}
                  placeholder="Nhập tiêu đề yêu cầu"
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <h4>Thời gian</h4>
              <FormGrid>
                <Input
                  label="Ngày bắt đầu"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  icon={<Calendar size={16} />}
                  required
                  disabled={isLoading}
                />
                
                {needsEndDate(formData.type) && (
                  <Input
                    label="Ngày kết thúc"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    icon={<Calendar size={16} />}
                    required
                    disabled={isLoading}
                  />
                )}
              </FormGrid>

              {needsTimeRange(formData.type) && (
                <FormGrid>
                  <Input
                    label="Thời gian bắt đầu"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    icon={<Clock size={16} />}
                    required
                    disabled={isLoading}
                  />
                  
                  <Input
                    label="Thời gian kết thúc"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    icon={<Clock size={16} />}
                    required
                    disabled={isLoading}
                  />
                </FormGrid>
              )}
            </FormSection>

            <FormSection>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                icon={<AlignLeft size={16} />}
                placeholder="Nhập lý do chi tiết cho yêu cầu này..."
                required
                disabled={isLoading}
                multiline
                rows={4}
              />
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateRequestModal;
