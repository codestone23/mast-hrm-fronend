"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Clock, 
  Eye, 
  ExternalLink,
  FolderOpen,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Pause,
  X,
  Briefcase
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData } from '@/components/common';
import {
  ProjectsContainer,
  ProjectsHeader,
  ProjectsTitle,
  ProjectsSubtitle,
  StatsGrid,
  StatsCard,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
  StatsCardNumber,
  StatsCardLabel,
  ProjectsGrid,
  ProjectCard,
  ProjectHeader,
  ProjectInfo,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  ProjectMetaItem,
  ProjectStatus,
  ProjectProgress,
  ProjectProgressLabel,
  ProjectProgressText,
  ProjectProgressPercent,
  ProjectProgressBar,
  ProjectProgressFill,
  ProjectTeam,
  ProjectTeamLabel,
  ProjectTeamAvatars,
  ProjectTeamAvatar,
  ProjectTeamCount,
  ProjectActions,
  ProjectDetailButton,
  ProjectSecondaryButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from './projectStyle';
import ROUTERS from "@/config/router";

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  teamSize: number;
  teamMembers: { name: string; avatar: string }[];
  client: string;
  priority: 'high' | 'medium' | 'low';
}

const Projects: React.FC = () => {
  const router = useRouter();

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Trang chủ',
      href: ROUTERS.PERSONAL.BASE
    },
    {
      label: 'Dự án',
      icon: <Briefcase size={16} />
    }
  ];

  const projects: ProjectData[] = [
    {
      id: 'proj-001',
      name: 'Hệ thống quản lý nhân sự MAST',
      description: 'Phát triển hệ thống quản lý nhân sự toàn diện với các tính năng chấm công, quản lý lương, đánh giá hiệu suất và báo cáo.',
      status: 'active',
      progress: 75,
      startDate: '01/03/2024',
      endDate: '30/12/2024',
      teamSize: 8,
      teamMembers: [
        { name: 'Nguyễn Văn A', avatar: 'NVA' },
        { name: 'Trần Thị B', avatar: 'TTB' },
        { name: 'Lê Văn C', avatar: 'LVC' },
        { name: 'Phạm Thị D', avatar: 'PTD' }
      ],
      client: 'MAST Corporation',
      priority: 'high'
    },
    {
      id: 'proj-002',
      name: 'Website thương mại điện tử',
      description: 'Xây dựng nền tảng thương mại điện tử với tích hợp thanh toán online, quản lý kho và hệ thống CRM.',
      status: 'active',
      progress: 45,
      startDate: '15/06/2024',
      endDate: '28/02/2025',
      teamSize: 6,
      teamMembers: [
        { name: 'Hoàng Văn E', avatar: 'HVE' },
        { name: 'Ngô Thị F', avatar: 'NTF' },
        { name: 'Đỗ Văn G', avatar: 'DVG' }
      ],
      client: 'TechStore Vietnam',
      priority: 'medium'
    },
    {
      id: 'proj-003',
      name: 'Ứng dụng di động Banking',
      description: 'Phát triển ứng dụng ngân hàng di động với các tính năng chuyển khoản, thanh toán hóa đơn và quản lý tài chính cá nhân.',
      status: 'completed',
      progress: 100,
      startDate: '10/01/2024',
      endDate: '15/05/2024',
      teamSize: 5,
      teamMembers: [
        { name: 'Vũ Văn H', avatar: 'VVH' },
        { name: 'Bùi Thị I', avatar: 'BTI' }
      ],
      client: 'VietBank',
      priority: 'high'
    },
    {
      id: 'proj-004',
      name: 'Hệ thống ERP cho doanh nghiệp',
      description: 'Triển khai giải pháp ERP tích hợp quản lý tài chính, nhân sự, bán hàng và sản xuất.',
      status: 'paused',
      progress: 30,
      startDate: '20/08/2024',
      endDate: '30/06/2025',
      teamSize: 10,
      teamMembers: [
        { name: 'Đinh Văn J', avatar: 'DVJ' },
        { name: 'Lý Thị K', avatar: 'LTK' },
        { name: 'Mai Văn L', avatar: 'MVL' }
      ],
      client: 'ABC Manufacturing',
      priority: 'medium'
    }
  ];

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    paused: projects.filter(p => p.status === 'paused').length
  };

  const getStatusIcon = (status: ProjectData['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={12} />;
      case 'completed':
        return <CheckCircle size={12} />;
      case 'paused':
        return <Pause size={12} />;
      case 'cancelled':
        return <X size={12} />;
      default:
        return <AlertCircle size={12} />;
    }
  };

  const getStatusText = (status: ProjectData['status']) => {
    switch (status) {
      case 'active':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'paused':
        return 'Tạm dừng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const handleViewDetail = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleViewAllProjects = () => {
    // console.log('View all projects');
  };

  if (projects.length === 0) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <ProjectsTitle>Dự án của tôi</ProjectsTitle>
          <ProjectsSubtitle>Quản lý và theo dõi tiến độ các dự án đang tham gia</ProjectsSubtitle>
        </ProjectsHeader>
        
        <EmptyState>
          <EmptyStateIcon>
            <FolderOpen size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Chưa có dự án nào</EmptyStateTitle>
          <EmptyStateDescription>
            Bạn chưa được phân công vào dự án nào. Liên hệ với quản lý để được giao dự án mới.
          </EmptyStateDescription>
        </EmptyState>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProjectsHeader>
        <ProjectsTitle>Dự án của tôi</ProjectsTitle>
        <ProjectsSubtitle>
          Quản lý và theo dõi tiến độ {projects.length} dự án đang tham gia
        </ProjectsSubtitle>
      </ProjectsHeader>

      <StatsGrid>
        <StatsCard>
          <StatsCardHeader>
            <StatsCardIcon $color="var(--primary-500)">
              <FolderOpen size={20} />
            </StatsCardIcon>
            <StatsCardTitle>Tổng số dự án</StatsCardTitle>
          </StatsCardHeader>
          <StatsCardNumber>{stats.total}</StatsCardNumber>
          <StatsCardLabel>dự án</StatsCardLabel>
        </StatsCard>

        <StatsCard>
          <StatsCardHeader>
            <StatsCardIcon $color="var(--success-500)">
              <CheckCircle size={20} />
            </StatsCardIcon>
            <StatsCardTitle>Đang thực hiện</StatsCardTitle>
          </StatsCardHeader>
          <StatsCardNumber>{stats.active}</StatsCardNumber>
          <StatsCardLabel>dự án</StatsCardLabel>
        </StatsCard>

        <StatsCard>
          <StatsCardHeader>
            <StatsCardIcon $color="var(--primary-600)">
              <BarChart3 size={20} />
            </StatsCardIcon>
            <StatsCardTitle>Hoàn thành</StatsCardTitle>
          </StatsCardHeader>
          <StatsCardNumber>{stats.completed}</StatsCardNumber>
          <StatsCardLabel>dự án</StatsCardLabel>
        </StatsCard>

        <StatsCard>
          <StatsCardHeader>
            <StatsCardIcon $color="var(--warning-500)">
              <Pause size={20} />
            </StatsCardIcon>
            <StatsCardTitle>Tạm dừng</StatsCardTitle>
          </StatsCardHeader>
          <StatsCardNumber>{stats.paused}</StatsCardNumber>
          <StatsCardLabel>dự án</StatsCardLabel>
        </StatsCard>
      </StatsGrid>

      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectHeader>
              <ProjectInfo>
                <ProjectName>{project.name}</ProjectName>
                <ProjectDescription>{project.description}</ProjectDescription>
                
                <ProjectMeta>
                  <ProjectMetaItem>
                    <Calendar size={16} />
                    <span>{project.startDate} - {project.endDate}</span>
                  </ProjectMetaItem>
                  <ProjectMetaItem>
                    <Users size={16} />
                    <span>{project.teamSize} thành viên</span>
                  </ProjectMetaItem>
                  <ProjectMetaItem>
                    <Clock size={16} />
                    <span>Khách hàng: {project.client}</span>
                  </ProjectMetaItem>
                </ProjectMeta>
              </ProjectInfo>
              
              <ProjectStatus $status={project.status}>
                {getStatusIcon(project.status)}
                {getStatusText(project.status)}
              </ProjectStatus>
            </ProjectHeader>

            <ProjectProgress>
              <ProjectProgressLabel>
                <ProjectProgressText>Tiến độ dự án</ProjectProgressText>
                <ProjectProgressPercent>{project.progress}%</ProjectProgressPercent>
              </ProjectProgressLabel>
              <ProjectProgressBar>
                <ProjectProgressFill $progress={project.progress} />
              </ProjectProgressBar>
            </ProjectProgress>

            <ProjectTeam>
              <ProjectTeamLabel>Thành viên:</ProjectTeamLabel>
              <ProjectTeamAvatars>
                {project.teamMembers.slice(0, 3).map((member, index) => (
                  <ProjectTeamAvatar key={index} title={member.name}>
                    {member.avatar}
                  </ProjectTeamAvatar>
                ))}
                {project.teamSize > 3 && (
                  <ProjectTeamCount title={`+${project.teamSize - 3} thành viên khác`}>
                    +{project.teamSize - 3}
                  </ProjectTeamCount>
                )}
              </ProjectTeamAvatars>
            </ProjectTeam>

            <ProjectActions>
              <ProjectDetailButton onClick={() => handleViewDetail(project.id)}>
                <Eye size={16} />
                Xem chi tiết
              </ProjectDetailButton>
              <ProjectSecondaryButton onClick={handleViewAllProjects}>
                <ExternalLink size={16} />
                Báo cáo
              </ProjectSecondaryButton>
            </ProjectActions>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default Projects;