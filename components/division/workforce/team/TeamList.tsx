"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Pagination, Table, TableColumn, Button, ConfirmDeleteModal } from "@/components/common";
import { Users, Edit, Trash2, Plus, Eye, Search } from "lucide-react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import AddTeamModal from "./modals/AddTeamModal";
import EditTeamModal from "./modals/EditTeamModal";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  CreateButton,
  SearchContainer,
  HeaderRow,
  FilterContainer,
  StatsRow,
} from "@/components/company/account/accountStyle";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamData, DivisionTeamUpdateRequest, DivisionTeamCreateRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";

const ITEMS_PER_PAGE = 10;

const TeamList: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMobile();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DivisionTeamData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["division-workforce", "teams", selectedDivisionId, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisionWorkforceService.getTeams(
        selectedDivisionId!,
        debouncedSearch,
        pageParam as number,
        ITEMS_PER_PAGE,
      ),
    enabled: !!selectedDivisionId,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const teams = useMemo(
    () => data?.pages.flatMap((page) => page.data || []) || [],
    [data]
  );

  const pagination = useMemo(() => {
    const lastPage = data?.pages[data.pages.length - 1];
    return lastPage?.pagination || {
      total: 0,
      current_page: 1,
      total_pages: 1,
      limit: ITEMS_PER_PAGE,
    };
  }, [data]);

  const createTeamMutation = useMutation({
    mutationFn: (formData: DivisionTeamCreateRequest) =>
      divisionWorkforceService.createTeam(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
      showSuccessToast("Tạo team thành công");
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể tạo team");
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ teamId, data }: { teamId: number; data: DivisionTeamUpdateRequest }) =>
      divisionWorkforceService.updateTeam(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "team"] });
      showSuccessToast("Cập nhật team thành công");
      setIsEditModalOpen(false);
      setSelectedTeam(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể cập nhật team");
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: number) => divisionWorkforceService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
      showSuccessToast("Xóa team thành công");
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể xóa team");
    },
  });

  const handleCreate = async (formData: DivisionTeamCreateRequest) => {
    await createTeamMutation.mutateAsync(formData);
  };

  const handleEdit = (team: DivisionTeamData) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData: DivisionTeamUpdateRequest) => {
    if (!selectedTeam) return;
    await updateTeamMutation.mutateAsync({ teamId: selectedTeam.id, data: formData });
  };

  const handleDeleteClick = (team: DivisionTeamData) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeam) {
      deleteTeamMutation.mutate(selectedTeam.id);
    }
  };

  const handleViewDetail = (team: DivisionTeamData) => {
    router.push(`/division/workforce/team/${team.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const formatResourceByLevel = (resourceByLevel: unknown) => {
    if (!resourceByLevel) return "-";
    try {
      if (typeof resourceByLevel === "string") {
        return resourceByLevel;
      }
      if (typeof resourceByLevel === "object") {
        const entries = Object.entries(resourceByLevel);
        if (entries.length === 0) return "-";
        return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
      }
      return String(resourceByLevel);
    } catch {
      return "-";
    }
  };

  const teamColumns: TableColumn<DivisionTeamData>[] = useMemo(() => [
    {
      key: "name",
      label: "Tên team",
      width: "2fr",
      render: (_, row) => (
        <div style={{ fontWeight: 500, color: "#111827" }}>{row.name}</div>
      ),
    },
    {
      key: "manager",
      label: "Người quản lý",
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
            {row.manager.avatar && row.manager.avatar.includes('https') ? (
              <Image src={row.manager.avatar} alt={row.manager.name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            ) : (
              <span style={{ fontWeight: 500 }}>{row.manager.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "#111827", marginBottom: "2px" }}>{row.manager.name}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{row.manager.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "member_count",
      label: "Số lượng thành viên",
      width: "150px",
      align: "center",
      render: (_, row) => (
        <span style={{ fontWeight: 500 }}>{row.member_count || 0}</span>
      ),
    },
    {
      key: "resource_by_level",
      label: "Resource theo level",
      width: "200px",
      render: (_, row) => (
        <span style={{ fontSize: "14px", color: "#6b7280" }}>
          {formatResourceByLevel(row.resource_by_level)}
        </span>
      ),
    },
    {
      key: "active_projects",
      label: "Dự án đang hoạt động",
      width: "150px",
      align: "center",
      render: (_, row) => (
        <span style={{ fontSize: "14px" }}>{row.active_projects || "-"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Ngày thành lập",
      width: "150px",
      render: (_, row) => formatDate(row.created_at),
    },
    {
      key: "actions",
      label: "Hành động",
      width: "150px",
      align: "center",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(row);
            }}
          >
            <span style={{ display: "none" }}>Xem</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            disabled={updateTeamMutation.isPending}
          >
            <span style={{ display: "none" }}>Sửa</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            disabled={deleteTeamMutation.isPending}
          >
            <span style={{ display: "none" }}>Xóa</span>
          </Button>
        </div>
      ),
    },
  ], [router, updateTeamMutation.isPending, deleteTeamMutation.isPending]);

  const emptyStateMessage = useMemo(() => {
    if (!selectedDivisionId) {
      return "Vui lòng chọn phòng ban";
    }
    if (debouncedSearch) {
      return "Không tìm thấy team nào";
    }
    return "Chưa có team nào";
  }, [selectedDivisionId, debouncedSearch]);

  const renderHeader = () => {
    return (
      <DashboardCol>
        <Card>
          <CardHeader>
            <IconWrapper>
              <Users size={20} />
            </IconWrapper>
            <CardTitle>Quản lý đội nhóm</CardTitle>
          </CardHeader>
          <FilterContainer>
            <HeaderRow $isMobile={isMobile}>
              <SearchContainer $isMobile={isMobile}>
                <Input
                  placeholder="Tìm kiếm theo tên team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                  fullWidth={true}
                />
              </SearchContainer>
              <CreateButton 
                $isMobile={isMobile}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={20} />
                Tạo team mới
              </CreateButton>
            </HeaderRow>
            <StatsRow>
              <span>
                Tổng số:{" "}
                <strong style={{ color: "var(--text-primary)" }}>{pagination.total || teams.length}</strong>
              </span>
            </StatsRow>
          </FilterContainer>
        </Card>
      </DashboardCol>
    );
  };

  return (
    <PersonalContainer>
      <DashboardGridAccount>
        {renderHeader()}
        <DashboardCol $span={2}>
          <Card>
            <CardHeader>
              <IconWrapper>
                <Users size={20} />
              </IconWrapper>
              <CardTitle>Danh sách team</CardTitle>
            </CardHeader>

            <Table
              columns={teamColumns}
              data={teams}
              loading={isLoading}
              error={error as Error | null}
              emptyState={{
                icon: <Users size={48} />,
                message: emptyStateMessage,
              }}
              onRowClick={(row) => router.push(`/division/workforce/team/${row.id}`)}
              rowKey="id"
            />

            {isFetchingNextPage && (
              <div style={{ padding: "16px", textAlign: "center", color: "#6b7280" }}>
                Đang tải thêm...
              </div>
            )}

            <div ref={sentinelRef} style={{ height: "1px" }} />

            {pagination.total_pages > 1 && !isFetchingNextPage && (
              <div style={{ marginTop: "16px" }}>
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={() => {
                    // For infinite query, we use scroll-based loading
                  }}
                  showInfo={true}
                />
              </div>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      <AddTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        divisionId={selectedDivisionId || 0}
        isLoading={createTeamMutation.isPending}
      />

      {selectedTeam && (
        <>
          <EditTeamModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTeam(null);
            }}
            team={selectedTeam}
            onSave={handleUpdate}
            isLoading={updateTeamMutation.isPending}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTeam(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Xóa team"
            message={`Bạn có chắc chắn muốn xóa team "${selectedTeam.name}"?`}
            isLoading={deleteTeamMutation.isPending}
          />
        </>
      )}
    </PersonalContainer>
  );
};

export default TeamList;
