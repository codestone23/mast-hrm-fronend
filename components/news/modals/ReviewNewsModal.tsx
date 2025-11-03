"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { TextArea } from "@/components/common";
import { ReviewNewsRequest, News, NewsStatus } from "@/types/api";
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

interface ReviewNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (id: number, payload: ReviewNewsRequest) => Promise<void>;
  news: News | null;
  isLoading?: boolean;
}

const ReviewNewsModal: React.FC<ReviewNewsModalProps> = ({
  isOpen,
  onClose,
  onReject,
  news,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Lý do từ chối là bắt buộc");
      return;
    }

    if (news) {
      const payload: ReviewNewsRequest = {
        status: NewsStatus.REJECTED,
        reason: reason.trim(),
      };

      await onReject(news.id, payload);
      handleClose();
    }
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  if (!isOpen || !news) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Duyệt tin tức</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Vui lòng nhập lý do từ chối tin tức: <strong>"{news.title}"</strong>
              </p>
            </div>

            <TextArea
              label="Lý do từ chối"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="Nhập lý do từ chối..."
              error={error}
              required
              fullWidth
              rows={4}
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={handleClose} disabled={isLoading}>
              Hủy
            </CancelButton>
            <SaveButton
              type="submit"
              disabled={isLoading}
              variant="error"
            >
              {isLoading ? "Đang xử lý..." : "Từ chối"}
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ReviewNewsModal;

