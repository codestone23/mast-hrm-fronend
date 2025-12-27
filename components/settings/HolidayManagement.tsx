"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useHolidays, useHolidayDetail, useHolidayMutations } from "@/hooks/useSettings";
import { Holiday } from "@/types/api";
import { HolidayType, HolidayStatus } from "@/constants/enums";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import TextArea from "@/components/common/TextArea/TextArea";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import { ITEMS_PER_PAGE } from "@/constants/constants";

const HolidayManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "" as HolidayType | "",
    status: "" as HolidayStatus | "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }>({});

  const { data, isLoading, error } = useHolidays({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const { data: detailData } = useHolidayDetail(selectedHoliday?.id || null);
  const { createHoliday, updateHoliday, deleteHoliday, isCreating, isUpdating, isDeleting } = useHolidayMutations();

  const holidays = data?.data || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const typeOptions = [
    { value: HolidayType.NATIONAL, label: "Quốc gia" },
    { value: HolidayType.COMPANY, label: "Công ty" },
  ];

  const statusOptions = [
    { value: HolidayStatus.ACTIVE, label: "Hoạt động" },
    { value: HolidayStatus.INACTIVE, label: "Không hoạt động" },
  ];

  const handleCreate = () => {
    setFormData({
      name: "",
      type: "",
      status: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setFormData({
      name: holiday.name,
      type: holiday.type,
      status: holiday.status,
      start_date: holiday.start_date.split('T')[0],
      end_date: holiday.end_date.split('T')[0],
      description: holiday.description || "",
    });
    setErrors({});
    setSelectedHoliday(holiday);
    setIsEditModalOpen(true);
  };

  const handleView = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên ngày lễ là bắt buộc";
    }
    if (!formData.type) {
      newErrors.type = "Loại ngày lễ là bắt buộc";
    }
    if (!formData.status) {
      newErrors.status = "Trạng thái là bắt buộc";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Ngày bắt đầu là bắt buộc";
    }
    if (!formData.end_date) {
      newErrors.end_date = "Ngày kết thúc là bắt buộc";
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;
    createHoliday({
      name: formData.name.trim(),
      type: formData.type as HolidayType,
      status: formData.status as HolidayStatus,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description.trim() || undefined,
    });
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      type: "",
      status: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedHoliday?.id) return;
    updateHoliday({
      id: selectedHoliday.id,
      data: {
        name: formData.name.trim(),
        type: formData.type as HolidayType,
        status: formData.status as HolidayStatus,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description.trim() || undefined,
      },
    });
    setIsEditModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedHoliday?.id) return;
    deleteHoliday(selectedHoliday.id);
    setIsDeleteModalOpen(false);
    setSelectedHoliday(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getTypeLabel = (type: HolidayType) => {
    return type === HolidayType.NATIONAL ? "Quốc gia" : "Công ty";
  };

  const getStatusBadge = (status: HolidayStatus) => {
    const isActive = status === HolidayStatus.ACTIVE;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
          backgroundColor: isActive ? "#4CAF5020" : "#EF535020",
          color: isActive ? "#4CAF50" : "#EF5350",
        }}
      >
        {isActive ? "Hoạt động" : "Không hoạt động"}
      </span>
    );
  };

  const columns: TableColumn<Holiday>[] = [
    {
      key: "name",
      label: "Tên ngày lễ",
      width: "2fr",
    },
    {
      key: "type",
      label: "Loại",
      width: "1fr",
      render: (_, row) => getTypeLabel(row.type),
    },
    {
      key: "start_date",
      label: "Ngày bắt đầu",
      width: "1fr",
      render: (_, row) => formatDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Ngày kết thúc",
      width: "1fr",
      render: (_, row) => formatDate(row.end_date),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "1fr",
      align: "center",
      render: (_, row) => getStatusBadge(row.status),
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
          Tạo ngày lễ
        </Button>
      </div>

      <Table
        columns={columns}
        data={holidays}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Calendar size={48} />,
          message: "Chưa có ngày lễ nào",
        }}
        rowKey="id"
      />

      {holidays.length > 0 && totalPages > 1 && (
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
        title="Tạo ngày lễ mới"
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
            label="Tên ngày lễ"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            placeholder="Nhập tên ngày lễ"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Loại ngày lễ"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => {
              setFormData({ ...formData, type: value as HolidayType });
              if (errors.type) setErrors({ ...errors, type: "" });
            }}
            placeholder="Chọn loại ngày lễ"
            error={errors.type}
            required
            fullWidth
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => {
              setFormData({ ...formData, status: value as HolidayStatus });
              if (errors.status) setErrors({ ...errors, status: "" });
            }}
            placeholder="Chọn trạng thái"
            error={errors.status}
            required
            fullWidth
          />
          <DatePicker
            label="Ngày bắt đầu"
            value={parseDateFromAPI(formData.start_date)}
            onChange={(date) => {
              setFormData({
                ...formData,
                start_date: date ? formatDateForAPI(date) : "",
              });
              if (errors.start_date) setErrors({ ...errors, start_date: "" });
            }}
            placeholder="Chọn ngày bắt đầu"
            error={errors.start_date}
            required
            fullWidth
          />
          <DatePicker
            label="Ngày kết thúc"
            value={parseDateFromAPI(formData.end_date)}
            onChange={(date) => {
              setFormData({
                ...formData,
                end_date: date ? formatDateForAPI(date) : "",
              });
              if (errors.end_date) setErrors({ ...errors, end_date: "" });
            }}
            placeholder="Chọn ngày kết thúc"
            error={errors.end_date}
            required
            fullWidth
          />
          <TextArea
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả (tùy chọn)"
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa ngày lễ"
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
            label="Tên ngày lễ"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            placeholder="Nhập tên ngày lễ"
            error={errors.name}
            required
            fullWidth
          />
          <Select
            label="Loại ngày lễ"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => {
              setFormData({ ...formData, type: value as HolidayType });
              if (errors.type) setErrors({ ...errors, type: "" });
            }}
            placeholder="Chọn loại ngày lễ"
            error={errors.type}
            required
            fullWidth
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => {
              setFormData({ ...formData, status: value as HolidayStatus });
              if (errors.status) setErrors({ ...errors, status: "" });
            }}
            placeholder="Chọn trạng thái"
            error={errors.status}
            required
            fullWidth
          />
          <DatePicker
            label="Ngày bắt đầu"
            value={parseDateFromAPI(formData.start_date)}
            onChange={(date) => {
              setFormData({
                ...formData,
                start_date: date ? formatDateForAPI(date) : "",
              });
              if (errors.start_date) setErrors({ ...errors, start_date: "" });
            }}
            placeholder="Chọn ngày bắt đầu"
            error={errors.start_date}
            required
            fullWidth
          />
          <DatePicker
            label="Ngày kết thúc"
            value={parseDateFromAPI(formData.end_date)}
            onChange={(date) => {
              setFormData({
                ...formData,
                end_date: date ? formatDateForAPI(date) : "",
              });
              if (errors.end_date) setErrors({ ...errors, end_date: "" });
            }}
            placeholder="Chọn ngày kết thúc"
            error={errors.end_date}
            required
            fullWidth
          />
          <TextArea
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả (tùy chọn)"
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết ngày lễ"
        size="md"
      >
        {detailData?.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên ngày lễ:</strong> {detailData.data.name}
            </div>
            <div>
              <strong>Loại:</strong> {getTypeLabel(detailData.data.type)}
            </div>
            <div>
              <strong>Trạng thái:</strong> {getStatusBadge(detailData.data.status)}
            </div>
            <div>
              <strong>Ngày bắt đầu:</strong> {formatDate(detailData.data.start_date)}
            </div>
            <div>
              <strong>Ngày kết thúc:</strong> {formatDate(detailData.data.end_date)}
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
        title="Xác nhận xóa ngày lễ"
        message={`Bạn có chắc chắn muốn xóa ngày lễ "${selectedHoliday?.name}" không?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default HolidayManagement;
