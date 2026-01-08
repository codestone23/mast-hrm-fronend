"use client";

import React, { useState } from 'react';
import {
  RejectModalOverlay,
  RejectModalContainer,
  RejectModalHeader,
  RejectModalTitle,
  RejectModalSubtitle,
  RejectModalContent,
  RejectModalLabel,
  RejectModalTextarea,
  RejectModalActions,
  RejectModalButton,
  RejectModalError,
  RejectModalSuccess,
} from './rejectModalStyle';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  error,
  success,
  title = "Lý do từ chối",
  subtitle = "Vui lòng nhập lý do từ chối yêu cầu này",
  placeholder = "Nhập lý do từ chối...",
  confirmText = "Xác nhận từ chối",
  cancelText = "Hủy",
}) => {
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setLocalError('Vui lòng nhập lý do từ chối');
      return;
    }
    
    setLocalError('');
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason('');
    setLocalError('');
    onClose();
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (localError) {
      setLocalError('');
    }
  };

  if (!isOpen) return null;

  return (
    <RejectModalOverlay onClick={handleClose}>
      <RejectModalContainer onClick={(e) => e.stopPropagation()}>
        <RejectModalHeader>
          <RejectModalTitle>{title}</RejectModalTitle>
          {subtitle && <RejectModalSubtitle>{subtitle}</RejectModalSubtitle>}
        </RejectModalHeader>

        <RejectModalContent>
          <RejectModalLabel htmlFor="reject-reason">
            Lý do từ chối <span style={{ color: '#EF4444' }}>*</span>
          </RejectModalLabel>
          <RejectModalTextarea
            id="reject-reason"
            value={reason}
            onChange={handleReasonChange}
            placeholder={placeholder}
            disabled={isLoading}
            rows={4}
          />
          
          {(localError || error) && (
            <RejectModalError>
              {localError || error}
            </RejectModalError>
          )}
          
          {success && (
            <RejectModalSuccess>
              {success}
            </RejectModalSuccess>
          )}
        </RejectModalContent>

        <RejectModalActions>
          <RejectModalButton
            type="button"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </RejectModalButton>
          <RejectModalButton
            type="button"
            $variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </RejectModalButton>
        </RejectModalActions>
      </RejectModalContainer>
    </RejectModalOverlay>
  );
};

export default RejectModal;
