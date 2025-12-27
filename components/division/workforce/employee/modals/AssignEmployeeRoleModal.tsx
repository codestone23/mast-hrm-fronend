"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import { SelectOption } from "@/components/common/Select/Select";
import { User as UserType, Role, ScopeType } from "@/types/api";
import rolesService from "@/services/roles.service";
import projectService from "@/services/project.service";
import divisionWorkforceService from "@/services/division_workforce.service";
import { useToast } from "@/hooks/useToast";
import { getRoleName } from "@/utils/help";
import { ROLE_NAMES } from "@/constants/enums";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  FormContainer,
  UserInfoSection,
  UserInfoLabel,
  UserInfoValue,
  InfoBox,
  RolesContainer,
  RoleBadge,
  RolesLabel,
} from "./assignEmployeeRoleModalStyle";

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

  interface AssignRoleFormData {
    roleId: number;
    scopeId: number;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssignRoleFormData>({
    defaultValues: {
      roleId: 0,
      scopeId: 0,
    },
    mode: "onChange",
  });

  const selectedRoleId = watch("roleId");

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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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

    const selectedRole = roles.find((r: Role) => r.id === Number(data.roleId));
    if (!selectedRole) {
      showErrorToast("Vai trò không hợp lệ");
      return;
    }

    let scopeType: ScopeType;
    let scopeId: number | null = null;

    if (selectedRole.name === 'division_head') {
      scopeType = ScopeType.DIVISION;
      scopeId = selectedDivisionId || null;
    } else if (selectedRole.name === 'project_manager') {
      scopeType = ScopeType.PROJECT;
      if (!data.scopeId) {
        showErrorToast("Vui lòng chọn dự án");
        return;
      }
      scopeId = Number(data.scopeId);
    } else if (selectedRole.name === 'team_leader') {
      scopeType = ScopeType.TEAM;
      if (!data.scopeId) {
        showErrorToast("Vui lòng chọn team");
        return;
      }
      scopeId = Number(data.scopeId);
    } else {
      showErrorToast("Vai trò không hợp lệ");
      return;
    }

    assignRoleMutation.mutate({
      userId: Number(user.id),
      roleId: Number(data.roleId),
      scopeType,
      scopeId,
    });
  };

  const handleClose = () => {
    if (!assignRoleMutation.isPending) {
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
            onClick={handleSubmit(onSubmit)}
            loading={assignRoleMutation.isPending || isLoading}
            disabled={assignRoleMutation.isPending || isLoading}
          >
            Gán vai trò
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

        <Controller
          name="roleId"
          control={control}
          rules={{ required: "Vui lòng chọn vai trò" }}
          render={({ field }) => (
            <Select
              label="Vai trò"
              options={roleOptions}
              value={field.value || ""}
              onChange={(value) => field.onChange(value ? Number(value) : 0)}
              placeholder="Chọn vai trò"
              required
              fullWidth
              disabled={assignRoleMutation.isPending || isLoading || isLoadingRoles}
              error={errors.roleId?.message}
            />
          )}
        />

        {selectedRole && selectedRole.name === 'project_manager' && (
          <Controller
            name="scopeId"
            control={control}
            rules={{ required: "Vui lòng chọn dự án" }}
            render={({ field }) => (
              <Select
                label="Dự án"
                options={scopeOptions}
                value={field.value || ""}
                onChange={(value) => field.onChange(value ? Number(value) : 0)}
                placeholder="Chọn dự án"
                required
                fullWidth
                disabled={assignRoleMutation.isPending || isLoading}
                error={errors.scopeId?.message}
              />
            )}
          />
        )}

        {selectedRole && selectedRole.name === 'team_leader' && (
          <Controller
            name="scopeId"
            control={control}
            rules={{ required: "Vui lòng chọn team" }}
            render={({ field }) => (
              <Select
                label="Team"
                options={scopeOptions}
                value={field.value || ""}
                onChange={(value) => field.onChange(value ? Number(value) : 0)}
                placeholder="Chọn team"
                required
                fullWidth
                disabled={assignRoleMutation.isPending || isLoading}
                error={errors.scopeId?.message}
              />
            )}
          />
        )}

        {selectedRole && selectedRole.name === 'division_head' && (
          <InfoBox>
            Vai trò này sẽ được gán cho phòng ban hiện tại
          </InfoBox>
        )}

        {existingAssignments.length > 0 && (
          <div>
            <RolesLabel>Vai trò hiện tại (Phòng ban/Dự án/Đội nhóm):</RolesLabel>
            <RolesContainer>
              {existingAssignments.map((assignment, index) => (
                <RoleBadge key={index}>
                  {getRoleName(assignment.role.name)} ({assignment.scope_type})
                </RoleBadge>
              ))}
            </RolesContainer>
          </div>
        )}

        {availableRoles.length === 0 && (
          <InfoBox $variant="error">
            Không có vai trò nào có thể gán cho nhân viên trong phòng ban này.
          </InfoBox>
        )}
      </FormContainer>
    </Modal>
  );
};

export default AssignEmployeeRoleModal;

