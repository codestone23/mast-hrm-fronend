"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, Role, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import projectService from "@/services/project.service";
import divisionWorkforceService from "@/services/division_workforce.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "@/components/company/account/AccountManagement";
import { ROLE_NAMES } from "@/constants/enums";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AssignEmployeeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  isLoading?: boolean;
}

const AssignEmployeeRoleModal: React.FC<AssignEmployeeRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoading = false,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  
  const [selectedRoleId, setSelectedRoleId] = useState<string | number>("");
  const [selectedScopeType, setSelectedScopeType] = useState<ScopeType | "">("");
  const [selectedScopeId, setSelectedScopeId] = useState<string | number>("");

  // Get user's existing role assignments for DIVISION and PROJECT scope
  const existingAssignments = user?.user_role_assignments?.filter(
    (assignment) => 
      assignment.scope_type === ScopeType.DIVISION || 
      assignment.scope_type === ScopeType.PROJECT ||
      assignment.scope_type === ScopeType.TEAM
  ) || [];

  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getRoles(),
    enabled: isOpen,
  });

  const roles = rolesData || [];

  // Fetch projects for project_manager role
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "for-assignment", selectedDivisionId],
    queryFn: () => projectService.getProjectsAdmin(1, undefined, selectedDivisionId || undefined),
    enabled: isOpen && selectedDivisionId !== null,
  });

  const projects = projectsData?.data || [];

  // Fetch teams for team_leader role
  const { data: teamsData } = useQuery({
    queryKey: ["teams", "for-assignment", selectedDivisionId],
    queryFn: () => divisionWorkforceService.getTeams(selectedDivisionId || 0, undefined, 1, 100),
    enabled: isOpen && selectedDivisionId !== null,
  });

  const teams = teamsData?.data || [];

  // Filter available roles
  const availableRoles = roles.filter((role: Role) => {
    // Only show roles that can be assigned with scope (division_head, project_manager, team_leader)
    return ['division_head', 'project_manager', 'team_leader'].includes(role.name);
  });

  const roleOptions: SelectOption[] = availableRoles.map((role: Role) => ({
    value: role.id,
    label: getRoleName(role.name as ROLE_NAMES),
  }));

  // Determine scope options based on selected role
  const selectedRole = roles.find((r: Role) => r.id === Number(selectedRoleId));
  const needsScopeSelection = selectedRole && ['project_manager', 'team_leader'].includes(selectedRole.name);

  const scopeOptions: SelectOption[] = React.useMemo(() => {
    if (!selectedRole) return [];
    
    if (selectedRole.name === 'project_manager') {
      return projects.map((project) => ({
        value: project.id,
        label: project.name,
      }));
    } else if (selectedRole.name === 'team_leader') {
      return teams.map((team) => ({
        value: team.id,
        label: team.name,
      }));
    } else if (selectedRole.name === 'division_head') {
      // For division_head, scope_id is the division_id (current division)
      return [];
    }
    return [];
  }, [selectedRole, projects, teams]);

  // Reset form when modal closes or user changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRoleId("");
      setSelectedScopeType("");
      setSelectedScopeId("");
    }
  }, [isOpen]);

  // Update scope type when role changes
  useEffect(() => {
    if (selectedRole) {
      if (selectedRole.name === 'project_manager') {
        setSelectedScopeType(ScopeType.PROJECT);
      } else if (selectedRole.name === 'team_leader') {
        setSelectedScopeType(ScopeType.TEAM);
      } else if (selectedRole.name === 'division_head') {
        setSelectedScopeType(ScopeType.DIVISION);
        setSelectedScopeId(selectedDivisionId || "");
      }
    } else {
      setSelectedScopeType("");
      setSelectedScopeId("");
    }
  }, [selectedRole, selectedDivisionId]);

  // Assign role mutation
  const assignRoleMutation = useMutation({
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
      rolesService.assignRole(userId, roleId, scopeType, scopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Gán vai trò thành công");
      onClose();
      setSelectedRoleId("");
      setSelectedScopeType("");
      setSelectedScopeId("");
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

    if (!selectedScopeType) {
      showErrorToast("Vui lòng chọn scope type");
      return;
    }

    // For division_head, use selectedDivisionId
    // For project_manager and team_leader, use selectedScopeId
    let scopeId: number | null = null;
    if (selectedRole?.name === 'division_head') {
      scopeId = selectedDivisionId || null;
    } else if (needsScopeSelection && selectedScopeId) {
      scopeId = Number(selectedScopeId);
    } else if (!needsScopeSelection) {
      scopeId = null;
    } else {
      showErrorToast("Vui lòng chọn project/team");
      return;
    }

    assignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(selectedRoleId),
      scopeType: selectedScopeType as ScopeType,
      scopeId,
    });
  };

  const handleClose = () => {
    if (!assignRoleMutation.isPending) {
      setSelectedRoleId("");
      setSelectedScopeType("");
      setSelectedScopeId("");
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
            disabled={
              assignRoleMutation.isPending || 
              isLoading || 
              !selectedRoleId || 
              !selectedScopeType ||
              (needsScopeSelection && !selectedScopeId)
            }
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

        {selectedRole && selectedRole.name === 'project_manager' && (
          <Select
            label="Dự án"
            options={scopeOptions}
            value={selectedScopeId}
            onChange={(value) => setSelectedScopeId(value)}
            placeholder="Chọn dự án"
            required
            fullWidth
            disabled={assignRoleMutation.isPending || isLoading}
          />
        )}

        {selectedRole && selectedRole.name === 'team_leader' && (
          <Select
            label="Team"
            options={scopeOptions}
            value={selectedScopeId}
            onChange={(value) => setSelectedScopeId(value)}
            placeholder="Chọn team"
            required
            fullWidth
            disabled={assignRoleMutation.isPending || isLoading}
          />
        )}

        {selectedRole && selectedRole.name === 'division_head' && (
          <div style={{ fontSize: "14px", color: "#6b7280", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            Vai trò này sẽ được gán cho phòng ban hiện tại
          </div>
        )}

        {existingAssignments.length > 0 && (
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            <div style={{ marginBottom: "4px" }}>Vai trò hiện tại (Division/Project/Team):</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {existingAssignments.map((assignment, index) => (
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
                  {getRoleName(assignment.role.name)} ({assignment.scope_type})
                </span>
              ))}
            </div>
          </div>
        )}

        {availableRoles.length === 0 && (
          <div style={{ fontSize: "14px", color: "#ef4444", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
            Không có vai trò nào có thể gán cho nhân viên trong phòng ban này.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignEmployeeRoleModal;

