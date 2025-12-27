"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "@/utils/help";
import {
  FormContainer,
  UserInfoSection,
  UserInfoLabel,
  UserInfoValue,
  InfoBox,
  RolesContainer,
  RoleBadge,
  RolesLabel,
} from "./unassignEmployeeRoleModalStyle";

interface UnassignEmployeeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  isLoading?: boolean;
}

const UnassignEmployeeRoleModal: React.FC<UnassignEmployeeRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoading = false,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  interface UnassignRoleFormData {
    assignmentIndex: number;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnassignRoleFormData>({
    defaultValues: {
      assignmentIndex: -1,
    },
    mode: "onChange",
  });

  // Get user's existing DIVISION and PROJECT scope role assignments
  const existingAssignments = user?.user_role_assignments?.filter(
    (assignment) => 
      assignment.scope_type === ScopeType.DIVISION || 
      assignment.scope_type === ScopeType.PROJECT ||
      assignment.scope_type === ScopeType.TEAM
  ) || [];

  // Create options from existing assignments
  const assignmentOptions: SelectOption[] = existingAssignments.map((assignment, index) => {
    const scopeInfo = assignment.scope_id 
      ? ` (${assignment.scope_type} #${assignment.scope_id})`
      : ` (${assignment.scope_type})`;
    return {
      value: index,
      label: `${getRoleName(assignment.role.name)}${scopeInfo}`,
    };
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Unassign role mutation
  const unassignRoleMutation = useMutation({
    mutationFn: ({ 
      userId, 
      roleId, 
      scopeType, 
      scopeId 
    }: { 
      userId: number; 
      roleId: number; 
      scopeType: ScopeType;
      scopeId: number | null;
    }) =>
      rolesService.unassignRole(userId, roleId, scopeType, scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Thu hồi vai trò thành công");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi thu hồi vai trò"
      );
    },
  });

  const onSubmit = (data: UnassignRoleFormData) => {
    if (!user || data.assignmentIndex < 0) {
      showErrorToast("Vui lòng chọn vai trò cần thu hồi");
      return;
    }

    const assignment = existingAssignments[data.assignmentIndex];
    if (!assignment) {
      showErrorToast("Vai trò không hợp lệ");
      return;
    }

    unassignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: assignment.role.id,
      scopeType: assignment.scope_type,
      scopeId: assignment.scope_id,
    });
  };

  const handleClose = () => {
    if (!unassignRoleMutation.isPending) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thu hồi vai trò"
      size="md"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={unassignRoleMutation.isPending || isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="error"
            onClick={handleSubmit(onSubmit)}
            loading={unassignRoleMutation.isPending || isLoading}
            disabled={unassignRoleMutation.isPending || isLoading}
          >
            Thu hồi vai trò
          </Button>
        </>
      }
    >
      <FormContainer>
        {user && (
          <UserInfoSection>
            <UserInfoLabel>Nhân viên</UserInfoLabel>
            <UserInfoValue>
              {user.user_information && 
               typeof user.user_information === 'object' && 
               !Array.isArray(user.user_information) &&
               'name' in user.user_information
                ? (user.user_information as { name: string }).name
                : user.name || user.email}
            </UserInfoValue>
          </UserInfoSection>
        )}

        {existingAssignments.length > 0 ? (
          <>
            <Controller
              name="assignmentIndex"
              control={control}
              rules={{ 
                required: "Vui lòng chọn vai trò cần thu hồi",
                validate: (value) => value >= 0 || "Vui lòng chọn vai trò cần thu hồi"
              }}
              render={({ field }) => (
                <Select
                  label="Vai trò cần thu hồi"
                  options={assignmentOptions}
                  value={field.value >= 0 ? field.value : ""}
                  onChange={(value) => field.onChange(value ? Number(value) : -1)}
                  placeholder="Chọn vai trò cần thu hồi"
                  required
                  fullWidth
                  disabled={unassignRoleMutation.isPending || isLoading}
                  error={errors.assignmentIndex?.message}
                />
              )}
            />

            <div>
              <RolesLabel>Tất cả vai trò hiện tại (Phòng ban/Dự án/Đội nhóm):</RolesLabel>
              <RolesContainer>
                {existingAssignments.map((assignment, index) => {
                  const scopeInfo = assignment.scope_id 
                    ? ` (${assignment.scope_type} #${assignment.scope_id})`
                    : ` (${assignment.scope_type})`;
                  return (
                    <RoleBadge key={index}>
                      {getRoleName(assignment.role.name)}{scopeInfo}
                    </RoleBadge>
                  );
                })}
              </RolesContainer>
            </div>
          </>
        ) : (
          <InfoBox $variant="error">
            Nhân viên này chưa có vai trò nào (Phòng ban/Dự án/Đội nhóm) để thu hồi.
          </InfoBox>
        )}
      </FormContainer>
    </Modal>
  );
};

export default UnassignEmployeeRoleModal;

