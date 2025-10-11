"use client";
import React from "react";
import { Modal } from "@/components/common";
import {
  Container,
  Header,
  Title,
  Code,
  Body,
  Row,
  Col,
  Label,
  Value,
  PricesTable,
} from "./viewCustomerModalStyle";

type PriceRow = {
  id: string;
  price: string;
  currency?: string;
  start?: string;
  end?: string;
};

type CustomerDetail = {
  id?: string;
  code?: string;
  name?: string;
  personInCharge?: string;
  address?: string;
  email?: string;
  phone?: string;
  project?: string;
  note?: string;
  priceRows?: PriceRow[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerDetail | null;
}

const fmtDate = (d?: string) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("vi-VN");
};

const ViewCustomerModal: React.FC<Props> = ({ isOpen, onClose, customer }) => {
  const c: CustomerDetail = customer || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết khách hàng"
      size="lg"
      closable
    >
      <Container>
        <Header>
          <div>
            <Title>{c.name || "-"}</Title>
            <Code>{c.code || ""}</Code>
          </div>
        </Header>

        <Body>
          <Row>
            <Col>
              <Label>Tên người phụ trách</Label>
              <Value>{c.personInCharge || "-"}</Value>

              <Label>Email khách hàng</Label>
              <Value>{c.email || "-"}</Value>

              <Label>Dự án</Label>
              <Value>{c.project || "-"}</Value>
            </Col>

            <Col>
              <Label>Địa chỉ khách hàng</Label>
              <Value>{c.address || "-"}</Value>

              <Label>Số điện thoại</Label>
              <Value>{c.phone || "-"}</Value>

              <Label>Note</Label>
              <Value>{c.note || "-"}</Value>
            </Col>
          </Row>

          <div style={{ marginTop: 12 }}>
            <Label>Bảng đơn giá</Label>
            <PricesTable>
              <thead>
                <tr>
                  <th>Đơn giá</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {(c.priceRows || []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.price + (p.currency ? ` ${p.currency}` : "")}</td>
                    <td>{fmtDate(p.start)}</td>
                    <td>{fmtDate(p.end)}</td>
                  </tr>
                ))}
                {(!c.priceRows || c.priceRows.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: 12 }}
                    >
                      No price rows
                    </td>
                  </tr>
                )}
              </tbody>
            </PricesTable>
          </div>
        </Body>
      </Container>
    </Modal>
  );
};

export default ViewCustomerModal;
