"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Trash2, FolderOpen, UserPlus } from "lucide-react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamData, DivisionMemberData } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { Button, ConfirmDeleteModal, Loading } from "@/components/common";
import {
  Container,
  TeamsGrid,
  TeamCard,
  TeamHeader,
  TeamName,
  TeamDivision,
  TeamStats,
  StatItem,
  StatValue,
  StatLabel,
  ProjectsList,
  ProjectsTitle,
  ProjectTag,
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
} from "./myTeamsStyle";
import AddMemberModal from "./modals/AddMemberModal";
import TeamProjectsModal from "./modals/TeamProjectsModal";

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

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "projects">("members");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
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
    setSelectedMember(member);
    setIsDeleteMemberModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeam && selectedMember) {
      deleteMemberMutation.mutate({
        teamId: selectedTeam.id,
        userId: selectedMember.user_id,
      });
    }
  };

  const formatResourceByLevel = (resourceByLevel: unknown) => {
    if (!resourceByLevel || typeof resourceByLevel !== "object") return {};
    return resourceByLevel as Record<string, number>;
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

  // Multiple teams view - show grid of team cards
  if (hasMultipleTeams && !selectedTeamId) {
    return (
      <Container>
        <TeamsTitle>
          Đội nhóm của tôi ({teams.length})
        </TeamsTitle>
        <TeamsGrid>
          {teams.map((team) => {
            const resourceLevels = formatResourceByLevel(team.resource_by_level);
            return (
              <TeamCard key={team.id} onClick={() => handleTeamClick(team.id)}>
                <TeamHeader>
                  <TeamName>{team.name}</TeamName>
                  <TeamDivision>{(team as any).division?.name || ""}</TeamDivision>
                </TeamHeader>

                <TeamStats>
                  <StatItem>
                    <StatValue>{team.member_count || 0}</StatValue>
                    <StatLabel>Thành viên</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>
                      {Array.isArray((team as any).active_projects) 
                        ? (team as any).active_projects.length 
                        : 0}
                    </StatValue>
                    <StatLabel>Dự án</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>
                      {Object.values(resourceLevels).reduce((a, b) => a + b, 0)}
                    </StatValue>
                    <StatLabel>Resources</StatLabel>
                  </StatItem>
                </TeamStats>

                {Object.keys(resourceLevels).length > 0 && (
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                    {Object.entries(resourceLevels).map(([level, count]) => (
                      <span key={level} style={{ marginRight: "12px" }}>
                        {level}: {count}
                      </span>
                    ))}
                  </div>
                )}

                {Array.isArray((team as any).active_projects) && (team as any).active_projects.length > 0 && (
                  <ProjectsList>
                    <ProjectsTitle>Dự án đang hoạt động</ProjectsTitle>
                    {(team as any).active_projects.slice(0, 3).map((project: { id: number; name: string }) => (
                      <ProjectTag key={project.id}>{project.name}</ProjectTag>
                    ))}
                    {(team as any).active_projects.length > 3 && (
                      <ProjectTag>+{(team as any).active_projects.length - 3}</ProjectTag>
                    )}
                  </ProjectsList>
                )}
              </TeamCard>
            );
          })}
        </TeamsGrid>
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
            <SingleTeamDivision>{(currentTeam as any).division?.name || ""}</SingleTeamDivision>
          </SingleTeamInfo>

          <TeamStats style={{ margin: 0, width: "auto" }}>
            <StatItem>
              <StatValue>{currentTeam.member_count || 0}</StatValue>
              <StatLabel>Thành viên</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {Array.isArray((currentTeam as any).active_projects) 
                  ? (currentTeam as any).active_projects.length 
                  : 0}
              </StatValue>
              <StatLabel>Dự án</StatLabel>
            </StatItem>
          </TeamStats>
        </SingleTeamHeader>

        <TabsContainer>
          <Tab $active={activeTab === "members"} onClick={() => setActiveTab("members")}>
            <Users size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Thành viên
          </Tab>
          <Tab $active={activeTab === "projects"} onClick={() => setIsProjectsModalOpen(true)}>
            <FolderOpen size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Dự án
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
                    <ActionButtons>
                      <IconButton
                        $variant="danger"
                        onClick={() => handleDeleteMember(member)}
                        title="Xóa khỏi team"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </ActionButtons>
                  </MemberItem>
                ))}
              </MembersList>
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

      <TeamProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        teamId={currentTeam.id}
        teamName={currentTeam.name}
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

