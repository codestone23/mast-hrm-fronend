"use client";

import React from "react";
import { X, Calendar, User, AlertCircle } from "lucide-react";
import { News, NewsStatus } from "@/types/api";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
} from "./newsModalStyle";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import {
  NewsDetailModalContent,
  NewsDetailMeta,
  NewsDetailMetaItem,
  NewsDetailAuthor,
  NewsDetailContentWrapper,
  RejectionReasonModal,
} from "./newsDetailModalStyle";

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: News | null;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  isOpen,
  onClose,
  news,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  if (!isOpen || !news) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{news.title}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <NewsDetailModalContent>
            <NewsDetailMeta>
              <NewsDetailMetaItem>
                <Calendar size={16} />
                <span>{formatDate(news.created_at)}</span>
              </NewsDetailMetaItem>
              <NewsDetailAuthor>
                <User size={16} />
                <span>{news.authorName || news.author?.user_information?.name || "Không xác định"}</span>
              </NewsDetailAuthor>
            </NewsDetailMeta>
            {news.status === NewsStatus.REJECTED && news.reason && (
              <RejectionReasonModal>
                <AlertCircle size={18} />
                <div>
                  <strong>Lý do từ chối:</strong>
                  <p>{news.reason}</p>
                </div>
              </RejectionReasonModal>
            )}
            <NewsDetailContentWrapper
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </NewsDetailModalContent>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default NewsDetailModal;

