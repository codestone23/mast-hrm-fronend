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
  DetailHeader,
  DetailHeaderContent,
  DetailTitleWrapper,
  DetailTitle,
  DetailContent as DetailContentWrapper,
} from "@/components/company/account/accountDetailStyle";
import { useEmployeeDetail } from "./useEmployeeDetail";
import {
  Skill,
  Experience,
  Education,
} from "@/services/profile.service";
import BasicInfoTab from "@/components/personal/personal-info/BasicInfoTab";
import SkillsTab from "@/components/personal/personal-info/SkillsTab";
import PersonalInfoSidebar from "@/components/personal/personal-info/PersonalInfoSidebar";
import TimeSheets from "./Tabs/TimeSheets";
import { useMobile } from "@/hooks/useMobile";

interface EmployeeDetailProps {
  id?: string;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ id }) => {
  const router = useRouter();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error, refetch } = useEmployeeDetail(id || "");

  // Avatar states
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const handleBack = () => {
    router.push("/division/workforce");
  };

  // Avatar handlers - disabled for admin view
  const handleAvatarClick = () => {
    // Disabled for admin
  };

  const handleAvatarChange = async () => {
    // Disabled for admin
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

  if (isLoading) {
    return (
      <PersonalInfoContainer>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <div>Đang tải...</div>
        </div>
      </PersonalInfoContainer>
    );
  }

  if (error || !data) {
    return (
      <PersonalInfoContainer>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ color: "var(--error-600)" }}>
            {error ? "Có lỗi xảy ra khi tải thông tin nhân viên" : "Không tìm thấy nhân viên"}
          </div>
        </div>
      </PersonalInfoContainer>
    );
  }

  return (
    <PersonalInfoContainer>
      <PersonalInfoSidebar
        data={data}
        avatarUrl={avatarUrl}
        isUploading={false}
        onAvatarClick={handleAvatarClick}
        onAvatarChange={handleAvatarChange}
        fileInputRef={fileInputRef}
        initPersonalInfo={data as any}
      />

      <MainContent>
        <DetailHeader $isMobile={isMobile}>
          <DetailHeaderContent $isMobile={isMobile}>
            <DetailTitleWrapper $isMobile={isMobile}>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={isMobile ? 18 : 20} />
              </BackButton>
              <DetailTitle $isMobile={isMobile}>
                Chi tiết nhân viên
              </DetailTitle>
            </DetailTitleWrapper>
          </DetailHeaderContent>
        </DetailHeader>

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
          <TabItem
            $active={activeTab === "timesheet"}
            onClick={() => setActiveTab("timesheet")}
          >
            BẢNG CHẤM CÔNG
          </TabItem>
        </ContentTabs>

        <TabContent>
          {activeTab === "basic" && (
            <BasicInfoTab data={data} onEdit={() => {}} />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              skills={skills}
              experiences={experiences}
              educations={educations}
              readOnly={true}
            />
          )}

          {activeTab === "timesheet" && (
            <DetailContentWrapper $isMobile={isMobile}>
              <TimeSheets employeeId={id} />
            </DetailContentWrapper>
          )}
        </TabContent>
      </MainContent>
    </PersonalInfoContainer>
  );
};

export default EmployeeDetail;
