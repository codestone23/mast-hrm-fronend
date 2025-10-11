"use client";

import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Button } from "@/components/common";
import { Form, Row, Col, Label, Select, FooterActions } from "./addMemberModalStyle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (members: Array<{ id: number; name: string; email: string }>) => void;
}

const options = [
  { id: 1, name: "Nguyễn Thị Doremon", email: "doremon@x.com" },
  { id: 2, name: "Phạm Thị Nobita", email: "nobita@x.com" },
  { id: 3, name: "Nguyễn Văn A", email: "a@x.com" },
];

const AddMemberModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSave = () => {
    const members = options.filter((o) => selected.includes(o.id));
    onSave(members);
    setSelected([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm nhân sự"
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
            <Label>Tên nhân sự</Label>
            <Select multiple value={selected.map(String)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelected(Array.from(e.target.selectedOptions).map(o => Number(o.value)))}>
              {options.map((o) => (
                <option key={o.id} value={o.id}>{o.name} — {o.email}</option>
              ))}
            </Select>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddMemberModal;
