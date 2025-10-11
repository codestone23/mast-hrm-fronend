"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button, Select, Input } from "@/components/common";
import {
  Container,
  QueryContainer,
  SearchRow,
  FilterRow,
  TableWrapper,
  TableContainer,
  ControlRow,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Avatar,
  PaginationRow,
  PageButton,
  RowsPerPageSelect,
} from "./employeeStyle";
import { useRouter } from "next/navigation";

interface EmpRow {
  id: string;
  code: string;
  name: string;
  email: string;
  birthday: string;
  team: string;
  joinDate: string;
  months: number;
  position: string;
  skills: string[];
  level: string;
  rank: number;
  avatar?: string;
}

// helper to format date
const fmtDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

const teams = ["Why's Team", "Dev Ops", "Finance", "HR"];
const positions = ["Dev", "PM", "Designer", "Tester"];
const levels = ["Intern", "Fresher", "Junior", "Senior"];

const SampleData = (n = 60) => {
  const out: EmpRow[] = [];

  for (let i = 1; i <= n; i++) {
    const join = new Date(2021, i % 12, (i % 28) + 1);
    const birth = new Date(1990 + (i % 10), i % 12, (i % 28) + 1);
    out.push({
      id: String(i),
      code: `NV${String(i).padStart(4, "0")}`,
      name: `Nguyễn Bảo ${i}`,
      email: `nb${i}@example.com`,
      birthday: birth.toISOString(),
      team: teams[i % teams.length],
      joinDate: join.toISOString(),
      months: 24,
      position: positions[i % positions.length],
      skills: ["PHP", "React"].slice(0, (i % 2) + 1),
      level: levels[i % levels.length],
      rank: 2,
      avatar: "https://i.pravatar.cc/48?img=" + ((i % 70) + 1),
    });
  }
  return out;
};

const EmployeeList: React.FC = () => {
  const [data, setData] = useState<EmpRow[]>(() => SampleData(60));

  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (teamFilter && r.team !== teamFilter) return false;
      if (positionFilter && r.position !== positionFilter) return false;
      if (levelFilter && r.level !== levelFilter) return false;
      if (skillFilter && !r.skills.includes(skillFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${r.code} ${r.name} ${r.email}`.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [data, teamFilter, positionFilter, levelFilter, skillFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setQuery("");
    setTeamFilter("");
    setPositionFilter("");
    setSkillFilter("");
    setLevelFilter("");
    setPage(1);
  };

  return (
    <Container>
      <QueryContainer>
        <SearchRow>
          <Input
            placeholder="Tìm nhân viên"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchRow>

        <FilterRow>
          <Select
            value={teamFilter}
            onChange={(v: string | number) => setTeamFilter(v as string)} 
            options={[
              { value: "", label: "Team" },
              ...teams.map((t) => ({ value: t, label: t })),
            ]}
          />

          <Select
            value={positionFilter}
            onChange={(v: string | number) => setPositionFilter(v as string)}
            options={[
              { value: "", label: "Vị trí" },
              ...positions.map((p) => ({ value: p, label: p })),
            ]}
          />

          <Select
            value={skillFilter}
            onChange={(v: string | number) => setSkillFilter(v as string)}
            options={[
              { value: "", label: "Kỹ năng" },
              { value: "PHP", label: "PHP" },
              { value: "React", label: "React" },
            ]}
          />

          <Select
            value={levelFilter}
            onChange={(v: string | number) => setLevelFilter(v as string)}
            options={[
              { value: "", label: "Level" },
              ...levels.map((l) => ({ value: l, label: l })),
            ]}
          />
        </FilterRow>

        <ControlRow>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              resetFilters();
            }}
          >
            Làm mới
          </Button>

          <Button variant="warning" size="md" onClick={() => setPage(1)}>
            Tìm kiếm
          </Button>
        </ControlRow>
      </QueryContainer>

      <TableWrapper>
        <TableContainer>
          <Table>
            <THead>
              <TR>
                <TH>Mã</TH>
                <TH>Tên nhân viên</TH>
                <TH>Ngày sinh</TH>
                <TH>Team</TH>
                <TH>Ngày vào làm</TH>
                <TH>Tháng</TH>
                <TH>Vị trí</TH>
                <TH>Kỹ năng</TH>
                <TH>Level</TH>
                <TH>Hệ số</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {visible.map((r) => (
                <TR
                  key={r.id}
                  onClick={() =>
                    router.push(`/division/workforce/employee/${r.id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <TD>{r.code}</TD>
                  <TD style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar src={r.avatar} alt={r.name} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {r.email}
                      </div>
                    </div>
                  </TD>
                  <TD>{fmtDate(r.birthday)}</TD>
                  <TD>{r.team}</TD>
                  <TD>{fmtDate(r.joinDate)}</TD>
                  <TD style={{ textAlign: "center" }}>{r.months}</TD>
                  <TD>{r.position}</TD>
                  <TD>{r.skills.join(", ")}</TD>
                  <TD>{r.level}</TD>
                  <TD style={{ textAlign: "center" }}>{r.rank}</TD>
                  <TD>
                    <Button variant="ghost" size="sm">
                      ⋮
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      </TableWrapper>

      <PaginationRow>
        <div>
          1 - {Math.min(pageSize, filtered.length)} of {filtered.length}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RowsPerPageSelect
            value={String(pageSize)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </RowsPerPageSelect>

          <PageButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ‹
          </PageButton>
          <div>
            {page} / {totalPages}
          </div>
          <PageButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            ›
          </PageButton>
        </div>
      </PaginationRow>
    </Container>
  );
};

export default EmployeeList;
