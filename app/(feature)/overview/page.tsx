'use client';

import React from 'react';
import Header from '@/components/header/Header';
import ModuleGrid from '../../../components/header/module-grid/ModuleGrid'; 
import { ContentHeader, PageContainer } from "./overviewStyle";
import { useRouter } from "next/navigation";
import { useOverview } from "./useOverview";

const OverviewPage: React.FC = () => {
  const router = useRouter();
  const { data } = useOverview();
  const handleModuleClick = (modulePath: string) => {
    router.push(modulePath);
  };

  return (
    <PageContainer>
      <Header userName={data?.name ?? ''} />
      <ContentHeader>
        <ModuleGrid onModuleClick={handleModuleClick} userName={data?.name ?? ''} />
      </ContentHeader>
    </PageContainer>
  );
};

export default OverviewPage;