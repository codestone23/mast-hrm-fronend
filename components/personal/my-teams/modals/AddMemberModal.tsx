"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Select, Input } from "@/components/common";
import divisionWorkforceService from "@/services/division_workforce.service";
import rolesService from "@/services/roles.service";
import { useToast } from "@/hooks/useToast";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, teamId }) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  // Fetch available users
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["available-members", teamId],
    queryFn: () => divisionWorkforceService.getListUserAvailableToAddToTeam(teamId),
    enabled: isOpen && !!teamId,
  });

  // Fetch roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getRoles(),
    enabled: isOpen,
  });

  const availableUsers = usersData?.data || [];
  const roles = rolesData || [];

  const userOptions = useMemo(
    () =>
      availableUsers.map((user) => ({
        value: String(user.id),
        label: `${user.name || user.email} (${user.email})`,
      })),
    [availableUsers]
  );

  const roleOptions = useMemo(
    () => [
      { value: "", label: "Không chọn" },
      ...roles.map((role) => ({
        value: String(role.id),
        label: role.name,
      })),
    ],
    [roles]
  );

  const addMemberMutation = useMutation({
    mutationFn: () =>
      divisionWorkforceService.addMemberToTeam(
        teamId,
        selectedUserId!,
        selectedRoleId || undefined,
        description || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["available-members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      showSuccessToast("Thêm thành viên thành công");
      handleClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleClose = () => {
    setSelectedUserId(null);
    setSelectedRoleId(null);
    setDescription("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedUserId) {
      showErrorToast("Vui lòng chọn thành viên");
      return;
    }
    addMemberMutation.mutate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm thành viên vào team"
      size="md"
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={addMemberMutation.isPending || !selectedUserId}
          >
            {addMemberMutation.isPending ? "Đang thêm..." : "Thêm thành viên"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Select
          label="Chọn thành viên *"
          options={userOptions}
          value={selectedUserId ? String(selectedUserId) : ""}
          onChange={(value) => setSelectedUserId(value ? Number(value) : null)}
          placeholder={isLoadingUsers ? "Đang tải..." : "Chọn thành viên"}
          fullWidth
          searchable
        />

        <Select
          label="Vai trò (tùy chọn)"
          options={roleOptions}
          value={selectedRoleId ? String(selectedRoleId) : ""}
          onChange={(value) => setSelectedRoleId(value ? Number(value) : null)}
          placeholder="Chọn vai trò"
          fullWidth
        />

        <Input
          label="Mô tả (tùy chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ví dụ: Backend Developer chính"
          fullWidth
        />
      </div>
    </Modal>
  );
};

export default AddMemberModal;

