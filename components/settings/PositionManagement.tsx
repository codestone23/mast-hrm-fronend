"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit, Trash2, Eye, Briefcase } from "lucide-react";
import { usePositions, usePositionDetail, usePositionMutations, useLevels } from "@/hooks/useSettings";
import { Position } from "@/services/settings.service";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";

const ITEMS_PER_PAGE = 10;

const PositionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({ name: "", level_id: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const { data, isLoading, error } = usePositions({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const { data: levelsData } = useLevels({ limit: 100 });
  const { data: detailData } = usePositionDetail(selectedPosition?.id || null);
  const { createPosition, updatePosition, deletePosition, isCreating, isUpdating, isDeleting } = usePositionMutations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const positions = data?.data || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const levelOptions = useMemo(() => {
    return (levelsData?.data || []).map((level) => ({
      value: level.id!,
      label: `${level.name} (Cấp ${level.level})`,
    }));
  }, [levelsData]);

  const handleCreate = () => {
    setFormData({ name: "", level_id: "", description: "" });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    setFormData({
      name: position.name,
      level_id: position.level_id?.toString() || "",
      description: position.description || "",
    });
    setErrors({});
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };

  const handleView = (position: Position) => {
    setSelectedPosition(position);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên vị trí là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;
    createPosition({
      name: formData.name.trim(),
      level_id: formData.level_id ? Number(formData.level_id) : undefined,
      description: formData.description.trim() || undefined,
    });
    setIsCreateModalOpen(false);
    setFormData({ name: "", level_id: "", description: "" });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedPosition?.id) return;
    updatePosition({
      id: selectedPosition.id,
      data: {
        name: formData.name.trim(),
        level_id: formData.level_id ? Number(formData.level_id) : undefined,
        description: formData.description.trim() || undefined,
      },
    });
    setIsEditModalOpen(false);
    setSelectedPosition(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedPosition?.id) return;
    deletePosition(selectedPosition.id);
    setIsDeleteModalOpen(false);
    setSelectedPosition(null);
  };

  const columns: TableColumn<Position>[] = [
    {
      key: "name",
      label: "Tên vị trí",
      width: "2fr",
    },
    {
      key: "_count",
      label: "Số người dùng",
      width: "1fr",
      align: "center",
      render: (value, row) => row._count?.user_information || 0,
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
          Tạo vị trí
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên vị trí..."
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
        data={positions}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Briefcase size={48} />,
          message: debouncedSearch ? "Không tìm thấy vị trí nào" : "Chưa có vị trí nào",
        }}
        rowKey="id"
      />

      {positions.length > 0 && totalPages > 1 && (
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
        title="Tạo vị trí mới"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitCreate} loading={isCreating}>
              Tạo
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Tên vị trí"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vị trí"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Cấp độ"
            options={levelOptions}
            value={formData.level_id ? Number(formData.level_id) : undefined}
            onChange={(value) => setFormData({ ...formData, level_id: value.toString() })}
            placeholder="Chọn cấp độ (tùy chọn)"
            fullWidth
          />
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả (tùy chọn)"
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa vị trí"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitEdit} loading={isUpdating}>
              Cập nhật
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Tên vị trí"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên vị trí"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Cấp độ"
            options={levelOptions}
            value={formData.level_id ? Number(formData.level_id) : undefined}
            onChange={(value) => setFormData({ ...formData, level_id: value.toString() })}
            placeholder="Chọn cấp độ (tùy chọn)"
            fullWidth
          />
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả (tùy chọn)"
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết vị trí"
        size="md"
      >
        {detailData?.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên vị trí:</strong> {detailData.data.name}
            </div>
            {detailData.data.level && (
              <div>
                <strong>Cấp độ:</strong> {detailData.data.level.name}
              </div>
            )}
            {detailData.data.description && (
              <div>
                <strong>Mô tả:</strong> {detailData.data.description}
              </div>
            )}
            <div>
              <strong>Số người dùng:</strong> {detailData.data._count?.user_information || 0}
            </div>
            <div>
              <strong>Số kỹ năng:</strong> {detailData.data._count?.skills || 0}
            </div>
            {detailData.data.created_at && (
              <div>
                <strong>Ngày tạo:</strong> {new Date(detailData.data.created_at).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa vị trí"
        message={`Bạn có chắc chắn muốn xóa vị trí "${selectedPosition?.name}" không?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PositionManagement;

