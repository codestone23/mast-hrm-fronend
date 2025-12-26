import { Users, UserCheck, Building2, Settings, Briefcase } from "lucide-react";
import { Module } from "./types";
import ROUTERS from "@/config/router";
import { ROLE_NAMES } from "./enums";

/**
 * Module definitions with allowed roles
 * This is the single source of truth for module permissions
 */
export const MODULE_DEFINITIONS: Omit<Module, "icon">[] = [
  {
    id: "personal",
    name: "Cá nhân",
    description: "Quản lý thông tin cá nhân và hồ sơ nhân viên",
    color: "#3b82f6",
    path: ROUTERS.PERSONAL.BASE,
    allowedRoles: [
      ROLE_NAMES.ADMIN,
      ROLE_NAMES.HR_MANAGER,
      ROLE_NAMES.PROJECT_MANAGER,
      ROLE_NAMES.DIVISION_HEAD,
      ROLE_NAMES.TEAM_LEADER,
      ROLE_NAMES.EMPLOYEE,
    ],
  },
  {
    id: "hr",
    name: "Nhân sự",
    description: "Quản lý tài sản và thống kê",
    color: "#f59e0b",
    path: ROUTERS.HR.STATS,
    allowedRoles: [ROLE_NAMES.HR_MANAGER],
  },
  {
    id: "division",
    name: "Phòng ban",
    description: "Quản lý phòng ban và cơ cấu tổ chức",
    color: "#ef4444",
    path: ROUTERS.DIVISION.BASE,
    allowedRoles: [
      ROLE_NAMES.ADMIN,
      ROLE_NAMES.DIVISION_HEAD,
      ROLE_NAMES.TEAM_LEADER,
    ],
  },
  {
    id: "company",
    name: "Công ty",
    description: "Quản lý công ty và cấu hình hệ thống",
    color: "#8b5cf6",
    path: ROUTERS.COMPANY.BASE,
    allowedRoles: [ROLE_NAMES.ADMIN, ROLE_NAMES.HR_MANAGER],
  },
  {
    id: "settings",
    name: "Cài đặt",
    description: "Cài đặt hệ thống và cấu hình",
    color: "#6b7280",
    path: ROUTERS.SETTINGS.BASE,
    allowedRoles: [ROLE_NAMES.ADMIN],
  },
];

/**
 * Icon mapping for modules
 */
const MODULE_ICONS: Record<string, typeof Users> = {
  personal: Users,
  hr: UserCheck,
  division: Building2,
  company: Briefcase,
  settings: Settings,
};

/**
 * Get complete module definitions with icons
 */
export function getModules(): Module[] {
  return MODULE_DEFINITIONS.map((moduleDef) => ({
    ...moduleDef,
    icon: MODULE_ICONS[moduleDef.id],
  }));
}

/**
 * Get allowed roles for a module by ID
 */
export function getModuleAllowedRoles(moduleId: string): string[] | undefined {
  const moduleDef = MODULE_DEFINITIONS.find((m) => m.id === moduleId);
  return moduleDef?.allowedRoles;
}

