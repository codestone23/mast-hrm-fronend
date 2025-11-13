"use client";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import ROUTERS from "@/config/router";
import { ROLE_NAMES } from "@/constants/enums";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import { ContentWrapper } from "../overview/overviewStyle";

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

  const roles = useMemo(() => {
    const userRoles =
      userData?.role_assignments.map((role) => role.name?.toLowerCase()) ?? [];
    const roleNames = Object.values(ROLE_NAMES);
    return userRoles.filter((role) =>
      roleNames.includes(role?.toLowerCase() as ROLE_NAMES)
    ) as ROLE_NAMES[];
  }, [userData]);

  const allNavItems: NavItem[] = useMemo(
    () => [
      {
        id: ROUTERS.PERSONAL.BASE,
        label: "Dashboard",
        roles: [
          ROLE_NAMES.EMPLOYEE,
          ROLE_NAMES.TEAM_LEADER,
          ROLE_NAMES.DIVISION_HEAD,
          ROLE_NAMES.PROJECT_MANAGER,
          ROLE_NAMES.HR_MANAGER,
          ROLE_NAMES.ADMIN,
        ],
      },
      {
        id: ROUTERS.PERSONAL.INFO,
        label: "Thông tin cá nhân",
        roles: [
          ROLE_NAMES.EMPLOYEE,
          ROLE_NAMES.TEAM_LEADER,
          ROLE_NAMES.DIVISION_HEAD,
          ROLE_NAMES.PROJECT_MANAGER,
          ROLE_NAMES.HR_MANAGER,
          ROLE_NAMES.ADMIN,
        ],
      },
      // {
      //   id: ROUTERS.PERSONAL.PROJECTS,
      //   label: "Dự án tham gia",
      //   roles: [ROLE_NAMES.EMPLOYEE, ROLE_NAMES.TEAM_LEADER, ROLE_NAMES.DIVISION_HEAD, ROLE_NAMES.PROJECT_MANAGER]
      // },
      {
        id: ROUTERS.PERSONAL.TIMEKEEPING,
        label: "Chấm công",
        roles: [
          ROLE_NAMES.EMPLOYEE,
          ROLE_NAMES.TEAM_LEADER,
          ROLE_NAMES.DIVISION_HEAD,
          ROLE_NAMES.PROJECT_MANAGER,
          ROLE_NAMES.HR_MANAGER,
          ROLE_NAMES.ADMIN,
        ],
      },
      {
        id: ROUTERS.PERSONAL.COMPANY,
        label: "Công ty",
        roles: [
          ROLE_NAMES.EMPLOYEE,
          ROLE_NAMES.TEAM_LEADER,
          ROLE_NAMES.DIVISION_HEAD,
          ROLE_NAMES.PROJECT_MANAGER,
          ROLE_NAMES.HR_MANAGER,
          ROLE_NAMES.ADMIN,
        ],
      },
      {
        id: ROUTERS.PERSONAL.NEWS,
        label: "Tin tức",
        roles: [
          ROLE_NAMES.EMPLOYEE,
          ROLE_NAMES.TEAM_LEADER,
          ROLE_NAMES.DIVISION_HEAD,
          ROLE_NAMES.PROJECT_MANAGER,
          ROLE_NAMES.HR_MANAGER,
          ROLE_NAMES.ADMIN,
        ],
      },
    ],
    []
  );

  const navItems = useMemo(() => {
    if (!roles) return [];
    return allNavItems
      .filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((role) =>
          roles.includes(role.toLowerCase() as ROLE_NAMES)
        );
      })
      .map((item) => ({ id: item.id, label: item.label }));
  }, [roles, allNavItems]);

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}
