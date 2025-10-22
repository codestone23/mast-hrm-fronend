import React, { useState, useEffect } from "react";
import { Modal, Button, Input, TextArea } from "@/components/common";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
} from "./projectModalStyles";
import { Project } from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Project | null;
  onSave: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    team_size: "",
    client: "",
    manager: "",
  });
  const [error, setError] = useState("");
  const { createProject, updateProject, isPending } = useProjectMutation();

  useEffect(() => {
    if (isOpen) {
      resetState();
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description,
          team_size: initialData.team_size.toString(),
          client: initialData.client,
          manager: initialData.manager,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          team_size: "",
          client: "",
          manager: "",
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const resetState = () => {
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên dự án");
      return;
    }
    if (!formData.description.trim()) {
      setError("Vui lòng nhập mô tả dự án");
      return;
    }
    if (!formData.team_size || parseInt(formData.team_size) <= 0) {
      setError("Vui lòng nhập số thành viên hợp lệ");
      return;
    }
    if (!formData.client.trim()) {
      setError("Vui lòng nhập tên khách hàng");
      return;
    }
    if (!formData.manager.trim()) {
      setError("Vui lòng nhập tên quản lý");
      return;
    }

    setError("");

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        team_size: parseInt(formData.team_size),
        client: formData.client.trim(),
        manager: formData.manager.trim(),
      };

      if (mode === "add") {
        createProject(projectData, {
          onSuccess: (response) => {
            onSave(response);
            handleClose();
          },
        });
      } else {
        updateProject(
          { id: initialData?.id || "", data: projectData },
          {
            onSuccess: (response) => {
              onSave(response);
              handleClose();
            },
          }
        );
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSubmitDisabled = isPending || !formData.name.trim() || !formData.description.trim() || 
    !formData.team_size || !formData.client.trim() || !formData.manager.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? "Thêm dự án mới" : "Chỉnh sửa dự án"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isPending}
            disabled={isSubmitDisabled}
          >
            {mode === "add" ? "Thêm" : "Cập nhật"}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormSection>
          <h4>Thông tin dự án</h4>
          <FormGrid>
            <Input
              label="Tên dự án"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên dự án..."
              required
              disabled={isPending}
            />

            <TextArea
              label="Mô tả dự án"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả dự án..."
              required
              disabled={isPending}
              rows={3}
            />

            <Input
              label="Số thành viên"
              type="number"
              value={formData.team_size}
              onChange={(e) => handleInputChange("team_size", e.target.value)}
              placeholder="Nhập số thành viên..."
              required
              disabled={isPending}
              min="1"
            />

            <Input
              label="Khách hàng"
              value={formData.client}
              onChange={(e) => handleInputChange("client", e.target.value)}
              placeholder="Nhập tên khách hàng..."
              required
              disabled={isPending}
            />

            <Input
              label="Quản lý dự án"
              value={formData.manager}
              onChange={(e) => handleInputChange("manager", e.target.value)}
              placeholder="Nhập tên quản lý..."
              required
              disabled={isPending}
            />
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;
