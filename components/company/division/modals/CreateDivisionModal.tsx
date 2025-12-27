"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Modal, Button, Input, Select, TextArea } from "@/components/common";
import { useCreateDivision } from "@/hooks/useDivisions";
import { useToast } from "@/hooks/useToast";
import { DivisionType } from "@/constants/enums";
import { CreateDivisionRequest, User } from "@/types/api";
import userService from "@/services/user.service";
import { FormContainer, FormGrid } from "./modalStyle";

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: CreateDivisionRequest) => void;
}

interface CreateDivisionFormData {
  name: string;
  description: string;
  parent_id?: number;
  type: DivisionType;
  leader_id?: number;
}

const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateDivisionFormData>({
    defaultValues: {
      name: "",
      description: "",
      parent_id: undefined,
      type: DivisionType.TECHNICAL,
      leader_id: undefined,
    },
    mode: "onChange",
  });


  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLeaderSearch(leaderSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [leaderSearchTerm]);

  // Fetch users for leader selection with infinite scroll
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    queryKey: ["users", "for-leader", debouncedLeaderSearch],
    queryFn: ({ pageParam = 1 }) =>
      userService.getUsers(pageParam, 20, debouncedLeaderSearch || undefined),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isOpen,
  });

  const getUserName = (user: User) => {
    if (
      user.user_information && 
      typeof user.user_information === 'object' && 
      !Array.isArray(user.user_information) && 
      'name' in user.user_information
    ) {
      return (user.user_information as { name: string }).name;
    }
    return user.name || user.email;
  };

  const allUsers = useMemo(() => {
    return usersData?.pages.flatMap((page) => page.data || []) || [];
  }, [usersData]);

  const leaderOptions = useMemo(() => {
    return [
      { value: "", label: "Chưa chọn trưởng phòng" },
      ...allUsers.map((user: User) => ({
        value: user.id,
        label: getUserName(user),
      })),
    ];
  }, [allUsers]);

  // Create division mutation
  const createMutation = useCreateDivision();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [isOpen, reset]);

  // Handle mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      showSuccessToast("Tạo phòng ban thành công");
      onClose();
    }
  }, [createMutation.isSuccess, onClose, showSuccessToast]);

  useEffect(() => {
    if (createMutation.isError) {
      const error = createMutation.error as { response?: { data?: { message?: string } } };
      showErrorToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo phòng ban"
      );
    }
  }, [createMutation.isError, createMutation.error, showErrorToast]);

  const onSubmit = (data: CreateDivisionFormData) => {
    const payload: CreateDivisionRequest = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      parent_id: data.parent_id,
      type: data.type,
      leader_id: data.leader_id,
    };

    createMutation.mutate(payload);
    if (onSave) {
      onSave(payload);
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose();
    }
  };

  const isLoading = createMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo phòng ban mới"
      size="lg"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            Tạo phòng ban
          </Button>
        </>
      }
    >
      <FormContainer>
        <Input
          label="Tên phòng ban"
          required
          {...register("name", {
            required: "Tên phòng ban là bắt buộc",
          })}
          error={errors.name?.message}
          placeholder="Nhập tên phòng ban"
          disabled={isLoading}
          fullWidth
        />

        <FormGrid>
          <Controller
            name="leader_id"
            control={control}
            rules={{
              required: "Trưởng phòng là bắt buộc",
            }}
            render={({ field }) => (
              <Select
                label="Trưởng phòng"
                required
                options={leaderOptions}
                value={field.value ?? ""}
                onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                placeholder="Chọn trưởng phòng"
                searchable
                onSearchChange={setLeaderSearchTerm}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                loadingText="Đang tải thêm..."
                disabled={isLoading || isLoadingUsers}
                error={errors.leader_id?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{
              required: "Loại phòng ban là bắt buộc",
            }}
            render={({ field }) => (
              <Select
                label="Loại phòng ban"
                required
                options={[
                  { value: DivisionType.TECHNICAL, label: "Kỹ thuật" },
                  { value: DivisionType.BUSINESS, label: "Kinh doanh" },
                  { value: DivisionType.OPERATIONS, label: "Vận hành" },
                  { value: DivisionType.OTHER, label: "Khác" },
                ]}
                value={field.value}
                onChange={(v) => field.onChange(v as DivisionType)}
                error={errors.type?.message}
                disabled={isLoading}
                fullWidth
              />
            )}
          />
        </FormGrid>

        <TextArea
          label="Mô tả"
          {...register("description")}
          placeholder="Nhập mô tả phòng ban (tùy chọn)"
          rows={4}
          disabled={isLoading}
          fullWidth
        />
      </FormContainer>
    </Modal>
  );
};

export default CreateDivisionModal;
