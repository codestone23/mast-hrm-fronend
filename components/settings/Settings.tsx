"use client";

import React, { useState } from "react";
import { Settings2, Users, GraduationCap, Briefcase, Languages, Brain, Calendar, FolderKanban, Building } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsContent,
  Sidebar,
  SidebarItem,
  MainContent,
} from "./settingsStyle";
import SkillManagement from "./SkillManagement";
import LanguageManagement from "./LanguageManagement";
import LevelManagement from "./LevelManagement";
import PositionManagement from "./PositionManagement";
import RoomManagement from "./RoomManagement";
import HolidayManagement from "./HolidayManagement";
import ProjectManagement from "./ProjectManagement";

interface DataItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const masterDataItems: DataItem[] = [
  { id: "position", name: "Vị trí", icon: <Briefcase size={20} /> },
  { id: "language", name: "Ngôn ngữ", icon: <Languages size={20} /> },
  { id: "skill", name: "Kỹ năng", icon: <Brain size={20} /> },
  { id: "project", name: "Dự án", icon: <FolderKanban size={20} /> },
  { id: "holiday", name: "Ngày lễ", icon: <Calendar size={20} /> },
  { id: "room", name: "Phòng họp", icon: <Building size={20} /> },
];

const Settings: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>(masterDataItems[0].id);

  const handleItemChange = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Cài đặt hệ thống</SettingsTitle>
      </SettingsHeader>

      <SettingsContent>
        <Sidebar>
          {masterDataItems.map((item) => (
            <SidebarItem
              key={item.id}
              $active={activeItem === item.id}
              onClick={() => handleItemChange(item.id)}
            >
              {item.icon}
              <span>{item.name}</span>
            </SidebarItem>
          ))}
        </Sidebar>
        <MainContent>
          {/* Content will be rendered based on activeItem */}
          {activeItem === "position" && <PositionManagement />}
          {activeItem === "language" && <LanguageManagement />}
          {activeItem === "skill" && <SkillManagement />}
          {activeItem === "project" && <ProjectManagement />}
          {activeItem === "holiday" && <HolidayManagement />}
          {activeItem === "room" && <RoomManagement />}
        </MainContent>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;

