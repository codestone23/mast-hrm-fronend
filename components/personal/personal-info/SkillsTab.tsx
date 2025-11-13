import React from "react";
import { Skill, Experience, Education } from "@/services/profile.service";
import SkillsList from "./lists/SkillsList";
import ExperienceList from "./lists/ExperienceList";
import EducationList from "./lists/EducationList";

interface SkillsTabProps {
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  onAddSkill: () => void;
  onEditSkill: (skill: Skill) => void;
  onDeleteSkill: (skill: Skill) => void;
  onAddExperience: () => void;
  onEditExperience: (experience: Experience) => void;
  onDeleteExperience: (experience: Experience) => void;
  onAddEducation: () => void;
  onEditEducation: (education: Education) => void;
  onDeleteEducation: (education: Education) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
  skills,
  experiences,
  educations,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
}) => {
  return (
    <>
      <SkillsList
        skills={skills}
        onAdd={onAddSkill}
        onEdit={onEditSkill}
        onDelete={onDeleteSkill}
      />
      <ExperienceList
        experiences={experiences}
        onAdd={onAddExperience}
        onEdit={onEditExperience}
        onDelete={onDeleteExperience}
      />
      <EducationList
        educations={educations}
        onAdd={onAddEducation}
        onEdit={onEditEducation}
        onDelete={onDeleteEducation}
      />
    </>
  );
};

export default SkillsTab;

