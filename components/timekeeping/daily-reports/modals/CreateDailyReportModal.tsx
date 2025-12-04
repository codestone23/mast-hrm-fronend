"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Input, Button, Select, DatePicker, TextArea } from "@/components/common";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  CancelButton,
  SaveButton,
} from "@/components/hr/asset/modals/modalStyle";
import reportService from "@/services/report.service";
import projectService from "@/services/project.service";
import { DailyReportCreateRequest, DailyReportUpdateRequest } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";

interface CreateDailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  reportId?: number;
  report?: {
    project_id: number;
    work_date: string;
    actual_time: number;
    title: string;
    description: string;
  };
}

const CreateDailyReportModal: React.FC<CreateDailyReportModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  reportId,
  report,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const isEdit = !!reportId && !!report;

  const [formData, setFormData] = useState<DailyReportCreateRequest>({
    project_id: 0,
    work_date: selectedDate || "",
    actual_time: 0,
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");

  // Get existing reports for the selected date to check total hours
  const { data: existingReportsData } = useQuery({
    queryKey: ["daily-reports", "my", { start_date: formData.work_date, end_date: formData.work_date }],
    queryFn: () => reportService.getMyReports({
      start_date: formData.work_date,
      end_date: formData.work_date,
    }),
    enabled: isOpen && !!formData.work_date && !isEdit,
  });

  const existingReports = existingReportsData?.data || [];
  const totalHoursForDay = useMemo(() => {
    if (isEdit) {
      // When editing, exclude current report from total
      return existingReports
        .filter(r => r.id !== reportId)
        .reduce((sum, r) => sum + r.actual_time, 0);
    }
    return existingReports.reduce((sum, r) => sum + r.actual_time, 0);
  }, [existingReports, isEdit, reportId]);

  const maxAvailableHours = 8 - totalHoursForDay;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectSearch(projectSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [projectSearchTerm]);

  const {
    data: projectsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["my-projects", debouncedProjectSearch],
    queryFn: ({ pageParam = 1 }) =>
      projectService.getMyProjects(pageParam, debouncedProjectSearch || undefined),
    enabled: isOpen,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const projects = useMemo(
    () => projectsData?.pages.flatMap((page) => page.data || []) || [],
    [projectsData]
  );

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: String(project.id),
        label: project.name,
      })),
    [projects]
  );

  // Generate actual_time options (0, 0.5, 1, 1.5, ..., 8)
  const actualTimeOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i <= 16; i++) {
      const value = i * 0.5;
      options.push({
        value: String(value),
        label: `${value} giờ`,
      });
    }
    return options;
  }, []);

  // Filter actual_time options based on max available hours
  const availableTimeOptions = useMemo(() => {
    if (isEdit) {
      return actualTimeOptions;
    }
    return actualTimeOptions.filter(
      (option) => parseFloat(option.value) <= maxAvailableHours
    );
  }, [actualTimeOptions, maxAvailableHours, isEdit]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && report) {
        setFormData({
          project_id: report.project_id,
          work_date: report.work_date.split('T')[0],
          actual_time: report.actual_time,
          title: report.title,
          description: report.description,
        });
      } else {
        setFormData({
          project_id: 0,
          work_date: selectedDate || "",
          actual_time: 0,
          title: "",
          description: "",
        });
      }
      setErrors({});
      setProjectSearchTerm("");
      setDebouncedProjectSearch("");
    }
  }, [isOpen, isEdit, report, selectedDate]);

  const createMutation = useMutation({
    mutationFn: (data: DailyReportCreateRequest) => reportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Tạo báo cáo thành công");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể tạo báo cáo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DailyReportUpdateRequest) => {
      if (!reportId) throw new Error("Report ID is required");
      return reportService.updateReport(reportId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Cập nhật báo cáo thành công");
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể cập nhật báo cáo");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.project_id || formData.project_id === 0) {
      newErrors.project_id = "Vui lòng chọn dự án";
    }

    if (!formData.work_date) {
      newErrors.work_date = "Vui lòng chọn ngày";
    }

    if (formData.actual_time <= 0) {
      newErrors.actual_time = "Vui lòng chọn số giờ làm việc";
    }

    if (!isEdit && totalHoursForDay + formData.actual_time > 8) {
      newErrors.actual_time = `Tổng số giờ trong ngày không được vượt quá 8 giờ. Còn lại: ${maxAvailableHours.toFixed(1)} giờ`;
    }

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch {
      // Error handling is done in mutation
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{isEdit ? "Chỉnh sửa báo cáo" : "Tạo báo cáo mới"}</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>
                Dự án <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Select
                options={projectOptions}
                value={formData.project_id ? String(formData.project_id) : ""}
                onChange={(value) => {
                  setFormData({ ...formData, project_id: value ? Number(value) : 0 });
                  if (errors.project_id) {
                    setErrors({ ...errors, project_id: "" });
                  }
                }}
                placeholder="Chọn dự án"
                fullWidth
                searchable={true}
                onSearchChange={setProjectSearchTerm}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                loadingText="Đang tải thêm dự án..."
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              {errors.project_id && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.project_id}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <DatePicker
                label="Ngày làm việc"
                value={parseDateFromAPI(formData.work_date)}
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    work_date: date ? formatDateForAPI(date) : "",
                  });
                  if (errors.work_date) {
                    setErrors({ ...errors, work_date: "" });
                  }
                }}
                placeholder="Chọn ngày"
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              {errors.work_date && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.work_date}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>
                Số giờ làm việc <span style={{ color: "#ef4444" }}>*</span>
                {!isEdit && maxAvailableHours < 8 && (
                  <span style={{ color: "#6b7280", fontSize: "12px", marginLeft: "8px" }}>
                    (Còn lại: {maxAvailableHours.toFixed(1)} giờ)
                  </span>
                )}
              </FormLabel>
              <Select
                options={availableTimeOptions}
                value={String(formData.actual_time)}
                onChange={(value) => {
                  setFormData({ ...formData, actual_time: value ? parseFloat(value) : 0 });
                  if (errors.actual_time) {
                    setErrors({ ...errors, actual_time: "" });
                  }
                }}
                placeholder="Chọn số giờ"
                fullWidth
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              {errors.actual_time && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.actual_time}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>
                Tiêu đề <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                placeholder="Nhập tiêu đề báo cáo"
                error={errors.title}
                fullWidth
                disabled={createMutation.isPending || updateMutation.isPending}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                Mô tả <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <TextArea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                placeholder="Nhập mô tả công việc đã làm..."
                rows={4}
                error={errors.description}
                fullWidth
                disabled={createMutation.isPending || updateMutation.isPending}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Hủy
            </CancelButton>
            <SaveButton
              type="button"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Đang xử lý..."
                : isEdit
                ? "Cập nhật"
                : "Tạo báo cáo"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateDailyReportModal;
