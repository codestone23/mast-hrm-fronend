"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common";
import AddTeamModal from "./modals/AddTeamModal";
import EditTeamModal from "./modals/EditTeamModal";
import {
  Container,
  Card,
  HeaderRow,
  InfoBox,
  Title,
  CreateWrap,
  TableWrap,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Actions,
  Pagination,
} from "./teamListStyle";
import divisionWorkforceService from "@/services/division_workforce.service";
import { PaginatedResponse, DivisionTeamData, DivisionTeamUpdateRequest, DivisionTeamCreateRequest } from "@/types/api";

const TeamList: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DivisionTeamData | null>(null);
  const [data, setData] = useState<DivisionTeamData[] | null>(null);

  const DIVISION_ID = 1;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    try {
      divisionWorkforceService.getTeams(
        DIVISION_ID,
        search,
        page,
        limit,
        sortBy,
        sortOrder
      ).then((res) => {
        setData(res.data);
        setTotalPages(res.pagination.total_pages);
      });
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }, [DIVISION_ID, search, page, limit, sortBy, sortOrder]);

  const handleCreate = (data: DivisionTeamCreateRequest) => {
    divisionWorkforceService.createTeam(data)
    // not done
    
    setOpen(false);
  };

  const handleEditSave = (data: DivisionTeamUpdateRequest) => {
    if (!editing) return;

    divisionWorkforceService.updateTeam(editing.id, data)
    // not done

    setEditOpen(false);
    setEditing(null);
  };

  const openEdit = (e: React.MouseEvent, team: DivisionTeamData) => {
    e.stopPropagation();
    setEditing(team);
    setEditOpen(true);
  };

  const handleDeleteTeam = (teamId: number) => {
    if (!data) return;
    divisionWorkforceService.deleteTeam(teamId).then(() => {
      setData(data.filter((t) => t.id !== teamId));
    });
  };

  return (
    <Container>
      <Card>
        <HeaderRow>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <strong>Thông tin team</strong>
          </div>

          <CreateWrap>
            <Button variant="warning" onClick={() => setOpen(true)}>+ Tạo team</Button>
          </CreateWrap>
        </HeaderRow>

        <TableWrap>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: 60 }}>STT</Th>
                <Th>Tên team</Th>
                <Th>Người quản lý</Th>
                <Th>Số lượng thành viên</Th>
                <Th>Resource theo level</Th>
                <Th>Dự án đang hoạt động</Th>
                <Th>Ngày thành lập</Th>
                <Th style={{ width: 96 }}></Th>
              </Tr>
            </Thead>

            <Tbody>
              {data && data.map((t) => (
                <Tr key={t.id} onClick={() => router.push(`/division/workforce/team/${t.id}`)} style={{ cursor: 'pointer' }}>
                  <Td>{t.id}</Td>
                  <Td>{t.name}</Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar src={t.manager.avatar} alt={t.manager.name} />
                      <div>{t.manager.name}</div>
                    </div>
                  </Td>
                  <Td>{t.member_count}</Td>
                  <Td>{JSON.stringify(t.resource_by_level)}</Td>
                  <Td>{t.active_projects}</Td>
                  <Td>{t.created_at}</Td>
                  <Td>
                    <Actions>
                      <button title="Edit" onClick={(e) => openEdit(e, t)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✏️</button>
                      <button title="Delete" onClick={(e) => { e.stopPropagation(); handleDeleteTeam(t.id); }} style={{ border: "none", background: "transparent", cursor: "pointer" }}>🗑️</button>
                    </Actions>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrap>

        <Pagination>
          <div>1 - 10 from 60</div>
          <div>Rows per page 10 ▸</div>
        </Pagination>
      </Card>

      <AddTeamModal isOpen={open} onClose={() => setOpen(false)} onSave={handleCreate} divisionId={DIVISION_ID} />
      <EditTeamModal isOpen={editOpen} onClose={() => setEditOpen(false)} team={editing} onSave={handleEditSave} />
    </Container>
  );
};

export default TeamList;
