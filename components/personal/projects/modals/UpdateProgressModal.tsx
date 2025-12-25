"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/common";
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

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (progress: number) => void;
  isLoading?: boolean;
  currentProgress: number;
  milestoneName: string;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  currentProgress,
  milestoneName,
}) => {
  const [progress, setProgress] = useState(currentProgress);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setProgress(currentProgress);
      setError("");
    }
  }, [isOpen, currentProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (progress < 0 || progress > 100) {
      setError("Tiến độ phải từ 0 đến 100");
      return;
    }

    onSave(progress);
  };

  const handleClose = () => {
    setProgress(currentProgress);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="sm" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Cập nhật tiến độ</ModalTitle>
            <ModalCloseButton onClick={handleClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <FormLabel>Milestone: {milestoneName}</FormLabel>
              </FormGroup>

              <FormGroup>
                <FormLabel>Tiến độ (%) *</FormLabel>
                <Input
                  type="number"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                  min={0}
                  max={100}
                  error={error}
                  required
                  fullWidth
                />
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                  Tiến độ hiện tại: {currentProgress}%
                </div>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton type="button" onClick={handleClose} disabled={isLoading}>
                Hủy
              </CancelButton>
              <SaveButton type="submit" disabled={isLoading}>
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </SaveButton>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default UpdateProgressModal;

