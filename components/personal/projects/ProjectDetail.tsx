"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { 
  Users, 
  Briefcase,
  Target,
  UserPlus,
  Trash2
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData, Loading, Button } from '@/components/common';
import {
  ProjectDetailContainer,
  ProjectDetailHeader,
  ProjectDetailTitle,
  ProjectDetailMeta,
  ProjectDetailGrid,
  ProjectDetailCard,
  CardHeader,
  CardTitle,
  CardIcon,
  ProjectOverview,
  ProjectInfo,
  ProjectInfoItem,
  ProjectInfoLabel,
  ProjectInfoValue,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  TabsContainer,
  Tab,
  TabContent,
  HorizontalStack,
} from './projectDetailStyle';
import projectService, { ProjectMember } from '@/services/project.service';
import ROUTERS from "@/config/router";
import { ProjectIndustry, ProjectStatus, ProjectType, ROLE_NAMES } from "@/constants/enums";
import Milestones from './Milestones';
import { getRoleName } from '@/utils/help';
import AddMemberModal from './modals/AddMemberModal';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal/ConfirmDeleteModal';
import { useToast } from '@/hooks/useToast';
import { RootState } from '@/store';

interface ProjectDetailProps {
  projectId: string;
  isDivision?: boolean;
}

const statusLabels: Record<string, string> = {
  [ProjectStatus.OPEN]: 'Mở',
  [ProjectStatus.IN_PROGRESS]: 'Đang thực hiện',
  [ProjectStatus.PENDING]: 'Tạm dừng',
  [ProjectStatus.CLOSED]: 'Đã đóng'
};

const projectTypeLabels: Record<string, string> = {
  [ProjectType.CUSTOMER]: 'Khách hàng',
  [ProjectType.IN_HOUSE]: 'Nội bộ',
  [ProjectType.START_UP]: 'Khởi nghiệp',
  [ProjectType.INTERNAL]: 'Nội bộ'
};

const industryLabels: Record<string, string> = {
  [ProjectIndustry.IT]: 'Công nghệ thông tin',
  [ProjectIndustry.FINANCE]: 'Tài chính',
  [ProjectIndustry.MANUFACTURING]: 'Sản xuất',
  [ProjectIndustry.OTHER]: 'Khác'
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, isDivision = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones'>('overview');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMemberToDelete, setSelectedMemberToDelete] = useState<{ id: number; name: string } | null>(null);
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const userData = useSelector((state: RootState) => state.user.data);
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
  });

  // Kiểm tra xem user có phải là project manager của dự án này không
  const isProjectManager = useMemo(() => {
    if (!project?.members || !userData?.id) return false;
    const currentUserMember = project.members.find(m => m?.user_id === userData.id);
    return currentUserMember?.role === ROLE_NAMES.PROJECT_MANAGER;
  }, [project, userData]);

  // Kiểm tra xem có thể quản lý thành viên không (division head hoặc project manager)
  const canManageMembers = isDivision || isProjectManager;

  // Xóa thành viên mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => projectService.removeMemberFromProject(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      showSuccessToast('Xóa thành viên khỏi dự án thành công!');
      setIsDeleteModalOpen(false);
      setSelectedMemberToDelete(null);
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi xóa thành viên';
      showErrorToast(errorMessage);
    },
  });

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Danh sách dự án',
      href: isDivision ? ROUTERS.DIVISION.PROJECTS : ROUTERS.PERSONAL.PROJECTS,
      icon: <Briefcase size={16} />
    },
    {
      label: project?.name || 'Chi tiết dự án',
      icon: <Briefcase size={16} />
    }
  ];

  const handleDeleteMember = (member: ProjectMember) => {
    // Không cho phép xóa project manager
    if (member.role === ROLE_NAMES.PROJECT_MANAGER) {
      showErrorToast('Không thể xóa Project Manager khỏi dự án');
      return;
    }
    setSelectedMemberToDelete({ id: member?.user_id ?? 0, name: member.name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedMemberToDelete) return;
    removeMemberMutation.mutate(selectedMemberToDelete.id.toString());
  };


  if (isLoading) {
    return (
      <ProjectDetailContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectDetailHeader>
          <Loading />
        </ProjectDetailHeader>
      </ProjectDetailContainer>
    );
  }

  if (error || !project) {
    return (
      <ProjectDetailContainer>
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState>
          <EmptyStateIcon>
            <Briefcase size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Không tìm thấy dự án</EmptyStateTitle>
          <EmptyStateDescription>
            Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </EmptyStateDescription>
        </EmptyState>
      </ProjectDetailContainer>
    );
  }

  return (
    <ProjectDetailContainer>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProjectDetailHeader>
        <ProjectDetailTitle>{project.name}</ProjectDetailTitle>
        <ProjectDetailMeta>
          {project.code && <span>Mã: {project.code}</span>}
          {project.code && <span>•</span>}
          <span>Trạng thái: {statusLabels[project.status] || project.status}</span>
        </ProjectDetailMeta>
      </ProjectDetailHeader>

      <TabsContainer>
        <Tab $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          <Briefcase size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Tổng quan
        </Tab>
        <Tab $active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')}>
          <Target size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Milestones
        </Tab>
      </TabsContainer>

      {activeTab === 'overview' && (
        <ProjectDetailGrid>
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <Briefcase size={20} />
            </CardIcon>
            <CardTitle>Thông tin dự án</CardTitle>
          </CardHeader>
          
          <ProjectOverview>
            <p>{project.description || project.scope}</p>
            
            <ProjectInfo>
              {project.code && (
                <ProjectInfoItem>
                  <ProjectInfoLabel>Mã dự án:</ProjectInfoLabel>
                  <ProjectInfoValue>{project.code}</ProjectInfoValue>
                </ProjectInfoItem>
              )}
              <ProjectInfoItem>
                <ProjectInfoLabel>Trạng thái:</ProjectInfoLabel>
                <ProjectInfoValue>{statusLabels[project.status] || project.status}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Loại dự án:</ProjectInfoLabel>
                <ProjectInfoValue>{projectTypeLabels[project.project_type] || project.project_type}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Ngành:</ProjectInfoLabel>
                <ProjectInfoValue>{industryLabels[project.industry] || project.industry}</ProjectInfoValue>
              </ProjectInfoItem>
              {project.start_date && (
                <ProjectInfoItem>
                  <ProjectInfoLabel>Ngày bắt đầu:</ProjectInfoLabel>
                  <ProjectInfoValue>{new Date(project.start_date).toLocaleDateString('vi-VN')}</ProjectInfoValue>
                </ProjectInfoItem>
              )}
              {project.end_date && (
                <ProjectInfoItem>
                  <ProjectInfoLabel>Ngày kết thúc:</ProjectInfoLabel>
                  <ProjectInfoValue>{new Date(project.end_date).toLocaleDateString('vi-VN')}</ProjectInfoValue>
                </ProjectInfoItem>
              )}
              <ProjectInfoItem>
                <ProjectInfoLabel>Số thành viên:</ProjectInfoLabel>
                <ProjectInfoValue>{project.member_count || 0} người</ProjectInfoValue>
              </ProjectInfoItem>
            </ProjectInfo>
          </ProjectOverview>
        </ProjectDetailCard>

        <ProjectDetailCard>
          <CardHeader style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CardIcon>
                <Users size={20} />
              </CardIcon>
              <CardTitle>Thành viên dự án</CardTitle>
            </div>
            {canManageMembers && (
              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus size={16} />}
                onClick={() => setIsAddMemberModalOpen(true)}
              >
                Thêm thành viên
              </Button>
            )}
          </CardHeader>
          
          <ProjectOverview>
            {project.members && project.members.length > 0 ? (
              <ProjectInfo>
                {project.members.map((member, index) => (
                  <ProjectInfoItem key={`member-${member.id}-${index}`}>
                    <ProjectInfoLabel>
                      <div>
                        {index + 1}. {member.name} ({member.email})
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Vai trò: {getRoleName(member.role)}
                      </div>
                    </ProjectInfoLabel> 
                    {canManageMembers && member.role !== ROLE_NAMES.PROJECT_MANAGER && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDeleteMember(member)}
                        style={{ marginLeft: 'auto' }}
                      >
                        <span style={{ display: 'none' }}>Xóa</span>
                      </Button>
                    )}
                  </ProjectInfoItem>
                ))}
              </ProjectInfo>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Chưa có thành viên nào trong dự án
              </div>
            )}
          </ProjectOverview>
        </ProjectDetailCard>
      </ProjectDetailGrid>
      )}

      {activeTab === 'milestones' && (
        <TabContent>
          <Milestones projectId={projectId} />
        </TabContent>
      )}

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={projectId}
        onSuccess={() => {
          // Refresh project data
          queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMemberToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thành viên"
        message={`Bạn có chắc chắn muốn xóa thành viên "${selectedMemberToDelete?.name}" khỏi dự án không?`}
        isLoading={removeMemberMutation.isPending}
      />
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
