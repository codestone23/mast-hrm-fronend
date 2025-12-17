"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal, Loading } from "@/components/common";
import { FolderOpen } from "lucide-react";
import divisionWorkforceService from "@/services/division_workforce.service";
import styled from "styled-components";

interface TeamProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
}

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const ProjectIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectName = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const ProjectMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#dcfce7";
      case "COMPLETED":
        return "#e0e7ff";
      case "ON_HOLD":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#166534";
      case "COMPLETED":
        return "#4f46e5";
      case "ON_HOLD":
        return "#92400e";
      default:
        return "#6b7280";
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

interface ProjectData {
  id: number;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const TeamProjectsModal: React.FC<TeamProjectsModalProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
}) => {
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["team-projects", teamId],
    queryFn: () => divisionWorkforceService.getProjectByTeamId(teamId),
    enabled: isOpen && !!teamId,
  });

  const projects = (projectsData?.data || []) as ProjectData[];

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "COMPLETED":
        return "Hoàn thành";
      case "ON_HOLD":
        return "Tạm dừng";
      default:
        return status || "N/A";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dự án của ${teamName}`}
      size="lg"
    >
      {isLoading ? (
        <Loading />
      ) : projects.length === 0 ? (
        <EmptyState>
          <FolderOpen size={48} style={{ marginBottom: "16px", color: "#9ca3af" }} />
          <p>Chưa có dự án nào</p>
        </EmptyState>
      ) : (
        <ProjectsList>
          {projects.map((project) => (
            <ProjectItem key={project.id}>
              <ProjectIcon>
                <FolderOpen size={20} />
              </ProjectIcon>
              <ProjectInfo>
                <ProjectName>{project.name}</ProjectName>
                <ProjectMeta>
                  {project.description && (
                    <span style={{ marginRight: "16px" }}>{project.description}</span>
                  )}
                  {project.start_date && (
                    <span>
                      {formatDate(project.start_date)}
                      {project.end_date && ` - ${formatDate(project.end_date)}`}
                    </span>
                  )}
                </ProjectMeta>
              </ProjectInfo>
              <StatusBadge $status={project.status}>
                {getStatusLabel(project.status)}
              </StatusBadge>
            </ProjectItem>
          ))}
        </ProjectsList>
      )}
    </Modal>
  );
};

export default TeamProjectsModal;

