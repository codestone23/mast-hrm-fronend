"use client";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "../me/staff/personalStyle";
import Header from "@/components/division/header/Header";
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
      <Header activeTab={activeTab} onTabChange={onTabChange} />  
      <ContentWrapper>{children}</ContentWrapper>
    </PersonalPageContainer>
  );
}