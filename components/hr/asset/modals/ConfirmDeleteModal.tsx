"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  ModalBody,
  ModalFooter,
  CancelButton,
  DeleteButton,
  ConfirmContainer,
} from "./modalStyle";
import { Modal } from "@/components/common";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  assetName?: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message,
  assetName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <ModalBody>
        <ConfirmContainer>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            background: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            marginBottom: '20px'
          }}>
            <AlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>
                {message || 'Bạn có chắc chắn muốn xóa tài sản này?'}
              </div>
              {assetName && (
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  <strong>{assetName}</strong> sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </div>
              )}
            </div>
          </div>
        </ConfirmContainer>
      </ModalBody>

      <ModalFooter>
        <CancelButton onClick={onClose} disabled={isLoading}>
          Hủy
        </CancelButton>
        <DeleteButton onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Đang xóa..." : "Xóa"}
        </DeleteButton>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDeleteModal;

