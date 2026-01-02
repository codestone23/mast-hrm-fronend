"use client";

import React, { useState } from 'react';
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
  EmptyStateDescription,
  TabsContainer,
  Tab,
  TabContent,
} from './projectDetailStyle';
import projectService from '@/services/project.service';
import ROUTERS from "@/config/router";
import { ProjectIndustry, ProjectStatus, ProjectType, ROLE_NAMES } from "@/constants/enums";
import Milestones from './Milestones';
import { getRoleName } from '@/utils/help';

interface ProjectDetailProps {
  projectId: string;
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

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones'>('overview');
  
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
                  <ProjectInfoItem key={`member-${member.id}-${index}`}>
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
      )}

      {activeTab === 'milestones' && (
        <TabContent>
          <Milestones projectId={projectId} />
        </TabContent>
      )}
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
