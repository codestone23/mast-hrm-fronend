"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Modal, Button, Input, Select, TextArea } from "@/components/common";
import { useCreateDivision } from "@/hooks/useDivisions";
import { useToast } from "@/hooks/useToast";
import { DivisionType } from "@/constants/enums";
import { CreateDivisionRequest, User } from "@/types/api";
import userService from "@/services/user.service";

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: CreateDivisionRequest) => void;
}

const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [form, setForm] = useState<CreateDivisionRequest>({ 
    name: "", 
    description: "", 
    parent_id: undefined, 
    type: DivisionType.TECHNICAL, 
    leader_id: undefined 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");


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
      setForm({ 
        name: "", 
        description: "", 
        parent_id: undefined, 
        type: DivisionType.TECHNICAL, 
        leader_id: undefined 
      });
      setErrors({});
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [isOpen]);

  // Handle mutation success/error
  useEffect(() => {
    if (createMutation.isSuccess) {
      showSuccessToast("Tạo phòng ban thành công");
      onClose();
      // Note: Mutation is handled internally, onSave is optional for backward compatibility
      if (onSave) {
        onSave(form);
      }
    }
  }, [createMutation.isSuccess, onClose, onSave, form, showSuccessToast]);

  useEffect(() => {
    if (createMutation.isError) {
      const error = createMutation.error as { response?: { data?: { message?: string } } };
      showErrorToast(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo phòng ban"
      );
    }
  }, [createMutation.isError, createMutation.error, showErrorToast]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) {
      e.name = "Tên phòng ban là bắt buộc";
    }
    if (!form.type) {
      e.type = "Loại phòng ban là bắt buộc";
    }
    if (!form.leader_id) {
      e.leader_id = "Trưởng phòng là bắt buộc";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload: CreateDivisionRequest = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      parent_id: form.parent_id,
      type: form.type,
      leader_id: form.leader_id,
    };

    createMutation.mutate(payload);
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
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Tạo phòng ban
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input
          label="Tên phòng ban"
          required
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            if (errors.name) {
              setErrors({ ...errors, name: "" });
            }
          }}
          error={errors.name}
          placeholder="Nhập tên phòng ban"
          disabled={isLoading}
          fullWidth
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Select
            label="Trưởng phòng"
            required
            options={leaderOptions}
            value={form.leader_id ?? ""}
            onChange={(v) => {
              setForm({ ...form, leader_id: v ? Number(v) : undefined });
              if (errors.leader_id) {
                setErrors({ ...errors, leader_id: "" });
              }
            }}
            placeholder="Chọn trưởng phòng"
            searchable
            onSearchChange={setLeaderSearchTerm}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            loadingText="Đang tải thêm..."
            disabled={isLoading || isLoadingUsers}
            error={errors.leader_id}
            fullWidth
          />

          <Select
            label="Loại phòng ban"
            required
            options={[
              { value: DivisionType.TECHNICAL, label: "Kỹ thuật" },
              { value: DivisionType.BUSINESS, label: "Kinh doanh" },
              { value: DivisionType.OPERATIONS, label: "Vận hành" },
              { value: DivisionType.OTHER, label: "Khác" },
            ]}
            value={form.type}
            onChange={(v) => {
              setForm({ ...form, type: v as DivisionType });
              if (errors.type) {
                setErrors({ ...errors, type: "" });
              }
            }}
            error={errors.type}
            disabled={isLoading}
            fullWidth
          />
        </div>

        <TextArea
          label="Mô tả"
          value={form.description || ""}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
          }}
          placeholder="Nhập mô tả phòng ban (tùy chọn)"
          rows={4}
          disabled={isLoading}
          fullWidth
        />
      </div>
    </Modal>
  );
};

export default CreateDivisionModal;
