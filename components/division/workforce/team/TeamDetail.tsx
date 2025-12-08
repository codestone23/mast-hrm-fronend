"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button, Table, TableColumn, ConfirmDeleteModal, Pagination, Input } from "@/components/common";
import { Search } from "lucide-react";
import AddMemberModal from "./modals/AddMemberModal";
import { useTeamDetail } from "./useTeamDetail";
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
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const { data: teamData, isLoading: isLoadingTeam, error: teamError, refetch } = useTeamDetail(id || null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    user_id: number;
    name: string;
    email: string;
    code: string;
    avatar: string | null;
    position?: { id: number; name: string };
    level?: { id: number; name: string; coefficient: number };
    role?: { id: number; name: string };
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use members from teamData if available
  const allMembers = useMemo(() => teamData?.members || [], [teamData?.members]);
  const filteredMembers = useMemo(() => {
    if (!debouncedSearch) return allMembers;
    const search = debouncedSearch.toLowerCase();
    return allMembers.filter((member: typeof allMembers[0]) =>
      member.name?.toLowerCase().includes(search) ||
      member.code?.toLowerCase().includes(search) ||
      member.email?.toLowerCase().includes(search)
    );
  }, [allMembers, debouncedSearch]);

  const ITEMS_PER_PAGE = 10;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredMembers.slice(start, end);
  }, [filteredMembers, currentPage]);

  const pagination = {
    total: filteredMembers.length,
    current_page: currentPage,
    total_pages: Math.ceil(filteredMembers.length / ITEMS_PER_PAGE),
    limit: ITEMS_PER_PAGE,
  };

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => {
      if (!id) throw new Error("Team ID is required");
      return divisionWorkforceService.removeMemberFromTeam(Number(id), userId);
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

  const addMemberMutation = useMutation({
    mutationFn: (userIds: number[]) => {
      if (!id) throw new Error("Team ID is required");
      return divisionWorkforceService.addMembersToTeam(Number(id), userIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "members"] });
      queryClient.invalidateQueries({ queryKey: ["team-detail", id] });
      showSuccessToast("Thêm thành viên vào team thành công");
      setIsAddMemberModalOpen(false);
      refetch();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể thêm thành viên");
    },
  });

  const handleAddMember = async (userIds: number[]) => {
    await addMemberMutation.mutateAsync(userIds);
  };

  const handleDeleteMember = (member: typeof allMembers[0]) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMember) {
      removeMemberMutation.mutate(selectedMember.user_id);
    }
  };

  type TeamMember = typeof allMembers[0];

  const columns: TableColumn<TeamMember>[] = [
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
      render: (_, row) => (
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          {row.position?.name || "-"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Vai trò",
      width: "150px",
      render: (_, row) => (
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          {row.role?.name || "-"}
        </span>
      ),
    },
    {
      key: "level",
      label: "Level",
      width: "100px",
      render: (_, row) => (
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          {row.level?.name || "-"}
        </span>
      ),
    },
    {
      key: "coefficient",
      label: "Hệ số",
      width: "100px",
      align: "center",
      render: (_, row) => (
        <span style={{ fontWeight: 500 }}>{row.level?.coefficient || "-"}</span>
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
                {isMobile ? teamData?.name || "" : `Chi tiết team: ${teamData?.name || ""}`}
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
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData?.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Phòng ban</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData?.division?.name || "-"}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Số lượng thành viên</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData?.member_count || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Số lượng dự án</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{teamData?.project_count || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Ngày thành lập</div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  {teamData?.founding_date ? new Date(teamData.founding_date).toLocaleDateString("vi-VN") : "-"}
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
            <div style={{ padding: "16px", paddingTop: 0 }}>
              <Input
                placeholder="Tìm kiếm thành viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                fullWidth
              />
            </div>

            <Table
              columns={columns}
              data={paginatedMembers}
              loading={isLoadingTeam}
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
        teamId={id ? Number(id) : undefined}
        isLoading={addMemberMutation.isPending}
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
