"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Briefcase,
  Calendar,
  Building,
  Tag,
  Target
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData, Loading } from '@/components/common';
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
  EmptyStateDescription
} from './projectDetailStyle';
import projectService from '@/services/project.service';
import ROUTERS from "@/config/router";
import { ROLE_NAMES } from "@/constants/enums";

interface ProjectDetailProps {
  projectId: string;
}

const statusLabels: Record<string, string> = {
  'OPEN': 'Mở',
  'IN_PROGRESS': 'Đang thực hiện',
  'PENDING': 'Tạm dừng',
  'CLOSED': 'Đã đóng'
};

const projectTypeLabels: Record<string, string> = {
  'CUSTOMER': 'Khách hàng',
  'IN_HOUSE': 'Nội bộ',
  'START_UP': 'Khởi nghiệp',
  'INTERNAL': 'Nội bộ'
};

const industryLabels: Record<string, string> = {
  'IT': 'Công nghệ thông tin',
  'FINANCE': 'Tài chính',
  'MANUFACTURING': 'Sản xuất',
  'OTHER': 'Khác'
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
  });

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Danh sách dự án',
      href: ROUTERS.PERSONAL.PROJECTS,
      icon: <Briefcase size={16} />
    },
    {
      label: project?.name || 'Chi tiết dự án',
      icon: <Briefcase size={16} />
    }
  ];

  const getRoleName = (role: ROLE_NAMES) => {
    switch (role) {
      case ROLE_NAMES.EMPLOYEE:
        return 'Nhân viên';
      case ROLE_NAMES.TEAM_LEADER:
        return 'Trưởng nhóm';
      case ROLE_NAMES.DIVISION_HEAD:
        return 'Trưởng phòng';
      case ROLE_NAMES.PROJECT_MANAGER:
        return 'Trưởng dự án';
      case ROLE_NAMES.HR_MANAGER:
        return 'Trưởng HR';
      case ROLE_NAMES.ADMIN:
        return 'Quản trị viên';
      case ROLE_NAMES.SUPER_ADMIN:
        return 'Quản trị hệ thống';
      case ROLE_NAMES.COMPANY_OWNER:
        return 'Chủ công ty';
      default:
        return role;
    }
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

        {project.members && project.members.length > 0 && (
          <ProjectDetailCard>
            <CardHeader>
              <CardIcon>
                <Users size={20} />
              </CardIcon>
              <CardTitle>Thành viên dự án</CardTitle>
            </CardHeader>
            
            <ProjectOverview>
              <ProjectInfo>
                {project.members.map((member, index) => (
                  <ProjectInfoItem key={member.id}>
                    <ProjectInfoLabel>{index + 1}. {member.name}</ProjectInfoLabel> 
                    <ProjectInfoValue>
                      <div>
                        <div>{member.email}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Vai trò: {getRoleName(member.role)}
                        </div>
                      </div>
                    </ProjectInfoValue>
                  </ProjectInfoItem>
                ))}
              </ProjectInfo>
            </ProjectOverview>
          </ProjectDetailCard>
        )}
      </ProjectDetailGrid>
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
