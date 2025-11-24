"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, GraduationCap } from "lucide-react";
import { useLevels, useLevelDetail, useLevelMutations } from "@/hooks/useSettings";
import { Level } from "@/services/settings.service";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";

const ITEMS_PER_PAGE = 10;

const LevelManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [formData, setFormData] = useState({ name: "", level: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string; level?: string }>({});

  const { data, isLoading, error } = useLevels({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const { data: detailData } = useLevelDetail(selectedLevel?.id || null);
  const { createLevel, updateLevel, deleteLevel, isCreating, isUpdating } = useLevelMutations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const levels = data?.data || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const handleCreate = () => {
    setFormData({ name: "", level: "", description: "" });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (level: Level) => {
    setFormData({
      name: level.name,
      level: level.level.toString(),
      description: level.description || "",
    });
    setErrors({});
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  const handleView = (level: Level) => {
    setSelectedLevel(level);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (level: Level) => {
    setSelectedLevel(level);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { name?: string; level?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên cấp độ là bắt buộc";
    }
    if (!formData.level || isNaN(Number(formData.level)) || Number(formData.level) < 1) {
      newErrors.level = "Cấp độ phải là số nguyên dương";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;
    createLevel({
      name: formData.name.trim(),
      level: Number(formData.level),
      description: formData.description.trim() || undefined,
    });
    setIsCreateModalOpen(false);
    setFormData({ name: "", level: "", description: "" });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedLevel?.id) return;
    updateLevel({
      id: selectedLevel.id,
      data: {
        name: formData.name.trim(),
        level: Number(formData.level),
        description: formData.description.trim() || undefined,
      },
    });
    setIsEditModalOpen(false);
    setSelectedLevel(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedLevel?.id) return;
    deleteLevel(selectedLevel.id);
    setIsDeleteModalOpen(false);
    setSelectedLevel(null);
  };

  const columns: TableColumn<Level>[] = [
    {
      key: "name",
      label: "Tên cấp độ",
      width: "2fr",
    },
    {
      key: "level",
      label: "Cấp độ",
      width: "1fr",
      align: "center",
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
          Tạo cấp độ
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên cấp độ..."
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
        data={levels}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <GraduationCap size={48} />,
          message: debouncedSearch ? "Không tìm thấy cấp độ nào" : "Chưa có cấp độ nào",
        }}
        rowKey="id"
      />

      {levels.length > 0 && totalPages > 1 && (
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
        title="Tạo cấp độ mới"
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
            label="Tên cấp độ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên cấp độ"
            error={errors.name}
            required
            fullWidth
          />
          <Input
            label="Cấp độ (số)"
            type="number"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            placeholder="Nhập cấp độ (ví dụ: 1, 2, 3)"
            error={errors.level}
            required
            fullWidth
            min="1"
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
        title="Chỉnh sửa cấp độ"
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
            label="Tên cấp độ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên cấp độ"
            error={errors.name}
            required
            fullWidth
          />
          <Input
            label="Cấp độ (số)"
            type="number"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            placeholder="Nhập cấp độ (ví dụ: 1, 2, 3)"
            error={errors.level}
            required
            fullWidth
            min="1"
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
        title="Chi tiết cấp độ"
        size="md"
      >
        {detailData?.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên cấp độ:</strong> {detailData.data.name}
            </div>
            <div>
              <strong>Cấp độ:</strong> {detailData.data.level}
            </div>
            {detailData.data.description && (
              <div>
                <strong>Mô tả:</strong> {detailData.data.description}
              </div>
            )}
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
        title="Xác nhận xóa cấp độ"
        message={`Bạn có chắc chắn muốn xóa cấp độ "${selectedLevel?.name}" không?`}
      />
    </div>
  );
};

export default LevelManagement;

