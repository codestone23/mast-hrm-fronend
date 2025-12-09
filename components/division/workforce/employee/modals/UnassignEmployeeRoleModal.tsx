"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "@/components/company/account/AccountManagement";

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
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState<string | number>("");

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

  // Reset form when modal closes or user changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAssignmentIndex("");
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
      queryClient.invalidateQueries({ queryKey: ["division-workforce"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Thu hồi vai trò thành công");
      onClose();
      setSelectedAssignmentIndex("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(
        err?.response?.data?.message || "Có lỗi xảy ra khi thu hồi vai trò"
      );
    },
  });

  const handleSubmit = () => {
    if (!user || selectedAssignmentIndex === "") {
      showErrorToast("Vui lòng chọn vai trò cần thu hồi");
      return;
    }

    const assignment = existingAssignments[Number(selectedAssignmentIndex)];
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
      setSelectedAssignmentIndex("");
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
            disabled={unassignRoleMutation.isPending || isLoading || selectedAssignmentIndex === ""}
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
              Nhân viên
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

        {existingAssignments.length > 0 ? (
          <>
            <Select
              label="Vai trò cần thu hồi"
              options={assignmentOptions}
              value={selectedAssignmentIndex}
              onChange={(value) => setSelectedAssignmentIndex(value)}
              placeholder="Chọn vai trò cần thu hồi"
              required
              fullWidth
              disabled={unassignRoleMutation.isPending || isLoading}
            />

            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              <div style={{ marginBottom: "4px" }}>Tất cả vai trò hiện tại (Phòng ban/Dự án/Đội nhóm):</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {existingAssignments.map((assignment, index) => {
                  const scopeInfo = assignment.scope_id 
                    ? ` (${assignment.scope_type} #${assignment.scope_id})`
                    : ` (${assignment.scope_type})`;
                  return (
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
                      {getRoleName(assignment.role.name)}{scopeInfo}
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: "14px", color: "#ef4444", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
            Nhân viên này chưa có vai trò nào (Phòng ban/Dự án/Đội nhóm) để thu hồi.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UnassignEmployeeRoleModal;

