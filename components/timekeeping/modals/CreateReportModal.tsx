"use client";

import React, { useState } from "react";
import { Link, Type, AlignLeft, CheckCircle } from "lucide-react";
import { Modal, Input, Button, Select, DatePicker } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage,
} from "./modalStyles";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ReportData) => void;
}

interface ReportData {
  id: string;
  title: string;
  type: string;
  link: string;
  workingHours: string;
  reportDate: string;
  description: string;
  date: string;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    link: "",
    workingHours: "",
    reportDate: new Date().toISOString().split("T")[0], // Default to today
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Generate working hours options from 0 minutes to 8 hours
  const generateWorkingHoursOptions = () => {
    const options = [];
    for (let totalMinutes = 0; totalMinutes <= 480; totalMinutes += 30) {
      // 480 minutes = 8 hours
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let label = "";
      if (totalMinutes === 0) {
        label = "0 phút";
      } else if (totalMinutes < 60) {
        label = `${minutes} phút`;
      } else if (minutes === 0) {
        label = `${hours} giờ`;
      } else {
        label = `${hours} giờ ${minutes} phút`;
      }

      options.push({
        value: totalMinutes.toString(),
        label: label,
      });
    }
    return options;
  };

  const workingHoursOptions = generateWorkingHoursOptions();

  const reportTypeOptions = [
    { value: "daily", label: "Báo cáo hàng ngày" },
    { value: "weekly", label: "Báo cáo hàng tuần" },
    { value: "monthly", label: "Báo cáo hàng tháng" },
    { value: "project", label: "Báo cáo dự án" },
    { value: "task", label: "Báo cáo công việc" },
    { value: "meeting", label: "Báo cáo họp" },
    { value: "other", label: "Khác" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      setError("Vui lòng nhập tiêu đề báo cáo");
      return;
    }
    if (!formData.type) {
      setError("Vui lòng chọn loại báo cáo");
      return;
    }
    if (!formData.workingHours) {
      setError("Vui lòng chọn thời gian làm việc");
      return;
    }
    if (!formData.reportDate) {
      setError("Vui lòng chọn ngày báo cáo");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const reportData: ReportData = {
        id: `report_${Date.now()}`,
        ...formData,
        date: formData.reportDate, // Use selected date instead of current date
      };

      setSuccess(true);
      if (onSave) {
        onSave(reportData);
      }

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      type: "",
      link: "",
      workingHours: "",
      reportDate: new Date().toISOString().split("T")[0], // Reset to today
      description: "",
    });
    setError("");
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const isSubmitDisabled =
    isLoading ||
    !formData.title ||
    !formData.type ||
    !formData.workingHours ||
    !formData.reportDate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo báo cáo công việc"
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
            Tạo báo cáo
          </Button>
        </>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>
            <CheckCircle size={24} style={{ marginRight: "0.5rem" }} />
            Báo cáo đã được tạo thành công!
          </SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormSection>
              <h4>Thông tin báo cáo</h4>
              <FormGrid>
                <Input
                  label="Tiêu đề báo cáo"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  icon={<Type size={16} />}
                  placeholder="Nhập tiêu đề báo cáo"
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Loại báo cáo"
                  value={formData.type}
                  onChange={(value) => handleInputChange("type", String(value))}
                  options={reportTypeOptions}
                  placeholder="Chọn loại báo cáo"
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <Input
                label="Link tài liệu (tùy chọn)"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                icon={<Link size={16} />}
                placeholder="https://example.com/document"
                disabled={isLoading}
              />
            </FormSection>

            <FormSection>
              <FormGrid>
                <DatePicker
                  label="Ngày báo cáo"
                  value={parseDateFromAPI(formData.reportDate)}
                  onChange={(date) => handleInputChange("reportDate", formatDateForAPI(date))}
                  required
                  disabled={isLoading}
                />

                <Select
                  label="Thời gian làm việc"
                  value={formData.workingHours}
                  onChange={(value) =>
                    handleInputChange("workingHours", String(value))
                  }
                  options={workingHoursOptions}
                  placeholder="Chọn thời gian làm việc"
                  required
                  disabled={isLoading}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <Input
                label="Mô tả công việc"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                icon={<AlignLeft size={16} />}
                placeholder="Mô tả chi tiết về công việc đã thực hiện..."
                disabled={isLoading}
                multiline
                rows={4}
              />
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateReportModal;
