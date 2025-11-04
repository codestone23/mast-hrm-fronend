"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button, Select, Input, Pagination, Table, TableColumn } from "@/components/common";
import { Users } from "lucide-react";
import Image from "next/image";
import {
  Container,
  ContentContainer,
  UserInfo,
  Avatar,
  UserName,
  UserEmail,
  SkillsContainer,
  SkillTag,
  MoreSkills,
} from "./employeeStyle";
import { useRouter } from "next/navigation";
import { useDivisionMembers } from "@/hooks/useDivisionWorkforce";
import { DivisionMemberData } from "@/types/api";

// helper to format date
const fmtDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

// helper to format and display skills
const formatSkills = (skills: string | null | undefined) => {
  if (!skills) return [];
  
  // Split by comma, semicolon, or pipe, and trim each skill
  const skillsList = skills
    .split(/[,;|]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return skillsList;
};

const SkillsDisplay: React.FC<{ skills: string | null | undefined }> = ({ skills }) => {
  const skillsList = formatSkills(skills);
  const maxSkills = 3;
  const displaySkills = skillsList.slice(0, maxSkills);
  const hasMore = skillsList.length > maxSkills;

  if (skillsList.length === 0) {
    return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
  }

  return (
    <SkillsContainer>
      {displaySkills.map((skill, index) => (
        <SkillTag key={index}>{skill}</SkillTag>
      ))}
      {hasMore && <MoreSkills>+{skillsList.length - maxSkills}</MoreSkills>}
    </SkillsContainer>
  );
};

const teams = ["Why's Team", "Dev Ops", "Finance", "HR"];
const positions = ["Dev", "PM", "Designer", "Tester"];
const levels = ["Intern", "Fresher", "Junior", "Senior"];

const EmployeeList: React.FC = () => {
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>(undefined);
  const [positionId, setPositionId] = useState<number | undefined>(undefined);
  const [skillId, setSkillId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const [sortBy] = useState("id");
  const [sortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useDivisionMembers(
    selectedDivisionId,
    page,
    limit,
    debouncedSearch,
    {
      teamId,
      positionId,
      skillId,
      levelId,
      sortBy,
      sortOrder,
    }
  );

  const columns: TableColumn<DivisionMemberData>[] = useMemo(() => [
    {
      key: "code",
      label: "Mã",
      width: "0.8fr",
    },
    {
      key: "name",
      label: "Tên nhân viên",
      width: "2fr",
      render: (_, row) => (
        <UserInfo>
          <Avatar>
            {row.avatar ? (
              <Image src={row.avatar ?? "/images/avatar.png"} alt={row.name} width={40} height={40} />
            ) : (
              <span>{row.name.charAt(0)}</span>
            )}
          </Avatar>
          <div>
            <UserName>{row.name}</UserName>
            <UserEmail>{row.email}</UserEmail>
          </div>
        </UserInfo>
      ),
    },
    {
      key: "birthday",
      label: "Ngày sinh",
      width: "1fr",
      render: (value) => fmtDate(value as string),
    },
    {
      key: "team",
      label: "Team",
      width: "1fr",
    },
    {
      key: "join_date",
      label: "Ngày vào làm",
      width: "1fr",
      render: (value) => fmtDate(value as string),
    },
    {
      key: "months_of_service",
      label: "Số tháng",
      width: "1fr",
      align: "center",
    },
    {
      key: "position",
      label: "Vị trí",
      width: "1fr",
    },
    {
      key: "skills",
      label: "Kỹ năng",
      width: "1fr",
      render: (value) => <SkillsDisplay skills={value as string | null | undefined} />,
    },
    {
      key: "level",
      label: "Level",
      width: "0.8fr",
    },
    {
      key: "action",
      label: "Hành động",
      width: "0.8fr",
      align: "right",
      render: () => (
        <Button variant="ghost" size="sm">
          ⋮
        </Button>
      ),
    },
  ], []);

  const tableData = data?.data || [];
  const emptyMessage = useMemo(() => {
    if (!selectedDivisionId) return "Vui lòng chọn phòng ban";
    if (debouncedSearch || teamId || positionId || skillId || levelId) {
      return "Không tìm thấy nhân viên nào";
    }
    return "Chưa có nhân viên nào";
  }, [selectedDivisionId, debouncedSearch, teamId, positionId, skillId, levelId]);

  return (
    <Container>
      <ContentContainer>
        <div style={{ marginBottom: "12px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Tìm kiếm theo tên nhân viên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                value={teamId || ""}
                onChange={(v: string | number) => {
                  setTeamId(v ? Number(v) : undefined);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Team (tất cả)" },
                  ...teams.map((t) => ({ value: t, label: t })),
                ]}
                placeholder="Team"
                fullWidth={false}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                value={positionId || ""}
                onChange={(v: string | number) => {
                  setPositionId(v ? Number(v) : undefined);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Vị trí (tất cả)" },
                  ...positions.map((p) => ({ value: p, label: p })),
                ]}
                placeholder="Vị trí"
                fullWidth={false}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                value={skillId || ""}
                onChange={(v: string | number) => {
                  setSkillId(v ? Number(v) : undefined);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Kỹ năng (tất cả)" },
                  { value: "1", label: "PHP" },
                  { value: "2", label: "React" },
                ]}
                placeholder="Kỹ năng"
                fullWidth={false}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                value={levelId || ""}
                onChange={(v: string | number) => {
                  setLevelId(v ? Number(v) : undefined);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Level (tất cả)" },
                  ...levels.map((l) => ({ value: l, label: l })),
                ]}
                placeholder="Level"
                fullWidth={false}
              />
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={tableData}
          loading={isLoading}
          error={error || (!selectedDivisionId ? new Error("Vui lòng chọn phòng ban") : null)}
          emptyState={{
            icon: <Users size={48} />,
            message: emptyMessage,
          }}
          onRowClick={(row) => router.push(`/division/workforce/employee/${row.user_id}`)}
          rowKey="user_id"
        />
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
    </Container>
  );
};

export default EmployeeList;
