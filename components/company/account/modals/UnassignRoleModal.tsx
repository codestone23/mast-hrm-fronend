"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "../AccountManagement";

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
  const [selectedRoleId, setSelectedRoleId] = useState<string | number>("");
  const [selectedScopeType, setSelectedScopeType] = useState<ScopeType | "">("");
  const [selectedScopeId, setSelectedScopeId] = useState<string | number>("");

  // Get user's existing COMPANY scope roles only
  const existingRoles = user?.user_role_assignments?.filter(
    (assignment) => assignment.scope_type === ScopeType.COMPANY
  ) || [];

  // Create unique role options (group by role id)
  const roleMap = new Map<number, { roleId: number; roleName: string }>();
  existingRoles.forEach((assignment) => {
    if (!roleMap.has(assignment.role.id)) {
      roleMap.set(assignment.role.id, {
        roleId: assignment.role.id,
        roleName: assignment.role.name,
      });
    }
  });

  const roleOptions: SelectOption[] = Array.from(roleMap.values()).map((item) => ({
    value: item.roleId,
    label: getRoleName(item.roleName as ROLE_NAMES),
  }));

  // Reset form when modal closes or user changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRoleId("");
      setSelectedScopeType("");
      setSelectedScopeId("");
    }
  }, [isOpen, user]);

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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Thu hồi vai trò thành công");
      onClose();
      setSelectedRoleId("");
      setSelectedScopeType("");
      setSelectedScopeId("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi thu hồi vai trò"
      );
    },
  });

  const handleSubmit = () => {
    if (!user || !selectedRoleId) {
      showErrorToast("Vui lòng chọn vai trò cần thu hồi");
      return;
    }

    // For COMPANY scope, scopeId is always null
    unassignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(selectedRoleId),
      scopeType: ScopeType.COMPANY,
      scopeId: null,
    });
  };

  const handleClose = () => {
    if (!unassignRoleMutation.isPending) {
      setSelectedRoleId("");
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
            onClick={handleSubmit}
            loading={unassignRoleMutation.isPending || isLoading}
            disabled={unassignRoleMutation.isPending || isLoading || !selectedRoleId}
          >
            Thu hồi vai trò
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

        {existingRoles.length > 0 ? (
          <>
            <Select
              label="Vai trò cần thu hồi"
              options={roleOptions}
              value={selectedRoleId}
              onChange={(value) => setSelectedRoleId(value)}
              placeholder="Chọn vai trò cần thu hồi"
              required
              fullWidth
              disabled={unassignRoleMutation.isPending || isLoading}
            />

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
          </>
        ) : (
          <div style={{ fontSize: "14px", color: "#ef4444", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
            Tài khoản này chưa có vai trò nào để thu hồi.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UnassignRoleModal;

