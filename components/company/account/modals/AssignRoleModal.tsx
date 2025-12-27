"use client";

import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, Role, ScopeType } from "@/types/api";
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

interface AssignRoleFormData {
  roleId: string | number;
}

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  isLoading?: boolean;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
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
  } = useForm<AssignRoleFormData>({
    defaultValues: {
      roleId: "",
    },
    mode: "onChange",
  });

  // Get user's existing COMPANY scope role IDs
  const existingRoleIds = useMemo(
    () =>
      user?.user_role_assignments
        ?.filter((assignment) => assignment.scope_type === ScopeType.COMPANY)
        .map((assignment) => assignment.role.id) || [],
    [user]
  );

  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getRoles(),
    enabled: isOpen,
  });

  const roles = rolesData || [];

  // Filter only COMPANY scope roles (HR_MANAGER, EMPLOYEE, ADMIN)
  const companyScopeRoles = useMemo(
    () =>
      roles.filter((role: Role) => {
        const roleName = role.name as ROLE_NAMES;
        return (
          roleName === ROLE_NAMES.HR_MANAGER ||
          roleName === ROLE_NAMES.EMPLOYEE ||
          roleName === ROLE_NAMES.ADMIN
        );
      }),
    [roles]
  );

  // Filter out roles that user already has
  const availableRoles = useMemo(
    () =>
      companyScopeRoles.filter(
        (role: Role) => !existingRoleIds.includes(role.id)
      ),
    [companyScopeRoles, existingRoleIds]
  );

  const roleOptions: SelectOption[] = useMemo(
    () =>
      availableRoles.map((role: Role) => ({
        value: role.id,
        label: getRoleName(role.name as ROLE_NAMES),
      })),
    [availableRoles]
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      rolesService.assignRole(userId, roleId, ScopeType.COMPANY, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Gán vai trò thành công");
      onClose();
      reset();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi gán vai trò"
      );
    },
  });

  const onSubmit = (data: AssignRoleFormData) => {
    if (!user || !data.roleId) {
      showErrorToast("Vui lòng chọn vai trò");
      return;
    }

    assignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(data.roleId),
    });
  };

  const handleClose = () => {
    if (!assignRoleMutation.isPending) {
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
      title="Gán vai trò"
      size="md"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={assignRoleMutation.isPending || isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={assignRoleMutation.isPending || isLoading}
            disabled={
              assignRoleMutation.isPending ||
              isLoading ||
              isSubmitting ||
              isLoadingRoles
            }
          >
            Gán vai trò
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

        <Controller
          name="roleId"
          control={control}
          rules={{ required: "Vui lòng chọn vai trò" }}
          render={({ field }) => (
            <Select
              label="Vai trò"
              options={roleOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Chọn vai trò"
              required
              fullWidth
              disabled={
                assignRoleMutation.isPending || isLoading || isLoadingRoles
              }
              error={errors.roleId?.message}
            />
          )}
        />

        {existingRoleIds.length > 0 && (
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
        )}

        {availableRoles.length === 0 && (
          <ErrorMessage>
            Tài khoản này đã có tất cả các vai trò có sẵn.
          </ErrorMessage>
        )}
      </FormContainer>
    </Modal>
  );
};

export default AssignRoleModal;

