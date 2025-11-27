"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button, Table, TableColumn, ConfirmDeleteModal, Pagination } from "@/components/common";
import AddMemberModal from "./modals/AddMemberModal";
import { useTeamDetail } from "./useTeamDetail";
import { useDivisionMembers } from "@/hooks/useDivisionWorkforce";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DivisionMemberData } from "@/types/api";
import {
  PersonalInfoContainer,
  MainContent,
  BackButton,
  DetailHeader,
  DetailHeaderContent,
  DetailTitleWrapper,
  DetailTitle,
  DetailContent,
  DetailInfoGrid,
  CardHeaderActions,
} from "@/components/company/account/accountDetailStyle";
import {
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
} from "@/components/company/account/accountStyle";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import divisionWorkforceService from "@/services/division_workforce.service";
import { useMobile } from "@/hooks/useMobile";
interface TeamDetailProps {
  id?: string;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMobile();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const { data: teamData, isLoading: isLoadingTeam, error: teamError, refetch } = useTeamDetail(id || null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DivisionMemberData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch members of this team
  const { data: membersData, isLoading: isLoadingMembers } = useDivisionMembers(
    selectedDivisionId,
    currentPage,
    10,
    debouncedSearch,
    {
      teamId: id ? Number(id) : undefined,
    }
  );

  const members = membersData?.data || [];
  const pagination = membersData?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: 10,
  };

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => {
      // Implement remove member from team API call
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "members"] });
      queryClient.invalidateQueries({ queryKey: ["team-detail", id] });
      showSuccessToast("Xóa thành viên khỏi team thành công");
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể xóa thành viên");
    },
  });

  const handleBack = () => {
    router.push("/division/workforce");
  };

  const handleAddMember = (newMembers: Array<{ id: number; name: string; email: string }>) => {
    // Implement add members to team logic
    showSuccessToast("Thêm thành viên vào team thành công");
    setIsAddMemberModalOpen(false);
    refetch();
  };

  const handleDeleteMember = (member: DivisionMemberData) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMember) {
      removeMemberMutation.mutate(selectedMember.user_id);
    }
  };

  const formatSkills = (skills: string | null | undefined) => {
    if (!skills) return "-";
    const skillsList = skills.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
    return skillsList.slice(0, 3).join(", ") + (skillsList.length > 3 ? ` +${skillsList.length - 3}` : "");
  };

  const columns: TableColumn<DivisionMemberData>[] = [
    {
      key: "code",
      label: "Mã",
      width: "100px",
    },
    {
      key: "name",
      label: "Tên nhân viên",
      width: "2fr",
      render: (_, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6366f1",
              overflow: "hidden",
            }}
          >
            {row.avatar && row.avatar.includes('https') ? (
              <Image src={row.avatar} alt={row.name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            ) : (
              <span style={{ fontWeight: 500 }}>{row.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "#111827", marginBottom: "2px" }}>{row.name}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      label: "Vị trí",
      width: "150px",
    },
    {
      key: "skills",
      label: "Kỹ năng",
      width: "200px",
      render: (value) => (
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          {formatSkills(value as string | null | undefined)}
        </span>
      ),
    },
    {
      key: "level",
      label: "Level",
      width: "100px",
    },
    {
      key: "coefficient",
      label: "Hệ số",
      width: "100px",
      align: "center",
      render: (value) => (
        <span style={{ fontWeight: 500 }}>{value as number || "-"}</span>
      ),
    },
    {
      key: "actions",
      label: "Hành động",
      width: "100px",
      align: "center",
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteMember(row);
          }}
          disabled={removeMemberMutation.isPending}
        >
          Xóa
        </Button>
      ),
    },
  ];

  if (isLoadingTeam) {
    return (
      <PersonalInfoContainer>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <div>Đang tải...</div>
        </div>
      </PersonalInfoContainer>
    );
  }

  if (teamError || !teamData) {
    return (
      <PersonalInfoContainer>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ color: "var(--error-600)" }}>
            {teamError ? "Có lỗi xảy ra khi tải thông tin team" : "Không tìm thấy team"}
          </div>
        </div>
      </PersonalInfoContainer>
    );
  }

  return (
    <PersonalInfoContainer>
      <MainContent>
        <DetailHeader $isMobile={isMobile}>
          <DetailHeaderContent $isMobile={isMobile}>
            <DetailTitleWrapper $isMobile={isMobile}>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={isMobile ? 18 : 20} />
              </BackButton>
              <DetailTitle $isMobile={isMobile}>
                {isMobile ? teamData.name : `Chi tiết team: ${teamData.name}`}
              </DetailTitle>
            </DetailTitleWrapper>
          </DetailHeaderContent>
        </DetailHeader>

        <DetailContent $isMobile={isMobile}>
          <Card style={{ marginBottom: isMobile ? "12px" : "20px" }}>
            <CardHeader>
              <IconWrapper>
                <Plus size={isMobile ? 18 : 20} />
              </IconWrapper>
              <CardTitle>Thông tin team</CardTitle>
            </CardHeader>
            <DetailInfoGrid $isMobile={isMobile}>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Tên team</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Người quản lý</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData.manager.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Số lượng thành viên</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData.member_count}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Ngày thành lập</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  {teamData.founding_date ? new Date(teamData.founding_date).toLocaleDateString("vi-VN") : "-"}
                </div>
              </div>
            </DetailInfoGrid>
          </Card>

          <Card>
            <CardHeaderActions $isMobile={isMobile}>
              <CardHeader style={{ marginBottom: 0 }}>
                <IconWrapper>
                  <Plus size={isMobile ? 18 : 20} />
                </IconWrapper>
                <CardTitle>Danh sách thành viên</CardTitle>
              </CardHeader>
              <Button
                variant="primary"
                onClick={() => setIsAddMemberModalOpen(true)}
                icon={<Plus size={18} />}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                Thêm nhân sự
              </Button>
            </CardHeaderActions>

            <Table
              columns={columns}
              data={members}
              loading={isLoadingMembers}
              error={null}
              emptyState={{
                icon: <Plus size={48} />,
                message: "Chưa có thành viên nào trong team",
              }}
              rowKey="user_id"
            />

            {pagination.total_pages > 1 && (
              <div style={{ marginTop: "16px" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={10}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                />
              </div>
            )}
          </Card>
        </DetailContent>
      </MainContent>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSave={handleAddMember}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa thành viên khỏi team"
        message={`Bạn có chắc chắn muốn xóa "${selectedMember?.name || ""}" khỏi team?`}
      />
    </PersonalInfoContainer>
  );
};

export default TeamDetail;
