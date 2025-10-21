"use client";
import React, { useState, useMemo } from "react";
import { Button, Select, Input, DatePicker } from "@/components/common";
import {
  Container,
  Card,
  TabsRow,
  HeaderRow,
  SubTab,
  QueryContainer,
  FilterRow,
  ControlRow,
  TableWrap,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
} from "./rentalStyle";

const rows = new Array(10).fill(0).map((_, i) => ({
  id: i + 1,
  name: "Nguyễn Bảo Long",
  image: "https://i.pravatar.cc/100?img=" + ((i % 70) + 1),
  email: "longnguyen1@amela.vn",
  level: "Junior",
  position: "Front end",
  team: "Bonne",
  project: "Sumitomo",
  month: "12/2024",
  start: "01/05/2023",
  end: "25/10/2023",
  allocation: "50%",
  cost: "100.00",
}));

const Tabs = ["Danh sách đi thuê", "Danh sách cho thuê"];

const Rental: React.FC = () => {
  const [active, setActive] = useState<string>(Tabs[0]);

  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const resetFilters = () => {
    setQuery("");
    setTeamFilter("");
    setStartDate(null);
    setEndDate(null);
  };
  const parseDMY = (s?: string) => {
    if (!s) return null;
    const parts = s.split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map((p) => Number(p));
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd);
  };

  const filtered = useMemo(() => {
    const sd = startDate;
    const ed = endDate;

    return rows.filter((r) => {
      if (teamFilter && r.team !== teamFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(r.name + " " + r.email).toLowerCase().includes(q)) return false;
      }

      const rowStart = parseDMY(r.start);
      const rowEnd = parseDMY(r.end);

      if (sd && rowStart && rowStart < sd) return false; // row must start on/after filter start
      if (ed && rowEnd && rowEnd > ed) return false; // row must end on/before filter end

      return true;
    });
  }, [rows, teamFilter, query, startDate, endDate]);

  return (
    <Container>
      <Card>
        <HeaderRow>
          <TabsRow>
            {Tabs.map((tab) => (
              <SubTab
                key={tab}
                $active={active === tab}
                onClick={() => setActive(tab)}
              >
                {tab}
              </SubTab>
            ))}
          </TabsRow>

          <div>
            <Button
              variant="warning"
              onClick={() => {}}
            >
              + Thuê nhân sự
            </Button>
          </div>
        </HeaderRow>

        <QueryContainer>
          <FilterRow>
            <Input
              placeholder="Nhân viên"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select
              options={[
                { value: "", label: "Team cho thuê" },
                { value: "Bonne", label: "Bonne" },
                { value: "Faderless", label: "Faderless" },
              ]}
              value={teamFilter}
              onChange={(v: string | number) => setTeamFilter(v as string)}
            />
            <DatePicker
              placeholder="Từ ngày"
              value={startDate}
              onChange={(d) => setStartDate(d)}
            />
            <DatePicker
              placeholder="Đến ngày"
              value={endDate}
              onChange={(d) => setEndDate(d)}
            />
          </FilterRow>

          <ControlRow>
            <Button
              variant="ghost"
              onClick={() => {
                resetFilters();
              }}
            >
              Làm mới
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                /* currently filtered updates automatically; if needed, trigger fetch */
              }}
            >
              Tìm kiếm
            </Button>
          </ControlRow>
        </QueryContainer>

        <TableWrap>
          <Table>
            <Thead>
              <Tr>
                <Th>STT</Th>
                <Th>Nhân viên</Th>
                <Th>Level</Th>
                <Th>Vị trí</Th>
                <Th>Team cho thuê</Th>
                <Th>Dự án</Th>
                <Th>Tháng thanh toán</Th>
                <Th>Bắt đầu</Th>
                <Th>Kết thúc</Th>
                <Th>Allocation</Th>
                <Th>Đơn giá</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr key={r.id}>
                  <Td>{r.id}</Td>
                  <Td>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <Avatar src={r.image} alt={r.name} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{r.name}</div>
                        <div
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          {r.email}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>{r.level}</Td>
                  <Td>{r.position}</Td>
                  <Td>{r.team}</Td>
                  <Td>{r.project}</Td>
                  <Td>{r.month}</Td>
                  <Td>{r.start}</Td>
                  <Td>{r.end}</Td>
                  <Td>{r.allocation}</Td>
                  <Td>{r.cost}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrap>
      </Card>
    </Container>
  );
};

export default Rental;
