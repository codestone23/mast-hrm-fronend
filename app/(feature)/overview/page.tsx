'use client';

import React from 'react';
import styled from 'styled-components';
import Header from '../../../components/Header';
import ModuleGrid from '../../../components/ModuleGrid';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ContentWrapper = styled.main`
  padding-bottom: 2rem;
`;

const OverviewPage: React.FC = () => {
  const handleModuleClick = (moduleId: string) => {
    // Tạm thời chỉ log, sau này sẽ implement navigation và phân quyền
    console.log(`Navigating to module: ${moduleId}`);
    alert(`Module "${moduleId}" will be available after permission setup`);
  };

  return (
    <PageContainer>
      <Header userName="Admin User" />
      <ContentWrapper>
        <ModuleGrid onModuleClick={handleModuleClick} />
      </ContentWrapper>
    </PageContainer>
  );
};

export default OverviewPage;