"use client";

import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Send, FileText } from "lucide-react";
import NewsCard from "@/components/news/NewsCard";
import CreateNewsModal from "@/components/news/modals/CreateNewsModal";
import EditNewsModal from "@/components/news/modals/EditNewsModal";
import NewsDetailModal from "@/components/news/modals/NewsDetailModal";
import { ConfirmDeleteModal } from "@/components/common";
import { Button } from "@/components/common";
import newsService from "@/services/news.service";
import { News, CreateNewsRequest, UpdateNewsRequest, NewsStatus } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import {
  HRNewsContainer,
  HRNewsHeader,
  HRNewsTitle,
  HRNewsActions,
  NewsGridWithActions,
  NewsCardWithActions,
  ActionButtons,
} from "./hrNewsStyle";

export default function HRNewsPage() {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const {
    data,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["hr-news"],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getNews(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const newsList = data?.pages.flatMap((page) => page.data || []) || [];

  const createMutation = useMutation({
    mutationFn: (news: CreateNewsRequest) => newsService.createNews(news),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-news"] });
      showSuccessToast("Tạo tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi tạo tin tức");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNewsRequest }) =>
      newsService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-news"] });
      showSuccessToast("Cập nhật tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi cập nhật tin tức");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-news"] });
      showSuccessToast("Xóa tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi xóa tin tức");
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: number) => newsService.submitNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-news"] });
      showSuccessToast("Gửi duyệt tin tức thành công");
    },
    onError: () => {
      showErrorToast("Có lỗi xảy ra khi gửi duyệt tin tức");
    },
  });

  const handleCreate = async (news: CreateNewsRequest) => {
    await createMutation.mutateAsync(news);
  };

  const handleEdit = (news: News) => {
    setSelectedNews(news);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: number, data: UpdateNewsRequest) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = (news: News) => {
    setSelectedNews(news);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNews) {
      deleteMutation.mutate(selectedNews.id);
      setIsDeleteModalOpen(false);
      setSelectedNews(null);
    }
  };

  const handleSubmit = (news: News) => {
    submitMutation.mutate(news.id);
  };

  const handleViewDetail = (news: News) => {
    setSelectedNews(news);
    setIsDetailModalOpen(true);
  };

  const canEdit = (news: News) => {
    return news.status === NewsStatus.DRAFT || news.status === NewsStatus.REJECTED;
  };

  const canSubmit = (news: News) => {
    return news.status === NewsStatus.DRAFT || news.status === NewsStatus.REJECTED;
  };

  return (
    <HRNewsContainer>
      <HRNewsHeader>
        <HRNewsTitle>Quản lý tin tức</HRNewsTitle>
        <HRNewsActions>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus size={18} />}
            iconPosition="left"
          >
            Tạo tin tức mới
          </Button>
        </HRNewsActions>
      </HRNewsHeader>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Đang tải...</div>
      ) : newsList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <FileText size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
          <p>Chưa có tin tức nào</p>
        </div>
      ) : (
        <NewsGridWithActions>
          {newsList.map((news) => (
            <NewsCardWithActions key={news.id}>
              <div onClick={() => handleViewDetail(news)} style={{ cursor: "pointer" }}>
                <NewsCard news={news} showStatus={true} />
              </div>
              <ActionButtons>
                {canEdit(news) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(news)}
                      icon={<Edit size={16} />}
                      iconPosition="left"
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(news)}
                      icon={<Trash2 size={16} />}
                      iconPosition="left"
                    >
                      Xóa
                    </Button>
                  </>
                )}
                {canSubmit(news) && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleSubmit(news)}
                    icon={<Send size={16} />}
                    iconPosition="left"
                  >
                    Gửi duyệt
                  </Button>
                )}
              </ActionButtons>
            </NewsCardWithActions>
          ))}
        </NewsGridWithActions>
      )}

      <CreateNewsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        isLoading={createMutation.isPending}
      />

      {selectedNews && (
        <>
          <EditNewsModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedNews(null);
            }}
            onUpdate={handleUpdate}
            news={selectedNews}
            isLoading={updateMutation.isPending}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedNews(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Xóa tin tức"
            message={`Bạn có chắc chắn muốn xóa tin tức "${selectedNews.title}"?`}
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
    </HRNewsContainer>
  );
}

