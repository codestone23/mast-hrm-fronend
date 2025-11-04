"use client";
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");
  const { user } = useAuthContext();
  const divisions = useSelector((state: RootState) => state.division.divisions);

  const userRoleName = user?.user_information?.role?.name?.toLowerCase();
  const isAdminOrSuperAdmin =
    userRoleName === ROLE_NAMES.ADMIN || userRoleName === ROLE_NAMES.SUPER_ADMIN;

  const navItems = [
    { id: ROUTERS.DIVISION.BASE, label: "Dashboard" },
    { id: ROUTERS.DIVISION.WORKFORCE, label: "Quản lý nhân sự" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />
      {isAdminOrSuperAdmin && divisions.length > 0 && (
        <SelectDivisionWrapper>
          <SelectDivision />
        </SelectDivisionWrapper>
      )}
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}