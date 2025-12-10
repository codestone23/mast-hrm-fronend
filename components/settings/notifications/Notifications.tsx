"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Bell, Edit, Trash2, Search } from "lucide-react";
import { Button, Input, Table } from "@/components/common";
import { TableColumn } from "@/components/common/Table/Table";
import Pagination from "@/components/common/Pagination/Pagination";
import notificationService from "@/services/notification.service";
import { Notification, CreateNotificationRequest, UpdateNotificationRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import CreateNotificationModal from "./modals/CreateNotificationModal";
import EditNotificationModal from "./modals/EditNotificationModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import {
  Container,
  Header,
  Title,
  ActionsBar,
  SearchContainer,
} from "./notificationsStyle";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query notifications
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", currentPage, debouncedSearch],
    queryFn: () =>
      notificationService.getNotificationsAdmin(currentPage, ITEMS_PER_PAGE, debouncedSearch || undefined),
  });

  const notifications = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (notification: CreateNotificationRequest) =>
      notificationService.createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showSuccessToast("Tạo thông báo thành công");
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi tạo thông báo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNotificationRequest }) =>
      notificationService.updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showSuccessToast("Cập nhật thông báo thành công");
      setIsEditModalOpen(false);
      setSelectedNotification(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông báo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showSuccessToast("Xóa thông báo thành công");
      setIsDeleteModalOpen(false);
      setSelectedNotification(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa thông báo");
    },
  });

  // Handlers
  const handleCreate = (notification: CreateNotificationRequest) => {
    createMutation.mutate(notification);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (id: number, data: UpdateNotificationRequest) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNotification) {
      deleteMutation.mutate(selectedNotification.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Table columns
  const columns: TableColumn<Notification>[] = [
    {
      key: "title",
      label: "Tiêu đề",
      width: "15%",
    },
    {
      key: "content",
      label: "Nội dung",
      width: "45%",
      render: (value) => {
        const content = String(value || "");
        return (
          <div 
            style={{ 
              maxWidth: "400px",
              position: "relative",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
              maxHeight: "4.5em",
            }}
            title={content}
          >
            {content}
          </div>
        );
      },
    },
    {
      key: "creatorName",
      label: "Người tạo",
      width: "10%",
      render: (value, row) => row.creatorName || row.creator?.user_information?.name || "-",
    },
    {
      key: "created_at",
      label: "Ngày tạo",
      width: "10%",
      render: (value) => formatDate(String(value || "")),
    },
    {
      key: "actions",
      label: "Hành động",
      width: "10%",
      align: "center",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            icon={<Edit size={14} />}
          >
            Sửa
          </Button>
          <Button
            size="sm"
            variant="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            icon={<Trash2 size={14} />}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <Title>
          <Bell size={24} />
          Quản lý thông báo
        </Title>
      </Header>

      <ActionsBar>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<Plus size={18} />}
          iconPosition="left"
        >
          Tạo thông báo
        </Button>
        <SearchContainer>
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            fullWidth
          />
        </SearchContainer>
      </ActionsBar>

      <Table
        columns={columns}
        data={notifications}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Bell size={48} />,
          message: searchTerm
            ? "Không tìm thấy thông báo nào"
            : "Chưa có thông báo nào",
        }}
        rowKey="id"
      />

      {pagination.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          showInfo={true}
        />
      )}

      {/* Modals */}
      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        isLoading={createMutation.isPending}
      />

      <EditNotificationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
        onSave={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedNotification(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa thông báo"
        message={`Bạn có chắc chắn muốn xóa thông báo "${selectedNotification?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </Container>
  );
}

