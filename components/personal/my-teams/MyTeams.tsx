"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Trash2, FolderOpen, UserPlus } from "lucide-react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import { useUser } from "@/hooks/useUser";
import divisionWorkforceService from "@/services/division_workforce.service";
import projectService from "@/services/project.service";
import { useToast } from "@/hooks/useToast";
import { Button, ConfirmDeleteModal, Loading } from "@/components/common";
import {
  Container,
  TeamsList,
  TeamCard,
  TeamHeader,
  TeamName,
  TeamDivision,
  TeamStats,
  StatItem,
  StatValue,
  StatLabel,
  SingleTeamContainer,
  SingleTeamHeader,
  SingleTeamInfo,
  SingleTeamName,
  SingleTeamDivision,
  TabsContainer,
  Tab,
  MembersList,
  MemberItem,
  MemberInfo,
  MemberAvatar,
  MemberDetails,
  MemberName,
  MemberRole,
  MemberPosition,
  ActionButtons,
  IconButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  TeamsTitle,
  ProjectsGrid,
  ProjectCard as ProjectCardStyled,
  ProjectCardName,
  ProjectCardDescription,
  ProjectCardMeta,
} from "./myTeamsStyle";
import AddMemberModal from "./modals/AddMemberModal";

interface TeamMember {
  assignment_id: number;
  user_id: number;
  email: string;
  name: string;
  code: string;
  avatar: string;
  position?: { id: number; name: string };
  level?: { id: number; name: string; coefficient: number };
  role?: { id: number; name: string };
  joined_at: string;
}

const MyTeams: React.FC = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const isMobile = useMobile();
  const { user } = useUser();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "projects">("members");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch my teams
  const { data: teamsData, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["my-teams"],
    queryFn: () => divisionWorkforceService.getMyTeams(),
  });

  const teams = teamsData?.data || [];
  const hasMultipleTeams = teams.length > 1;
  const selectedTeam = selectedTeamId
    ? teams.find((t) => t.id === selectedTeamId)
    : teams.length === 1
    ? teams[0]
    : null;

  // Fetch team members when a team is selected
  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["team-members", selectedTeam?.id],
    queryFn: () => divisionWorkforceService.getTeamMembers(selectedTeam!.id),
    enabled: !!selectedTeam,
  });

  const members = (membersData?.data || []) as unknown as TeamMember[];

  // Fetch team projects when projects tab is active
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["team-projects", selectedTeam?.id],
    queryFn: () => projectService.getProjectsAdmin(1, undefined, undefined, undefined, selectedTeam!.id),
    enabled: !!selectedTeam && activeTab === "projects",
  });

  const projects = projectsData?.data || [];

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      divisionWorkforceService.deleteMemberFromTeam(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      showSuccessToast("Xóa thành viên thành công");
      setIsDeleteMemberModalOpen(false);
      setSelectedMember(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId);
    setActiveTab("members");
  };

  const handleDeleteMember = (member: TeamMember) => {
    // Kiểm tra nếu đang cố xóa chính mình
    if (user?.id && member.user_id === user.id) {
      showErrorToast("Bạn không thể xóa chính mình khỏi team");
      return;
    }
    setSelectedMember(member);
    setIsDeleteMemberModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeam && selectedMember) {
      // Kiểm tra lại trước khi xóa
      if (user?.id && selectedMember.user_id === user.id) {
        showErrorToast("Bạn không thể xóa chính mình khỏi team");
        setIsDeleteMemberModalOpen(false);
        setSelectedMember(null);
        return;
      }
      deleteMemberMutation.mutate({
        teamId: selectedTeam.id,
        userId: selectedMember.user_id,
      });
    }
  };

  if (isLoadingTeams) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (teams.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>
            <Users size={64} />
          </EmptyIcon>
          <EmptyText>Bạn chưa quản lý đội nhóm nào</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  // Multiple teams view - show list of teams
  if (hasMultipleTeams && !selectedTeamId) {
    return (
      <Container>
        <TeamsTitle>
          Đội nhóm của tôi ({teams.length})
        </TeamsTitle>
        <TeamsList>
          {teams.map((team) => {
            const teamWithDivision = team as unknown as { division?: { name: string }; active_projects?: unknown[] };
            return (
              <TeamCard key={team.id} onClick={() => handleTeamClick(team.id)}>
                <TeamHeader>
                  <div>
                    <TeamName>{team.name}</TeamName>
                    <TeamDivision>{teamWithDivision.division?.name || ""}</TeamDivision>
                  </div>
                  <TeamStats style={{ margin: 0, width: "auto" }}>
                    <StatItem>
                      <StatValue>{team.member_count || 0}</StatValue>
                      <StatLabel>Thành viên</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>
                        {Array.isArray(teamWithDivision.active_projects) 
                          ? teamWithDivision.active_projects.length 
                          : 0}
                      </StatValue>
                      <StatLabel>Dự án</StatLabel>
                    </StatItem>
                  </TeamStats>
                </TeamHeader>
              </TeamCard>
            );
          })}
        </TeamsList>
      </Container>
    );
  }

  // Single team view or selected team view
  const currentTeam = selectedTeam || teams[0];

  return (
    <Container>
      {hasMultipleTeams && (
        <Button
          variant="ghost"
          onClick={() => setSelectedTeamId(null)}
          style={{ marginBottom: "16px" }}
        >
          ← Quay lại danh sách
        </Button>
      )}

      <SingleTeamContainer>
        <SingleTeamHeader>
          <SingleTeamInfo>
            <SingleTeamName>{currentTeam.name}</SingleTeamName>
            <SingleTeamDivision>{((currentTeam as unknown) as { division?: { name: string } }).division?.name || ""}</SingleTeamDivision>
          </SingleTeamInfo>

          <TeamStats style={{ margin: 0, width: "auto" }}>
            <StatItem>
              <StatValue>{currentTeam.member_count || 0}</StatValue>
              <StatLabel>Thành viên</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {(() => {
                  const teamWithProjects = (currentTeam as unknown) as { active_projects?: unknown[] };
                  return Array.isArray(teamWithProjects.active_projects) 
                    ? teamWithProjects.active_projects.length 
                    : 0;
                })()}
              </StatValue>
              <StatLabel>Dự án</StatLabel>
            </StatItem>
          </TeamStats>
        </SingleTeamHeader>

        <TabsContainer>
          <Tab $active={activeTab === "members"} onClick={() => setActiveTab("members")}>
            <Users size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Danh sách thành viên
          </Tab>
          <Tab $active={activeTab === "projects"} onClick={() => setActiveTab("projects")}>
            <FolderOpen size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Danh sách dự án
          </Tab>
        </TabsContainer>

        {activeTab === "members" && (
          <>
            <div style={{ 
              display: "flex", 
              justifyContent: isMobile ? "stretch" : "flex-end", 
              marginBottom: "16px" 
            }}>
              <Button
                variant="primary"
                icon={<UserPlus size={18} />}
                onClick={() => setIsAddMemberModalOpen(true)}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                Thêm thành viên
              </Button>
            </div>

            {isLoadingMembers ? (
              <Loading />
            ) : members.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <Users size={48} />
                </EmptyIcon>
                <EmptyText>Chưa có thành viên nào</EmptyText>
              </EmptyState>
            ) : (
              <MembersList>
                {members.map((member) => (
                  <MemberItem key={member.user_id}>
                    <MemberInfo>
                      <MemberAvatar>
                        {member.avatar && member.avatar.includes("https") ? (
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={44}
                            height={44}
                          />
                        ) : (
                          member.name?.charAt(0)?.toUpperCase() || "?"
                        )}
                      </MemberAvatar>
                      <MemberDetails>
                        <MemberName>
                          {member.name}
                          {member.position && (
                            <MemberPosition>{member.position.name}</MemberPosition>
                          )}
                        </MemberName>
                        <MemberRole>
                          {member.email}
                          {member.level && ` • ${member.level.name}`}
                        </MemberRole>
                      </MemberDetails>
                    </MemberInfo>
                    {user?.id && member.user_id !== user.id && (
                      <ActionButtons>
                        <IconButton
                          $variant="danger"
                          onClick={() => handleDeleteMember(member)}
                          title="Xóa khỏi team"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </ActionButtons>
                    )}
                  </MemberItem>
                ))}
              </MembersList>
            )}
          </>
        )}

        {activeTab === "projects" && (
          <>
            {isLoadingProjects ? (
              <Loading />
            ) : projects.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <FolderOpen size={48} />
                </EmptyIcon>
                <EmptyText>Chưa có dự án nào</EmptyText>
              </EmptyState>
            ) : (
              <ProjectsGrid>
                {projects.map((project) => (
                  <ProjectCardStyled key={project.id}>
                    <ProjectCardName>{project.name}</ProjectCardName>
                    {project.description && (
                      <ProjectCardDescription>{project.description}</ProjectCardDescription>
                    )}
                    <ProjectCardMeta>
                      {project.code && <span>Mã: {project.code}</span>}
                      {project.member_count !== undefined && (
                        <span>{project.member_count} thành viên</span>
                      )}
                      {project.status && (
                        <span>Trạng thái: {project.status}</span>
                      )}
                    </ProjectCardMeta>
                  </ProjectCardStyled>
                ))}
              </ProjectsGrid>
            )}
          </>
        )}
      </SingleTeamContainer>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        teamId={currentTeam.id}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteMemberModalOpen}
        onClose={() => {
          setIsDeleteMemberModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa thành viên"
        message={`Bạn có chắc chắn muốn xóa "${selectedMember?.name}" khỏi team?`}
        isLoading={deleteMemberMutation.isPending}
      />
    </Container>
  );
};

export default MyTeams;

