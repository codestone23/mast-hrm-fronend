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
} from "./userDetailStyle";
import { useUserDetail } from "./useUserDetail";
import {
  Skill,
  Experience,
  Education,
} from "@/services/profile.service";
import EditAccountInfoModal from "@/components/company/account/modals/EditAccountInfoModal";
import BasicInfoTab from "@/components/personal/personal-info/BasicInfoTab";
import SkillsTab from "@/components/personal/personal-info/SkillsTab";
import PersonalInfoSidebar from "@/components/personal/personal-info/PersonalInfoSidebar";
import ROUTERS from "@/config/router";

interface UserDetailProps {
  userId: string;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, refetch } = useUserDetail(userId);

  // Avatar states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Modal states
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] =
    useState(false);

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const handleBack = () => {
    router.push(ROUTERS.HR.USERS); 
  };

  const handleEditPersonalInfo = () => {
    setIsEditPersonalModalOpen(true);
  };

  useEffect(() => {
    if (data) {
      setSkills(data?.user_skills || []);
      setExperiences(data.experience || []);
      setEducations(
        (data.education || []).map((edu) => ({
          ...edu,
          description: (edu as { description?: string }).description || "",
        }))
      );
      setAvatarUrl(data.user_information?.avatar && data.user_information.avatar.includes('https') ? data.user_information.avatar : null); 
    }
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
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <h1
                style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}
              >
                Chi tiết người dùng
              </h1>
            </div>
          </div>
        </div>

        <ContentTabs>
          <TabItem
            $active={activeTab === "basic"}
            onClick={() => setActiveTab("basic")}
          >
            THÔNG TIN CƠ BẢN
          </TabItem>
          <TabItem
            $active={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
          >
            THÔNG TIN CÔNG VIỆC
          </TabItem>
        </ContentTabs>

        <TabContent>
          {activeTab === "basic" && (
            <BasicInfoTab data={data} onEdit={handleEditPersonalInfo} />
          )}

          {activeTab === "skills" && (
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
        userId={userId}
        onSave={() => {
          refetch();
        }}
        initialData={
          data?.user_information
            ? {
                name: data?.user_information?.name || "",
                email: data?.email || "",
              }
            : undefined
        }
      />
    </PersonalInfoContainer>
  );
};

export default UserDetail;

