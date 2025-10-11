"use client";
import { PageContainer } from "./overview/overviewStyle";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageContainer>{children}</PageContainer>;
}
