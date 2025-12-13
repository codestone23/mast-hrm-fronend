"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/common";
import RichTextEditor from "../RichTextEditor";
import { UpdateNewsRequest, News } from "@/types/api";
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

interface EditNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, news: UpdateNewsRequest) => Promise<void>;
  news: News | null;
  isLoading?: boolean;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  news,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateNewsRequest>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
      });
    }
  }, [news]);

  const handleInputChange = (field: keyof UpdateNewsRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isContentEmpty = (htmlContent: string): boolean => {
    if (!htmlContent) return true;
    
    // Remove HTML tags using regex
    const textWithoutTags = htmlContent.replace(/<[^>]*>/g, "");
    
    // Replace HTML entities (like &nbsp;, &amp;, etc.) with spaces
    const textWithoutEntities = textWithoutTags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-z]+;/gi, " "); // Replace any other HTML entities
    
    // Remove all whitespace characters (spaces, tabs, newlines, etc.)
    const trimmedContent = textWithoutEntities.replace(/\s+/g, "").trim();
    
    return trimmedContent.length === 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (isContentEmpty(formData.content || "")) {
      newErrors.content = "Nội dung là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && news) {
      await onUpdate(news.id, formData);
      handleClose();
    }
  };

  const handleClose = () => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
      });
    } else {
      setFormData({
        title: "",
        content: "",
      });
    }
    setErrors({});
    onClose();
  };

  if (!isOpen || !news) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Chỉnh sửa tin tức</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Input
              label="Tiêu đề"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Nhập tiêu đề tin tức"
              error={errors.title}
              required
              fullWidth
            />

            <RichTextEditor
              label="Nội dung"
              value={formData.content || ""}
              onChange={(value) => handleInputChange("content", value)}
              placeholder="Nhập nội dung tin tức..."
              error={errors.content}
              required
            />
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={handleClose}>
              Hủy
            </CancelButton>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditNewsModal;

