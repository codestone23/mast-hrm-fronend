import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { Modal, Input, Button } from '@/components/common';
import TextArea from '@/components/common/TextArea/TextArea';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage
} from '../personalInfoModalStyles';
import profileService, { Education } from '@/services/profile.service';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Education | null;
  onSave: (education: Education) => void;
}

const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    description: '',
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
          name: initialData.name,
          major: initialData.major,
          description: initialData.description || '',
          start_date: initialData.start_date.split('T')[0],
          end_date: initialData.end_date.split('T')[0]
        });
      } else {
        setFormData({
          name: '',
          major: '',
          description: '',
          start_date: '',
          end_date: ''
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async () => {
    if (!formData.name) {
      setError('Vui lòng nhập tên trường/khóa học');
      return;
    }
    if (!formData.major) {
      setError('Vui lòng nhập chuyên ngành');
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
      const educationData = {
        name: formData.name,
        major: formData.major,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      if (mode === 'add') {
        const response = await profileService.addEducation(educationData);
        onSave(response);
      } else {
        const response = await profileService.updateEducationById((initialData?.id || 0).toString(), educationData);
        onSave(response);
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving education:', error);
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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };

  const isSubmitDisabled = isLoading || !formData.name || !formData.major || !formData.start_date || !formData.end_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Thêm học vấn mới' : 'Chỉnh sửa học vấn'}
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
            <GraduationCap size={24} style={{ marginRight: '0.5rem' }} />
            Học vấn đã được {mode === 'add' ? 'thêm' : 'cập nhật'} thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <h4>Thông tin học vấn</h4>
              <FormGrid>
                <Input
                  label="Tên trường/Cơ sở đào tạo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Chuyên ngành"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder="Ví dụ: Công nghệ thông tin"
                  required
                  disabled={isLoading}
                />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleTextAreaChange}
                    placeholder="Ví dụ: Cử nhân Công nghệ thông tin"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                
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

export default EducationModal;
