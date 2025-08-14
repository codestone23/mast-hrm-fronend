'use client';

import React from 'react';
import styled from 'styled-components';
import Header from '../../components/header/Header';
import ModuleGrid from '../../components/header/module-grid/ModuleGrid';
import { ContentHeader, ContentWrapper, PageContainer } from "./overviewStyle";
import { useRouter } from "next/navigation";

const OverviewPage: React.FC = () => {
  const router = useRouter();
  const handleModuleClick = (modulePath: string) => {
    router.push(modulePath);
  };

  return (
    <PageContainer>
      <Header userName="Trung Thu" />
      <ContentHeader>
        <ModuleGrid onModuleClick={handleModuleClick} />
      </ContentHeader>
    </PageContainer>
  );
};

export default OverviewPage;