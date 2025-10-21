"use client";

import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Button, DatePicker } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import {
  Form,
  Row,
  Col,
  Label,
  Input,
  FooterActions,
  Select,
  DateInput,
} from "./addTeamModalStyle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; startDate?: string; manager?: string; members?: string[] }) => void;
}

const AddTeamModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [manager, setManager] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), startDate, manager, members });
    setName("");
    setStartDate("");
    setManager("");
    setMembers([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo team"
      size="sm"
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
          <Label>Tên team *</Label>
          <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Tên team" />
        </Col>
        </Row>

        <Row>
          <Col>
            <DatePicker
              label="Ngày thành lập"
              value={parseDateFromAPI(startDate)}
              onChange={(date) => setStartDate(formatDateForAPI(date))}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Người quản lý *</Label>
            <Select value={manager} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setManager(e.target.value)}>
              <option value="">-- Chọn --</option>
              <option value="Phi Việt Anh">Phi Việt Anh</option>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
            </Select>
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Thêm thành viên</Label>
            <Select multiple value={members} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMembers(Array.from(e.target.selectedOptions).map((o: HTMLOptionElement) => o.value))}>   
              <option value="NV0001">Nguyễn Văn 1</option>
              <option value="NV0002">Nguyễn Văn 2</option>
              <option value="NV0003">Nguyễn Văn 3</option>
            </Select>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddTeamModal;
