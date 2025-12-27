"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  PersonalInfoContainer,
  MainContent,
  ContentTabs,
  TabItem,
  TabContent,
  BackButton,
  DetailHeaderWrapper,
  DetailHeaderContentWrapper,
  DetailHeaderTitleGroup,
  DetailPageTitle,
} from "./accountDetailStyle";
import { useAccountDetail } from "./useAccountDetail";
import {
  Skill,
  Experience,
  Education,
} from "@/services/profile.service";
import EditAccountInfoModal from "./modals/EditAccountInfoModal";
import BasicInfoTab from "@/components/personal/personal-info/BasicInfoTab";
import SkillsTab from "@/components/personal/personal-info/SkillsTab";
import PersonalInfoSidebar from "@/components/personal/personal-info/PersonalInfoSidebar";
import ROUTERS from "@/config/router";

interface AccountDetailProps {
  accountId: string;
}

const enum Tab {
  BASIC = "basic",
  SKILLS = "skills",
}

const AccountDetail: React.FC<AccountDetailProps> = ({ accountId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(Tab.BASIC);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, refetch } = useAccountDetail(accountId);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] =
    useState(false);

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const handleBack = () => {
    router.push(ROUTERS.COMPANY.ACCOUNTS); 
  };

  const handleEditPersonalInfo = () => {
    setIsEditPersonalModalOpen(true);
  };

  useEffect(() => {
    if (!data) return;

    setSkills(data.user_skills || []);
    setExperiences(data.experience || []);
    setEducations(
      (data.education || []).map((edu) => ({
        ...edu,
        description: (edu as { description?: string }).description || "",
      }))
    );
    setAvatarUrl(
      data.user_information?.avatar?.includes('https') 
        ? data.user_information.avatar 
        : null
    );
  }, [data]);

  return (
    <PersonalInfoContainer>
      <PersonalInfoSidebar
        data={data}
        avatarUrl={avatarUrl}
        isUploading={false}
        fileInputRef={fileInputRef}
      />

      <MainContent>
        <DetailHeaderWrapper>
          <DetailHeaderContentWrapper>
            <DetailHeaderTitleGroup>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <DetailPageTitle>Chi tiết tài khoản</DetailPageTitle>
            </DetailHeaderTitleGroup>
          </DetailHeaderContentWrapper>
        </DetailHeaderWrapper>

        <ContentTabs>
          <TabItem
            $active={activeTab === Tab.BASIC}
            onClick={() => setActiveTab(Tab.BASIC)}
          >
            THÔNG TIN CƠ BẢN
          </TabItem>
          <TabItem
            $active={activeTab === Tab.SKILLS}
            onClick={() => setActiveTab(Tab.SKILLS)}
          >
            THÔNG TIN CÔNG VIỆC
          </TabItem>
        </ContentTabs>

        <TabContent>
          {activeTab === Tab.BASIC && (
            <BasicInfoTab data={data} onEdit={handleEditPersonalInfo} />
          )}

          {activeTab === Tab.SKILLS && (
            <SkillsTab
              skills={skills}
              experiences={experiences}
              educations={educations}
              readOnly={true}
            />
          )}
        </TabContent>
      </MainContent>

      <EditAccountInfoModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => {
          refetch();
          setIsEditPersonalModalOpen(false);
        }}
        userId={accountId}
        onSave={() => {
          refetch();
        }}
        initialData={
          data?.user_information
            ? {
                name: data.user_information.name || "",
                email: data.email || "",
              }
            : undefined
        }
      />
    </PersonalInfoContainer>
  );
};

export default AccountDetail;
