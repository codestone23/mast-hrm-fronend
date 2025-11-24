"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye,
  Users,
  Briefcase,
  Building,
  Search
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData, Input, Loading } from '@/components/common';
import {
  ProjectsContainer,
  ProjectsHeader,
  ProjectsTitle,
  ProjectsSubtitle,
  ProjectsGrid,
  ProjectCard,
  ProjectInfo,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  ProjectMetaItem,
  ProjectActions,
  ProjectActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from './projectStyle';
import projectService, { Project } from '@/services/project.service';
import ROUTERS from "@/config/router";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Projects: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Danh sách dự án',
      href: ROUTERS.PERSONAL.PROJECTS,
    }
  ];

  // Fetch projects data
  const { data: projectsResponse, isLoading, error } = useQuery({
    queryKey: ['my-projects', searchTerm, selectedDivisionId],
    queryFn: () => projectService.getMyProjects(1, searchTerm || undefined),
  });

  const projects = projectsResponse?.data || [];

  const handleViewDetail = (projectId: number) => {
    router.push(`${ROUTERS.PERSONAL.PROJECTS}/${projectId}`);
  };

  const renderNoProjects = () => {
    return (
      <ProjectsContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Dự án của tôi</ProjectsTitle>
            <ProjectsSubtitle>Chưa có dự án nào</ProjectsSubtitle>
          </div>
        </ProjectsHeader>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            placeholder="Tìm kiếm theo tên dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
            iconPosition="left"
          />
        </div>
        
        <EmptyState>
          <EmptyStateIcon>
            <Briefcase size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Chưa có dự án nào</EmptyStateTitle>
          <EmptyStateDescription>
            Bạn chưa tham gia dự án nào.
          </EmptyStateDescription>
        </EmptyState>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProjectsHeader>
        <div>
          <ProjectsTitle>Dự án của tôi</ProjectsTitle>
          <ProjectsSubtitle>{projects.length} dự án</ProjectsSubtitle>
        </div>
      </ProjectsHeader>

      <div style={{ marginBottom: '1.5rem' }}>
        <Input
          placeholder="Tìm kiếm theo tên dự án..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={16} />}
          iconPosition="left"
        />
      </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            <Loading />
          </div>
        ) : (
          <ProjectsGrid>
            {projects.length === 0 ? renderNoProjects() : (
              <>
                {projects.map((project) => (
                  <ProjectCard key={project.id}>
                    <ProjectInfo>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectDescription>{project.description || project.scope}</ProjectDescription>
                      
                      <ProjectMeta>
                        <ProjectMetaItem>
                          <Users size={14} />
                          <span>{project.member_count || 0} thành viên</span>
                        </ProjectMetaItem>
                        {project.code && (
                          <ProjectMetaItem>
                            <Building size={14} />
                            <span>{project.code}</span>
                          </ProjectMetaItem>
                        )}
                      </ProjectMeta>
                    </ProjectInfo>

                    <ProjectActions>
                      <ProjectActionButton onClick={() => handleViewDetail(project.id)}>
                        <Eye size={14} />
                        Xem chi tiết
                      </ProjectActionButton>
                    </ProjectActions>
                  </ProjectCard>
                ))}
              </>
            )}
          </ProjectsGrid>
        )}
    </ProjectsContainer>
  );
};

export default Projects;