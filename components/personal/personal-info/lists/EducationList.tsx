import React from "react";
import { Edit, Trash2, GraduationCap, Plus } from "lucide-react";
import { Education } from "@/services/profile.service";
import {
  SectionHeader,
  SectionTitle,
  SectionAction,
  EducationContainer,
  EducationCard,
  EducationCardHeader,
  EducationInfo,
  EducationTitle,
  EducationMajor,
  EducationDescription,
  EducationDate,
  EducationActions,
  EducationActionButton,
  EducationDeleteButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "../personalInfoStyle";

interface EducationListProps {
  educations: Education[];
  onAdd?: () => void;
  onEdit?: (education: Education) => void;
  onDelete?: (education: Education) => void;
  readOnly?: boolean;
}

const EducationList: React.FC<EducationListProps> = ({
  educations,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle>
          <GraduationCap size={20} />
          Học vấn
        </SectionTitle>
        {!readOnly && (
          <SectionAction onClick={() => onAdd?.()}>
            <Plus size={16} />
          </SectionAction>
        )}
      </SectionHeader>

      <EducationContainer>
        {educations.map((edu, index) => (
          <EducationCard key={index}>
            <EducationCardHeader>
              <EducationInfo>
                <EducationTitle>{edu.name}</EducationTitle>
                <EducationMajor>{edu.major}</EducationMajor>
                <EducationDescription>{edu.description}</EducationDescription>
                <EducationDate>
                  {new Date(edu.start_date).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(edu.end_date).toLocaleDateString("vi-VN")}
                </EducationDate>
              </EducationInfo>
              {!readOnly && (
                <EducationActions>
                  <EducationActionButton onClick={() => onEdit?.(edu)}>
                    <Edit size={16} />
                  </EducationActionButton>
                  <EducationDeleteButton onClick={() => onDelete?.(edu)}>
                    <Trash2 size={16} />
                  </EducationDeleteButton>
                </EducationActions>
              )}
            </EducationCardHeader>
          </EducationCard>
        ))}
        {educations.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>
              <GraduationCap size={48} />
            </EmptyStateIcon>
            <EmptyStateTitle>Chưa có học vấn nào</EmptyStateTitle>
            {!readOnly && (
              <EmptyStateDescription>
                Nhấn nút + để thêm học vấn mới
              </EmptyStateDescription>
            )}
          </EmptyState>
        )}
      </EducationContainer>
    </>
  );
};

export default EducationList;

