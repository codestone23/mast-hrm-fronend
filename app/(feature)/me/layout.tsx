"use client";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname } from "next/navigation";
import ROUTERS from "@/config/router";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");

  const navItems = [
    { id: ROUTERS.PERSONAL.BASE, label: "Dashboard" },
    { id: ROUTERS.PERSONAL.INFO, label: "Thông tin cá nhân" },
    { id: ROUTERS.PERSONAL.PROJECTS, label: "Dự án tham gia" },
    { id: ROUTERS.PERSONAL.TIMEKEEPING, label: "Chấm công" },
    { id: ROUTERS.PERSONAL.COMPANY, label: "Công ty" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}