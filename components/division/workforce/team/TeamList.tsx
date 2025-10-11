"use client";

import React from "react";
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

const makeTeams = () => new Array(10).fill(0).map((_, i) => ({
  id: i + 1,
  name: `Team Project ${String.fromCharCode(65 + (i % 6))}`,
  manager: "Phi Việt Anh",
  managerAvatar: `https://i.pravatar.cc/40?img=${i + 10}`,
  members: 20 + (i % 5),
  resource: 24,
  projects: "AR Civil, City Portal",
  createdAt: "2022-01-25",
}));

const TeamList: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [teams, setTeams] = React.useState(makeTeams);
  const [editing, setEditing] = React.useState<any | null>(null);

  const handleCreate = (data: { name: string }) => {
    const newTeam = {
      id: teams.length + 1,
      name: data.name,
      manager: data.manager || "",
      managerAvatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random()*40)+1}`,
      members: data.members ? data.members.length : 0,
      resource: 0,
      projects: "",
      createdAt: data.startDate || new Date().toISOString().slice(0,10),
    } as any;
    setTeams((t) => [newTeam, ...t]);
    setOpen(false);
  };

  const handleEditSave = (team: any) => {
    setTeams((t) => t.map((x) => (x.id === team.id ? team : x)));
    setEditOpen(false);
    setEditing(null);
  };

  const openEdit = (e: React.MouseEvent, team: any) => {
    e.stopPropagation();
    setEditing(team);
    setEditOpen(true);
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
              {teams.map((t) => (
                <Tr key={t.id} onClick={() => router.push(`/division/workforce/team/${t.id}`)} style={{ cursor: 'pointer' }}>
                  <Td>{t.id}</Td>
                  <Td>{t.name}</Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar src={t.managerAvatar} alt={t.manager} />
                      <div>{t.manager}</div>
                    </div>
                  </Td>
                  <Td>{t.members}</Td>
                  <Td>{t.resource}</Td>
                  <Td>{t.projects}</Td>
                  <Td>{t.createdAt}</Td>
                  <Td>
                    <Actions>
                      <button title="Edit" onClick={(e) => openEdit(e, t)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✏️</button>
                      <button title="Delete" onClick={(e) => { e.stopPropagation(); setTeams((s) => s.filter(x => x.id !== t.id)); }} style={{ border: "none", background: "transparent", cursor: "pointer" }}>🗑️</button>
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

      <AddTeamModal isOpen={open} onClose={() => setOpen(false)} onSave={handleCreate} />
      {/* Edit modal */}
      {editing && (
        <React.Suspense>
          <EditTeamModal isOpen={editOpen} onClose={() => setEditOpen(false)} team={editing} onSave={handleEditSave} />
        </React.Suspense>
      )}
    </Container>
  );
};

export default TeamList;
