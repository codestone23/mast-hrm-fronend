"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Briefcase
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData } from '@/components/common';
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

interface ProjectDetailProps {
  projectId: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
  });

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Trang chủ',
      href: ROUTERS.PERSONAL.BASE    
    },
    {
      label: 'Dự án',
      href: ROUTERS.PERSONAL.PROJECTS,
      icon: <Briefcase size={16} />
    },
    {
      label: project?.name || 'Chi tiết dự án',
      icon: <Briefcase size={16} />
    }
  ];

  if (isLoading) {
    return (
      <ProjectDetailContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectDetailHeader>
          <ProjectDetailTitle>Đang tải dữ liệu...</ProjectDetailTitle>
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
          <span>Khách hàng: {project.client}</span>
          <span>•</span>
          <span>Quản lý: {project.manager}</span>
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
            <p>{project.description}</p>
            
            <ProjectInfo>
              <ProjectInfoItem>
                <ProjectInfoLabel>Khách hàng:</ProjectInfoLabel>
                <ProjectInfoValue>{project.client}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Quản lý:</ProjectInfoLabel>
                <ProjectInfoValue>{project.manager}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Thành viên:</ProjectInfoLabel>
                <ProjectInfoValue>{project.team_size} người</ProjectInfoValue>
              </ProjectInfoItem>
            </ProjectInfo>
          </ProjectOverview>
        </ProjectDetailCard>
      </ProjectDetailGrid>
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
