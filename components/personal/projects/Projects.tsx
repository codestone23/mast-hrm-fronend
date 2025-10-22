"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Briefcase,
  User,
  Building
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData, Button } from '@/components/common';
import { ConfirmDeleteModal } from '@/components/common';
import {
  ProjectsContainer,
  ProjectsHeader,
  ProjectsTitle,
  ProjectsSubtitle,
  ProjectsActions,
  ProjectsGrid,
  ProjectCard,
  ProjectHeader,
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
import ProjectModal from './modals/ProjectModal';
import projectService, { Project } from '@/services/project.service';
import { useProjectMutation } from '@/hooks/useProjectMutation';
import ROUTERS from "@/config/router";

const Projects: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { deleteProject } = useProjectMutation();

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

  // Fetch projects data
  const { data: projectsResponse, isLoading, error } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectService.getMyProjects(1),
  });

  const projects = projectsResponse?.data || [];

  const handleAddProject = () => {
    setModalMode('add');
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        },
      });
    }
  };

  const handleViewDetail = (projectId: string) => {
    router.push(`${ROUTERS.PERSONAL.PROJECTS}/${projectId}`);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <ProjectsContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectsHeader>
          <ProjectsTitle>Dự án của tôi</ProjectsTitle>
          <ProjectsSubtitle>Đang tải dữ liệu...</ProjectsSubtitle>
        </ProjectsHeader>
      </ProjectsContainer>
    );
  }

  if (error) {
    return (
      <ProjectsContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectsHeader>
          <ProjectsTitle>Dự án của tôi</ProjectsTitle>
          <ProjectsSubtitle>Có lỗi xảy ra khi tải dữ liệu</ProjectsSubtitle>
        </ProjectsHeader>
      </ProjectsContainer>
    );
  }

  if (projects.length === 0) {
    return (
      <ProjectsContainer>
        <Breadcrumb items={breadcrumbItems} />
        <ProjectsHeader>
          <div>
            <ProjectsTitle>Dự án của tôi</ProjectsTitle>
            <ProjectsSubtitle>Chưa có dự án nào</ProjectsSubtitle>
          </div>
          <Button variant="primary" onClick={handleAddProject}>
            <Plus size={16} />
            Thêm dự án
          </Button>
        </ProjectsHeader>
        
        <EmptyState>
          <EmptyStateIcon>
            <Briefcase size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Chưa có dự án nào</EmptyStateTitle>
          <EmptyStateDescription>
            Bạn chưa có dự án nào. Hãy thêm dự án đầu tiên để bắt đầu.
          </EmptyStateDescription>
        </EmptyState>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          initialData={selectedProject}
          onSave={handleModalSave}
        />
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
        <Button variant="primary" onClick={handleAddProject}>
          <Plus size={16} />
          Thêm dự án
        </Button>
      </ProjectsHeader>

      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectInfo>
              <ProjectName>{project.name}</ProjectName>
              <ProjectDescription>{project.description}</ProjectDescription>
              
              <ProjectMeta>
                <ProjectMetaItem>
                  <Users size={14} />
                  <span>{project.team_size} người</span>
                </ProjectMetaItem>
                <ProjectMetaItem>
                  <Building size={14} />
                  <span>{project.client}</span>
                </ProjectMetaItem>
              </ProjectMeta>
            </ProjectInfo>

            <ProjectActions>
              <ProjectActionButton onClick={() => handleViewDetail(project.id)}>
                <Eye size={14} />
              </ProjectActionButton>
              <ProjectActionButton onClick={() => handleEditProject(project)}>
                <Edit size={14} />
              </ProjectActionButton>
              <ProjectActionButton 
                onClick={() => handleDeleteProject(project)}
                $danger
              >
                <Trash2 size={14} />
              </ProjectActionButton>
            </ProjectActions>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedProject}
        onSave={handleModalSave}
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

export default Projects;