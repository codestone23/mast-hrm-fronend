"use client";

import React, { useState } from "react";
import { Settings2, Users, GraduationCap, Briefcase, Languages, Brain, Calendar } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsTabs,
  Tab,
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

interface MasterDataItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const masterDataItems: MasterDataItem[] = [
  { id: "level", name: "Cấp độ (Level)", icon: <GraduationCap size={20} /> },
  { id: "position", name: "Vị trí (Position)", icon: <Briefcase size={20} /> },
  { id: "language", name: "Ngôn ngữ (Language)", icon: <Languages size={20} /> },
  { id: "skill", name: "Kỹ năng (Skill)", icon: <Brain size={20} /> },
  { id: "holiday", name: "Ngày lễ (Holiday)", icon: <Calendar size={20} /> },
];

const Settings: React.FC = () => {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<string>("master-data");
  const [activeItem, setActiveItem] = useState<string>("level");

  const tabs = [
    { id: "master-data", label: "Dữ liệu chính", icon: <Settings2 size={20} /> },
    { id: "system", label: "Hệ thống", icon: <Users size={20} /> },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== "master-data") {
      setActiveItem("");
    } else {
      setActiveItem("level");
    }
  };

  const handleItemChange = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Cài đặt hệ thống</SettingsTitle>
        <SettingsTabs>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </Tab>
          ))}
        </SettingsTabs>
      </SettingsHeader>

      <SettingsContent>
        {activeTab === "master-data" && (
          <>
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
              {activeItem === "level" && <LevelManagement />}
              {activeItem === "position" && <PositionManagement />}
              {activeItem === "language" && <LanguageManagement />}
              {activeItem === "skill" && <SkillManagement />}
              {activeItem === "holiday" && <HolidayManagement />}
            </MainContent>
          </>
        )}
        
        {activeTab === "system" && (
          <MainContent>
            <RoomManagement />
          </MainContent>
        )}
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;

