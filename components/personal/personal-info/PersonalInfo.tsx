import React, { useState, useEffect, useRef } from "react";
import EditPersonalInfoModal from "./EditPersonalInfoModal";
import SkillModal from "./modals/SkillModal";
import ExperienceModal from "./modals/ExperienceModal";
import CertificateModal from "./modals/CertificateModal";
import EducationModal from "./modals/EducationModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import PersonalInfoSidebar from "./PersonalInfoSidebar";
import BasicInfoTab from "./BasicInfoTab";
import SkillsTab from "./SkillsTab";
import {
    Skill,
    Experience,
    Certificate,
    Education,
} from "@/services/profile.service";
import profileService from "@/services/profile.service";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/useToast";
import {
    PersonalInfoContainer,
    MainContent,
    ContentTabs,
    TabItem,
    TabContent,
} from "./personalInfoStyle";
import { usePersonalInfo } from "./usePersonalInfo";

const PersonalInfo = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, initPersonalInfo, refetch } = usePersonalInfo();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const { uploadAvatar, isUploading } = useImageUpload({
        onSuccess: () => {
            showSuccessToast("Avatar đã được cập nhật thành công!", "Thành công");
            refetch();
        },
        onError: (error) => {
            showErrorToast(error, "Lỗi upload");
        },
    });

    // Avatar states
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Modal states
    const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] =
        useState(false);

    // Skills state
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [skillsModalMode, setSkillsModalMode] = useState<"add" | "edit">(
        "add"
    );
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
    const [isCertificatesModalOpen, setIsCertificatesModalOpen] =
        useState(false);
    const [certificatesModalMode, setCertificatesModalMode] = useState<
        "add" | "edit"
    >("add");
    const [selectedCertificate, setSelectedCertificate] =
        useState<Certificate | null>(null);

    // Education state
    const [educations, setEducations] = useState<Education[]>([]);
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [educationModalMode, setEducationModalMode] = useState<
        "add" | "edit"
    >("add");
    const [selectedEducation, setSelectedEducation] =
        useState<Education | null>(null);

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

    // Avatar handlers
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAvatar(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
            setSkills((prev) =>
                prev.map((s) => (s.id === skill.id ? skill : s))
            );
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
                        await profileService.deleteSkills(
                            itemToDelete.id!.toString()
                        );
                        setSkills((prev) =>
                            prev.filter((s) => s.id !== itemToDelete.id)
                        );
                    }
                    break;
                case "experience":
                    if (itemToDelete && "job_title" in itemToDelete) {
                        await profileService.deleteExperience(
                            itemToDelete.id!.toString()
                        );
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
                        await profileService.deleteEducation(
                            itemToDelete.id!.toString()
                        );
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

    useEffect(() => {
        if (data) {
            setSkills(data.user_skills || []);
            setExperiences(data.experience || []);
            setCertificates(data.user_certificates || []);
            setEducations(
                (data.education || []).map((edu) => ({
                    ...edu,
                    description:
                        (edu as { description?: string }).description || "",
                }))
            );
            setAvatarUrl(data.user_information?.avatar || null);
        }
    }, [data]);

    return (
        <PersonalInfoContainer>
            <PersonalInfoSidebar
                data={data}
                avatarUrl={avatarUrl}
                isUploading={isUploading}
                onAvatarClick={handleAvatarClick}
                onAvatarChange={handleAvatarChange}
                fileInputRef={fileInputRef}
                initPersonalInfo={initPersonalInfo}
            />

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
                        <BasicInfoTab data={data} onEdit={handleEditPersonalInfo} />
                    )}

                    {activeTab === "skills" && (
                        <SkillsTab
                            skills={skills}
                            experiences={experiences}
                            certificates={certificates}
                            educations={educations}
                            onAddSkill={handleAddSkill}
                            onEditSkill={handleEditSkill}
                            onDeleteSkill={handleDeleteSkill}
                            onAddExperience={handleAddExperience}
                            onEditExperience={handleEditExperience}
                            onDeleteExperience={handleDeleteExperience}
                            onAddCertificate={handleAddCertificate}
                            onEditCertificate={handleEditCertificate}
                            onDeleteCertificate={handleDeleteCertificate}
                            onAddEducation={handleAddEducation}
                            onEditEducation={handleEditEducation}
                            onDeleteEducation={handleDeleteEducation}
                        />
                    )}
                </TabContent>
            </MainContent>

            <EditPersonalInfoModal
                isOpen={isEditPersonalModalOpen}
                onClose={() => {
                    refetch();
                    setIsEditPersonalModalOpen(false);
                }}
                initialData={
                    data?.user_information
                        ? {
                              birthDate: data.user_information.birthday
                                  ? new Date(
                                        data.user_information.birthday
                                    ).toLocaleDateString("vi-VN")
                                  : "",
                              nationality:
                                  data.user_information.nationality || "",
                              gender: data.user_information.gender || "",
                              phone: data.user_information.phone || "",
                              maritalStatus:
                                  data.user_information.marital || "",
                              temporaryAddress:
                                  data.user_information.temp_address || "",
                              permanentAddress:
                                  data.user_information.address || "",
                              personalEmail:
                                  data.user_information.personal_email || "",
                              expertise: data.user_information.expertise || "",
                          }
                        : undefined
                }
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
