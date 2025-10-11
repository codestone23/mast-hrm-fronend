"use client";
import { ContentWrapper } from "./overview/overviewStyle";
import { PersonalPageContainer } from "./me/staff/personalStyle";
import HeaderCommon from "@/components/common/header/HeaderCommon";
import { usePathname, useRouter } from "next/navigation";
import { PageContainer } from "../overview/overviewStyle";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageContainer>{children}</PageContainer>;
}
