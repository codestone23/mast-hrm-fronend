"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/components/common";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  CancelButton,
  SaveButton,
} from "@/components/hr/asset/modals/modalStyle";

interface RejectDailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  count?: number;
  isLoading?: boolean;
}

const RejectDailyReportModal: React.FC<RejectDailyReportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count = 1,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    onConfirm(reason);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {count === 1 ? "Từ chối báo cáo" : `Từ chối ${count} báo cáo`}
            </ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>
                Lý do từ chối <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Input
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Nhập lý do từ chối..."
                error={error}
                fullWidth
                disabled={isLoading}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </CancelButton>
            <SaveButton
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RejectDailyReportModal;
