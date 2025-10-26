"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Building2,
  Settings,
  Briefcase,
} from "lucide-react";
import {
  GridContainer,
  WelcomeSection,
  WelcomeGreeting,
  WelcomeDate,
  WelcomeDivider,
  SystemSection,
  SystemBar,
  SystemTitle,
  ModulesGrid,
  ModuleCard,
  IconWrapper,
  ModuleName,
  ModuleDescription,
} from "./moduleGridStyle";
import { Module } from "@/constants/types";
import ROUTERS from "@/config/router";

const modules: Module[] = [
  {
    id: "personal",
    name: "Personal",
    description: "Quản lý thông tin cá nhân và hồ sơ nhân viên",
    icon: Users,
    color: "#3b82f6",
    path: ROUTERS.PERSONAL.BASE,
    allowedRoles: ["super_admin", "admin", "hr_manager", "project_manager", "division_head", "team_leader", "employee"],
  },
  {
    id: "hr",
    name: "HR",
    description: "Quản lý tài sản và thống kê",
    icon: UserCheck,
    color: "#f59e0b",
    path: ROUTERS.HR.STATS,
    allowedRoles: ["hr_manager", "admin"],
  },
  {
    id: "division",
    name: "Division",
    description: "Quản lý phòng ban và cơ cấu tổ chức",
    icon: Building2,
    color: "#ef4444",
    path: ROUTERS.DIVISION.BASE,
    allowedRoles: ["super_admin", "admin", "division_head"],
  },
  {
    id: "company",
    name: "Company",
    description: "Quản lý công ty và cấu hình hệ thống",
    icon: Briefcase,
    color: "#8b5cf6",
    path: ROUTERS.COMPANY.BASE,
    allowedRoles: ["super_admin", "admin", "hr_manager"],
  },
  {
    id: "settings",
    name: "Settings",
    description: "Cài đặt hệ thống và cấu hình",
    icon: Settings,
    color: "#6b7280",
    path: ROUTERS.SETTINGS.BASE,
    allowedRoles: ["super_admin", "admin", "hr_manager"],
  },
];

interface ModuleGridProps {
  onModuleClick?: (moduleId: string) => void;
  userName?: string;
  userRole?: string;
}

const ModuleGrid: React.FC<ModuleGridProps> = (props: ModuleGridProps) => {
  const { onModuleClick, userName, userRole } = props;
  const handleModuleClick = (modulePath: string) => {
    if (onModuleClick) {
      onModuleClick(modulePath);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("vi-VN", options);
  };

  // Filter modules based on user role
  const filteredModules = modules.filter(module => 
    !module.allowedRoles || module.allowedRoles.includes(userRole || "")
  );

  return (
    <GridContainer>
      <WelcomeSection>
        <WelcomeGreeting>Chào buổi tối {userName}</WelcomeGreeting>
        <WelcomeDate>{getCurrentDate()}</WelcomeDate>
        <WelcomeDivider />
      </WelcomeSection>

      <SystemSection>
        <SystemBar />
        <SystemTitle>Hệ thống</SystemTitle>
      </SystemSection>

      <ModulesGrid>
        {filteredModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <ModuleCard
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
            >
              <IconWrapper style={{ backgroundColor: module.color }}>
                <IconComponent size={28} />
              </IconWrapper>
              <ModuleName>{module.name}</ModuleName>
              <ModuleDescription>{module.description}</ModuleDescription>
            </ModuleCard>
          );
        })}
      </ModulesGrid>
    </GridContainer>
  );
};

export default ModuleGrid;
