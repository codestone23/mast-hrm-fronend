"use client";

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { Modal, Input, Button, Select } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage
} from './personalInfoModalStyles';

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PersonalInfoData;
  onSave?: (data: PersonalInfoData) => void;
}

interface PersonalInfoData {
  birthDate: string;
  nationality: string;
  gender: string;
  accountStatus: string;
  phone: string;
  employeeType: string;
  maritalStatus: string;
  department: string;
  temporaryAddress: string;
  contractType: string;
  permanentAddress: string;
  personalEmail: string;
}

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState<PersonalInfoData>(
    initialData || {
      birthDate: '30/04/2003',
      nationality: 'Việt Nam',
      gender: 'Nam',
      accountStatus: 'Active',
      phone: '094545857',
      employeeType: 'Chính thức',
      maritalStatus: 'Chưa kết hôn',
      department: '44444',
      temporaryAddress: 'Hà Nội',
      contractType: 'Hợp đồng xác định thời hạn',
      permanentAddress: 'Thanh Hóa',
      personalEmail: 'abc@outlook.com'
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' }
  ];

  const maritalStatusOptions = [
    { value: 'Chưa kết hôn', label: 'Chưa kết hôn' },
    { value: 'Đã kết hôn', label: 'Đã kết hôn' },
    { value: 'Ly hôn', label: 'Ly hôn' },
    { value: 'Góa', label: 'Góa' }
  ];

  const employeeTypeOptions = [
    { value: 'Chính thức', label: 'Chính thức' },
    { value: 'Thử việc', label: 'Thử việc' },
    { value: 'Thực tập', label: 'Thực tập' },
    { value: 'Part-time', label: 'Part-time' }
  ];

  const contractTypeOptions = [
    { value: 'Hợp đồng xác định thời hạn', label: 'Hợp đồng xác định thời hạn' },
    { value: 'Hợp đồng không xác định thời hạn', label: 'Hợp đồng không xác định thời hạn' },
    { value: 'Hợp đồng thử việc', label: 'Hợp đồng thử việc' }
  ];

  const accountStatusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' }
  ];

  const handleInputChange = (field: keyof PersonalInfoData, value: string) => {
    setError(''); // Clear error on input change
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!formData.personalEmail) {
      setError('Vui lòng nhập email cá nhân');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      if (onSave) {
        onSave(formData);
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
    setError('');
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const isSubmitDisabled = isLoading || !formData.phone || !formData.personalEmail;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa thông tin cá nhân"
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
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <User size={24} style={{ marginRight: '0.5rem' }} />
            Thông tin cá nhân đã được cập nhật thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <h4>Thông tin cơ bản</h4>
              <FormGrid>
                <Input
                  label="Ngày sinh"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  icon={<Calendar size={16} />}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Quốc tịch"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  icon={<MapPin size={16} />}
                  required
                  disabled={isLoading}
                />
                
                <Select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', String(value))}
                  options={genderOptions}
                  required
                  disabled={isLoading}
                />
                
                <Select
                  label="Trạng thái tài khoản"
                  value={formData.accountStatus}
                  onChange={(value) => handleInputChange('accountStatus', String(value))}
                  options={accountStatusOptions}
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <h4>Thông tin liên lạc</h4>
              <FormGrid>
                <Input
                  label="Số điện thoại"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  icon={<Phone size={16} />}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Email cá nhân"
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                  icon={<Mail size={16} />}
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <h4>Thông tin công việc</h4>
              <FormGrid>
                <Select
                  label="Loại nhân sự"
                  value={formData.employeeType}
                  onChange={(value) => handleInputChange('employeeType', String(value))}
                  options={employeeTypeOptions}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Phòng ban (Nhóm)"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  icon={<Users size={16} />}
                  required
                  disabled={isLoading}
                />
                
                <Select
                  label="Loại hợp đồng"
                  value={formData.contractType}
                  onChange={(value) => handleInputChange('contractType', String(value))}
                  options={contractTypeOptions}
                  required
                  disabled={isLoading}
                />
                
                <Select
                  label="Tình trạng hôn nhân"
                  value={formData.maritalStatus}
                  onChange={(value) => handleInputChange('maritalStatus', String(value))}
                  options={maritalStatusOptions}
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <h4>Địa chỉ</h4>
              <FormGrid>
                <Input
                  label="Địa chỉ tạm trú"
                  value={formData.temporaryAddress}
                  onChange={(e) => handleInputChange('temporaryAddress', e.target.value)}
                  icon={<MapPin size={16} />}
                  disabled={isLoading}
                />
                
                <Input
                  label="Địa chỉ thường trú"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  icon={<MapPin size={16} />}
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

export default EditPersonalInfoModal;
