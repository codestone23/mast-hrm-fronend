"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Modal, Button, Input, TextArea, Select, DatePicker } from "@/components/common";
import { ProjectCreateRequest } from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ProjectIndustry, ProjectStatus, ProjectType } from "@/constants/enums";
import userService from "@/services/user.service";
import { User } from "@/types/api";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const projectTypeOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'IN_HOUSE', label: 'Nội bộ' },
  { value: 'START_UP', label: 'Khởi nghiệp' },
  { value: 'INTERNAL', label: 'Nội bộ' },
];

const statusOptions = [
  { value: 'OPEN', label: 'Mở' },
  { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
  { value: 'PENDING', label: 'Tạm dừng' },
  { value: 'CLOSED', label: 'Đã đóng' },
];

const industryOptions = [
  { value: 'IT', label: 'Công nghệ thông tin' },
  { value: 'FINANCE', label: 'Tài chính' },
  { value: 'MANUFACTURING', label: 'Sản xuất' },
  { value: 'OTHER', label: 'Khác' },
];


const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);
  const { createProject, isPending } = useProjectMutation();
  const [formData, setFormData] = useState<Partial<ProjectCreateRequest>>({
    name: '',
    code: '',
    status: 'OPEN',
    division_id: selectedDivisionId || 0,
    project_type: 'INTERNAL',
    industry: 'IT',
    description: '',
    start_date: '',
    end_date: '',
    manager_id: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("");

  useEffect(() => {
    if (isOpen && selectedDivisionId) {
      setFormData(prev => ({
        ...prev,
        division_id: selectedDivisionId,
      }));
    }
  }, [isOpen, selectedDivisionId]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedManagerSearch(managerSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [managerSearchTerm]);

  // Fetch users for manager selection with infinite scroll
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "for-manager", selectedDivisionId, debouncedManagerSearch],
    queryFn: ({ pageParam = 1 }) =>
      userService.getUsers(
        pageParam, 
        20, 
        debouncedManagerSearch || undefined,
        undefined,
        undefined,
        selectedDivisionId || undefined
      ),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isOpen && !!selectedDivisionId,
  });

  const getUserName = (user: User) => {
    if (user.user_information && typeof user.user_information === 'object' && !Array.isArray(user.user_information) && 'name' in user.user_information) {
      return (user.user_information as { name: string }).name;
    }
    return user.name || user.email;
  };

  const allUsers = useMemo(() => {
    return usersData?.pages.flatMap((page) => page.data || []) || [];
  }, [usersData]);

  const managerOptions = useMemo(() => {
    return [
      { value: 0, label: "Chưa chọn quản lý" },
      ...allUsers.map((user: User) => ({
        value: user.id,
        label: getUserName(user),
      })),
    ];
  }, [allUsers]);

  const validate = (): boolean => {
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
    if (!formData.division_id) {
      newErrors.division_id = 'Phòng ban là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload: ProjectCreateRequest = {
      name: formData.name!,
      code: formData.code!,
      status: formData.status!,
      division_id: formData.division_id!,
      team_id: formData.team_id,
      manager_id: formData.manager_id,
      project_type: formData.project_type!,
      industry: formData.industry!,
      description: formData.description!,
      start_date: formData.start_date!,
      end_date: formData.end_date!,
    };

    createProject(payload, {
      onSuccess: () => {
        onSave();
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      status: 'OPEN',
      division_id: selectedDivisionId || 0,
      project_type: 'INTERNAL',
      industry: 'IT',
      description: '',
      start_date: '',
      end_date: '',
      manager_id: undefined,
    });
    setErrors({});
    setManagerSearchTerm("");
    setDebouncedManagerSearch("");
    onClose();
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

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={isPending}>
        Hủy
      </Button>
      <Button variant="primary" onClick={handleSubmit} loading={isPending}>
        Tạo dự án
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo dự án mới"
      footer={footer}
      size="lg"
    >
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Tên dự án"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên dự án"
            error={errors.name}
            disabled={isPending}
          />
          <Input
            label="Mã dự án"
            required
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Nhập mã dự án"
            error={errors.code}
            disabled={isPending}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Trạng thái"
            required
            options={statusOptions}
            value={formData.status || 'OPEN'}
            onChange={(v) => setFormData({ ...formData, status: v as ProjectStatus })} 
            error={errors.status}
            disabled={isPending}
          />
          <Select
            label="Loại dự án"
            required
            options={projectTypeOptions}
            value={formData.project_type || 'INTERNAL'}
            onChange={(v) => setFormData({ ...formData, project_type: v as ProjectType })}
            error={errors.project_type}
            disabled={isPending}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
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
              disabled={isPending}
            />
          </div>
          <div>
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
              disabled={isPending}
              minDate={parseDateFromString(formData.start_date || '') || undefined}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Ngành"
            required
            options={industryOptions}
            value={formData.industry || 'IT'}
            onChange={(v) => setFormData({ ...formData, industry: v as ProjectIndustry })}
            error={errors.industry}
            disabled={isPending}
          />
          <Input
            label="Team ID (tùy chọn)"
            type="number"
            value={formData.team_id?.toString() || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              team_id: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Nhập Team ID"
            disabled={isPending}
          />
        </div>

        <Select
          label="Quản lý dự án"
          options={managerOptions}
          value={formData.manager_id || 0}
          onChange={(v) => {
            const managerId = Number(v);
            setFormData({ 
              ...formData, 
              manager_id: managerId === 0 ? undefined : managerId
            });
          }}
          placeholder="Chọn quản lý dự án"
          searchable
          onSearchChange={setManagerSearchTerm}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={!!isFetchingNextPage}
          fetchNextPage={fetchNextPage || (() => {})}
          loadingText="Đang tải thêm..."
          disabled={isPending || !selectedDivisionId}
          error={errors.manager_id}
        />

        <TextArea
          label="Mô tả"
          required
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập mô tả dự án"
          error={errors.description}
          disabled={isPending}
          rows={3}
        />

      </div>
    </Modal>
  );
};

export default CreateProjectModal;

