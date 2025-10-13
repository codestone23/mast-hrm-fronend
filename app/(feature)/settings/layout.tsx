"use client";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");
  const onTabChange = (tab: string) => {
    router.push(`/${tab}`);
  };
  return (
    <PersonalPageContainer>
      <SettingsHeader activeTab={activeTab} onTabChange={onTabChange} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}
