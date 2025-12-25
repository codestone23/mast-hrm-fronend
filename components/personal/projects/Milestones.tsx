"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Target, Calendar, TrendingUp } from "lucide-react";
import { Button, Loading, ConfirmDeleteModal } from "@/components/common";
import projectService, { MilestoneProject } from "@/services/project.service";
import { useToast } from "@/hooks/useToast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ROLE_NAMES } from "@/constants/enums";
import CreateEditMilestoneModal from "./modals/CreateEditMilestoneModal";
import UpdateProgressModal from "./modals/UpdateProgressModal";
import {
  MilestonesContainer,
  MilestonesHeader,
  MilestonesList,
  MilestoneItem,
  MilestoneHeader,
  MilestoneName,
  MilestoneOrder,
  MilestoneDescription,
  MilestoneMeta,
  MilestoneMetaItem,
  MilestoneProgress,
  MilestoneProgressBar,
  MilestoneProgressFill,
  MilestoneProgressText,
  MilestoneActions,
  MilestoneActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "./milestonesStyle";

interface MilestonesProps {
  projectId: string;
}

const statusLabels: Record<string, string> = {
  PENDING: "Chờ bắt đầu",
  IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Hoàn thành",
};

const statusColors: Record<string, string> = {
  PENDING: "#6b7280",
  IN_PROGRESS: "#3b82f6",
  COMPLETED: "#10b981",
};

const Milestones: React.FC<MilestonesProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const userData = useSelector((state: RootState) => state.user.data);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneProject | null>(null);

  // Kiểm tra quyền: Admin, Division Head, Project Manager có thể CRUD
  const canEdit = useMemo(() => {
    if (!userData?.role_assignments) return false;
    const userRoles = userData.role_assignments.map((role) =>
      role.name?.toLowerCase()
    );
    return (
      userRoles.includes(ROLE_NAMES.ADMIN.toLowerCase()) ||
      userRoles.includes(ROLE_NAMES.DIVISION_HEAD.toLowerCase()) ||
      userRoles.includes(ROLE_NAMES.PROJECT_MANAGER.toLowerCase())
    );
  }, [userData]);

  // Fetch milestones
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => projectService.getMilestoneProject(projectId),
  });

  // Sắp xếp milestones theo order
  const sortedMilestones = useMemo(() => {
    if (!milestones) return [];
    return [...milestones].sort((a, b) => a.order - b.order);
  }, [milestones]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof projectService.createMilestoneProject>[1]) =>
      projectService.createMilestoneProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      showSuccessToast("Tạo milestone thành công");
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ milestoneId, data }: { milestoneId: string; data: Parameters<typeof projectService.updateMilestoneProject>[1] }) =>
      projectService.updateMilestoneProject(milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      showSuccessToast("Cập nhật milestone thành công");
      setIsEditModalOpen(false);
      setSelectedMilestone(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ milestoneId, progress }: { milestoneId: string; progress: number }) =>
      projectService.updateProcessMilestoneProject(milestoneId, { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      showSuccessToast("Cập nhật tiến độ thành công");
      setIsProgressModalOpen(false);
      setSelectedMilestone(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      projectService.deleteMilestoneProject(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      showSuccessToast("Xóa milestone thành công");
      setIsDeleteModalOpen(false);
      setSelectedMilestone(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (milestone: MilestoneProject) => {
    setSelectedMilestone(milestone);
    setIsEditModalOpen(true);
  };

  const handleUpdateProgress = (milestone: MilestoneProject) => {
    setSelectedMilestone(milestone);
    setIsProgressModalOpen(true);
  };

  const handleDelete = (milestone: MilestoneProject) => {
    setSelectedMilestone(milestone);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMilestone) {
      deleteMutation.mutate(selectedMilestone.id.toString());
    }
  };

  if (isLoading) {
    return (
      <MilestonesContainer>
        <Loading />
      </MilestonesContainer>
    );
  }

  return (
    <MilestonesContainer>
      <MilestonesHeader>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, marginBottom: "4px" }}>
            Milestones
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            {sortedMilestones.length} milestone
          </p>
        </div>
        {canEdit && (
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleCreate}>
            Tạo milestone
          </Button>
        )}
      </MilestonesHeader>

      {sortedMilestones.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <Target size={48} />
          </EmptyStateIcon>
          <EmptyStateTitle>Chưa có milestone nào</EmptyStateTitle>
          <EmptyStateDescription>
            {canEdit
              ? "Tạo milestone đầu tiên để theo dõi tiến độ dự án"
              : "Chưa có milestone nào được tạo cho dự án này"}
          </EmptyStateDescription>
        </EmptyState>
      ) : (
        <MilestonesList>
          {sortedMilestones.map((milestone) => (
            <MilestoneItem key={milestone.id}>
              <MilestoneHeader>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <MilestoneOrder>{milestone.order}</MilestoneOrder>
                  <div style={{ flex: 1 }}>
                    <MilestoneName>{milestone.name}</MilestoneName>
                    <MilestoneDescription>{milestone.description}</MilestoneDescription>
                  </div>
                </div>
                {canEdit && (
                  <MilestoneActions>
                    <MilestoneActionButton
                      onClick={() => handleUpdateProgress(milestone)}
                      title="Cập nhật tiến độ"
                    >
                      <TrendingUp size={16} />
                    </MilestoneActionButton>
                    <MilestoneActionButton
                      onClick={() => handleEdit(milestone)}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </MilestoneActionButton>
                    <MilestoneActionButton
                      $danger
                      onClick={() => handleDelete(milestone)}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </MilestoneActionButton>
                  </MilestoneActions>
                )}
              </MilestoneHeader>

              <MilestoneMeta>
                <MilestoneMetaItem>
                  <Calendar size={14} />
                  <span>
                    {new Date(milestone.start_date).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(milestone.end_date).toLocaleDateString("vi-VN")}
                  </span>
                </MilestoneMetaItem>
                <MilestoneMetaItem>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor: `${statusColors[milestone.status]}20`,
                      color: statusColors[milestone.status],
                    }}
                  >
                    {statusLabels[milestone.status]}
                  </span>
                </MilestoneMetaItem>
              </MilestoneMeta>

              <MilestoneProgress>
                <MilestoneProgressText>
                  <span>Tiến độ: {milestone.progress}%</span>
                </MilestoneProgressText>
                <MilestoneProgressBar>
                  <MilestoneProgressFill $progress={milestone.progress} />
                </MilestoneProgressBar>
              </MilestoneProgress>
            </MilestoneItem>
          ))}
        </MilestonesList>
      )}

      {/* Modals */}
      <CreateEditMilestoneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        mode="create"
        projectId={projectId}
        existingMilestones={sortedMilestones}
      />

      {selectedMilestone && (
        <>
          <CreateEditMilestoneModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedMilestone(null);
            }}
            onSave={(data) =>
              updateMutation.mutate({ milestoneId: selectedMilestone.id.toString(), data })
            }
            isLoading={updateMutation.isPending}
            mode="edit"
            milestone={selectedMilestone}
            projectId={projectId}
            existingMilestones={sortedMilestones}
          />

          <UpdateProgressModal
            isOpen={isProgressModalOpen}
            onClose={() => {
              setIsProgressModalOpen(false);
              setSelectedMilestone(null);
            }}
            onSave={(progress) =>
              updateProgressMutation.mutate({
                milestoneId: selectedMilestone.id.toString(),
                progress,
              })
            }
            isLoading={updateProgressMutation.isPending}
            currentProgress={selectedMilestone.progress}
            milestoneName={selectedMilestone.name}
          />
        </>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMilestone(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa milestone"
        message={`Bạn có chắc chắn muốn xóa milestone "${selectedMilestone?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </MilestonesContainer>
  );
};

export default Milestones;

