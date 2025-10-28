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
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionMemberData } from "@/types/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const EmployeeList: React.FC = () => {
  const [data, setData] = useState<DivisionMemberData[] | null>(null);

  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>(undefined);
  const [positionId, setPositionId] = useState<number | undefined>(undefined);
  const [skillId, setSkillId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  const DIVISION_ID = 1; // to be replaced with actual division id

  const resetFilters = () => {
    setSearch("");
    setTeamId(undefined);
    setPositionId(undefined);
    setSkillId(undefined);
    setLevelId(undefined);
    setPage(1);
  };

  useEffect(() => {
    try {
      divisionWorkforceService.getMembers(
        DIVISION_ID,
        page,
        limit,
        search,
        teamId,
        positionId,
        skillId,
        levelId,
        sortBy,
        sortOrder
      ).then((res) => {
        setData(res.data);
        setTotalPages(res.pagination.totalPages);
      });
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
    }
  }, [DIVISION_ID, page, limit, search, teamId, positionId, skillId, levelId, sortBy, sortOrder]);

  return (
    <Container>
      <QueryContainer>
        <SearchRow>
          <Input
            placeholder="Tìm nhân viên"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchRow>

        <FilterRow>
          <Select
            value={teamId}
            onChange={(v: string | number) => setTeamId(Number(v))}
            options={[
              { value: "", label: "Team" },
              ...teams.map((t) => ({ value: t, label: t })),
            ]}
          />

          <Select
            value={positionId}
            onChange={(v: string | number) => setPositionId(Number(v))}
            options={[
              { value: "", label: "Vị trí" },
              ...positions.map((p) => ({ value: p, label: p })),
            ]}
          />

          <Select
            value={skillId}
            onChange={(v: string | number) => setSkillId(Number(v))}
            options={[
              { value: "", label: "Kỹ năng" },
              { value: "1", label: "PHP" },
              { value: "2", label: "React" },
            ]}
          />

          <Select
            value={levelId}
            onChange={(v: string | number) => setLevelId(Number(v))}
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
              {data?.map((r) => (
                <TR
                  key={r.user_id}
                  onClick={() =>
                    router.push(`/division/workforce/employee/${r.user_id}`)
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
                  <TD>{fmtDate(r.join_date)}</TD>
                  <TD style={{ textAlign: "center" }}>{r.months_of_service}</TD>
                  <TD>{r.position}</TD>
                  <TD>{r.skills}</TD>
                  <TD>{r.level}</TD>
                  <TD style={{ textAlign: "center" }}>{r.level}</TD>
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
          1 - {limit} from {totalPages * limit}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RowsPerPageSelect
            value={String(limit)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setLimit(Number(e.target.value));
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
            <ChevronLeft color="var(--text-secondary)" />
          </PageButton>
          <div>
            {page} / {totalPages}
          </div>
          <PageButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight color="var(--text-secondary)" />
          </PageButton>
        </div>
      </PaginationRow>
    </Container>
  );
};

export default EmployeeList;
