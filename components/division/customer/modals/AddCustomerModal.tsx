"use client";
import React, { useState } from "react";
import { Modal, Button, Input, Select } from "@/components/common";
import {
  Form,
  Row,
  Col,
  Label,
  FooterActions,
  ProjectInputWrapper,
  TagListStyled,
  Tag,
  TagCloseButton,
  PriceRow,
  DateGroup,
  DateInput,
  RemoveButton,
  AddPriceButton,
} from "./addCustomerModalStyle";

interface PriceRowData {
  id: string;
  price: string;
  currency: string;
  start?: string;
  end?: string;
}

interface AddCustomerData {
  name: string;
  personInCharge?: string;
  address?: string;
  email?: string;
  phone?: string;
  project?: string;
  note?: string;
  priceRows?: PriceRowData[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddCustomerData) => void;
}

const AddCustomerModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [priceRows, setPriceRows] = useState<Array<PriceRowData>>
  ([{ id: "p-1", price: "", currency: "VND", start: undefined, end: undefined }]);

  const reset = () => {
    setName("");
    setPersonInCharge("");
    setAddress("");
    setEmail("");
    setPhone("");
    setProject("");
    setNote("");
    setProjects([]);
    setPriceRows([
      { id: "p-1", price: "", currency: "VND", start: undefined, end: undefined },
    ]);
  };

  const handleSave = () => {
    if (!name.trim()) return; // simple required check

    onSave({
      name: name.trim(),
      personInCharge: personInCharge.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      project: projects.join(", "),
      note: note.trim(),
      priceRows: priceRows.map((r) => ({ ...r })),
    });

    reset();
    onClose();
  };

  // project tag helpers
  const addProjectTag = (value?: string) => {
    const v = (value ?? project).trim();
    if (!v) return;
    if (!projects.includes(v)) setProjects((p) => [...p, v]);
    setProject("");
  };

  const removeProjectTag = (tag: string) => {
    setProjects((p) => p.filter((t) => t !== tag));
  };

  // price rows helpers
  const addPriceRow = () => {
    const id = `p-${Date.now()}`;
    setPriceRows((rows) => [
      ...rows,
      { id, price: "", currency: "VND", start: undefined, end: undefined },
    ]);
  };

  const updatePriceRow = (
    id: string, patch: Partial<PriceRowData>
  ) => {
    setPriceRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const removePriceRow = (id: string) => {
    setPriceRows((rows) => rows.filter((r) => r.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm khách hàng"
      size="lg"
      footer={
        <FooterActions>
          <Button variant="ghost" size="md" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="warning" size="md" onClick={handleSave}>
            Lưu
          </Button>
        </FooterActions>
      }
    >
      <Form>
        <Row>
          <Col>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              label="Tên khách hàng"
              required
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Input
              value={personInCharge}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPersonInCharge(e.target.value)
              }
              label="Tên người phụ trách"
              required

            />
          </Col>
          <Col>
            <Input
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
              label="Địa chỉ"
              required
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              label="Email"
              required
            />
          </Col>
          <Col>
            <Input
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              label="Số điện thoại"
              required
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Dự án</Label>
            <ProjectInputWrapper>
              <Input
                value={project}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProject(e.target.value)
                }
                label="Dự án (gõ và nhấn Enter)"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addProjectTag();
                  }
                }}
              />
              <TagListStyled>
                {projects.map((p) => (
                  <Tag key={p}>
                    <span style={{ fontSize: 12 }}>{p}</span>
                    <TagCloseButton
                      type="button"
                      onClick={() => removeProjectTag(p)}
                    >
                      ×
                    </TagCloseButton>
                  </Tag>
                ))}
              </TagListStyled>
            </ProjectInputWrapper>
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Ghi chú</Label>
            <Input
              value={note}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNote(e.target.value)
              }
              label="Note"
              multiline
            />
          </Col>
        </Row>

        {/* price rows */}
        <Row style={{ flexDirection: "column", gap: 12 }}>
          <Col>
            {priceRows.map((pr) => (
              <PriceRow key={pr.id}>
                <Input
                  value={pr.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updatePriceRow(pr.id, { price: e.target.value })
                  }
                  label="Đơn giá"
                  type={"number"}
                  required
                />

                <Select
                  value={pr.currency}
                  onChange={(value) => {
                    updatePriceRow(pr.id, { currency: value as string })
                  }}
                  label="Loại tiền"
                  options={[
                    { value: "VND", label: "VNĐ (₫)" },
                    { value: "USD", label: "USD ($)" },
                  ]}
                  required
                  fullWidth
                />

                <DateGroup>
                  <Col>
                    <Label>Thời gian áp dụng</Label>
                    <DateInput
                      type="date"
                      value={pr.start || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updatePriceRow(pr.id, { start: e.target.value })
                      }
                    />
                  </Col>
                  <span>~</span>
                  <Col>
                    <Label>Thời gian kết thúc</Label>
                    <DateInput
                      type="date"
                      value={pr.end || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updatePriceRow(pr.id, { end: e.target.value })
                      }
                    />
                  </Col>
                </DateGroup>

                <RemoveButton
                  type="button"
                  onClick={() => removePriceRow(pr.id)}
                >
                  ×
                </RemoveButton>
              </PriceRow>
            ))}

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <AddPriceButton type="button" onClick={addPriceRow}>
                ＋ Thêm đơn giá
              </AddPriceButton>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
