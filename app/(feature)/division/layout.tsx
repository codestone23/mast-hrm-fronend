"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname } from "next/navigation";
import ROUTERS from "@/config/router";
import SelectDivision from "@/components/division/SelectDivision";
import { SelectDivisionWrapper } from "@/components/division/selectDivisionStyle";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuthContext } from "@/contexts/AuthContext";
import { ROLE_NAMES } from "@/constants/enums";
import { hasRolePermission, getModuleAllowedRoles } from "@/utils/rolePermission";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");
  const { user } = useAuthContext();
  const divisions = useSelector((state: RootState) => state.division.divisions);

  useEffect(() => {
    if (!user) return;

    const userRoles = user.role_assignments?.map((role) => role.name?.toLowerCase()).filter((role): role is string => Boolean(role)) || [];
    const allowedRoles = getModuleAllowedRoles("division");

    if (!hasRolePermission(userRoles, allowedRoles)) {
      router.push(ROUTERS.NOT_FOUND); 
    }
  }, [user, router]);

  const userRoleNames = user?.role_assignments.map(role => role?.name?.toLowerCase());
  const isAdmin = userRoleNames?.includes(ROLE_NAMES.ADMIN);

  const navItems = [
    { id: ROUTERS.DIVISION.BASE, label: "Tổng quan" },
    { id: ROUTERS.DIVISION.WORKFORCE, label: "Quản lý nhân sự" },
    { id: ROUTERS.DIVISION.PROJECTS, label: "Quản lý dự án" },
    { id: ROUTERS.DIVISION.REQUESTS, label: "Quản lý yêu cầu" },
    { id: ROUTERS.DIVISION.DAILY_REPORTS, label: "Báo cáo" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />
      {isAdmin && divisions.length > 0 && (
        <SelectDivisionWrapper>
          <SelectDivision />
        </SelectDivisionWrapper>
      )}
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}