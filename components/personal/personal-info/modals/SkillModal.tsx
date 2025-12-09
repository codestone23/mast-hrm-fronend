import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
} from "../personalInfoModalStyles";
import profileService, { Skill, PositionsResponse } from "@/services/profile.service";
import { useToast } from "@/hooks/useToast";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Skill | null;
  onSave: (skill: Skill) => void;
}



const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    position_id: "",
    skill_id: "",
    experience: "",
    months_experience: "",
    is_main: false,
  });
  const [error, setError] = useState("");
  const { success: showSuccessToast } = useToast();

  // Fetch positions
  const {
    data: positionsData,
    fetchNextPage: fetchNextPositionPage,
    hasNextPage: hasNextPositionPage,
    isFetching: isFetchingPositions,
    isFetchingNextPage: isFetchingNextPositionPage,
    isLoading: isLoadingPositions,
    error: positionsError,
  } = useInfiniteQuery<PositionsResponse, Error>({
    queryKey: ['positions'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await profileService.getPositions(pageParam as number);
      return response as PositionsResponse;
    },
    getNextPageParam: (lastPage: PositionsResponse) => {
      return lastPage.pagination?.has_next_page 
        ? lastPage.pagination.current_page + 1 
        : undefined;
    },
    initialPageParam: 1,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const availablePositions = positionsData?.pages.flatMap(page => page.data) || [];

  // Fetch skills by position ID
  const {
    data: skillsData,
    isLoading: isLoadingSkills,
    error: skillsError,
  } = useQuery<Skill[], Error>({
    queryKey: ['skills-by-position', formData.position_id],
    queryFn: () => profileService.getSkillByPositionId(formData.position_id),
    enabled: !!formData.position_id && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(skillsData);

  const availableSkills = skillsData || [];

  useEffect(() => {
    if (isOpen) {
      resetState();
      if (mode === "edit" && initialData) {
        setFormData({
          position_id: "",
          skill_id: initialData.skill_id.toString(),
          experience: initialData.experience.toString(),
          months_experience: initialData.months_experience.toString(),
          is_main: initialData.is_main,
        });
      } else {
        setFormData({
          position_id: "",
          skill_id: "",
          experience: "",
          months_experience: "",
          is_main: false,
        });
      }
    }
  }, [isOpen, mode, initialData]);

  // Reset skill_id when position changes
  useEffect(() => {
    if (formData.position_id) {
      setFormData((prev) => ({
        ...prev,
        skill_id: "",
      }));
    }
  }, [formData.position_id]);

  const resetState = () => {
    setError("");
  };



  const handleSubmit = async () => {
    if (!formData.position_id) {
      setError("Vui lòng chọn vị trí");
      return;
    }
    if (!formData.skill_id) {
      setError("Vui lòng chọn kỹ năng");
      return;
    }
    if (!formData.experience) {
      setError("Vui lòng chọn số năm kinh nghiệm");
      return;
    }

    setError("");

    try {
      const skillData = {
        skill_id: parseInt(formData.skill_id),
        experience: parseInt(formData.experience),
        months_experience: parseInt(formData.months_experience),
        is_main: formData.is_main,
      };

      if (mode === "add") {
        const response = await profileService.addSkills(skillData);
        onSave(response);
        showSuccessToast("Kỹ năng đã được thêm thành công!");
      } else {
        const response = await profileService.updateSkillsById(
          (initialData?.id || 0).toString(),
          skillData
        );
        onSave(response);
        showSuccessToast("Kỹ năng đã được cập nhật thành công!");
      }

      handleClose();
    } catch (error) {
      console.error("Error saving skill:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSubmitDisabled =
    isFetchingPositions || isLoadingSkills || !formData.position_id || !formData.skill_id || !formData.experience;

  // Generate options for years (0-30)
  const yearOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i.toString(),
    label: `${i} năm`,
  }));

  // Generate options for months (0-12)
  const monthOptions = Array.from({ length: 13 }, (_, i) => ({
    value: i.toString(),
    label: `${i} tháng`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? "Thêm kỹ năng mới" : "Chỉnh sửa kỹ năng"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isFetchingPositions || isLoadingSkills}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isFetchingPositions || isLoadingSkills}
            disabled={isSubmitDisabled}
          >
            {mode === "add" ? "Thêm" : "Cập nhật"}
          </Button>
        </>
      }
    >
      <ModalContent>
        {(error || positionsError || skillsError) && (
          <ErrorMessage>
            {error || positionsError?.message || skillsError?.message || "Không thể tải dữ liệu"}
          </ErrorMessage>
        )}

        <FormSection>
          <h4>Thông tin kỹ năng</h4>
          <FormGrid>
            <Select
              label="Vị trí"
              value={formData.position_id}
              onChange={(value: string | number) => {
                handleInputChange("position_id", value.toString())
              }}
              options={availablePositions.map((position) => ({
                value: position.id.toString(),
                label: position.name,
              }))}
              required
              disabled={isLoadingPositions}
              placeholder="Chọn vị trí..."
              hasNextPage={hasNextPositionPage}
              isFetchingNextPage={isFetchingNextPositionPage}
              fetchNextPage={fetchNextPositionPage}
              loadingText="Đang tải thêm vị trí..."
            />

            <Select
              label="Kỹ năng"
              value={formData.skill_id}
              onChange={(value: string | number) => {
                handleInputChange("skill_id", value.toString())
              }}
              options={availableSkills.map((skill) => ({
                value: skill.id?.toString() || "",
                label: skill?.name || "",
              })).filter(option => option.value && option.label)}
              required
              disabled={isLoadingSkills || !formData.position_id}
              placeholder={formData.position_id ? "Chọn kỹ năng..." : "Vui lòng chọn vị trí trước"}
            />

            <Select
              label="Số năm kinh nghiệm"
              value={formData.experience}
              onChange={(value: string | number) => {
                handleInputChange("experience", value.toString())
              }}
              options={yearOptions}
              required
              disabled={isLoadingPositions || isLoadingSkills}
              placeholder="Chọn số năm kinh nghiệm"
            />

            <Select
              label="Số tháng kinh nghiệm"
              value={formData.months_experience}
              onChange={(value: string | number) => {
                handleInputChange("months_experience", value.toString())
              }}
              options={monthOptions}
              required
              disabled={isLoadingPositions || isLoadingSkills}
              placeholder="Chọn số tháng kinh nghiệm"
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <input
                type="checkbox"
                id="is_main"
                checked={formData.is_main}
                onChange={(e) => handleInputChange("is_main", e.target.checked)}
                disabled={isLoadingPositions || isLoadingSkills}
              />
              <label
                htmlFor="is_main"
                style={{ fontSize: "14px", color: "#374151" }}
              >
                Kỹ năng chính
              </label>
            </div>

          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default SkillModal;
