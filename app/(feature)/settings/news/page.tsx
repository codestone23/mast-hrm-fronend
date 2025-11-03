"use client";

import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import ReviewNewsModal from "@/components/news/modals/ReviewNewsModal";
import ConfirmApproveModal from "@/components/news/modals/ConfirmApproveModal";
import NewsDetailModal from "@/components/news/modals/NewsDetailModal";
import { Button } from "@/components/common";
import newsService from "@/services/news.service";
import { News, ReviewNewsRequest, NewsStatus } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import {
  AdminNewsContainer,
  AdminNewsHeader,
  AdminNewsTitle,
  NewsGridWithReview,
  NewsCardWithReview,
  ReviewButtons,
} from "./adminNewsStyle";

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const {
    data,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["admin-news", NewsStatus.PENDING],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getNews(pageParam, 10, undefined, NewsStatus.PENDING),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const newsList = data?.pages.flatMap((page) => page.data || []) || [];

  const approveMutation = useMutation({
    mutationFn: (id: number) =>
      newsService.reviewNews(id, { status: NewsStatus.APPROVED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      showSuccessToast("Duyệt tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi duyệt tin tức");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReviewNewsRequest }) =>
      newsService.reviewNews(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      showSuccessToast("Từ chối tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi từ chối tin tức");
    },
  });

  const handleApprove = (news: News) => {
    setSelectedNews(news);
    setIsApproveModalOpen(true);
  };

  const handleReject = (news: News) => {
    setSelectedNews(news);
    setIsReviewModalOpen(true);
  };

  const handleViewDetail = (news: News) => {
    setSelectedNews(news);
    setIsDetailModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedNews) {
      await approveMutation.mutateAsync(selectedNews.id);
      setIsApproveModalOpen(false);
      setSelectedNews(null);
    }
  };

  const handleConfirmReject = async (id: number, payload: ReviewNewsRequest) => {
    await rejectMutation.mutateAsync({ id, payload });
    setIsReviewModalOpen(false);
    setSelectedNews(null);
  };


  return (
    <AdminNewsContainer>
      <AdminNewsHeader>
        <AdminNewsTitle>Duyệt tin tức</AdminNewsTitle>
      </AdminNewsHeader>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Đang tải...</div>
      ) : newsList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <FileText size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
          <p>Không có tin tức nào cần duyệt</p>
        </div>
      ) : (
        <NewsGridWithReview>
          {newsList.map((news) => (
            <NewsCardWithReview key={news.id}>
              <div onClick={() => handleViewDetail(news)} style={{ cursor: "pointer" }}>
                <NewsCard news={news} showStatus={true} />
              </div>
              {news.status === NewsStatus.PENDING && (
                <ReviewButtons>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleApprove(news)}
                    icon={<CheckCircle size={16} />}
                    iconPosition="left"
                  >
                    Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="error"
                    onClick={() => handleReject(news)}
                    icon={<XCircle size={16} />}
                    iconPosition="left"
                  >
                    Từ chối
                  </Button>
                </ReviewButtons>
              )}
            </NewsCardWithReview>
          ))}
        </NewsGridWithReview>
      )}

      {selectedNews && (
        <>
          <ConfirmApproveModal
            isOpen={isApproveModalOpen}
            onClose={() => {
              setIsApproveModalOpen(false);
              setSelectedNews(null);
            }}
            onConfirm={handleConfirmApprove}
            news={selectedNews}
            isLoading={approveMutation.isPending}
          />

          <ReviewNewsModal
            isOpen={isReviewModalOpen}
            onClose={() => {
              setIsReviewModalOpen(false);
              setSelectedNews(null);
            }}
            onReject={handleConfirmReject}
            news={selectedNews}
            isLoading={rejectMutation.isPending}
          />

          <NewsDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedNews(null);
            }}
            news={selectedNews}
          />
        </>
      )}
    </AdminNewsContainer>
  );
}

