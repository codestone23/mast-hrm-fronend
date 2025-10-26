import React from "react";
import { Edit, Trash2, Star, Plus } from "lucide-react";
import { Skill } from "@/services/profile.service";
import {
  SectionHeader,
  SectionTitle,
  SectionAction,
  SkillsContainer,
  SkillCard,
  SkillCardHeader,
  SkillInfo,
  SkillTitle,
  SkillDescription,
  SkillMainTag,
  SkillActions,
  SkillActionButton,
  SkillDeleteButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "../personalInfoStyle";

interface SkillsListProps {
  skills: Skill[];
  onAdd: () => void;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle>
          <Star size={20} />
          Kỹ năng
        </SectionTitle>
        <SectionAction onClick={onAdd}>
          <Plus size={16} />
        </SectionAction>
      </SectionHeader>

      <SkillsContainer>
        {skills.map((skill, index) => (
          <SkillCard key={index}>
            <SkillCardHeader>
              <SkillInfo>
                <SkillTitle>{skill.skill?.name}</SkillTitle>
                <SkillDescription>
                  Kinh nghiệm: {skill.experience} năm {skill.months_experience}{" "}
                  tháng
                </SkillDescription>
                {skill.is_main && <SkillMainTag>Kỹ năng chính</SkillMainTag>}
              </SkillInfo>
              <SkillActions>
                <SkillActionButton onClick={() => onEdit(skill)}>
                  <Edit size={16} />
                </SkillActionButton>
                <SkillDeleteButton onClick={() => onDelete(skill)}>
                  <Trash2 size={16} />
                </SkillDeleteButton>
              </SkillActions>
            </SkillCardHeader>
          </SkillCard>
        ))}
        {skills.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>
              <Star size={48} />
            </EmptyStateIcon>
            <EmptyStateTitle>Chưa có kỹ năng nào</EmptyStateTitle>
            <EmptyStateDescription>
              Nhấn nút + để thêm kỹ năng mới
            </EmptyStateDescription>
          </EmptyState>
        )}
      </SkillsContainer>
    </>
  );
};

export default SkillsList;

