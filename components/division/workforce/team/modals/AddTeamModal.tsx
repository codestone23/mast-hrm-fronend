"use client";

import React, { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import { Button, DatePicker, Input } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import {
  Form,
  Row,
  Col,
  Label,
  FooterActions,
  Select,
} from "./addTeamModalStyle";
import { DivisionTeamCreateRequest } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DivisionTeamCreateRequest) => void;
  divisionId: number;
}

const AddTeamModal: React.FC<Props> = ({ isOpen, onClose, onSave, divisionId }) => {
  const [data, setData] = useState<DivisionTeamCreateRequest>({
    divisionId: divisionId,
    name: "",
    foundingDate: "",
    managerId: 0,
  });

  const handleSave = () => {
    if (!data.name.trim()) return;
    onSave(data);
    setData({
      divisionId: divisionId,
      name: "",
      foundingDate: "",
      managerId: 0,
    });
    onClose();
  };

  const updateField = (field: keyof DivisionTeamCreateRequest, value: string | number) => {
    setData({ ...data, [field]: value });
  }

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
          <Input value={data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("name", e.target.value)} placeholder="Tên team" />
        </Col>
        </Row>

        <Row>
          <Col>
            <DatePicker
              label="Ngày thành lập"
              value={parseDateFromAPI(data.foundingDate)}
              onChange={(date) => updateField("foundingDate", formatDateForAPI(date))}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Người quản lý *</Label>
            <Select value={data.managerId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField("managerId", e.target.value)}>
              <option value="">-- Chọn --</option>
              <option value="1">Phi Việt Anh</option>
              <option value="2">Nguyễn Văn A</option>
            </Select>
          </Col>
        </Row>

      </Form>
    </Modal>
  );
};

export default AddTeamModal;
