"use client";

import React from "react";
import { X, CheckCircle } from "lucide-react";
import { News } from "@/types/api";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  CancelButton,
  SaveButton,
} from "./newsModalStyle";

interface ConfirmApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  news: News | null;
  isLoading?: boolean;
}

const ConfirmApproveModal: React.FC<ConfirmApproveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  news,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  if (!isOpen || !news) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Xác nhận duyệt tin tức</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircle size={48} style={{ color: "var(--success-500)", marginBottom: "1rem" }} />
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: 500 }}>
              Bạn có chắc chắn muốn duyệt tin tức này không?
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              &quot;{news.title}&quot;
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={onClose} disabled={isLoading}>
            Hủy
          </CancelButton>
          <SaveButton
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận duyệt"}
          </SaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmApproveModal;

