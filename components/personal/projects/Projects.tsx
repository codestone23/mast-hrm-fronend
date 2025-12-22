"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye,
  Users,
  Briefcase,
  Building,
  Search,
  Crown
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import { Breadcrumb, BreadcrumbItemData, Input, Loading, Pagination } from '@/components/common';
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
  EmptyStateDescription,
  FilterContainer,
  ToggleContainer,
  ToggleLabel,
  ToggleSwitch,
  ManagerBadge,
  ProjectCardManaged
} from './projectStyle';
import projectService, { Project } from '@/services/project.service';
import ROUTERS from "@/config/router";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ROLE_NAMES, ProjectAccessType } from '@/constants/enums';

const Projects: React.FC = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showManagedOnly, setShowManagedOnly] = useState(false);
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);
  const userData = useSelector((state: RootState) => state.user.data);

  // Kiểm tra xem user có role project_manager không
  const isProjectManager = useMemo(() => {
    if (!userData?.role_assignments) return false;
    return userData.role_assignments.some(
      (role) => role.name?.toLowerCase() === ROLE_NAMES.PROJECT_MANAGER.toLowerCase()
    );
  }, [userData]);

  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Danh sách dự án',
      href: ROUTERS.PERSONAL.PROJECTS,
    }
  ];

  // Fetch my projects data (luôn fetch nếu không phải filter managed only)
  const { data: myProjectsResponse, isLoading: isLoadingMyProjects } = useQuery({
    queryKey: ['my-projects', currentPage, searchTerm, selectedDivisionId],
    queryFn: () => projectService.getMyProjects(
      currentPage, 
      searchTerm || undefined, 
      selectedDivisionId || undefined,
      ProjectAccessType.RESTRICTED
    ),
    enabled: !showManagedOnly,
  });

  // Fetch managed projects data (fetch khi là project_manager và cần merge hoặc filter)
  const { data: managedProjectsResponse, isLoading: isLoadingManagedProjects } = useQuery({
    queryKey: ['managed-projects', currentPage, searchTerm],
    queryFn: () => projectService.getProjectsManager(
      currentPage, 
      searchTerm || undefined,
      ProjectAccessType.RESTRICTED
    ),
    enabled: isProjectManager,
  });

  const isLoading = isLoadingMyProjects || isLoadingManagedProjects;

  // Lấy danh sách ID của các dự án được quản lý để đánh dấu
  const managedProjectIds = useMemo(() => {
    if (!isProjectManager || !managedProjectsResponse?.data) return new Set<number>();
    return new Set(managedProjectsResponse.data.map((p: Project) => p.id));
  }, [isProjectManager, managedProjectsResponse]);

  // Xác định dữ liệu và pagination dựa trên filter
  const projectsResponse = useMemo(() => {
    return showManagedOnly ? managedProjectsResponse : myProjectsResponse;
  }, [showManagedOnly, managedProjectsResponse, myProjectsResponse]);

  const projects = useMemo(() => {
    return projectsResponse?.data || [];
  }, [projectsResponse]);

  // Pagination: dùng từ managed khi filter, từ my khi không filter
  const pagination = useMemo(() => {
    if (showManagedOnly) {
      return managedProjectsResponse?.pagination;
    }
    return myProjectsResponse?.pagination;
  }, [showManagedOnly, managedProjectsResponse?.pagination, myProjectsResponse?.pagination]);

  // Merge projects nếu không filter (hiển thị tất cả)
  const allProjects = useMemo(() => {
    if (showManagedOnly) return projects;
    
    if (!isProjectManager || !managedProjectsResponse?.data) {
      return projects;
    }

    // Merge và loại bỏ duplicate
    const projectMap = new Map<number, Project>();
    
    // Thêm my projects
    projects.forEach((project: Project) => {
      projectMap.set(project.id, project);
    });

    // Thêm managed projects
    managedProjectsResponse.data.forEach((project: Project) => {
      projectMap.set(project.id, project);
    });

    return Array.from(projectMap.values());
  }, [projects, managedProjectsResponse, showManagedOnly, isProjectManager]);

  const displayProjects = showManagedOnly ? projects : allProjects;

  const handleViewDetail = (projectId: number) => {
    router.push(`${ROUTERS.PERSONAL.PROJECTS}/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleChange = (checked: boolean) => {
    setShowManagedOnly(checked);
    setCurrentPage(1); // Reset về trang 1 khi đổi filter
  };

  const renderNoProjects = () => {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <Briefcase size={32} />
        </EmptyStateIcon>
        <EmptyStateTitle>Chưa có dự án nào</EmptyStateTitle>
        <EmptyStateDescription>
          {showManagedOnly 
            ? 'Bạn chưa quản lý dự án nào.' 
            : 'Bạn chưa tham gia dự án nào.'}
        </EmptyStateDescription>
      </EmptyState>
    );
  };

  const isManagedProject = (projectId: number) => {
    return managedProjectIds.has(projectId);
  };

  return (
    <ProjectsContainer>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProjectsHeader>
        <div>
          <ProjectsTitle>Dự án của tôi</ProjectsTitle>
          <ProjectsSubtitle>
            {pagination?.total 
              ? `${pagination.total} dự án` 
              : `${displayProjects.length} dự án`}
          </ProjectsSubtitle>
        </div>
      </ProjectsHeader>

      <FilterContainer>
        <div style={{ flex: 1, minWidth: isMobile ? "100%" : "200px" }}>
          <Input
            placeholder="Tìm kiếm theo tên dự án..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
            icon={<Search size={16} />}
            iconPosition="left"
            fullWidth={isMobile}
          />
        </div>
        
        {isProjectManager && (
          <ToggleContainer>
            <ToggleLabel htmlFor="managed-toggle">
              <span>Chỉ hiển thị dự án tôi quản lý</span>
              <ToggleSwitch
                $checked={showManagedOnly}
                onClick={() => handleToggleChange(!showManagedOnly)}
                id="managed-toggle"
              />
            </ToggleLabel>
          </ToggleContainer>
        )}
      </FilterContainer>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%' }}>
          <Loading />
        </div>
      ) : (
        <>
          <ProjectsGrid>
            {displayProjects.length === 0 ? (
              renderNoProjects()
            ) : (
              displayProjects.map((project) => {
                const isManaged = isManagedProject(project.id);
                const CardComponent = isManaged ? ProjectCardManaged : ProjectCard;
                
                return (
                  <CardComponent key={project.id}>
                    <ProjectInfo>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <ProjectName>{project.name}</ProjectName>
                        {isManaged && (
                          <ManagerBadge>
                            <Crown size={12} />
                            <span>Quản lý</span>
                          </ManagerBadge>
                        )}
                      </div>
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
                  </CardComponent>
                );
              })
            )}
          </ProjectsGrid>

          {pagination && pagination.total_pages > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.per_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </ProjectsContainer>
  );
};

export default Projects;