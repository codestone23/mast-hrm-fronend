"use client";
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input, Button, ConfirmDeleteModal } from "@/components/common";
import {
  Container,
  Header,
  Title,
  QueryContainer,
  TableWrapper,
  TableContainer,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Footer,
  Pagination,
} from "./customerStyle";
import AddCustomerModal from "./modals/AddCustomerModal";
import ViewCustomerModal from "./modals/ViewCustomerModal";

interface CustomerRow {
  id: string;
  code: string;
  name: string;
  originalName?: string;
  domain?: string;
  address?: string;
  project?: string;
  note?: string;
}

const SAMPLE_DATA = (n = 30): CustomerRow[] => {
  return new Array(n).fill(null).map((_, i) => ({
    id: String(i + 1),
    code: "NV0001",
    name: "Nguyễn Bảo Long",
    originalName: "佐々木孝康",
    domain: "synesthesias.jp",
    address: "東京都品川区北品",
    project: "AR Civil",
    note: "Note abc...",
  }));
};

const Customer: React.FC = () => {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<CustomerRow[]>(SAMPLE_DATA(30));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // temporary id counter for demo rows
  const [nextId, setNextId] = useState(rows.length + 1);

  return (
    <Container>
      <Header>
        <Title>Thông tin khách hàng</Title>

        <QueryContainer>
          <Input
            icon={<SearchIcon size={16} />}
            placeholder="Tìm khách hàng"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            fullWidth={false}
          />
          <Button
            variant="warning"
            size="md"
            onClick={() => setIsAddOpen(true)}
          >
            + Thêm khách hàng
          </Button>
        </QueryContainer>
      </Header>

      <TableWrapper>
        <TableContainer>
          <Table>
            <THead>
              <TR>
                <TH>Mã KH</TH>
                <TH>Tên khách hàng</TH>
                <TH>Original name</TH>
                <TH>Domain</TH>
                <TH>Địa chỉ</TH>
                <TH>Dự án</TH>
                <TH>Note</TH>
                <TH></TH>
              </TR>
            </THead>

            <TBody>
              {rows.map((r) => (
                <TR key={r.id}>
                  <TD>{r.code}</TD>
                  <TD
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      color: "var(--primary)",
                    }}
                    onClick={() => {
                      setSelectedCustomer(r);
                      setIsViewOpen(true);
                    }}
                  >
                    {r.name}
                  </TD>
                  <TD>{r.originalName}</TD>
                  <TD>
                    <a
                      href={`https://${r.domain}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.domain}
                    </a>
                  </TD>
                  <TD>{r.address}</TD>
                  <TD>{r.project}</TD>
                  <TD>{r.note}</TD>
                  <TD>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="ghost" size="sm">
                        ✎
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingId(r.id);
                          setIsDeleteOpen(true);
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
        <div>1 - 10 from 60</div>
        <Pagination />
      </Footer>

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(data) => {
          const newRow: CustomerRow = {
            id: String(nextId),
            code: `KH${String(nextId).padStart(4, "0")}`,
            name: data.name,
            originalName: undefined,
            domain: undefined,
            address: data.address,
            project: data.project,
            note: data.note,
          };
          setRows((prev) => [newRow, ...prev]);
          setNextId((n) => n + 1);
        }}
      />

      <ViewCustomerModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        customer={selectedCustomer}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={() => {
          if (deletingId) {
            setRows((prev) => prev.filter((x) => x.id !== deletingId));
          }
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
        title="Xác nhận xóa khách hàng"
        message="Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác."
      />
    </Container>
  );
};

export default Customer;
