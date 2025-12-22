'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Send, FileText } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import NewsCard from '@/components/news/NewsCard';
import CreateNewsModal from '@/components/news/modals/CreateNewsModal';
import EditNewsModal from '@/components/news/modals/EditNewsModal';
import NewsDetailModal from '@/components/news/modals/NewsDetailModal';
import {
    ConfirmDeleteModal,
    ConfirmApproveModal,
    Loading,
    Pagination,
} from '@/components/common';
import { Button } from '@/components/common';
import newsService from '@/services/news.service';
import {
    News,
    CreateNewsRequest,
    UpdateNewsRequest,
    NewsStatus,
} from '@/types/api';
import { useToast } from '@/hooks/useToast';
import {
    HRNewsContainer,
    HRNewsHeader,
    HRNewsTitle,
    HRNewsActions,
    NewsGridWithActions,
    NewsCardWithActions,
    ActionButtons,
} from './hrNewsStyle';

const ITEMS_PER_PAGE = 10;

export default function HRNewsPage() {
    const queryClient = useQueryClient();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const isMobile = useMobile();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['hr-news', currentPage],
        queryFn: () => newsService.getNews(currentPage, ITEMS_PER_PAGE),
    });

    const newsList = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        current_page: 1,
        total_pages: 1,
        limit: ITEMS_PER_PAGE,
    };
    const totalPages = pagination.total_pages || 1;

    const createMutation = useMutation({
        mutationFn: (news: CreateNewsRequest) => newsService.createNews(news),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-news'] });
            showSuccessToast('Tạo tin tức thành công');
            setCurrentPage(1); // Reset to first page after creating
        },
        onError: () => {
            showErrorToast('Có lỗi xảy ra khi tạo tin tức');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateNewsRequest }) =>
            newsService.updateNews(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-news'] });
            showSuccessToast('Cập nhật tin tức thành công');
        },
        onError: () => {
            showErrorToast('Có lỗi xảy ra khi cập nhật tin tức');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => newsService.deleteNews(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-news'] });
            showSuccessToast('Xóa tin tức thành công');
        },
        onError: () => {
            showErrorToast('Có lỗi xảy ra khi xóa tin tức');
        },
    });

    const submitMutation = useMutation({
        mutationFn: (id: number) => newsService.submitNews(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hr-news'] });
            showSuccessToast('Gửi duyệt tin tức thành công');
            setIsSubmitModalOpen(false);
            setSelectedNews(null);
        },
        onError: () => {
            showErrorToast('Có lỗi xảy ra khi gửi duyệt tin tức');
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
        if (!canDelete(news)) {
            showErrorToast(
                'Không thể xóa tin tức đã được duyệt hoặc đang chờ duyệt'
            );
            return;
        }
        setSelectedNews(news);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedNews) {
            if (!canDelete(selectedNews)) {
                showErrorToast(
                    'Không thể xóa tin tức đã được duyệt hoặc đang chờ duyệt'
                );
                setIsDeleteModalOpen(false);
                setSelectedNews(null);
                return;
            }
            deleteMutation.mutate(selectedNews.id);
            setIsDeleteModalOpen(false);
            setSelectedNews(null);
        }
    };

    const handleSubmit = (news: News) => {
        setSelectedNews(news);
        setIsSubmitModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (selectedNews) {
            submitMutation.mutate(selectedNews.id);
        }
    };

    const handleViewDetail = (news: News) => {
        setSelectedNews(news);
        setIsDetailModalOpen(true);
    };

    const canEdit = (news: News) => {
        return (
            news.status === NewsStatus.DRAFT ||
            news.status === NewsStatus.REJECTED
        );
    };

    const canSubmit = (news: News) => {
        return (
            news.status === NewsStatus.DRAFT ||
            news.status === NewsStatus.REJECTED
        );
    };

    const canDelete = (news: News) => {
        return (
            news.status === NewsStatus.DRAFT ||
            news.status === NewsStatus.REJECTED ||
            news.status === NewsStatus.APPROVED
        );
    };

    return (
        <HRNewsContainer>
            <HRNewsHeader>
                <HRNewsTitle>Quản lý tin tức</HRNewsTitle>
                <HRNewsActions>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        icon={<Plus size={18} />}
                        iconPosition='left'>
                        Tạo tin tức mới
                    </Button>
                </HRNewsActions>
            </HRNewsHeader>

            {isLoading ? (
                <Loading />
            ) : newsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
                    <FileText
                        size={isMobile ? 40 : 48}
                        style={{ opacity: 0.5, marginBottom: '1rem' }}
                    />
                    <p style={{ fontSize: isMobile ? '14px' : '16px' }}>Chưa có tin tức nào</p>
                </div>
            ) : (
                <>
                    <NewsGridWithActions>
                        {newsList.map((news) => (
                            <NewsCardWithActions key={news.id}>
                                <div
                                    onClick={() => handleViewDetail(news)}
                                    style={{
                                        cursor: 'pointer',
                                        height: '100%',
                                    }}>
                                    <NewsCard news={news} showStatus={true} />
                                </div>
                                {(canSubmit(news) ||
                                    canEdit(news) ||
                                    canDelete(news)) && (
                                    <ActionButtons>
                                        <>
                                            {canEdit(news) && (
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() =>
                                                        handleEdit(news)
                                                    }
                                                    icon={<Edit size={16} />}
                                                    iconPosition='left'>
                                                    Sửa
                                                </Button>
                                            )}
                                            {canDelete(news) && (
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() =>
                                                        handleDelete(news)
                                                    }
                                                    icon={<Trash2 size={16} />}
                                                    iconPosition='left'>
                                                    Xóa
                                                </Button>
                                            )}
                                        </>
                                        {canSubmit(news) && (
                                            <Button
                                                size='sm'
                                                variant='primary'
                                                onClick={() =>
                                                    handleSubmit(news)
                                                }
                                                icon={<Send size={16} />}
                                                iconPosition='left'>
                                                Gửi duyệt
                                            </Button>
                                        )}
                                    </ActionButtons>
                                )}
                            </NewsCardWithActions>
                        ))}
                    </NewsGridWithActions>
                    {newsList.length > 0 && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={pagination.total}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
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
                        title='Xóa tin tức'
                        message={`Bạn có chắc chắn muốn xóa tin tức "${selectedNews.title}"?`}
                        isLoading={deleteMutation.isPending}
                    />

                    <ConfirmApproveModal
                        isOpen={isSubmitModalOpen}
                        onClose={() => {
                            setIsSubmitModalOpen(false);
                            setSelectedNews(null);
                        }}
                        onConfirm={handleConfirmSubmit}
                        title='Gửi duyệt tin tức'
                        message={`Bạn có chắc chắn muốn gửi duyệt tin tức "${selectedNews.title}"?`}
                        confirmText='Gửi duyệt'
                        isLoading={submitMutation.isPending}
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
