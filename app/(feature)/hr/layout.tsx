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
    { id: ROUTERS.HR.STATS, label: "Thống kê tài sản" },
    { id: ROUTERS.HR.ASSETS, label: "Quản lý tài sản" },
    { id: ROUTERS.HR.USERS, label: "Quản lý user" },
    { id: ROUTERS.HR.NEWS, label: "Tin tức" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}

