"use client";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { ContentWrapper } from "../overview/overviewStyle";
import { PersonalPageContainer } from "./personal/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname().split("/");
  const activeTab = pathname.slice(1, pathname.length).join("/");
  console.log(activeTab);
  const onTabChange = (tab: string) => {
    router.push(`/${tab}`);
  };
  return (
    <StyledComponentsRegistry>
      <PersonalPageContainer>
        <HeaderCommon activeTab={activeTab} onTabChange={onTabChange} />
        <ContentWrapper>{children}</ContentWrapper>
      </PersonalPageContainer>
    </StyledComponentsRegistry>
  );
}
