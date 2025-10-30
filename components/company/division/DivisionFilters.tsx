"use client";

import React from "react";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { DivisionType } from "@/constants/enums";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  type?: string;
  status?: string;
  onTypeChange: (v?: string) => void;
  onStatusChange: (v?: string) => void;
}

const typeOptions = [
  { value: "", label: "Loại (tất cả)" },
  { value: DivisionType.TECHNICAL, label: "Kỹ thuật" },
  { value: DivisionType.BUSINESS, label: "Kinh doanh" },
  { value: DivisionType.OPERATIONS, label: "Vận hành" },
  { value: DivisionType.OTHER, label: "Khác" },
];

const statusOptions = [
  { value: "", label: "Trạng thái (tất cả)" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
];

const DivisionFilters: React.FC<Props> = ({ search, onSearchChange, type, status, onTypeChange, onStatusChange }) => {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '100%' }}>
        <Input placeholder="Tìm kiếm theo tên phòng ban" value={search} onChange={(e)=>onSearchChange(e.target.value)} />
      </div>
      <div style={{ width: '100%' }}>
        <Select
          options={typeOptions}
          value={type ?? ""}
          onChange={(v)=>onTypeChange(String(v) || undefined)}
        />
      </div>
      <div style={{ width: '100%' }}>
        <Select
          options={statusOptions}
          value={status ?? ""}
          onChange={(v)=>onStatusChange(String(v) || undefined)}
        />
      </div>
    </div>
  );
};

export default DivisionFilters;


