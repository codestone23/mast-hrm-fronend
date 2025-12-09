"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Languages } from "lucide-react";
import { useLanguages, useLanguageDetail, useLanguageMutations } from "@/hooks/useSettings";
import { Language } from "@/services/settings.service";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";

const ITEMS_PER_PAGE = 10;

const LanguageManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});

  const { data, isLoading, error } = useLanguages({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const { data: detailData } = useLanguageDetail(selectedLanguage?.id || null);
  const { createLanguage, updateLanguage, deleteLanguage, isCreating, isUpdating } = useLanguageMutations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const languages = data?.data || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const handleCreate = () => {
    setFormData({ name: "", code: "", description: "" });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (language: Language) => {
    setFormData({
      name: language.name,
      code: language.code,
      description: language.description || "",
    });
    setErrors({});
    setSelectedLanguage(language);
    setIsEditModalOpen(true);
  };

  const handleView = (language: Language) => {
    setSelectedLanguage(language);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (language: Language) => {
    setSelectedLanguage(language);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { name?: string; code?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên ngôn ngữ là bắt buộc";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Mã ngôn ngữ là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;
    createLanguage({
      name: formData.name.trim()
    });
    setIsCreateModalOpen(false);
    setFormData({ name: "", code: "", description: "" });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedLanguage?.id) return;
    updateLanguage({
      id: selectedLanguage.id,
      data: {
        name: formData.name.trim(),
      },
    });
    setIsEditModalOpen(false);
    setSelectedLanguage(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedLanguage?.id) return;
    deleteLanguage(selectedLanguage.id);
    setIsDeleteModalOpen(false);
    setSelectedLanguage(null);
  };

  const columns: TableColumn<Language>[] = [
    {
      key: "name",
      label: "Tên ngôn ngữ",
      width: "2fr",
    },
    {
      key: "_count",
      label: "Số người dùng",
      width: "1fr",
      align: "center",
      render: (value, row) => row._count?.user_languages || 0,
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
          Tạo ngôn ngữ
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên ngôn ngữ..."
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
        data={languages}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Languages size={48} />,
          message: debouncedSearch ? "Không tìm thấy ngôn ngữ nào" : "Chưa có ngôn ngữ nào",
        }}
        rowKey="id"
      />

      {languages.length > 0 && totalPages > 1 && (
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
        title="Tạo ngôn ngữ mới"
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
            label="Tên ngôn ngữ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên ngôn ngữ"
            error={errors.name}
            required
            fullWidth
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa ngôn ngữ"
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
            label="Tên ngôn ngữ"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên ngôn ngữ"
            error={errors.name}
            required
            fullWidth
          />
          <Input
            label="Mã ngôn ngữ"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="Nhập mã ngôn ngữ (ví dụ: en, vi)"
            error={errors.code}
            required
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
        title="Chi tiết ngôn ngữ"
        size="md"
      >
        {detailData?.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên ngôn ngữ:</strong> {detailData.data.name}
            </div>
            <div>
              <strong>Mã:</strong> {detailData.data.code}
            </div>
            {detailData.data.description && (
              <div>
                <strong>Mô tả:</strong> {detailData.data.description}
              </div>
            )}
            <div>
              <strong>Số người dùng:</strong> {detailData.data._count?.user_languages || 0}
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
        title="Xác nhận xóa ngôn ngữ"
        message={`Bạn có chắc chắn muốn xóa ngôn ngữ "${selectedLanguage?.name}" không?`}
      />
    </div>
  );
};

export default LanguageManagement;

