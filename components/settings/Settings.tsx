"use client";

import React, { useState } from "react";
import { Settings2, Users, GraduationCap, Briefcase, Shield, Languages, DollarSign } from "lucide-react";
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

interface MasterDataItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const masterDataItems: MasterDataItem[] = [
  { id: "level", name: "Cấp độ (Level)", icon: <GraduationCap size={20} /> },
  { id: "position", name: "Vị trí (Position)", icon: <Briefcase size={20} /> },
  { id: "roles", name: "Vai trò (Roles)", icon: <Shield size={20} /> },
  { id: "language", name: "Ngôn ngữ (Language)", icon: <Languages size={20} /> },
];

const Settings: React.FC = () => {
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
              {activeItem === "level" && <div>Level Management - Coming soon</div>}
              {activeItem === "position" && <div>Position Management - Coming soon</div>}
              {activeItem === "roles" && <div>Roles Management - Coming soon</div>}
              {activeItem === "language" && <div>Language Management - Coming soon</div>}
              {activeItem === "salary" && <div>Salary Management - Coming soon</div>}
            </MainContent>
          </>
        )}
        
        {activeTab === "system" && (
          <MainContent>
            <div>System Settings - Coming soon</div>
          </MainContent>
        )}
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;

