import React from "react";
import { Edit, Trash2, Briefcase, Plus } from "lucide-react";
import { Experience } from "@/services/profile.service";
import {
  SectionHeader,
  SectionTitle,
  SectionAction,
  ExperienceContainer,
  ExperienceCard,
  ExperienceCardHeader,
  ExperienceInfo,
  ExperienceTitle,
  ExperienceCompany,
  ExperienceDate,
  ExperienceActions,
  ExperienceActionButton,
  ExperienceDeleteButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "../personalInfoStyle";

interface ExperienceListProps {
  experiences: Experience[];
  onAdd: () => void;
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
  readOnly?: boolean;
}

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle>
          <Briefcase size={20} />
          Kinh nghiệm làm việc
        </SectionTitle>
        {!readOnly && (
          <SectionAction onClick={onAdd}>
            <Plus size={16} />
          </SectionAction>
        )}
      </SectionHeader>

      <ExperienceContainer>
        {experiences.map((exp, index) => (
          <ExperienceCard key={index}>
            <ExperienceCardHeader>
              <ExperienceInfo>
                <ExperienceTitle>{exp.job_title}</ExperienceTitle>
                <ExperienceCompany>{exp.company}</ExperienceCompany>
                <ExperienceDate>
                  {new Date(exp.start_date).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(exp.end_date).toLocaleDateString("vi-VN")}
                </ExperienceDate>
              </ExperienceInfo>
              {!readOnly && (
                <ExperienceActions>
                  <ExperienceActionButton onClick={() => onEdit(exp)}>
                    <Edit size={16} />
                  </ExperienceActionButton>
                  <ExperienceDeleteButton onClick={() => onDelete(exp)}>
                    <Trash2 size={16} />
                  </ExperienceDeleteButton>
                </ExperienceActions>
              )}
            </ExperienceCardHeader>
          </ExperienceCard>
        ))}
        {experiences.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>
              <Briefcase size={48} />
            </EmptyStateIcon>
            <EmptyStateTitle>Chưa có kinh nghiệm nào</EmptyStateTitle>
            {!readOnly && (
              <EmptyStateDescription>
                Nhấn nút + để thêm kinh nghiệm mới
              </EmptyStateDescription>
            )}
          </EmptyState>
        )}
      </ExperienceContainer>
    </>
  );
};

export default ExperienceList;

