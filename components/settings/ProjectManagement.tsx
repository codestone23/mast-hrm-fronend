"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, FolderKanban } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Project, ProjectCreateRequest, ProjectUpdateRequest } from "@/services/project.service";
import projectService from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import { useUser } from "@/hooks/useUser";
import Table, { TableColumn } from "@/components/common/Table/Table";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal/ConfirmDeleteModal";
import Pagination from "@/components/common/Pagination/Pagination";
import TextArea from "@/components/common/TextArea/TextArea";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import { ProjectAccessType } from "@/constants/enums";

const ITEMS_PER_PAGE = 10;
const ProjectManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectCreateRequest>>({
    name: '',
    code: '',
    description: '',
    start_date: '',
    end_date: '',
    project_access_type: 'COMPANY',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createProject, updateProject, deleteProject, isCreating, isUpdating, isDeleting } = useProjectMutation();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch projects with COMPANY access type
  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects-company', currentPage, debouncedSearch],
    queryFn: () => projectService.getProjectsAdmin(
      currentPage,
      debouncedSearch || undefined,
      undefined,
      'COMPANY'
    ),
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const projects = projectsData?.data || [];
  const pagination = projectsData?.pagination || { total: 0, current_page: 1, total_pages: 1 };
  const totalPages = pagination.total_pages || Math.ceil(pagination.total / ITEMS_PER_PAGE);

  const handleCreate = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      start_date: '',
      end_date: '',
      project_access_type: ProjectAccessType.COMPANY,
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      code: project.code,
      description: project.description || '',
      start_date: project.start_date,
      end_date: project.end_date,
      project_access_type: (project.project_access_type || ProjectAccessType.COMPANY) as ProjectAccessType,
    });
    setErrors({});
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên dự án là bắt buộc';
    }
    if (!formData.code?.trim()) {
      newErrors.code = 'Mã dự án là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Ngày bắt đầu là bắt buộc';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'Ngày kết thúc là bắt buộc';
    }
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;

    const payload: ProjectCreateRequest = {
      name: formData.name!,
      code: formData.code!,
      project_access_type: ProjectAccessType.COMPANY,
      description: formData.description!,
      start_date: formData.start_date!,
      end_date: formData.end_date!,
      manager_id: user?.id,
    };

    createProject(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects-company'] });
        setIsCreateModalOpen(false);
        setFormData({
          name: '',
          code: '',
          description: '',
          start_date: '',
          end_date: '',
          project_access_type: ProjectAccessType.COMPANY,
        });
      },
    });
  };

  const handleSubmitEdit = () => {
    if (!validateForm() || !selectedProject?.id) return;

    const payload: ProjectUpdateRequest = {
      name: formData.name,
      description: formData.description,
    };

    updateProject({ id: selectedProject.id.toString(), data: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects-company'] });
        setIsEditModalOpen(false);
        setSelectedProject(null);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedProject?.id) return;
    deleteProject(selectedProject.id.toString(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects-company'] });
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
      },
    });
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromString = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const columns: TableColumn<Project>[] = [
    {
      key: "code",
      label: "Mã dự án",
      width: "120px",
    },
    {
      key: "name",
      label: "Tên dự án",
      width: "2fr",
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
          Tạo dự án
        </Button>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm kiếm theo tên dự án..."
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
        data={projects}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <FolderKanban size={48} />,
          message: debouncedSearch ? "Không tìm thấy dự án nào" : "Chưa có dự án nào",
        }}
        rowKey="id"
      />

      {projects.length > 0 && totalPages > 1 && (
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
        title="Tạo dự án mới"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} disabled={isCreating}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitCreate} loading={isCreating}>
              Tạo
            </Button>
          </>
        }
      >
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Input
              label="Tên dự án"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên dự án"
              error={errors.name}
              disabled={isCreating}
              fullWidth
            />
            <Input
              label="Mã dự án"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Nhập mã dự án"
              error={errors.code}
              disabled={isCreating}
              fullWidth
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <DatePicker
              label="Ngày bắt đầu"
              required
              value={parseDateFromString(formData.start_date || '')}
              onChange={(date) => {
                setFormData({
                  ...formData,
                  start_date: formatDateForInput(date)
                });
              }}
              error={errors.start_date}
              disabled={isCreating}
              fullWidth
            />
            <DatePicker
              label="Ngày kết thúc"
              required
              value={parseDateFromString(formData.end_date || '')}
              onChange={(date) => {
                setFormData({
                  ...formData,
                  end_date: formatDateForInput(date)
                });
              }}
              error={errors.end_date}
              disabled={isCreating}
              minDate={parseDateFromString(formData.start_date || '') || undefined}
              fullWidth
            />
          </div>
          
          <TextArea
            label="Mô tả"
            required
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả dự án"
            error={errors.description}
            disabled={isCreating}
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa dự án"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>
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
            label="Tên dự án"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên dự án"
            error={errors.name}
            required
            disabled={isUpdating}
            fullWidth
          />
          <TextArea
            label="Mô tả"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả dự án"
            error={errors.description}
            required
            disabled={isUpdating}
            rows={3}
            fullWidth
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa dự án"
        message={`Bạn có chắc chắn muốn xóa dự án "${selectedProject?.name}" không?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjectManagement;

