"use client";

import React from "react";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { DivisionStatus, DivisionType } from "@/constants/enums";
import styled from "styled-components";

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
  { value: DivisionStatus.ACTIVE, label: "Hoạt động" },
  { value: DivisionStatus.INACTIVE, label: "Không hoạt động" },
];

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterItem = styled.div`
  width: 100%;
`;

const DivisionFilters: React.FC<Props> = ({ search, onSearchChange, type, status, onTypeChange, onStatusChange }) => {
  return (
    <FiltersContainer>
      <FilterItem>
        <Input placeholder="Tìm kiếm theo tên phòng ban" value={search} onChange={(e)=>onSearchChange(e.target.value)} />
      </FilterItem>
      <FilterItem>
        <Select
          options={typeOptions}
          value={type ?? ""}
          onChange={(v)=>onTypeChange(String(v) || undefined)}
        />
      </FilterItem>
      <FilterItem>
        <Select
          options={statusOptions}
          value={status ?? ""}
          onChange={(v)=>onStatusChange(String(v) || undefined)}
        />
      </FilterItem>
    </FiltersContainer>
  );
};

export default DivisionFilters;


