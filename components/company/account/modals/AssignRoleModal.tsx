"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, Role, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "../AccountManagement";
import { ROLE_NAMES } from "@/constants/enums";

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
  const [selectedRoleId, setSelectedRoleId] = useState<string | number>("");

  // Get user's existing COMPANY scope role IDs
  const existingRoleIds = user?.user_role_assignments
    ?.filter((assignment) => assignment.scope_type === ScopeType.COMPANY)
    .map((assignment) => assignment.role.id) || [];

  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getRoles(),
    enabled: isOpen,
  });

  const roles = rolesData || [];

  // Filter out roles that user already has
  const availableRoles = roles.filter(
    (role: Role) => !existingRoleIds.includes(role.id)
  );

  const roleOptions: SelectOption[] = availableRoles.map((role: Role) => ({
    value: role.id,
    label: getRoleName(role.name as ROLE_NAMES),
  }));

  // Reset form when modal closes or user changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRoleId("");
    }
  }, [isOpen]);

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      rolesService.assignRole(userId, roleId, ScopeType.COMPANY, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Gán vai trò thành công");
      onClose();
      setSelectedRoleId("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi gán vai trò"
      );
    },
  });

  const handleSubmit = () => {
    if (!user || !selectedRoleId) {
      showErrorToast("Vui lòng chọn vai trò");
      return;
    }

    assignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(selectedRoleId),
    });
  };

  const handleClose = () => {
    if (!assignRoleMutation.isPending) {
      setSelectedRoleId("");
      onClose();
    }
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
            onClick={handleSubmit}
            loading={assignRoleMutation.isPending || isLoading}
            disabled={assignRoleMutation.isPending || isLoading || !selectedRoleId}
          >
            Gán vai trò
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {user && (
          <div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
              Tài khoản
            </div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#111827" }}>
              {user.user_information && 
               typeof user.user_information === 'object' && 
               !Array.isArray(user.user_information) &&
               'name' in user.user_information
                ? (user.user_information as { name: string }).name
                : user.name || user.email}
            </div>
          </div>
        )}

        <Select
          label="Vai trò"
          options={roleOptions}
          value={selectedRoleId}
          onChange={(value) => setSelectedRoleId(value)}
          placeholder="Chọn vai trò"
          required
          fullWidth
          disabled={assignRoleMutation.isPending || isLoading || isLoadingRoles}
        />

        {existingRoleIds.length > 0 && (
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            <div style={{ marginBottom: "4px" }}>Vai trò hiện tại (Company):</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user?.user_role_assignments
                ?.filter((assignment) => assignment.scope_type === ScopeType.COMPANY)
                .map((assignment, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor: "#e0e7ff",
                      color: "#6366f1",
                    }}
                  >
                    {getRoleName(assignment.role.name)}
                  </span>
                ))}
            </div>
          </div>
        )}

        {availableRoles.length === 0 && (
          <div style={{ fontSize: "14px", color: "#ef4444", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
            Tài khoản này đã có tất cả các vai trò có sẵn.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignRoleModal;

