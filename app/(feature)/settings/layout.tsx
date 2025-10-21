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
    { id: ROUTERS.SETTINGS.ACCOUNTS, label: "Quản lý tài khoản" },
    { id: ROUTERS.SETTINGS.DIVISIONS, label: "Các divisions" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}
