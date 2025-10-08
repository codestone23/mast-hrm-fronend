import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { Modal, Input, Button } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage
} from '../personalInfoModalStyles';
import profileService, { Certificate } from '@/services/profile.service';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Certificate | null;
  onSave: (certificate: Certificate) => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    authority: '',
    issued_at: '',
    start_date: '',
    type: 'ACHIEVEMENT'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: `Chứng chỉ #${initialData.id}`,
          authority: 'N/A',
          issued_at: initialData.issued_at.split('T')[0],
          start_date: initialData.start_date.split('T')[0],
          type: 'ACHIEVEMENT'
        });
      } else {
        setFormData({
          name: '',
          authority: '',
          issued_at: '',
          start_date: '',
          type: 'ACHIEVEMENT'
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async () => {
    if (!formData.name) {
      setError('Vui lòng nhập tên chứng chỉ');
      return;
    }
    if (!formData.authority) {
      setError('Vui lòng nhập tổ chức cấp');
      return;
    }
    if (!formData.issued_at) {
      setError('Vui lòng chọn ngày cấp');
      return;
    }
    if (!formData.start_date) {
      setError('Vui lòng chọn ngày bắt đầu hiệu lực');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const certificateData: Certificate = {
        name: formData.name,
        authority: formData.authority,
        issued_at: formData.issued_at,
        start_date: formData.start_date,
        type: formData.type,
        certificate_id: mode === 'edit' ? (initialData?.certificate_id || 1) : 1
      };

      if (mode === 'add') {
        const response = await profileService.addCertificates(certificateData);
        onSave(response);
      } else {
        const response = await profileService.updateCertificatesById((initialData?.id || 0).toString(), certificateData);
        onSave(response);
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving certificate:', error);
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

  const isSubmitDisabled = isLoading || !formData.name || !formData.authority || !formData.issued_at || !formData.start_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Thêm chứng chỉ mới' : 'Chỉnh sửa chứng chỉ'}
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
            <Award size={24} style={{ marginRight: '0.5rem' }} />
            Chứng chỉ đã được {mode === 'add' ? 'thêm' : 'cập nhật'} thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <h4>Thông tin chứng chỉ</h4>
              <FormGrid>
                <Input
                  label="Tên chứng chỉ"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ví dụ: AWS Certified Developer"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Tổ chức cấp"
                  value={formData.authority}
                  onChange={(e) => handleInputChange('authority', e.target.value)}
                  placeholder="Ví dụ: Amazon Web Services"
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Ngày cấp"
                  type="date"
                  value={formData.issued_at}
                  onChange={(e) => handleInputChange('issued_at', e.target.value)}
                  required
                  disabled={isLoading}
                />
                
                <Input
                  label="Ngày bắt đầu hiệu lực"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                  disabled={isLoading}
                />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Loại chứng chỉ
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: isLoading ? '#f9fafb' : 'white'
                    }}
                  >
                    <option value="ACHIEVEMENT">Thành tích</option>
                    <option value="CERTIFICATION">Chứng nhận</option>
                    <option value="LICENSE">Giấy phép</option>
                  </select>
                </div>
              </FormGrid>
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CertificateModal;
