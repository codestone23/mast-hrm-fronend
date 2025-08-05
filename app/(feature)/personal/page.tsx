'use client';

import React from 'react';
import HeaderCommon from '@/components/common/header/HeaderCommon';
import Personal from '@/components/personal/Personal';
import { PersonalPageContainer, ContentWrapper } from './personalStyle';

const PersonalPage: React.FC = () => {
  return (
    <PersonalPageContainer>
      <HeaderCommon activeTab="dashboard" />
      <ContentWrapper>
        <Personal />
      </ContentWrapper>
    </PersonalPageContainer>
  );
};

export default PersonalPage;
