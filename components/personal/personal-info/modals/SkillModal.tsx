import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
    skill_id: "",
    experience: "",
    months_experience: "",
    is_main: false,
  });
  const [error, setError] = useState("");
  const { success: showSuccessToast } = useToast();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error: queryError,
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

  const availableSkills = data?.pages.flatMap(page => page.data) || [];

  useEffect(() => {
    if (isOpen) {
      resetState();
      if (mode === "edit" && initialData) {
        setFormData({
          skill_id: initialData.skill_id.toString(),
          experience: initialData.experience.toString(),
          months_experience: initialData.months_experience.toString(),
          is_main: initialData.is_main,
        });
      } else {
        setFormData({
          skill_id: "",
          experience: "",
          months_experience: "",
          is_main: false,
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const resetState = () => {
    setError("");
  };



  const handleSubmit = async () => {
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
    isFetching || !formData.skill_id || !formData.experience;

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
          <Button variant="ghost" onClick={handleClose} disabled={isFetching}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isFetching}
            disabled={isSubmitDisabled}
          >
            {mode === "add" ? "Thêm" : "Cập nhật"}
          </Button>
        </>
      }
    >
      <ModalContent>
        {(error || queryError) && <ErrorMessage>{error || "Không thể tải danh sách kỹ năng"}</ErrorMessage>}

        <FormSection>
          <h4>Thông tin kỹ năng</h4>
          <FormGrid>
            <Select
              label="Kỹ năng"
              value={formData.skill_id}
              onChange={(value: string | number) => {
                handleInputChange("skill_id", value.toString())
              }}
              options={availableSkills.map((skill) => ({
                value: skill.id.toString(),
                label: skill.name,
              }))}
              required
              disabled={isLoading}
              placeholder="Chọn kỹ năng..."
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              loadingText="Đang tải thêm kỹ năng..."
            />

            <Select
              label="Số năm kinh nghiệm"
              value={formData.experience}
              onChange={(value: string | number) => {
                handleInputChange("experience", value.toString())
              }}
              options={yearOptions}
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
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
