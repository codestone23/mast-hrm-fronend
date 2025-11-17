"use client";

import Header from "@/components/header/Header";
import { useRouter } from "next/navigation";
import React from "react";
import ModuleGrid from "../../../components/header/module-grid/ModuleGrid";
import { ContentHeader, PageContainer } from "./overviewStyle";
import { useOverview } from "./useOverview";

const OverviewPage: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } = useOverview();

  const getUserRoles = () => {
    const roles = data?.role_assignments?.map((role) => role?.name ?? "");
    return Array.isArray(roles) ? roles : [];
  };

  const handleModuleClick = (modulePath: string) => {
    router.push(modulePath);
  };

  return (
    <PageContainer>
      <Header userName={data?.user_information?.name ?? ""} />
      <ContentHeader>
        <ModuleGrid
          onModuleClick={handleModuleClick}
          userName={data?.user_information?.name ?? ""}
          userRoles={getUserRoles()}
          isLoading={isLoading}
        />
      </ContentHeader>
    </PageContainer>
  );
};

export default OverviewPage;
