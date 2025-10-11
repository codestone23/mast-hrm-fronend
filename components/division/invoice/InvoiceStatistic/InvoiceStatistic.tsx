"use client";
import React, {useEffect, useState} from "react";
import {
  StatContainer,
  StatHeader,
  StatCards,
  StatCard,
  StatCardTitle,
  StatCardValue,
  FilterRow,
  TableWrapper,
  ProjectsTable,
  THead,
  TBody,
  TR,
  TH,
  TD,
  TotalRow,
} from "./invoiceStatisticStyle";

const SAMPLE_DATA = [
  { name: "Sumitomo", months: new Array(12).fill(30000) },
  { name: "Workflow", months: new Array(12).fill(30000) },
  { name: "ORS", months: new Array(12).fill(30000) },
  { name: "Love Rec", months: new Array(12).fill(30000) },
  { name: "Another", months: new Array(12).fill(30000) },
];

const monthLabels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const InvoiceStatistic: React.FC = () => {
  const [data, setData] = useState(SAMPLE_DATA);

  const totalByProject = data.map((p) =>
    p.months.reduce((s, v) => s + v, 0)
  );
  const totalsByMonth = monthLabels.map((_, idx) =>
    data.reduce((s, p) => s + (p.months[idx] || 0), 0)
  );
  const grandTotal = totalByProject.reduce((s, v) => s + v, 0);

  return (
    <StatContainer>
      <StatHeader>
        <StatCards>
          <StatCard>
            <StatCardTitle>Estimated Revenue</StatCardTitle>
            <StatCardValue>3.000.000₫</StatCardValue>
          </StatCard>

          <StatCard>
            <StatCardTitle>Paid amount</StatCardTitle>
            <StatCardValue>2.000.000₫</StatCardValue>
          </StatCard>

          <StatCard>
            <StatCardTitle>Remaining</StatCardTitle>
            <StatCardValue>600.000₫</StatCardValue>
          </StatCard>
        </StatCards>

        <FilterRow>
          {/* placeholder filters: year selects, status, project etc. */}
        </FilterRow>
      </StatHeader>

      <TableWrapper>
        <ProjectsTable>
          <THead>
            <TR>
              <TH>Dự án</TH>
              {monthLabels.map((m) => (
                <TH key={m}>{m}</TH>
              ))}
              <TH>Tổng</TH>
            </TR>
          </THead>
          <TBody>
            {data.map((p, i) => (
              <TR key={p.name}>
                <TD>{p.name}</TD>
                {p.months.map((val, idx) => (
                  <TD key={idx}>{val.toLocaleString()}₫</TD>
                ))}
                <TD style={{ fontWeight: 700 }}>
                  {totalByProject[i].toLocaleString()}₫
                </TD>
              </TR>
            ))}

            <TotalRow>
              <TD style={{ fontWeight: 700 }}>Tổng</TD>
              {totalsByMonth.map((val, idx) => (
                <TD key={idx} style={{ fontWeight: 700 }}>
                  {val.toLocaleString()}₫
                </TD>
              ))}
              <TD style={{ fontWeight: 700 }}>
                {grandTotal.toLocaleString()}₫
              </TD>
            </TotalRow>
          </TBody>
        </ProjectsTable>
      </TableWrapper>
    </StatContainer>
  );
};

export default InvoiceStatistic;
