"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Modal, Button, Input, TextArea, Select, DatePicker } from "@/components/common";
import { ProjectCreateRequest } from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ProjectIndustry, ProjectStatus, ProjectType } from "@/constants/enums";
import userService from "@/services/user.service";
import { User } from "@/types/api";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import { FormContainer, FormGrid, FormGridFull } from "./createProjectModalStyle";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const projectTypeOptions = [
  { value: ProjectType.CUSTOMER, label: 'Khách hàng' },
  { value: ProjectType.IN_HOUSE, label: 'Nội bộ' },
  { value: ProjectType.START_UP, label: 'Khởi nghiệp' },
  { value: ProjectType.INTERNAL, label: 'Nội bộ' },
];

const statusOptions = [
  { value: ProjectStatus.OPEN, label: 'Mở' },
  { value: ProjectStatus.IN_PROGRESS, label: 'Đang thực hiện' },
  { value: ProjectStatus.PENDING, label: 'Tạm dừng' },
  { value: ProjectStatus.CLOSED, label: 'Đã đóng' },
];

const industryOptions = [
  { value: ProjectIndustry.IT, label: 'Công nghệ thông tin' },
  { value: ProjectIndustry.FINANCE, label: 'Tài chính' },
  { value: ProjectIndustry.MANUFACTURING, label: 'Sản xuất' },
  { value: ProjectIndustry.OTHER, label: 'Khác' },
];


interface CreateProjectFormData {
  name: string;
  code: string;
  status: ProjectStatus;
  project_type: ProjectType;
  industry: ProjectIndustry;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  team_id?: number;
  manager_id?: number;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);
  const { createProject, isPending } = useProjectMutation();
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateProjectFormData>({
    defaultValues: {
      name: '',
      code: '',
      status: ProjectStatus.OPEN,
      project_type: ProjectType.INTERNAL,
      industry: ProjectIndustry.IT,
      description: '',
      start_date: null,
      end_date: null,
      team_id: undefined,
      manager_id: undefined,
    },
    mode: "onChange",
  });

  const startDate = watch("start_date");

  useEffect(() => {
    if (!isOpen) {
      reset();
      setManagerSearchTerm("");
      setDebouncedManagerSearch("");
    }
  }, [isOpen, reset]);

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

  const onSubmit = async (data: CreateProjectFormData) => {
    if (!selectedDivisionId) {
      return;
    }

    const payload: ProjectCreateRequest = {
      name: data.name.trim(),
      code: data.code.trim(),
      status: data.status,
      division_id: selectedDivisionId,
      team_id: data.team_id,
      manager_id: data.manager_id === 0 ? undefined : data.manager_id,
      project_type: data.project_type,
      industry: data.industry,
      description: data.description.trim(),
      start_date: data.start_date ? formatDateForAPI(data.start_date) : '',
      end_date: data.end_date ? formatDateForAPI(data.end_date) : '',
    };

    createProject(payload, {
      onSuccess: () => {
        onSave();
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo dự án mới"
      size="lg"
      closable
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={isPending}>
            Tạo dự án
          </Button>
        </>
      }
    >
      <FormContainer>
        <FormGrid>
          <Input
            label="Tên dự án"
            required
            {...register("name", {
              required: "Tên dự án là bắt buộc",
            })}
            placeholder="Nhập tên dự án"
            error={errors.name?.message}
            disabled={isPending}
          />
          <Input
            label="Mã dự án"
            required
            {...register("code", {
              required: "Mã dự án là bắt buộc",
            })}
            placeholder="Nhập mã dự án"
            error={errors.code?.message}
            disabled={isPending}
          />
        </FormGrid>

        <FormGrid>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Trạng thái là bắt buộc" }}
            render={({ field }) => (
              <Select
                label="Trạng thái"
                required
                options={statusOptions}
                value={field.value}
                onChange={(v) => field.onChange(v as ProjectStatus)}
                error={errors.status?.message}
                disabled={isPending}
              />
            )}
          />
          <Controller
            name="project_type"
            control={control}
            rules={{ required: "Loại dự án là bắt buộc" }}
            render={({ field }) => (
              <Select
                label="Loại dự án"
                required
                options={projectTypeOptions}
                value={field.value}
                onChange={(v) => field.onChange(v as ProjectType)}
                error={errors.project_type?.message}
                disabled={isPending}
              />
            )}
          />
        </FormGrid>

        <FormGrid>
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Ngày bắt đầu là bắt buộc" }}
            render={({ field }) => (
              <DatePicker
                label="Ngày bắt đầu"
                required
                value={field.value}
                onChange={(date) => field.onChange(date)}
                error={errors.start_date?.message}
                disabled={isPending}
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            rules={{
              required: "Ngày kết thúc là bắt buộc",
              validate: (value) => {
                if (startDate && value && value < startDate) {
                  return "Ngày kết thúc phải sau ngày bắt đầu";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <DatePicker
                label="Ngày kết thúc"
                required
                value={field.value}
                onChange={(date) => field.onChange(date)}
                error={errors.end_date?.message}
                disabled={isPending}
                minDate={startDate || undefined}
              />
            )}
          />
        </FormGrid>

        <FormGrid>
          <Controller
            name="industry"
            control={control}
            rules={{ required: "Ngành là bắt buộc" }}
            render={({ field }) => (
              <Select
                label="Ngành"
                required
                options={industryOptions}
                value={field.value}
                onChange={(v) => field.onChange(v as ProjectIndustry)}
                error={errors.industry?.message}
                disabled={isPending}
              />
            )}
          />
          <Input
            label="Team ID (tùy chọn)"
            type="number"
            {...register("team_id", {
              valueAsNumber: true,
            })}
            placeholder="Nhập Team ID"
            disabled={isPending}
          />
        </FormGrid>

        <Controller
          name="manager_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Quản lý dự án"
              options={managerOptions}
              value={field.value || 0}
              onChange={(v) => {
                const managerId = Number(v);
                field.onChange(managerId === 0 ? undefined : managerId);
              }}
              placeholder="Chọn quản lý dự án"
              searchable
              onSearchChange={setManagerSearchTerm}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={!!isFetchingNextPage}
              fetchNextPage={fetchNextPage || (() => {})}
              loadingText="Đang tải thêm..."
              disabled={isPending || !selectedDivisionId}
              error={errors.manager_id?.message}
            />
          )}
        />

        <TextArea
          label="Mô tả"
          required
          {...register("description", {
            required: "Mô tả là bắt buộc",
          })}
          placeholder="Nhập mô tả dự án"
          error={errors.description?.message}
          disabled={isPending}
          rows={3}
        />
      </FormContainer>
    </Modal>
  );
};

export default CreateProjectModal;

