"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { Input, Pagination, Loading } from "@/components/common";
import { Users, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import AddTeamModal from "./modals/AddTeamModal";
import EditTeamModal from "./modals/EditTeamModal";
import {
  Container,
  ContentContainer,
  CreateButton,
  TeamTable,
  TableHeader,
  TableRow,
  TableCell,
  UserInfo,
  Avatar,
  UserName,
  ActionButton,
  Actions,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./teamListStyle";
import {
  useDivisionTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
} from "@/hooks/useDivisionWorkforce";
import { DivisionTeamData, DivisionTeamUpdateRequest, DivisionTeamCreateRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";

const TeamList: React.FC = () => {
  const router = useRouter();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const { success, error: showError } = useToast();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DivisionTeamData | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy] = useState("id");
  const [sortOrder] = useState("asc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useDivisionTeams(
    selectedDivisionId,
    debouncedSearch,
    page,
    limit,
    sortBy,
    sortOrder
  );

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam(editing?.id || 0);
  const deleteTeamMutation = useDeleteTeam();

  const handleCreate = async (formData: DivisionTeamCreateRequest) => {
    try {
      await createTeamMutation.mutateAsync(formData);
      success("Tạo team thành công");
      setOpen(false);
    } catch {
      showError("Không thể tạo team");
    }
  };

  const handleEditSave = async (formData: DivisionTeamUpdateRequest) => {
    if (!editing) return;
    try {
      await updateTeamMutation.mutateAsync(formData);
      success("Cập nhật team thành công");
      setEditOpen(false);
      setEditing(null);
    } catch {
      showError("Không thể cập nhật team");
    }
  };

  const openEdit = (e: React.MouseEvent, team: DivisionTeamData) => {
    e.stopPropagation();
    setEditing(team);
    setEditOpen(true);
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await deleteTeamMutation.mutateAsync(teamId);
      success("Xóa team thành công");
    } catch {
      showError("Không thể xóa team");
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

  return (
    <Container>
      <ContentContainer>
        <div style={{ marginBottom: "12px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <CreateButton onClick={() => setOpen(true)}>
            + Tạo team
          </CreateButton>
          
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Tìm kiếm theo tên team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        <TeamTable>
          <TableHeader>
            <TableCell>STT</TableCell>
            <TableCell>Tên team</TableCell>
            <TableCell>Người quản lý</TableCell>
            <TableCell>Số lượng thành viên</TableCell>
            <TableCell>Resource theo level</TableCell>
            <TableCell>Dự án đang hoạt động</TableCell>
            <TableCell>Ngày thành lập</TableCell>
            <TableCell>Hành động</TableCell>
          </TableHeader>
          {isLoading ? (
            <EmptyState>
              <Loading />
            </EmptyState>
          ) : error || !selectedDivisionId ? (
            <EmptyState>
              <EmptyIcon>
                <Users size={48} />
              </EmptyIcon>
              <EmptyText>
                {!selectedDivisionId
                  ? "Vui lòng chọn phòng ban"
                  : "Không thể tải dữ liệu"}
              </EmptyText>
            </EmptyState>
          ) : !data || data.data.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Users size={48} />
              </EmptyIcon>
              <EmptyText>
                {debouncedSearch
                  ? "Không tìm thấy team nào"
                  : "Chưa có team nào"}
              </EmptyText>
            </EmptyState>
          ) : (
            data.data.map((t) => (
              <TableRow
                key={t.id}
                onClick={() => router.push(`/division/workforce/team/${t.id}`)}
              >
                <TableCell>{t.id}</TableCell>
                <TableCell>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                </TableCell>
                <TableCell>
                  <UserInfo>
                    <Avatar>
                      {t.manager.avatar ? (
                        <Image src={t.manager.avatar} alt={t.manager.name} width={40} height={40} />
                      ) : (
                        <span>{t.manager.name.charAt(0)}</span>
                      )}
                    </Avatar>
                    <UserName>{t.manager.name}</UserName>
                  </UserInfo>
                </TableCell>
                <TableCell>{t.member_count}</TableCell>
                <TableCell>
                  {t.resource_by_level ? JSON.stringify(t.resource_by_level) : "-"}
                </TableCell>
                <TableCell>{t.active_projects}</TableCell>
                <TableCell>{formatDate(t.created_at)}</TableCell>
                <TableCell>
                  <Actions>
                    <ActionButton
                      $variant="edit"
                      title="Edit"
                      onClick={(e) => openEdit(e, t)}
                    >
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton
                      $variant="delete"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(t.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </Actions>
                </TableCell>
              </TableRow>
            ))
          )}
        </TeamTable>
        {data && data.data.length > 0 && data.pagination.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.pagination.total_pages}
            totalItems={data.pagination.total}
            itemsPerPage={limit}
            onPageChange={setPage}
            showInfo={true}
          />
        )}
      </ContentContainer>

      <AddTeamModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleCreate}
        divisionId={selectedDivisionId || 0}
      />
      <EditTeamModal isOpen={editOpen} onClose={() => setEditOpen(false)} team={editing} onSave={handleEditSave} />
    </Container>
  );
};

export default TeamList;
