import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/components/common';
import {
  ModalContent,
  FormSection,
  ErrorMessage
} from '../personalInfoModalStyles';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  isLoading?: boolean;
  error?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  error
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            Xóa
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormSection>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '20px',
            background: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <AlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#dc2626' }}>
                {message}
              </h4>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                <strong>{itemName}</strong> sẽ bị xóa vĩnh viễn và không thể khôi phục.
              </p>
            </div>
          </div>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
