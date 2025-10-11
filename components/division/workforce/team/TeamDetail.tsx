"use client";

import React from "react";
import { Button } from "@/components/common";
import AddMemberModal from "./modals/AddMemberModal";
import {
  Container,
  Header,
  Title,
  TopActions,
  MembersTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Empty,
} from "./teamDetailStyle";

const initialMembers = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  code: `NV00045${i}`,
  name: "Nguyễn Bảo Long",
  email: "longnguyen1@amela.vn",
  position: "Design",
  skill: "PHP",
  level: "Intern",
  rank: 1.5,
}));

const TeamDetail: React.FC<{ id?: string }> = ({ id }) => {
  const [members, setMembers] = React.useState(initialMembers);
  const [open, setOpen] = React.useState(false);

  const handleAdd = (newMembers: Array<{ id: number; name: string; email: string }>) => {
    // map into member shape used by table
    const mapped = newMembers.map((m, idx) => ({
      id: members.length + idx + 1,
      code: `NV_NEW_${m.id}`,
      name: m.name,
      email: m.email,
      position: "",
      skill: "",
      level: "",
      rank: 0,
    }));
    setMembers((s) => [...s, ...mapped]);
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Thông tin nhân sự</Title>
        </div>
        <TopActions>
          <Button variant="warning" onClick={() => setOpen(true)}>+ Thêm nhân sự</Button>
        </TopActions>
      </Header>

      <MembersTable>
        <Thead>
          <Tr>
            <Th>Mã NV</Th>
            <Th>Tên nhân viên</Th>
            <Th>Vị trí</Th>
            <Th>Kỹ năng</Th>
            <Th>Level</Th>
            <Th>Hệ số theo Job Rank</Th>
            <Th style={{ width: 60 }}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {members.map((m) => (
            <Tr key={m.id}>
              <Td>{m.code}</Td>
              <Td>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Avatar src={`https://i.pravatar.cc/40?img=${m.id + 10}`} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.email}</div>
                  </div>
                </div>
              </Td>
              <Td>{m.position}</Td>
              <Td>{m.skill}</Td>
              <Td>{m.level}</Td>
              <Td>{m.rank}</Td>
              <Td>
                <button style={{ border: "none", background: "transparent", cursor: "pointer" }}>🗑️</button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </MembersTable>

      {members.length === 0 && <Empty>Không có nhân sự trong team</Empty>}
      <AddMemberModal isOpen={open} onClose={() => setOpen(false)} onSave={handleAdd} />
    </Container>
  );
};

export default TeamDetail;
