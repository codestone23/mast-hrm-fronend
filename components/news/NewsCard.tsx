"use client";

import React from "react";
import { Calendar, User, AlertCircle } from "lucide-react";
import { News, NewsStatus } from "@/types/api";
import {
  NewsCardContainer,
  NewsCardHeader,
  NewsCardTitle,
  NewsCardContent,
  NewsCardMeta,
  NewsCardMetaItem,
  NewsCardAuthor,
  StatusBadge,
  RejectionReason,
} from "./newsStyle";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";

interface NewsCardProps {
  news: News;
  onClick?: () => void;
  showStatus?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, showStatus = false }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Strip HTML tags and limit to 3 lines
  const stripHtml = (html: string) => {
    if (typeof document === "undefined") {
      // Server-side: simple regex strip
      return html.replace(/<[^>]*>/g, "").trim();
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncatedContent = stripHtml(news.content);

  const getStatusLabel = (status: NewsStatus) => {
    const labels: { [key in NewsStatus]: string } = {
      [NewsStatus.DRAFT]: "Bản nháp",
      [NewsStatus.PENDING]: "Chờ duyệt",
      [NewsStatus.APPROVED]: "Đã duyệt",
      [NewsStatus.REJECTED]: "Từ chối",
    };
    return labels[status] || status;
  };

  return (
    <NewsCardContainer onClick={onClick}>
      <NewsCardHeader>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", width: "100%" }}>
          <NewsCardTitle style={{ flex: 1, margin: 0 }}>{news.title}</NewsCardTitle>
          {showStatus && (
            <StatusBadge $status={news.status}>
              {getStatusLabel(news.status)}
            </StatusBadge>
          )}
        </div>
      </NewsCardHeader>
      <NewsCardContent>{truncatedContent}</NewsCardContent>
      {showStatus && news.status === NewsStatus.REJECTED && news.reason && (
        <RejectionReason>
          <AlertCircle size={14} />
          <span>
            <strong>Lý do từ chối:</strong> {news.reason}
          </span>
        </RejectionReason>
      )}
      <NewsCardMeta>
        <NewsCardMetaItem>
          <Calendar size={14} />
          <span>{formatDate(news.created_at)}</span>
        </NewsCardMetaItem>
        <NewsCardAuthor>
          <User size={14} />
          <span>{news.authorName || news.author?.user_information?.name || "Không xác định"}</span>
        </NewsCardAuthor>
      </NewsCardMeta>
    </NewsCardContainer>
  );
};

export default NewsCard;

