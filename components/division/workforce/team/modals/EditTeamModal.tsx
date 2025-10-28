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
} from "./addTeamModalStyle";

import { DivisionTeamData, DivisionTeamUpdateRequest } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  team?: DivisionTeamData | null;
  onSave: (team: DivisionTeamUpdateRequest) => void;
}

const EditTeamModal: React.FC<Props> = ({ isOpen, onClose, team, onSave }) => {
  const [data, setData] = useState<DivisionTeamUpdateRequest | null>(null);

  useEffect(() => {
    if (team) {
      setData({
        name: team.name,
        foundingDate: team.founding_date,
        managerId: team.manager.id,
      });
    }
  }, [team, isOpen]);

  const handleSave = () => {
    if (!data) return;
    const updated = { ...data };
    onSave(updated);
    onClose();
  };

  const updateField = (field: keyof DivisionTeamUpdateRequest, value: string | number) => {
    if (!data) return;
    setData({ ...data, [field]: value });
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
            <Input
              value={data?.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateField("name", e.target.value)
              }
              placeholder="Tên team"
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <DatePicker
              label="Ngày thành lập"
              value={parseDateFromAPI(data?.foundingDate || "")}
              onChange={(date) =>
                updateField("foundingDate", formatDateForAPI(date))
              }
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Label>Người quản lý *</Label>
            <Select
              value={data?.managerId || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateField("managerId", e.target.value)
              }
            >
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

export default EditTeamModal;
