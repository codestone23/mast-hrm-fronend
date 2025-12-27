"use client";

import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "@/utils/help";
import { ROLE_NAMES } from "@/constants/enums";
import {
  FormContainer,
  UserInfoSection,
  UserInfoLabel,
  UserInfoValue,
  RoleBadgeContainer,
  RoleBadge,
  CurrentRolesSection,
  CurrentRolesLabel,
  ErrorMessage,
} from "./modalStyle";

interface UnassignRoleFormData {
  roleId: string | number;
}

interface UnassignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  isLoading?: boolean;
}

const UnassignRoleModal: React.FC<UnassignRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoading = false,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UnassignRoleFormData>({
    defaultValues: {
      roleId: "",
    },
    mode: "onChange",
  });

  // Get user's existing COMPANY scope roles only
  const existingRoles = useMemo(
    () =>
      user?.user_role_assignments?.filter(
        (assignment) => assignment.scope_type === ScopeType.COMPANY
      ) || [],
    [user]
  );

  // Create unique role options (group by role id)
  const roleOptions: SelectOption[] = useMemo(() => {
    const roleMap = new Map<number, { roleId: number; roleName: string }>();
    existingRoles.forEach((assignment) => {
      if (!roleMap.has(assignment.role.id)) {
        roleMap.set(assignment.role.id, {
          roleId: assignment.role.id,
          roleName: assignment.role.name,
        });
      }
    });
    return Array.from(roleMap.values()).map((item) => ({
      value: item.roleId,
      label: getRoleName(item.roleName as ROLE_NAMES),
    }));
  }, [existingRoles]);

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
      scopeId,
    }: {
      userId: number;
      roleId: number;
      scopeType: ScopeType;
      scopeId: number | null;
    }) => rolesService.unassignRole(userId, roleId, scopeType, scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Thu hồi vai trò thành công");
      onClose();
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi thu hồi vai trò"
      );
    },
  });

  const onSubmit = (data: UnassignRoleFormData) => {
    if (!user || !data.roleId) {
      showErrorToast("Vui lòng chọn vai trò cần thu hồi");
      return;
    }

    // For COMPANY scope, scopeId is always null
    unassignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(data.roleId),
      scopeType: ScopeType.COMPANY,
      scopeId: null,
    });
  };

  const handleClose = () => {
    if (!unassignRoleMutation.isPending) {
      reset();
      onClose();
    }
  };

  const getUserName = (): string => {
    if (!user) return "";
    if (
      user.user_information &&
      typeof user.user_information === "object" &&
      !Array.isArray(user.user_information) &&
      "name" in user.user_information
    ) {
      return (user.user_information as { name: string }).name;
    }
    return user.name || user.email;
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
            disabled={
              unassignRoleMutation.isPending ||
              isLoading ||
              isSubmitting ||
              !roleOptions.length
            }
          >
            Thu hồi vai trò
          </Button>
        </>
      }
    >
      <FormContainer>
        {user && (
          <UserInfoSection>
            <UserInfoLabel>Tài khoản</UserInfoLabel>
            <UserInfoValue>{getUserName()}</UserInfoValue>
          </UserInfoSection>
        )}

        {existingRoles.length > 0 ? (
          <>
            <Controller
              name="roleId"
              control={control}
              rules={{ required: "Vui lòng chọn vai trò cần thu hồi" }}
              render={({ field }) => (
                <Select
                  label="Vai trò cần thu hồi"
                  options={roleOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn vai trò cần thu hồi"
                  required
                  fullWidth
                  disabled={unassignRoleMutation.isPending || isLoading}
                  error={errors.roleId?.message}
                />
              )}
            />

            <CurrentRolesSection>
              <CurrentRolesLabel>Vai trò hiện tại (Company):</CurrentRolesLabel>
              <RoleBadgeContainer>
                {user?.user_role_assignments
                  ?.filter(
                    (assignment) => assignment.scope_type === ScopeType.COMPANY
                  )
                  .map((assignment, index) => (
                    <RoleBadge key={index}>
                      {getRoleName(assignment.role.name)}
                    </RoleBadge>
                  ))}
              </RoleBadgeContainer>
            </CurrentRolesSection>
          </>
        ) : (
          <ErrorMessage>
            Tài khoản này chưa có vai trò nào để thu hồi.
          </ErrorMessage>
        )}
      </FormContainer>
    </Modal>
  );
};

export default UnassignRoleModal;

