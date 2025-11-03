"use client";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname } from "next/navigation";
import ROUTERS from "@/config/router";
import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { ROLE_NAMES } from "@/constants/enums";

interface NavItem {
  id: string;
  label: string;
  roles?: string[]; 
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");
  const userData = useAppSelector((state) => state.user.data);
  
  const userRole = userData?.user_information?.role?.name?.toLowerCase() ?? '';
  const role = useMemo(() => {
    const roleNames = Object.values(ROLE_NAMES);
    return roleNames.find(r => r.toLowerCase() === userRole) as string;
  }, [userRole]);

  const allNavItems: NavItem[] = useMemo(() => [
    { 
      id: ROUTERS.PERSONAL.BASE, 
      label: "Dashboard",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.HR_MANAGER, ROLE_NAMES.ADMIN, ROLE_NAMES.SUPER_ADMIN]
    },
    { 
      id: ROUTERS.PERSONAL.INFO, 
      label: "Thông tin cá nhân",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.HR_MANAGER, ROLE_NAMES.ADMIN, ROLE_NAMES.SUPER_ADMIN]
    },
    { 
      id: ROUTERS.PERSONAL.PROJECTS, 
      label: "Dự án tham gia",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER]
    },
    { 
      id: ROUTERS.PERSONAL.TIMEKEEPING, 
      label: "Chấm công",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.HR_MANAGER, ROLE_NAMES.ADMIN, ROLE_NAMES.SUPER_ADMIN]
    },
    { 
      id: ROUTERS.PERSONAL.COMPANY, 
      label: "Công ty",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.HR_MANAGER, ROLE_NAMES.ADMIN, ROLE_NAMES.SUPER_ADMIN]
    },
    { 
      id: ROUTERS.PERSONAL.NEWS, 
      label: "Tin tức",
      roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.HR_MANAGER, ROLE_NAMES.ADMIN, ROLE_NAMES.SUPER_ADMIN]
    },
  ], []);

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    if (!role) return [];
    return allNavItems.filter(item => {
      if (!item.roles) return true; // No role restriction
      return item.roles.includes(role);
    }).map(item => ({ id: item.id, label: item.label }));
  }, [role, allNavItems]);

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}