import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Trash2,
  Clock,
  Star,
  Briefcase,
  Award,
  GraduationCap,
} from "lucide-react";
import EditPersonalInfoModal from "./EditPersonalInfoModal";
import SkillModal from "./modals/SkillModal";
import ExperienceModal from "./modals/ExperienceModal";
import CertificateModal from "./modals/CertificateModal";
import EducationModal from "./modals/EducationModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import {
  Skill,
  Experience,
  Certificate,
  Education,
} from "@/services/profile.service";
import profileService from "@/services/profile.service";
import {
  PersonalInfoContainer,
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserRole,
  UserDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  MainContent,
  ContentTabs,
  TabItem,
  TabContent,
  SectionHeader,
  SectionTitle,
  SectionAction,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  SkillsContainer,
  SkillCard,
  SkillCardHeader,
  SkillInfo,
  SkillTitle,
  SkillDescription,
  SkillMainTag,
  SkillActions,
  SkillActionButton,
  SkillDeleteButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  ExperienceContainer,
  ExperienceCard,
  ExperienceCardHeader,
  ExperienceInfo,
  ExperienceTitle,
  ExperienceCompany,
  ExperienceDate,
  ExperienceActions,
  ExperienceActionButton,
  ExperienceDeleteButton,
  CertificateContainer,
  CertificateCard,
  CertificateCardHeader,
  CertificateInfo,
  CertificateTitle,
  CertificateId,
  CertificateDate,
  CertificateActions,
  CertificateActionButton,
  CertificateDeleteButton,
  EducationContainer,
  EducationCard,
  EducationCardHeader,
  EducationInfo,
  EducationTitle,
  EducationMajor,
  EducationDescription,
  EducationDate,
  EducationActions,
  EducationActionButton,
  EducationDeleteButton,
} from "./personalInfoStyle";
import Image from "next/image";
import IMAGES from "@/config/images";
import { usePersonalInfo } from "./usePersonalInfo";


const PersonalInfo = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const { data, initPersonalInfo, refetch } = usePersonalInfo();
  // Modal states
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillsModalMode, setSkillsModalMode] = useState<"add" | "edit">("add");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceModalMode, setExperienceModalMode] = useState<
    "add" | "edit"
  >("add");
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] = useState(false);
  const [certificatesModalMode, setCertificatesModalMode] = useState<
    "add" | "edit"
  >("add");
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  // Education state
  const [educations, setEducations] = useState<Education[]>([]);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [educationModalMode, setEducationModalMode] = useState<"add" | "edit">(
    "add"
  );
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );

  // Delete confirm modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalType, setDeleteModalType] = useState<
    "skill" | "experience" | "certificate" | "education" | null
  >(null);
  const [itemToDelete, setItemToDelete] = useState<
    Skill | Experience | Certificate | Education | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleEditPersonalInfo = () => {
    setIsEditPersonalModalOpen(true);
  };


  // Skills handlers
  const handleAddSkill = () => {
    setSkillsModalMode("add");
    setSelectedSkill(null);
    setIsSkillsModalOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillsModalMode("edit");
    setSelectedSkill(skill);
    setIsSkillsModalOpen(true);
  };

  const handleDeleteSkill = (skill: Skill) => {
    setItemToDelete(skill);
    setDeleteModalType("skill");
    setIsDeleteModalOpen(true);
  };

  // Experience handlers
  const handleAddExperience = () => {
    setExperienceModalMode("add");
    setSelectedExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setExperienceModalMode("edit");
    setSelectedExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const handleDeleteExperience = (experience: Experience) => {
    setItemToDelete(experience);
    setDeleteModalType("experience");
    setIsDeleteModalOpen(true);
  };

  // Certificates handlers
  const handleAddCertificate = () => {
    setCertificatesModalMode("add");
    setSelectedCertificate(null);
    setIsCertificatesModalOpen(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setCertificatesModalMode("edit");
    setSelectedCertificate(certificate);
    setIsCertificatesModalOpen(true);
  };

  const handleDeleteCertificate = (certificate: Certificate) => {
    setItemToDelete(certificate);
    setDeleteModalType("certificate");
    setIsDeleteModalOpen(true);
  };

  // Education handlers
  const handleAddEducation = () => {
    setEducationModalMode("add");
    setSelectedEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEducationModalMode("edit");
    setSelectedEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleDeleteEducation = (education: Education) => {
    setItemToDelete(education);
    setDeleteModalType("education");
    setIsDeleteModalOpen(true);
  };

  // Save handlers for modals
  const handleSaveSkill = (skill: Skill) => {
    if (skillsModalMode === "add") {
      setSkills((prev) => [...prev, skill]);
    } else {
      setSkills((prev) => prev.map((s) => (s.id === skill.id ? skill : s)));
    }
  };

  const handleSaveExperience = (experience: Experience) => {
    if (experienceModalMode === "add") {
      setExperiences((prev) => [...prev, experience]);
    } else {
      setExperiences((prev) =>
        prev.map((e) => (e.id === experience.id ? experience : e))
      );
    }
  };

  const handleSaveCertificate = (certificate: Certificate) => {
    if (certificatesModalMode === "add") {
      setCertificates((prev) => [...prev, certificate]);
    } else {
      setCertificates((prev) =>
        prev.map((c) => (c.id === certificate.id ? certificate : c))
      );
    }
  };

  const handleSaveEducation = (education: Education) => {
    if (educationModalMode === "add") {
      setEducations((prev) => [...prev, education]);
    } else {
      setEducations((prev) =>
        prev.map((e) => (e.id === education.id ? education : e))
      );
    }
  };

  // Delete confirm handlers
  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteModalType) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      switch (deleteModalType) {
        case "skill":
          if (itemToDelete && "skill" in itemToDelete) {
            await profileService.deleteSkills(itemToDelete.id!.toString());
            setSkills((prev) => prev.filter((s) => s.id !== itemToDelete.id));
          }
          break;
        case "experience":
          if (itemToDelete && "job_title" in itemToDelete) {
            await profileService.deleteExperience(itemToDelete.id!.toString());
            setExperiences((prev) =>
              prev.filter((e) => e.id !== itemToDelete.id)
            );
          }
          break;
        case "certificate":
          if (itemToDelete && "certificate_id" in itemToDelete) {
            await profileService.deleteCertificates(
              itemToDelete.id!.toString()
            );
            setCertificates((prev) =>
              prev.filter((c) => c.id !== itemToDelete.id)
            );
          }
          break;
        case "education":
          if (itemToDelete && "major" in itemToDelete) {
            await profileService.deleteEducation(itemToDelete.id!.toString());
            setEducations((prev) =>
              prev.filter((e) => e.id !== itemToDelete.id)
            );
          }
          break;
      }

      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting item:", error);
      setDeleteError("Có lỗi xảy ra khi xóa. Vui lòng thử lại sau.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClose = () => {
    setDeleteError("");
    setIsDeleting(false);
    setItemToDelete(null);
    setDeleteModalType(null);
    setIsDeleteModalOpen(false);
  };

  // Helper functions for delete modal
  const getDeleteModalTitle = () => {
    switch (deleteModalType) {
      case "skill":
        return "Xóa kỹ năng";
      case "experience":
        return "Xóa kinh nghiệm";
      case "certificate":
        return "Xóa chứng chỉ";
      case "education":
        return "Xóa học vấn";
      default:
        return "Xóa mục";
    }
  };

  const getDeleteModalMessage = () => {
    switch (deleteModalType) {
      case "skill":
        return "Bạn có chắc chắn muốn xóa kỹ năng này?";
      case "experience":
        return "Bạn có chắc chắn muốn xóa kinh nghiệm này?";
      case "certificate":
        return "Bạn có chắc chắn muốn xóa chứng chỉ này?";
      case "education":
        return "Bạn có chắc chắn muốn xóa học vấn này?";
      default:
        return "Bạn có chắc chắn muốn xóa mục này?";
    }
  };

  const getItemName = () => {
    if (!itemToDelete) return "";

    switch (deleteModalType) {
      case "skill":
        if ("skill" in itemToDelete) {
          return itemToDelete.skill?.name || "Kỹ năng";
        }
        return "Kỹ năng";
      case "experience":
        if ("job_title" in itemToDelete) {
          return itemToDelete.job_title || "Kinh nghiệm";
        }
        return "Kinh nghiệm";
      case "certificate":
        return `Chứng chỉ #${itemToDelete.id}`;
      case "education":
        if ("name" in itemToDelete) {
          return itemToDelete.name || "Học vấn";
        }
        return "Học vấn";
      default:
        return "Mục này";
    }
  };

  // Load data from API
  useEffect(() => {
    if (data) {
      setSkills(data.user_skills || []);
      setExperiences(data.experience || []);
      setCertificates(data.user_certificates || []);
      setEducations(
        (data.education || []).map((edu) => ({
          ...edu,
          description: (edu as { description?: string }).description || "",
        }))
      );
    }
  }, [data]);

  return (
    <PersonalInfoContainer>
      <LeftSidebar>
        <UserProfile>
          <UserAvatar>
            <Image
              src={IMAGES.common.backgroundLogin}
              alt="User Avatar"
              width={120}
              height={120}
            />
          </UserAvatar>
          <UserName>{data?.user_information?.[0]?.name || data?.name}</UserName>
          <UserRole>{data?.user_information?.[0]?.expertise || "N/A"}</UserRole>
        </UserProfile>

        <UserDetails>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>
              {data?.user_information?.[0]?.email || data?.email}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Mã nhân viên</DetailLabel>
            <DetailValue>{data?.user_information?.[0]?.code || "N/A"}</DetailValue>
          </DetailItem>
          {/* <DetailItem>
            <DetailLabel>Người quản lý</DetailLabel>
            <DetailValue>
              <div>Không có</div>
            </DetailValue>
          </DetailItem> */}
        </UserDetails>
          <StatsGrid>
            <StatCard $color="#3b82f6">
              <StatNumber>
                {initPersonalInfo?.remaining_leave_days || 0}
              </StatNumber>
              <StatLabel>Số giờ phép còn lại</StatLabel>
            </StatCard>
          </StatsGrid>
        <StatsGrid>
          <StatCard $color="#6b7280">
            <StatNumber>0</StatNumber>
            <StatLabel>Số giờ đã nghỉ</StatLabel>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatNumber>0</StatNumber>
            <StatLabel>
              <Clock
                size={16}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Số giờ OT
            </StatLabel>
          </StatCard>
        </StatsGrid>

      </LeftSidebar>

      <MainContent>
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
            SKILL SHEET
          </TabItem>
        </ContentTabs>

        <TabContent>
          {activeTab === "basic" && (
            <>
              <SectionHeader>
                <SectionTitle>Thông tin cá nhân</SectionTitle>
                <SectionAction onClick={handleEditPersonalInfo}>
                  <Edit size={16} />
                </SectionAction>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Ngày sinh</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.birthday
                      ? new Date(
                          data.user_information?.[0]?.birthday
                        ).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Quốc tịch</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.nationality || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Giới tính</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.gender || "Không có"}
                  </InfoValue>
                </InfoItem>
                {/* <InfoItem>
                  <InfoLabel>Trạng thái tài khoản</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.status || "Không có"}
                  </InfoValue>
                </InfoItem> */}
                <InfoItem>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.phone || "Không có"}
                  </InfoValue>
                </InfoItem>
                {/* <InfoItem>
                  <InfoLabel>Loại nhân sự</InfoLabel>
                  <InfoValue>Chính thức</InfoValue>
                </InfoItem> */}
                <InfoItem>
                  <InfoLabel>Tình trạng hôn nhân</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.marital || "Chưa kết hôn"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Phòng ban (Nhóm)</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.office_id || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.temp_address || "Không có"}
                  </InfoValue>
                </InfoItem>
                {/* <InfoItem>
                  <InfoLabel>Loại hợp đồng</InfoLabel>
                  <InfoValue>Hợp đồng xác định thời hạn</InfoValue>
                </InfoItem> */}
                <InfoItem>
                  <InfoLabel>Địa chỉ thường trú</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.address || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email cá nhân</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.[0]?.personal_email || "Không có"}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </>
          )}

          {activeTab === "skills" && (
            <>
              {/* Skills Section */}
              <SectionHeader>
                <SectionTitle>
                  <Star size={20} />
                  Kỹ năng
                </SectionTitle>
                <SectionAction onClick={handleAddSkill}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <SkillsContainer>
                {skills.map((skill, index) => (
                  <SkillCard key={index}>
                    <SkillCardHeader>
                      <SkillInfo>
                        <SkillTitle>{skill.skill?.name}</SkillTitle>
                        <SkillDescription>
                          Kinh nghiệm: {skill.experience} năm{" "}
                          {skill.months_experience} tháng
                        </SkillDescription>
                        {skill.is_main && (
                          <SkillMainTag>Kỹ năng chính</SkillMainTag>
                        )}
                      </SkillInfo>
                      <SkillActions>
                        <SkillActionButton onClick={() => handleEditSkill(skill)}>
                          <Edit size={16} />
                        </SkillActionButton>
                        <SkillDeleteButton onClick={() => handleDeleteSkill(skill)}>
                          <Trash2 size={16} />
                        </SkillDeleteButton>
                      </SkillActions>
                    </SkillCardHeader>
                  </SkillCard>
                ))}
                {skills.length === 0 && (
                  <EmptyState>
                    <EmptyStateIcon>
                      <Star size={48} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có kỹ năng nào</EmptyStateTitle>
                    <EmptyStateDescription>
                      Nhấn nút + để thêm kỹ năng mới
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </SkillsContainer>

              {/* Experience Section */}
              <SectionHeader>
                <SectionTitle>
                  <Briefcase size={20} />
                  Kinh nghiệm làm việc
                </SectionTitle>
                <SectionAction onClick={handleAddExperience}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <ExperienceContainer>
                {experiences.map((exp, index) => (
                  <ExperienceCard key={index}>
                    <ExperienceCardHeader>
                      <ExperienceInfo>
                        <ExperienceTitle>{exp.job_title}</ExperienceTitle>
                        <ExperienceCompany>{exp.company}</ExperienceCompany>
                        <ExperienceDate>
                          {new Date(exp.start_date).toLocaleDateString("vi-VN")}{" "}
                          - {new Date(exp.end_date).toLocaleDateString("vi-VN")}
                        </ExperienceDate>
                      </ExperienceInfo>
                      <ExperienceActions>
                        <ExperienceActionButton onClick={() => handleEditExperience(exp)}>
                          <Edit size={16} />
                        </ExperienceActionButton>
                        <ExperienceDeleteButton onClick={() => handleDeleteExperience(exp)}>
                          <Trash2 size={16} />
                        </ExperienceDeleteButton>
                      </ExperienceActions>
                    </ExperienceCardHeader>
                  </ExperienceCard>
                ))}
                {experiences.length === 0 && (
                  <EmptyState>
                    <EmptyStateIcon>
                      <Briefcase size={48} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có kinh nghiệm nào</EmptyStateTitle>
                    <EmptyStateDescription>
                      Nhấn nút + để thêm kinh nghiệm mới
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </ExperienceContainer>

              {/* Certificates Section */}
              <SectionHeader>
                <SectionTitle>
                  <Award size={20} />
                  Chứng chỉ
                </SectionTitle>
                <SectionAction onClick={handleAddCertificate}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <CertificateContainer>
                {certificates.map((cert, index) => (
                  <CertificateCard key={index}>
                    <CertificateCardHeader>
                      <CertificateInfo>
                        <CertificateTitle>Chứng chỉ {cert.name}</CertificateTitle>
                        <CertificateId>Tổ chức cấp: {cert.authority}</CertificateId>
                        <CertificateDate>
                          Cấp ngày: {new Date(cert.issued_at).toLocaleDateString("vi-VN")}
                        </CertificateDate>
                      </CertificateInfo>
                      <CertificateActions>
                        <CertificateActionButton onClick={() => handleEditCertificate(cert)}>
                          <Edit size={16} />
                        </CertificateActionButton>
                        <CertificateDeleteButton onClick={() => handleDeleteCertificate(cert)}>
                          <Trash2 size={16} />
                        </CertificateDeleteButton>
                      </CertificateActions>
                    </CertificateCardHeader>
                  </CertificateCard>
                ))}
                {certificates.length === 0 && (
                  <EmptyState>
                    <EmptyStateIcon>
                      <Award size={48} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có chứng chỉ nào</EmptyStateTitle>
                    <EmptyStateDescription>
                      Nhấn nút + để thêm chứng chỉ mới
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </CertificateContainer>

              {/* Education Section */}
              <SectionHeader>
                <SectionTitle>
                  <GraduationCap size={20} />
                  Học vấn
                </SectionTitle>
                <SectionAction onClick={handleAddEducation}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <EducationContainer>
                {educations.map((edu, index) => (
                  <EducationCard key={index}>
                    <EducationCardHeader>
                      <EducationInfo>
                        <EducationTitle>{edu.name}</EducationTitle>
                        <EducationMajor>{edu.major}</EducationMajor>
                        <EducationDescription>{edu.description}</EducationDescription>
                        <EducationDate>
                          {new Date(edu.start_date).toLocaleDateString("vi-VN")}{" "}
                          - {new Date(edu.end_date).toLocaleDateString("vi-VN")}
                        </EducationDate>
                      </EducationInfo>
                      <EducationActions>
                        <EducationActionButton onClick={() => handleEditEducation(edu)}>
                          <Edit size={16} />
                        </EducationActionButton>
                        <EducationDeleteButton onClick={() => handleDeleteEducation(edu)}>
                          <Trash2 size={16} />
                        </EducationDeleteButton>
                      </EducationActions>
                    </EducationCardHeader>
                  </EducationCard>
                ))}
                {educations.length === 0 && (
                  <EmptyState>
                    <EmptyStateIcon>
                      <GraduationCap size={48} />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Chưa có học vấn nào</EmptyStateTitle>
                    <EmptyStateDescription>
                      Nhấn nút + để thêm học vấn mới
                    </EmptyStateDescription>
                  </EmptyState>
                )}
              </EducationContainer>
            </>
          )}
        </TabContent>
      </MainContent>

      <EditPersonalInfoModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => {
          refetch();
          setIsEditPersonalModalOpen(false);
        }}
        initialData={data?.user_information?.[0] ? {
          birthDate: data.user_information[0].birthday ? new Date(data.user_information[0].birthday).toLocaleDateString("vi-VN") : "",
          nationality: data.user_information[0].nationality || "",
          gender: data.user_information[0].gender || "",
          phone: data.user_information[0].phone || "",
          maritalStatus: data.user_information[0].marital || "",
          temporaryAddress: data.user_information[0].temp_address || "",
          permanentAddress: data.user_information[0].address || "",
          personalEmail: data.user_information[0].personal_email || "",
          expertise: data.user_information[0].expertise || "",
        } : undefined}
      />


      {/* Skills Modal */}
      <SkillModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        mode={skillsModalMode}
        initialData={selectedSkill}
        onSave={handleSaveSkill}
      />

      {/* Experience Modal */}
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        mode={experienceModalMode}
        initialData={selectedExperience}
        onSave={handleSaveExperience}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificatesModalOpen}
        onClose={() => setIsCertificatesModalOpen(false)}
        mode={certificatesModalMode}
        initialData={selectedCertificate}
        onSave={handleSaveCertificate}
      />

      {/* Education Modal */}
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        mode={educationModalMode}
        initialData={selectedEducation}
        onSave={handleSaveEducation}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title={getDeleteModalTitle()}
        message={getDeleteModalMessage()}
        itemName={getItemName()}
        isLoading={isDeleting}
        error={deleteError}
      />
    </PersonalInfoContainer>
  );
};

export default PersonalInfo;
