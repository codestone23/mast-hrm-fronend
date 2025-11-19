"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Pagination, Table, TableColumn, Button, ConfirmDeleteModal } from "@/components/common";
import { Users, Edit, Trash2, Plus, Eye } from "lucide-react";
import Image from "next/image";
import AddTeamModal from "./modals/AddTeamModal";
import EditTeamModal from "./modals/EditTeamModal";
import {
  Container,
  ContentContainer,
  UserInfo,
  Avatar,
  UserName,
} from "./teamListStyle";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamData, DivisionTeamUpdateRequest, DivisionTeamCreateRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";

const ITEMS_PER_PAGE = 10;

const TeamList: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DivisionTeamData | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["division-workforce", "teams", selectedDivisionId, debouncedSearch, page, ITEMS_PER_PAGE],
    queryFn: () =>
      divisionWorkforceService.getTeams(
        selectedDivisionId!,
        debouncedSearch,
        page,
        ITEMS_PER_PAGE,
      ),
    enabled: !!selectedDivisionId,
  });

  const teams = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };
  const totalPages = pagination.total_pages || 1;

  const createTeamMutation = useMutation({
    mutationFn: (formData: DivisionTeamCreateRequest) =>
      divisionWorkforceService.createTeam(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
      showSuccessToast("Tạo team thành công");
      setIsCreateModalOpen(false);
      setPage(1);
    },
    onError: () => {
      showErrorToast("Không thể tạo team");
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
    onError: () => {
      showErrorToast("Không thể cập nhật team");
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
    onError: () => {
      showErrorToast("Không thể xóa team");
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
      return JSON.stringify(resourceByLevel);
    } catch {
      return "-";
    }
  };

  const teamColumns: TableColumn<DivisionTeamData>[] = useMemo(() => [
    {
      key: "id",
      label: "STT",
      width: "80px",
      align: "center",
    },
    {
      key: "name",
      label: "Tên team",
      width: "2fr",
      render: (_, row) => (
        <div style={{ fontWeight: 500 }}>{row.name}</div>
      ),
    },
    {
      key: "manager",
      label: "Người quản lý",
      width: "1.5fr",
      render: (_, row) => (
        <UserInfo>
          <Avatar>
            {row.manager.avatar && row.manager.avatar.includes('https') ? (
              <Image src={row.manager.avatar} alt={row.manager.name} width={40} height={40} />
            ) : (
              <span>{row.manager.name.charAt(0)}</span>
            )}
          </Avatar>
          <UserName>{row.manager.name}</UserName>
        </UserInfo>
      ),
    },
    {
      key: "member_count",
      label: "Số lượng thành viên",
      width: "1fr",
      align: "center",
    },
    {
      key: "resource_by_level",
      label: "Resource theo level",
      width: "1.5fr",
      render: (_, row) => formatResourceByLevel(row.resource_by_level),
    },
    {
      key: "active_projects",
      label: "Dự án đang hoạt động",
      width: "1fr",
      align: "center",
    },
    {
      key: "created_at",
      label: "Ngày thành lập",
      width: "1fr",
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
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/division/workforce/team/${row.id}`);
            }}
            icon={<Eye size={16} />}
            title="Xem chi tiết"
          >
            <span style={{ width: 0, height: 0, overflow: "hidden" }}>Xem</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            icon={<Edit size={16} />}
            title="Sửa"
          >
            <span style={{ width: 0, height: 0, overflow: "hidden" }}>Sửa</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            icon={<Trash2 size={16} />}
            title="Xóa"
          >
            <span style={{ width: 0, height: 0, overflow: "hidden" }}>Xóa</span>
          </Button>
        </div>
      ),
    },
  ], [router]);

  const emptyStateMessage = useMemo(() => {
    if (!selectedDivisionId) {
      return "Vui lòng chọn phòng ban";
    }
    if (debouncedSearch) {
      return "Không tìm thấy team nào";
    }
    return "Chưa có team nào";
  }, [selectedDivisionId, debouncedSearch]);

  return (
    <Container>
      <ContentContainer>
        <div style={{ marginBottom: "12px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus size={18} />}
            iconPosition="left"
          >
            Tạo team
          </Button>
          
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Tìm kiếm theo tên team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </div>
        </div>

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

        {teams.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </ContentContainer>

      <AddTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        divisionId={selectedDivisionId || 0}
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
          />
        </>
      )}
    </Container>
  );
};

export default TeamList;
