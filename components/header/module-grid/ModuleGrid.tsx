'use client';

import React from 'react';
import { 
  Users, 
  FolderOpen, 
  UserCheck, 
  Building2, 
  Calendar, 
  FileText, 
  Settings,
  BarChart3 
} from 'lucide-react';
import { GridContainer, Title, ModulesGrid, ModuleCard, IconWrapper, ModuleName, ModuleDescription } from './moduleGridStyle';
import { Module } from "@/constants/types";
import ROUTERS from "@/config/router";

const modules: Module[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Quản lý thông tin cá nhân và hồ sơ nhân viên',
    icon: Users,
    color: '#3b82f6',
    path: ROUTERS.PERSONAL.BASE
  },
  {
    id: 'project',
    name: 'Project',
    description: 'Quản lý dự án và theo dõi tiến độ công việc',
    icon: FolderOpen,
    color: '#10b981',
    path: ''
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Quản lý nhân sự và các hoạt động HR',
    icon: UserCheck,
    color: '#f59e0b',
    path: ''
  },
  {
    id: 'division',
    name: 'Division',
    description: 'Quản lý phòng ban và cơ cấu tổ chức',
    icon: Building2,
    color: '#ef4444',
    path: ''
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Quản lý lịch làm việc và nghỉ phép',
    icon: Calendar,
    color: '#8b5cf6',
    path: ''
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Báo cáo và thống kê dữ liệu',
    icon: BarChart3,
    color: '#06b6d4',
    path: ''
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Quản lý tài liệu và văn bản',
    icon: FileText,
    color: '#84cc16',
    path: ''
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Cài đặt hệ thống và cấu hình',
    icon: Settings,
    color: '#6b7280',
    path: ''
  }
];

interface ModuleGridProps {
  onModuleClick?: (moduleId: string) => void;
}

const ModuleGrid: React.FC<ModuleGridProps> = (props: ModuleGridProps) => {
  const { onModuleClick } = props;
  const handleModuleClick = (modulePath: string) => {
    if (onModuleClick) {
      onModuleClick(modulePath);
    }
  };

  return (
    <GridContainer>
      <Title>Hệ thống quản lý nhân sự - HRM</Title>
      <ModulesGrid>
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <ModuleCard
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
            >
              <IconWrapper style={{ backgroundColor: module.color }}>
                <IconComponent size={32} />
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