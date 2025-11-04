"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setSelectedDivisionId } from "@/store/slices/divisionSlice";
import { Select } from "@/components/common";
import { DivisionListItem } from "@/types/api";

interface SelectDivisionProps {
  className?: string;
}

const SelectDivision: React.FC<SelectDivisionProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const divisions = useSelector((state: RootState) => state.division.divisions);
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const options = divisions.map((division: DivisionListItem) => ({
    value: division.id,
    label: division.name,
  }));

  const handleChange = (value: string | number) => {
    dispatch(setSelectedDivisionId(value as number));
  };

  if (divisions.length === 0) {
    return null;
  }

  return (
    <Select
      options={options}
      value={selectedDivisionId || undefined}
      onChange={handleChange}
      placeholder="Chọn phòng ban"
      size="sm"
      fullWidth={false}
      className={className}
    />
  );
};

export default SelectDivision;

