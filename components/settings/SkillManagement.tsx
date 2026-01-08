"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useSkills, useSkillDetail, useSkillMutations } from "@/hooks/useSettings";
import { usePositions } from "@/hooks/useSettings";
import { Skill } from "@/services/settings.service";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import { Brain } from "lucide-react";
import { ITEMS_PER_PAGE } from "@/constants/constants";

interface SkillFormData {
  name: string;
  position_id: number | undefined;
}

const SkillManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const { data, isLoading, error } = useSkills({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const { data: positionsData } = usePositions({ limit: 100 });
  const { data: detailData } = useSkillDetail(selectedSkill?.skill_id || null);
  const { createSkill, updateSkill, deleteSkill, isCreating, isUpdating } = useSkillMutations();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SkillFormData>({
    defaultValues: {
      name: "",
      position_id: undefined,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset form when modals open/close
  useEffect(() => {
    if (!isCreateModalOpen && !isEditModalOpen) {
      reset({
        name: "",
        position_id: undefined,
      });
    }
  }, [isCreateModalOpen, isEditModalOpen, reset]);

  const skills = data?.data.map((skill) => {
    return {
      ...skill,
      name: skill.skill?.name || "-",
    };
  }) || [];
  const pagination = data?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const positionOptions = useMemo(() => {
    return (positionsData?.data || []).map((pos) => ({
      value: pos.id!,
      label: pos.name,
    }));
  }, [positionsData]);

  const handleCreate = () => {
    reset({
      name: "",
      position_id: undefined,
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    reset({
      name: skill.name,
      position_id: skill.position_id,
    });
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteModalOpen(true);
  };

  const onSubmitCreate = (data: SkillFormData) => {
    createSkill({
      name: data.name.trim(),
      position_id: Number(data.position_id),
    }, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        reset();
      }
    });
  };

  const onSubmitEdit = (data: SkillFormData) => {
    if (!selectedSkill?.id) return;
    updateSkill({
      id: selectedSkill.id,
      data: {
        name: data.name.trim(),
        position_id: Number(data.position_id),
      },
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedSkill(null);
        reset();
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedSkill?.id) return;
    deleteSkill(selectedSkill.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedSkill(null);
      }
    });
  };

  const getPositionName = (positionId: number) => {
    return positionsData?.data.find((pos) => pos.id === positionId)?.name || "";
  };

  const columns: TableColumn<Skill>[] = [
    {
      key: "name",
      label: "Tên kỹ năng",
      width: "2fr",
    },
    {
      key: "skill",
      label: "Vị trí",
      width: "2fr",
      render: (value, row) => getPositionName(row?.skill?.position_id || 0) || "-",
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
          Tạo kỹ năng
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên kỹ năng..."
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
        data={skills}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <Brain size={48} />,
          message: debouncedSearch ? "Không tìm thấy kỹ năng nào" : "Chưa có kỹ năng nào",
        }}
        rowKey="id"
      />

      {skills.length > 0 && totalPages > 1 && (
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
        title="Tạo kỹ năng mới"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting || isCreating}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitCreate)} loading={isSubmitting || isCreating}>
              Tạo
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmitCreate)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="Tên kỹ năng"
              {...register("name", {
                required: "Tên kỹ năng là bắt buộc",
              })}
              placeholder="Nhập tên kỹ năng"
              error={errors.name?.message}
              required
              fullWidth
            />
            <Controller
              name="position_id"
              control={control}
              rules={{ required: "Vị trí là bắt buộc" }}
              render={({ field }) => (
                <Select
                  label="Vị trí"
                  options={positionOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder="Chọn vị trí"
                  error={errors.position_id?.message}
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa kỹ năng"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting || isUpdating}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmitEdit)} loading={isSubmitting || isUpdating}>
              Cập nhật
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="Tên kỹ năng"
              {...register("name", {
                required: "Tên kỹ năng là bắt buộc",
              })}
              placeholder="Nhập tên kỹ năng"
              error={errors.name?.message}
              required
              fullWidth
            />
            <Controller
              name="position_id"
              control={control}
              rules={{ required: "Vị trí là bắt buộc" }}
              render={({ field }) => (
                <Select
                  label="Vị trí"
                  options={positionOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder="Chọn vị trí"
                  error={errors.position_id?.message}
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết kỹ năng"
        size="md"
      >
        {detailData?.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong>Tên kỹ năng:</strong> {detailData.data.skill?.name || "-"}
            </div>
            <div>
              <strong>Vị trí:</strong> {detailData.data.position?.name || "-"}
            </div>
            <div>
              <strong>Số người dùng:</strong> {detailData.data._count?.user_skills || 0}
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
        title="Xác nhận xóa kỹ năng"
        message={`Bạn có chắc chắn muốn xóa kỹ năng "${selectedSkill?.name}" không?`}
      />
    </div>
  );
};

export default SkillManagement;

