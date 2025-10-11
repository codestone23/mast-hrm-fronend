import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Modal, Input, Button, Select } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage
} from '../personalInfoModalStyles';
import profileService, { Skill, Position } from '@/services/profile.service';
import { useToast } from '@/hooks/useToast';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Skill | null;
  onSave: (skill: Skill) => void;
}

const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    skill_id: '',
    experience: '',
    months_experience: '',
    is_main: false
  });
  const [availableSkills, setAvailableSkills] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadAvailableSkills();
      if (mode === 'edit' && initialData) {
        setFormData({
          skill_id: initialData.skill_id.toString(),
          experience: initialData.experience.toString(),
          months_experience: initialData.months_experience.toString(),
          is_main: initialData.is_main
        });
      } else {
        setFormData({
          skill_id: '',
          experience: '',
          months_experience: '',
          is_main: false
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const loadAvailableSkills = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getPositions();
      setAvailableSkills(response || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      setError('Không thể tải danh sách kỹ năng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.skill_id) {
      setError('Vui lòng chọn kỹ năng');
      return;
    }
    if (!formData.experience) {
      setError('Vui lòng nhập số năm kinh nghiệm');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const skillData = {
        skill_id: parseInt(formData.skill_id),
        experience: parseInt(formData.experience),
        months_experience: parseInt(formData.months_experience),
        is_main: formData.is_main
      };

      if (mode === 'add') {
               const response = await profileService.addSkills(skillData);
               onSave(response);
               showSuccessToast('Kỹ năng đã được thêm thành công!');
             } else {
               const response = await profileService.updateSkillsById((initialData?.id || 0).toString(), skillData);
               onSave(response);
               showSuccessToast('Kỹ năng đã được cập nhật thành công!');
             }
             
             handleClose();
    } catch (error) {
      console.error('Error saving skill:', error);
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
    setError(''); // Clear error on input change
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isSubmitDisabled = isLoading || !formData.skill_id || !formData.experience;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Thêm kỹ năng mới' : 'Chỉnh sửa kỹ năng'}
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormSection>
          <h4>Thông tin kỹ năng</h4>
          <FormGrid>
            <Select
              label="Kỹ năng"
              value={formData.skill_id}
              onChange={(value: string | number) => handleInputChange('skill_id', value.toString())}
              options={availableSkills.map(skill => ({
                value: skill.id.toString(),
                label: skill.name
              }))}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Số năm kinh nghiệm"
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              min="0"
              max="50"
              required
              disabled={isLoading}
            />
            
            <Input
              label="Số tháng kinh nghiệm"
              type="number"
              value={formData.months_experience}
              onChange={(e) => handleInputChange('months_experience', e.target.value)}
              min="0"
              max="12"
              required
              disabled={isLoading}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                id="is_main"
                checked={formData.is_main}
                onChange={(e) => handleInputChange('is_main', e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="is_main" style={{ fontSize: '14px', color: '#374151' }}>
                Kỹ năng chính
              </label>
            </div>
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default SkillModal;
