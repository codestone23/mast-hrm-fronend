"use client";

import React from "react";
import { Modal, Button } from "@/components/common";
import { CheckCircle } from "lucide-react";
import {
  ConfirmContainer,
  Message,
  ActionsRow,
  Spacer,
} from "../ConfirmDeleteModal/confirmDeleteModalStyle";

export interface ConfirmApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

const ConfirmApproveModal: React.FC<ConfirmApproveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận duyệt",
  message = "Bạn có chắc chắn muốn duyệt yêu cầu này không?",
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closable
    >
      <ConfirmContainer>
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <CheckCircle 
            size={48} 
            style={{ color: "#22c55e", marginBottom: "1rem" }} 
          />
          <Message style={{ textAlign: "center" }}>
            {message}
          </Message>
        </div>

        <ActionsRow>
          <Spacer />
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            loading={isLoading}
          >
            Xác nhận duyệt
          </Button>
        </ActionsRow>
      </ConfirmContainer>
    </Modal>
  );
};

export default ConfirmApproveModal;

