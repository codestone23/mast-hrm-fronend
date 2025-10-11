"use client";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  Input,
  DatePicker,
  Button,
  Select,
  ConfirmDeleteModal,
} from "@/components/common";
import {
  Container,
  QueryContainer,
  SearchRow,
  FilterRow,
  ControlRow,
  TableWrapper,
  TableContainer,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Badge,
  Footer,
  Pagination,
} from "./invoiceTableStyle";
import CreateInvoiceModal from "../modals/CreateInvoiceModal";

interface InvoiceRow {
  id: string;
  code: string;
  project: string;
  contract: string;
  customer: string;
  createdAt: string;
  monthReceive: number;
  revenue: string;
  billable: number;
  status: string;
}

const statusColor = (s: string) => {
  switch (s) {
    case "Đã thu tiền":
      return "#10b981"; // green
    case "Dự tính":
      return "#3b82f6"; // blue
    case "Có thể gửi hóa đơn":
      return "#f59e0b"; // amber
    case "Đã gửi hóa đơn":
      return "#06b6d4"; // cyan
    case "Nợ":
      return "#ef4444"; // red
    case "Hủy":
      return "#9ca3af"; // gray
    default:
      return "#6b7280";
  }
};

const SAMPLE_DATA = (n = 10): InvoiceRow[] => {
  return new Array(n).fill(null).map((_, i) => ({
    id: String(4 + i),
    code: `000000${3 + i}`,
    project: "Sumitomo",
    contract: "Labo",
    customer: "Doraemon",
    createdAt: "01/12/2021",
    monthReceive: 5,
    revenue: "200M",
    billable: 3.75,
    status: "Dự tính",
  }));
};

interface InvoiceTableProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const [data, setData] = useState<InvoiceRow[]>(SAMPLE_DATA(30));

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [monthCreateFilter, setMonthCreateFilter] = useState<Date | null>(null);
  const [monthReceiveFilter, setMonthReceiveFilter] = useState<Date | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = data.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (customerFilter && r.customer !== customerFilter) return false;
    if (
      query &&
      !`${r.code} ${r.project} ${r.customer}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("");
    setCustomerFilter("");
    setProjectFilter("");
    setMonthCreateFilter(null);
    setMonthReceiveFilter(null);
  };

  return (
    <Container>
      <QueryContainer>
        <SearchRow>
          <Input
            placeholder="Tìm hóa đơn"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, minWidth: 320 }}
            icon={<SearchIcon size={16} color="#f59e0b" />}
          />
        </SearchRow>

        <FilterRow>
          <Select
            value={statusFilter || ""}
            onChange={(v: any) => setStatusFilter(v?.target?.value)}
            options={[
              { value: "", label: "Trạng thái" },
              { value: "Dự tính", label: "Dự tính" },
              { value: "Có thể gửi hóa đơn", label: "Có thể gửi hóa đơn" },
              { value: "Đã gửi hóa đơn", label: "Đã gửi hóa đơn" },
              { value: "Đã thu tiền", label: "Đã thu tiền" },
              { value: "Nợ", label: "Nợ" },
              { value: "Hủy", label: "Hủy" },
            ]}
            placeholder="Trạng thái"
          />

          <Select
            value={customerFilter || ""}
            onChange={(v: any) => setCustomerFilter(v?.target?.value)}
            options={[
              { value: "", label: "Khách hàng" },
              { value: "Doraemon", label: "Doraemon" },
            ]}
            placeholder="Khách hàng"
          />

          <Select
            value={projectFilter || ""}
            onChange={(v: any) => setProjectFilter(v?.target?.value)}
            options={[
              { value: "", label: "Dự án" },
              { value: "Sumitomo", label: "Sumitomo" },
            ]}
            placeholder="Dự án"
          />

          <DatePicker
            onChange={(value) => {
              setMonthCreateFilter(value);
            }}
            format="MM-yyyy"
            mode="month"
            placeholder="Tháng tạo request"
            size="md"
          />

          <DatePicker
            onChange={(value) => {
              setMonthReceiveFilter(value);
            }}
            format="MM-yyyy"
            mode="month"
            placeholder="Tháng nhận tiền"
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
          <Button variant="warning" size="md" onClick={() => {}}>
            Tìm kiếm
          </Button>
        </ControlRow>
      </QueryContainer>

      <TableWrapper>
        <TableContainer>
          <Table>
            <THead>
              <TR>
                <TH>Mã hóa đơn</TH>
                <TH>Dự án</TH>
                <TH>Hợp đồng</TH>
                <TH>Tên khách hàng</TH>
                <TH>Ngày tạo request</TH>
                <TH>Tháng nhận tiền</TH>
                <TH>Revenue (Tiền trên hóa đơn)</TH>
                <TH>Billable (MM)</TH>
                <TH>Trạng thái</TH>
                <TH></TH>
              </TR>
            </THead>

            <TBody>
              {filtered.map((r) => (
                <TR key={r.id}>
                  <TD style={{ width: 120 }}>{r.code}</TD>
                  <TD>{r.project}</TD>
                  <TD>{r.contract}</TD>
                  <TD style={{ color: "var(--primary)" }}>{r.customer}</TD>
                  <TD>{r.createdAt}</TD>
                  <TD style={{ textAlign: "center" }}>{r.monthReceive}</TD>
                  <TD>{r.revenue}</TD>
                  <TD style={{ textAlign: "center" }}>{r.billable}</TD>
                  <TD>
                    <Badge $color={statusColor(r.status)}>{r.status}</Badge>
                  </TD>
                  <TD>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="ghost" size="sm">
                        ✎
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setDeletingId(r.id);
                        }}
                      >
                        🗑
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </TableContainer>
      </TableWrapper>

      <Footer>
        <div>
          1 - {Math.min(10, filtered.length)} from {data.length}
        </div>
        <Pagination />
      </Footer>

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data) => {
          // prepend new invoice row
          const newRow: InvoiceRow = {
            id: data.id,
            code: data.code,
            project: data.project,
            contract: data.contract || "",
            customer: data.customer || "",
            createdAt: data.createdAt || new Date().toLocaleDateString(),
            monthReceive: Number(data.monthReceive) || 0,
            revenue: data.amount || "",
            billable: data.billable || 0,
            status: data.status || "",
          };
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (deletingId) {
            setData((prev) => prev.filter((x) => x.id !== deletingId));
          }
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
        title="Xác nhận xóa hóa đơn"
        message="Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác."
      />
    </Container>
  );
};

export default InvoiceTable;
