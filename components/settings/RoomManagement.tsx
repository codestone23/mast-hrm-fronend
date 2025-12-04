"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Building2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import meetingService from "@/services/meeting.service";
import { MeetingRoom, CreateRoomPayload, UpdateRoomPayload } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import { Loading } from "@/components/common";

const ITEMS_PER_PAGE = 10;

const RoomManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["meeting-rooms", { page: currentPage, limit: ITEMS_PER_PAGE, is_active: undefined }],
    queryFn: () => meetingService.getRooms({ page: currentPage, limit: ITEMS_PER_PAGE }),
  });

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["meeting-room-detail", selectedRoom?.id],
    queryFn: () => meetingService.getRoomById(selectedRoom!.id.toString()),
    enabled: !!selectedRoom && isDetailModalOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRoomPayload) => meetingService.createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-rooms"] });
      showSuccessToast("Tạo phòng họp thành công!");
      setIsCreateModalOpen(false);
      setFormData({ name: "", is_active: true });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra khi tạo phòng họp";
      showErrorToast(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoomPayload }) =>
      meetingService.updateRoom(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["meeting-room-detail"] });
      showSuccessToast("Cập nhật phòng họp thành công!");
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      showErrorToast(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => meetingService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-rooms"] });
      showSuccessToast("Xóa phòng họp thành công!");
      setIsDeleteModalOpen(false);
      setSelectedRoom(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra khi xóa";
      showErrorToast(errorMessage);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const rooms = data?.data || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1, per_page: ITEMS_PER_PAGE };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ name: "", is_active: true });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (room: MeetingRoom) => {
    setFormData({
      name: room.name,
      is_active: room.is_active,
    });
    setErrors({});
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleView = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng họp là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;
    createMutation.mutate({
      name: formData.name.trim(),
      is_active: formData.is_active,
    });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedRoom?.id) return;
    updateMutation.mutate({
      id: selectedRoom.id.toString(),
      payload: {
        name: formData.name.trim(),
        is_active: formData.is_active,
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedRoom?.id) return;
    deleteMutation.mutate(selectedRoom.id.toString());
  };

  const statusOptions = [
    { value: "true", label: "Hoạt động" },
    { value: "false", label: "Không hoạt động" },
  ];

  const columns: TableColumn<MeetingRoom>[] = [
    {
      key: "name",
      label: "Tên phòng",
      width: "2fr",
    },
    {
      key: "is_active",
      label: "Trạng thái",
      width: "1fr",
      align: "center",
      render: (value, row) => (
        <span style={{ color: row.is_active ? "var(--success-600)" : "var(--error-600)" }}>
          {row.is_active ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Ngày tạo",
      width: "1.5fr",
      render: (value, row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString("vi-VN") : "-",
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "1.5fr",
      align: "center",
      render: (value, row) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
          >
            <span style={{ display: "none" }}>Xem</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <span style={{ display: "none" }}>Sửa</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <span style={{ display: "none" }}>Xóa</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
        <Button onClick={handleCreate} icon={<Plus size={18} />} iconPosition="left">
          Tạo phòng họp
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            iconPosition="left"
            fullWidth
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredRooms}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Building2 size={48} />,
          message: debouncedSearch ? "Không tìm thấy phòng họp nào" : "Chưa có phòng họp nào",
        }}
        rowKey="id"
      />

      {filteredRooms.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={pagination.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo phòng họp mới"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitCreate} loading={createMutation.isPending}>
              Tạo
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Tên phòng họp"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên phòng họp"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={formData.is_active ? "true" : "false"}
            onChange={(value) => setFormData({ ...formData, is_active: value === "true" })}
            placeholder="Chọn trạng thái"
            fullWidth
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa phòng họp"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitEdit} loading={updateMutation.isPending}>
              Cập nhật
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Tên phòng họp"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên phòng họp"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={formData.is_active ? "true" : "false"}
            onChange={(value) => setFormData({ ...formData, is_active: value === "true" })}
            placeholder="Chọn trạng thái"
            fullWidth
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết phòng họp"
        size="md"
      >
        {isLoadingDetail ? (
          <Loading />
        ) : detailData ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên phòng:</strong> {detailData.name || "-"}
            </div>
            <div>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: detailData.is_active ? "var(--success-600)" : "var(--error-600)" }}>
                {detailData.is_active ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>
            {detailData.created_at && (
              <div>
                <strong>Ngày tạo:</strong> {new Date(detailData.created_at).toLocaleString("vi-VN")}
              </div>
            )}
            {detailData.updated_at && (
              <div>
                <strong>Ngày cập nhật:</strong> {new Date(detailData.updated_at).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa phòng họp"
        message={`Bạn có chắc chắn muốn xóa phòng họp "${selectedRoom?.name}" không?`}
      />
    </div>
  );
};

export default RoomManagement;
