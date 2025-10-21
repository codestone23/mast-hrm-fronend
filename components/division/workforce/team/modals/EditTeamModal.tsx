"use client";

import React, { useEffect, useState } from "react";
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

interface TeamShape {
  id: number;
  name: string;
  manager: string;
  createdAt?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  team?: TeamShape | null;
  onSave: (team: TeamShape) => void;
}

const EditTeamModal: React.FC<Props> = ({ isOpen, onClose, team, onSave }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [manager, setManager] = useState("");

  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setManager(team.manager || "");
      setStartDate(team.createdAt || "");
    } else {
      setName("");
      setManager("");
      setStartDate("");
    }
  }, [team, isOpen]);

  const handleSave = () => {
    if (!team) return;
    const updated = { ...team, name: name.trim(), manager, createdAt: startDate };
    onSave(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa team"
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
      </Form>
    </Modal>
  );
};

export default EditTeamModal;
