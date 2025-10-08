import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { Modal, Input, Button } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage
} from '../personalInfoModalStyles';
import profileService, { Experience } from '@/services/profile.service';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Experience | null;
  onSave: (experience: Experience) => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    job_title: '',
    company: '',
    start_date: '',
    end_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          job_title: initialData.job_title,
          company: initialData.company,
          start_date: initialData.start_date.split('T')[0], // Convert to YYYY-MM-DD format
          end_date: initialData.end_date.split('T')[0]
        });
      } else {
        setFormData({
          job_title: '',
          company: '',
          start_date: '',
          end_date: ''
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async () => {
    if (!formData.job_title) {
      setError('Vui lòng nhập chức vụ');
      return;
    }
    if (!formData.company) {
      setError('Vui lòng nhập tên công ty');
      return;
    }
    if (!formData.start_date) {
      setError('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (!formData.end_date) {
      setError('Vui lòng chọn ngày kết thúc');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const experienceData = {
        job_title: formData.job_title,
        company: formData.company,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      if (mode === 'add') {
        const response = await profileService.addExperience(experienceData);
        onSave(response);
      } else {
        const response = await profileService.updateExperienceById((initialData?.id || 0).toString(), experienceData);
        onSave(response);
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving experience:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError(''); // Clear error on input change
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };

  const isSubmitDisabled = isLoading || !formData.job_title || !formData.company || !formData.start_date || !formData.end_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Thêm kinh nghiệm mới' : 'Chỉnh sửa kinh nghiệm'}
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
            disabled={isSubmitDisabled}
          >
            {mode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <Briefcase size={24} style={{ marginRight: '0.5rem' }} />
            Kinh nghiệm đã được {mode === 'add' ? 'thêm' : 'cập nhật'} thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <h4>Thông tin kinh nghiệm</h4>
              <FormGrid>
                <Input
                  label="Chức vụ"
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  placeholder="Ví dụ: Frontend Developer"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Công ty"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Ví dụ: Công ty ABC"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Ngày bắt đầu"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleDateChange}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Ngày kết thúc"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleDateChange}
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExperienceModal;
