"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname } from "next/navigation";
import ROUTERS from "@/config/router";
import { useAuthContext } from "@/contexts/AuthContext";
import { hasRolePermission, getModuleAllowedRoles } from "@/utils/rolePermission";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user } = useAuthContext();
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");

  useEffect(() => {
    if (!user) return;

    const userRoles = user.role_assignments?.map((role) => role.name?.toLowerCase()).filter((role): role is string => Boolean(role)) || [];
    const allowedRoles = getModuleAllowedRoles("settings");

    if (!hasRolePermission(userRoles, allowedRoles)) {
      router.push(ROUTERS.NOT_FOUND);
    }
  }, [user, router]);

  const navItems = [
    { id: ROUTERS.SETTINGS.BASE, label: "Cài đặt" },
    { id: ROUTERS.SETTINGS.NEWS, label: "Tin tức" },
    { id: ROUTERS.SETTINGS.NOTIFICATIONS, label: "Thông báo" },
  ];

  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab={activeTab} navItems={navItems} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}
