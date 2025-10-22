import React, { useState, useEffect } from "react";
import { Modal, Input, Button, DatePicker } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
} from "../personalInfoModalStyles";
import profileService, { Certificate } from "@/services/profile.service";
import { useToast } from "@/hooks/useToast";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Certificate | null;
  onSave: (certificate: Certificate) => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    authority: "",
    issued_at: "",
    start_date: "",
    type: "CERTIFICATE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { success: showSuccessToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData?.name ?? '',
          authority: initialData?.authority ?? '',
          issued_at: initialData.issued_at.split("T")[0],
          start_date: initialData.start_date.split("T")[0],
          type: initialData?.type ?? 'CERTIFICATE',
        });
      } else {
        setFormData({
          name: "",
          authority: "",
          issued_at: "",
          start_date: "",
          type: "CERTIFICATE",
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSubmit = async () => {
    if (!formData.name) {
      setError("Vui lòng nhập tên chứng chỉ");
      return;
    }
    if (!formData.authority) {
      setError("Vui lòng nhập tổ chức cấp");
      return;
    }
    if (!formData.issued_at) {
      setError("Vui lòng chọn ngày cấp");
      return;
    }
    if (!formData.start_date) {
      setError("Vui lòng chọn ngày bắt đầu hiệu lực");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const certificateData: Certificate = {
        name: formData.name,
        authority: formData.authority,
        issued_at: formData.issued_at,
        start_date: formData.start_date,
        type: formData.type,
        certificate_id: mode === "edit" ? initialData?.certificate_id || 1 : 1,
      };

      if (mode === "add") {
        const response = await profileService.addCertificates(certificateData);
        onSave(response);
        showSuccessToast("Chứng chỉ đã được thêm thành công!");
      } else {
        const response = await profileService.updateCertificatesById(
          (initialData?.id || 0).toString(),
          certificateData
        );
        onSave(response);
        showSuccessToast("Chứng chỉ đã được cập nhật thành công!");
      }

      handleClose();
    } catch (error) {
      console.error("Error saving certificate:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSubmitDisabled =
    isLoading ||
    !formData.name ||
    !formData.authority ||
    !formData.issued_at ||
    !formData.start_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? "Thêm chứng chỉ mới" : "Chỉnh sửa chứng chỉ"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
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
          <h4>Thông tin chứng chỉ</h4>
          <FormGrid>
            <Input
              label="Tên chứng chỉ"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ví dụ: AWS Certified Developer"
              required
              disabled={isLoading}
            />

            <Input
              label="Tổ chức cấp"
              value={formData.authority}
              onChange={(e) => handleInputChange("authority", e.target.value)}
              placeholder="Ví dụ: Amazon Web Services"
              required
              disabled={isLoading}
            />

              <DatePicker
                label="Ngày cấp"
                value={parseDateFromAPI(formData.issued_at)}
                onChange={(date) => handleInputChange("issued_at", formatDateForAPI(date))}
                required
                disabled={isLoading}
              />

              <DatePicker
                label="Ngày bắt đầu hiệu lực"
                value={parseDateFromAPI(formData.start_date)}
                onChange={(date) => handleInputChange("start_date", formatDateForAPI(date))}
                required
                disabled={isLoading}
              />
          </FormGrid>
        </FormSection>
      </ModalContent>
    </Modal>
  );
};

export default CertificateModal;
