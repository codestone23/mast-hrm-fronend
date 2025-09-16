'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Modal, Button, Input } from '@/components/common';
import {
  ModalContent,
  FormSection,
  PasswordStrengthIndicator,
  PasswordStrengthBar,
  PasswordStrengthText,
  PasswordRequirements,
  RequirementItem,
  SuccessMessage,
  ErrorMessage
} from './changePasswordModalStyle';

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthMap = {
      0: { label: 'Rất yếu', color: '#ef4444' },
      1: { label: 'Yếu', color: '#f97316' },
      2: { label: 'Trung bình', color: '#eab308' },
      3: { label: 'Mạnh', color: '#22c55e' },
      4: { label: 'Rất mạnh', color: '#16a34a' },
      5: { label: 'Cực mạnh', color: '#15803d' }
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const passwordRequirements = [
    { text: 'Ít nhất 8 ký tự', met: newPassword.length >= 8 },
    { text: 'Chứa chữ thường', met: /[a-z]/.test(newPassword) },
    { text: 'Chứa chữ hoa', met: /[A-Z]/.test(newPassword) },
    { text: 'Chứa số', met: /\d/.test(newPassword) },
    { text: 'Chứa ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(newPassword) }
  ];

  const handleSubmit = async () => {
    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate validation - current password check
      if (currentPassword !== 'Password@123') {
        setError('Mật khẩu hiện tại không đúng');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'current':
        setCurrentPassword(value);
        break;
      case 'new':
        setNewPassword(value);
        break;
      case 'confirm':
        setConfirmPassword(value);
        break;
    }
    if (error) setError('');
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && 
                     newPassword === confirmPassword && passwordStrength.score >= 3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đổi mật khẩu"
      size="md"
      footer={
        !success && (
          <>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </>
        )
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <CheckCircle size={24} style={{ marginRight: '0.5rem' }} />
            Đổi mật khẩu thành công! Modal sẽ tự động đóng...
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormSection>
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => handleInputChange('current', e.target.value)}
                icon={<Lock size={16} />}
                required
                disabled={isLoading}
              />
            </FormSection>

            <FormSection>
              <Input
                label="Mật khẩu mới"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => handleInputChange('new', e.target.value)}
                icon={<Lock size={16} />}
                required
                disabled={isLoading}
              />

              {newPassword && (
                <>
                  <PasswordStrengthIndicator>
                    <PasswordStrengthBar 
                      strength={passwordStrength.score}
                      color={passwordStrength.color}
                    />
                    <PasswordStrengthText color={passwordStrength.color}>
                      {passwordStrength.label}
                    </PasswordStrengthText>
                  </PasswordStrengthIndicator>
                  
                  <PasswordRequirements>
                    {passwordRequirements.map((req, index) => (
                      <RequirementItem key={index} met={req.met}>
                        <CheckCircle size={14} />
                        {req.text}
                      </RequirementItem>
                    ))}
                  </PasswordRequirements>
                </>
              )}
            </FormSection>

            <FormSection>
              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                icon={<Lock size={16} />}
                error={confirmPassword && newPassword !== confirmPassword ? 'Mật khẩu xác nhận không khớp' : undefined}
                required
                disabled={isLoading}
              />
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
