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
import FamilyMemberModal from "./FamilyMemberModal";
import DeleteFamilyMemberModal from "./DeleteFamilyMemberModal";
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
  FamilyTable,
  TableHeader,
  TableRow,
  TableCell,
  ActionButtons,
  ActionButton,
} from "./personalInfoStyle";
import Image from "next/image";
import IMAGES from "@/config/images";
import { usePersonalInfo } from "./usePersonalInfo";

interface FamilyMemberData {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  birthDate: string;
  phone: string;
  dependent: string;
  notes: string;
}

const PersonalInfo = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const { data, initPersonalInfo } = usePersonalInfo();
  // Modal states
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isDeleteFamilyModalOpen, setIsDeleteFamilyModalOpen] = useState(false);
  const [familyModalMode, setFamilyModalMode] = useState<"add" | "edit">("add");
  const [selectedFamilyMember, setSelectedFamilyMember] =
    useState<FamilyMemberData | null>(null);

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);

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

  const handleAddFamilyMember = () => {
    setFamilyModalMode("add");
    setSelectedFamilyMember(null);
    setIsFamilyModalOpen(true);
  };

  const handleEditFamilyMember = (member: FamilyMemberData) => {
    setFamilyModalMode("edit");
    setSelectedFamilyMember(member);
    setIsFamilyModalOpen(true);
  };

  const handleDeleteFamilyMember = (member: FamilyMemberData) => {
    setSelectedFamilyMember(member);
    setIsDeleteFamilyModalOpen(true);
  };

  const handleSaveFamilyMember = (memberData: FamilyMemberData) => {
    if (familyModalMode === "add") {
      setFamilyMembers((prev) => [...prev, memberData]);
    } else {
      setFamilyMembers((prev) =>
        prev.map((member) =>
          member.id === memberData.id ? memberData : member
        )
      );
    }
  };

  const handleConfirmDeleteFamilyMember = () => {
    if (selectedFamilyMember) {
      setFamilyMembers((prev) =>
        prev.filter((member) => member.id !== selectedFamilyMember.id)
      );
    }
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
          <UserName>{data?.user_information?.name || data?.name}</UserName>
          <UserRole>{data?.user_information?.expertise || "N/A"}</UserRole>
        </UserProfile>

        <UserDetails>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>
              {data?.user_information?.email || data?.email}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Mã nhân viên</DetailLabel>
            <DetailValue>{data?.user_information?.code || "N/A"}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Người quản lý</DetailLabel>
            <DetailValue>
              <div>Không có</div>
            </DetailValue>
          </DetailItem>
        </UserDetails>

        <StatsGrid>
          <StatCard $color="#3b82f6">
            <StatNumber>
              {initPersonalInfo?.remaining_leave_days || 0}
            </StatNumber>
            <StatLabel>Số giờ phép còn lại</StatLabel>
          </StatCard>
          <StatCard $color="#6b7280">
            <StatNumber>0</StatNumber>
            <StatLabel>Số giờ đã nghỉ</StatLabel>
          </StatCard>
        </StatsGrid>

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
                    {data?.user_information?.birthday
                      ? new Date(
                          data.user_information.birthday
                        ).toLocaleDateString("vi-VN")
                      : "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Quốc tịch</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.nationality || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Giới tính</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.gender || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Trạng thái tài khoản</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.status || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.phone || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Loại nhân sự</InfoLabel>
                  <InfoValue>Chính thức</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Tình trạng hôn nhân</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.marital || "Chưa kết hôn"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Phòng ban (Nhóm)</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.office_id || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.temp_address || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Loại hợp đồng</InfoLabel>
                  <InfoValue>Hợp đồng xác định thời hạn</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ thường trú</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.address || "Không có"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email cá nhân</InfoLabel>
                  <InfoValue>
                    {data?.user_information?.personal_email || "Không có"}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>

              <SectionHeader>
                <SectionTitle>Thông tin thân nhân</SectionTitle>
                <SectionAction onClick={handleAddFamilyMember}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <FamilyTable>
                <TableHeader>
                  <div>Họ và tên</div>
                  <div>Mối quan hệ</div>
                  <div>Giới tính</div>
                  <div>Ngày sinh</div>
                  <div>Số điện thoại</div>
                  <div>Người phụ thuộc</div>
                  <div>Ghi nhận phụ thuộc</div>
                  <div></div>
                </TableHeader>

                {familyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell>{member.gender}</TableCell>
                    <TableCell>{member.birthDate}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.dependent}</TableCell>
                    <TableCell>{member.notes}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ActionButton
                          $type="edit"
                          onClick={() => handleEditFamilyMember(member)}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          $type="delete"
                          onClick={() => handleDeleteFamilyMember(member)}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </FamilyTable>
            </>
          )}

          {activeTab === "skills" && (
            <>
              {/* Skills Section */}
              <SectionHeader>
                <SectionTitle>
                  <Star size={20} style={{ marginRight: "8px" }} />
                  Kỹ năng
                </SectionTitle>
                <SectionAction onClick={handleAddSkill}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          {skill.skill?.name}
                        </h4>
                        <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
                          Kinh nghiệm: {skill.experience} năm{" "}
                          {skill.months_experience} tháng
                        </p>
                        {skill.is_main && (
                          <span
                            style={{
                              background: "#dbeafe",
                              color: "#1e40af",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            Kỹ năng chính
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditSkill(skill)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#6b7280",
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px dashed #d1d5db",
                    }}
                  >
                    <Star
                      size={48}
                      style={{ marginBottom: "16px", opacity: 0.5 }}
                    />
                    <p style={{ margin: "0", fontSize: "16px" }}>
                      Chưa có kỹ năng nào
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                      Nhấn nút + để thêm kỹ năng mới
                    </p>
                  </div>
                )}
              </div>

              {/* Experience Section */}
              <SectionHeader>
                <SectionTitle>
                  <Briefcase size={20} style={{ marginRight: "8px" }} />
                  Kinh nghiệm làm việc
                </SectionTitle>
                <SectionAction onClick={handleAddExperience}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          {exp.job_title}
                        </h4>
                        <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
                          {exp.company}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          {new Date(exp.start_date).toLocaleDateString("vi-VN")}{" "}
                          - {new Date(exp.end_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditExperience(exp)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#6b7280",
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px dashed #d1d5db",
                    }}
                  >
                    <Briefcase
                      size={48}
                      style={{ marginBottom: "16px", opacity: 0.5 }}
                    />
                    <p style={{ margin: "0", fontSize: "16px" }}>
                      Chưa có kinh nghiệm nào
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                      Nhấn nút + để thêm kinh nghiệm mới
                    </p>
                  </div>
                )}
              </div>

              {/* Certificates Section */}
              <SectionHeader>
                <SectionTitle>
                  <Award size={20} style={{ marginRight: "8px" }} />
                  Chứng chỉ
                </SectionTitle>
                <SectionAction onClick={handleAddCertificate}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          Chứng chỉ #{cert.id}
                        </h4>
                        <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
                          Certificate ID: {cert.certificate_id}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          Cấp ngày:{" "}
                          {new Date(cert.issued_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditCertificate(cert)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#6b7280",
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(cert)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px dashed #d1d5db",
                    }}
                  >
                    <Award
                      size={48}
                      style={{ marginBottom: "16px", opacity: 0.5 }}
                    />
                    <p style={{ margin: "0", fontSize: "16px" }}>
                      Chưa có chứng chỉ nào
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                      Nhấn nút + để thêm chứng chỉ mới
                    </p>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <SectionHeader>
                <SectionTitle>
                  <GraduationCap size={20} style={{ marginRight: "8px" }} />
                  Học vấn
                </SectionTitle>
                <SectionAction onClick={handleAddEducation}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {educations.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          {edu.name}
                        </h4>
                        <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
                          {edu.major}
                        </p>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          {edu.description}
                        </p>
                        <p
                          style={{
                            margin: "0",
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          {new Date(edu.start_date).toLocaleDateString("vi-VN")}{" "}
                          - {new Date(edu.end_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEditEducation(edu)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#6b7280",
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {educations.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px dashed #d1d5db",
                    }}
                  >
                    <GraduationCap
                      size={48}
                      style={{ marginBottom: "16px", opacity: 0.5 }}
                    />
                    <p style={{ margin: "0", fontSize: "16px" }}>
                      Chưa có học vấn nào
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                      Nhấn nút + để thêm học vấn mới
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </TabContent>
      </MainContent>

      <EditPersonalInfoModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => setIsEditPersonalModalOpen(false)}
      />

      <FamilyMemberModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        mode={familyModalMode}
        initialData={selectedFamilyMember ?? undefined}
        onSave={handleSaveFamilyMember}
      />

      <DeleteFamilyMemberModal
        isOpen={isDeleteFamilyModalOpen}
        onClose={() => setIsDeleteFamilyModalOpen(false)}
        memberName={selectedFamilyMember?.name || ""}
        onConfirm={handleConfirmDeleteFamilyMember}
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
