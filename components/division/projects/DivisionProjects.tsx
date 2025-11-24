"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus,
  Eye,
  Trash2,
  Users,
  Briefcase,
  Search,
  Building
} from "lucide-react";
import { Button, Input, Pagination, ConfirmDeleteModal, Loading } from "@/components/common";
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
} from "@/components/personal/projects/projectStyle";
import projectService, { Project } from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import CreateProjectModal from "./modals/CreateProjectModal";
import ROUTERS from "@/config/router";

const statusLabels: Record<string, string> = {
  'OPEN': 'Mở',
  'IN_PROGRESS': 'Đang thực hiện',
  'PENDING': 'Tạm dừng',
  'CLOSED': 'Đã đóng'
};

const DivisionProjects: React.FC = () => {
  const router = useRouter();
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { deleteProject } = useProjectMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: projectsResponse, isLoading, error } = useQuery({
    queryKey: ['projects-admin', page, debouncedSearch, selectedDivisionId],
    queryFn: () => projectService.getProjectsAdmin(
      page, 
      debouncedSearch || undefined, 
      selectedDivisionId || undefined
    ),
    enabled: !!selectedDivisionId,
  });

  const projects = projectsResponse?.data || [];
  const pagination = projectsResponse?.pagination;

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewDetail = (projectId: number) => {
    router.push(`${ROUTERS.DIVISION.PROJECTS}/${projectId}`);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id.toString(), {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        },
      });
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  if (!selectedDivisionId) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Quản lý dự án</ProjectsTitle>
            <ProjectsSubtitle>Vui lòng chọn phòng ban</ProjectsSubtitle>
          </div>
        </ProjectsHeader>
        <EmptyState>
          <EmptyStateIcon>
            <Briefcase size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Chưa chọn phòng ban</EmptyStateTitle>
          <EmptyStateDescription>
            Vui lòng chọn phòng ban để xem danh sách dự án.
          </EmptyStateDescription>
        </EmptyState>
      </ProjectsContainer>
    );
  }

  if (isLoading) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Quản lý dự án</ProjectsTitle>
            <ProjectsSubtitle>Đang tải dữ liệu...</ProjectsSubtitle>
          </div>
        </ProjectsHeader>
      </ProjectsContainer>
    );
  }

  if (error) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Quản lý dự án</ProjectsTitle>
            <ProjectsSubtitle>Có lỗi xảy ra khi tải dữ liệu</ProjectsSubtitle>
          </div>
        </ProjectsHeader>
      </ProjectsContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Quản lý dự án</ProjectsTitle>
            <ProjectsSubtitle>Chưa có dự án nào</ProjectsSubtitle>
          </div>
          <Button variant="primary" onClick={handleCreateProject}>
            <Plus size={16} />
            Tạo dự án
          </Button>
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
            Hãy tạo dự án đầu tiên để bắt đầu.
          </EmptyStateDescription>
        </EmptyState>

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateSuccess}
        />
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <div>
          <ProjectsTitle>Quản lý dự án</ProjectsTitle>
          <ProjectsSubtitle>
            {pagination?.total || projects.length} dự án
          </ProjectsSubtitle>
        </div>
        <Button variant="primary" onClick={handleCreateProject}>
          <Plus size={16} />
          Tạo dự án
        </Button>
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
        <Loading />
      ) : (
        <ProjectsGrid>
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
                  <ProjectMetaItem>
                    <Briefcase size={14} />
                    <span>{statusLabels[project.status] || project.status}</span>
                  </ProjectMetaItem>
                </ProjectMeta>
              </ProjectInfo>

              <ProjectActions>
                <ProjectActionButton onClick={() => handleViewDetail(project.id)}>
                  <Eye size={14} />
                  Chi tiết
                </ProjectActionButton>
                <ProjectActionButton 
                  onClick={() => handleDeleteProject(project)}
                  $danger
                >
                  <Trash2 size={14} />
                  Xóa
                </ProjectActionButton>
              </ProjectActions>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}


      {pagination && pagination.total_pages > 1 && (
        <div style={{ marginTop: '2rem' }}>
          <Pagination
            currentPage={page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
            onPageChange={setPage}
            showInfo={true}
          />
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSuccess}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa dự án"
        message={`Bạn có chắc chắn muốn xóa dự án "${projectToDelete?.name}"?`}
      />
    </ProjectsContainer>
  );
};

export default DivisionProjects;

