"use client";

import React from "react";
import { DivisionListItem } from "@/types/api";
import { Building2, Edit, Trash2, Users } from "lucide-react";
import { DivisionGrid, DivisionCard, DivisionIcon, DivisionInfo, DivisionName, DivisionDescription, DivisionStats, DivisionActions as CardActions, ActionButton } from "./divisionStyle";

interface Props {
  divisions: DivisionListItem[];
  onEdit: (division: DivisionListItem) => void;
  onDelete: (division: DivisionListItem) => void;
  onOpen: (division: DivisionListItem) => void;
}

const DivisionList: React.FC<Props> = ({ divisions, onEdit, onDelete, onOpen }) => {
  const getStatusColor = (status: string) => status === 'ACTIVE' ? 'var(--success-600)' : 'var(--error-600)';
  return (
    <DivisionGrid>
      {divisions.map((division) => (
        <DivisionCard key={division.id} onClick={() => onOpen(division)}>
          <DivisionIcon>
            <Building2 size={24} />
          </DivisionIcon>
          <DivisionInfo>
            <DivisionName>{division.name}</DivisionName>
            <DivisionDescription>{division.description}</DivisionDescription>
            <DivisionStats>
              <div className="stat">
                <Users size={16} />
                <span>{division.member_count ?? 0} nhân viên</span>
              </div>
              <div className="stat">
                <span className="status" style={{ color: getStatusColor(division.status), background: 'var(--background-secondary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600 }}>{division.status}</span>
              </div>
            </DivisionStats>
          </DivisionInfo>
          <CardActions>
            <ActionButton $variant="edit" onClick={(e)=>{e.stopPropagation(); onEdit(division);}} title="Chỉnh sửa phòng ban">
              <Edit size={16} />
            </ActionButton>
            <ActionButton $variant="delete" onClick={(e)=>{e.stopPropagation(); onDelete(division);}} title="Xóa phòng ban">
              <Trash2 size={16} />
            </ActionButton>
          </CardActions>
        </DivisionCard>
      ))}
    </DivisionGrid>
  );
};

export default DivisionList;


