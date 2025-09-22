"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/components/common';
import {
  ModalContent,
  DeleteWarning,
  ConfirmText,
  ErrorMessage,
  SuccessMessage
} from './personalInfoModalStyles';

interface DeleteFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  onConfirm?: () => void;
}

const DeleteFamilyMemberModal: React.FC<DeleteFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  memberName,
  onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      if (onConfirm) {
        onConfirm();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Xác nhận xóa thân nhân"
      size="sm"
      footer={
        success ? null : (
          <>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              loading={isLoading}
              disabled={isLoading}
            >
              <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
              Xóa thân nhân
            </Button>
          </>
        )
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <Trash2 size={24} style={{ marginRight: '0.5rem' }} />
            Thông tin thân nhân đã được xóa thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <DeleteWarning>
              <h4>
                <AlertTriangle size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Cảnh báo
              </h4>
              <p>
                Hành động này không thể hoàn tác. Thông tin thân nhân sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
            </DeleteWarning>
            
            <ConfirmText>
              Bạn có chắc chắn muốn xóa thông tin thân nhân <strong>&quot;{memberName}&quot;</strong> không?
            </ConfirmText>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteFamilyMemberModal;
