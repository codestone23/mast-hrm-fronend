"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Input, TextArea, Select, DatePicker } from "@/components/common";
import { ProjectCreateRequest } from "@/services/project.service";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ProjectCritical, ProjectIndustry, ProjectStatus, ProjectType } from "@/constants/enums";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const projectTypeOptions = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'IN_HOUSE', label: 'Nội bộ' },
  { value: 'START_UP', label: 'Khởi nghiệp' },
  { value: 'INTERNAL', label: 'Nội bộ' },
];

const statusOptions = [
  { value: 'OPEN', label: 'Mở' },
  { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
  { value: 'PENDING', label: 'Tạm dừng' },
  { value: 'CLOSED', label: 'Đã đóng' },
];

const industryOptions = [
  { value: 'IT', label: 'Công nghệ thông tin' },
  { value: 'FINANCE', label: 'Tài chính' },
  { value: 'MANUFACTURING', label: 'Sản xuất' },
  { value: 'OTHER', label: 'Khác' },
];

const criticalOptions = [
  { value: 'Low', label: 'Thấp' },
  { value: 'Medium', label: 'Trung bình' },
  { value: 'High', label: 'Cao' },
  { value: 'Critical', label: 'Rất cao' },
];

const rankOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const selectedDivisionId = useSelector((state: RootState) => state.division.selectedDivisionId);
  const { createProject, isPending } = useProjectMutation();
  const [formData, setFormData] = useState<Partial<ProjectCreateRequest>>({
    name: '',
    code: '',
    status: 'OPEN',
    division_id: selectedDivisionId || 0,
    project_type: 'INTERNAL',
    rank: 1,
    industry: 'IT',
    scope: '',
    description: '',
    critical: 'Medium',
    start_date: '',
    end_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && selectedDivisionId) {
      setFormData(prev => ({
        ...prev,
        division_id: selectedDivisionId,
      }));
    }
  }, [isOpen, selectedDivisionId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên dự án là bắt buộc';
    }
    if (!formData.code?.trim()) {
      newErrors.code = 'Mã dự án là bắt buộc';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (!formData.scope?.trim()) {
      newErrors.scope = 'Phạm vi là bắt buộc';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Ngày bắt đầu là bắt buộc';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'Ngày kết thúc là bắt buộc';
    }
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    if (!formData.division_id) {
      newErrors.division_id = 'Phòng ban là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const payload: ProjectCreateRequest = {
      name: formData.name!,
      code: formData.code!,
      status: formData.status!,
      division_id: formData.division_id!,
      team_id: formData.team_id,
      project_type: formData.project_type!,
      rank: formData.rank!,
      industry: formData.industry!,
      scope: formData.scope!,
      description: formData.description!,
      contract_information: formData.contract_information,
      critical: formData.critical!,
      note: formData.note,
      start_date: formData.start_date!,
      end_date: formData.end_date!,
    };

    createProject(payload, {
      onSuccess: () => {
        onSave();
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      status: 'OPEN',
      division_id: selectedDivisionId || 0,
      project_type: 'INTERNAL',
      rank: 1,
      industry: 'IT',
      scope: '',
      description: '',
      critical: 'Medium',
      start_date: '',
      end_date: '',
    });
    setErrors({});
    onClose();
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromString = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={isPending}>
        Hủy
      </Button>
      <Button variant="primary" onClick={handleSubmit} loading={isPending}>
        Tạo dự án
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo dự án mới"
      footer={footer}
      size="lg"
    >
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Tên dự án"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên dự án"
            error={errors.name}
            disabled={isPending}
          />
          <Input
            label="Mã dự án"
            required
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Nhập mã dự án"
            error={errors.code}
            disabled={isPending}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Trạng thái"
            required
            options={statusOptions}
            value={formData.status || 'OPEN'}
            onChange={(v) => setFormData({ ...formData, status: v as ProjectStatus })} 
            error={errors.status}
            disabled={isPending}
          />
          <Select
            label="Loại dự án"
            required
            options={projectTypeOptions}
            value={formData.project_type || 'INTERNAL'}
            onChange={(v) => setFormData({ ...formData, project_type: v as ProjectType })}
            error={errors.project_type}
            disabled={isPending}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Ngành"
            required
            options={industryOptions}
            value={formData.industry || 'IT'}
            onChange={(v) => setFormData({ ...formData, industry: v as ProjectIndustry })}
            error={errors.industry}
            disabled={isPending}
          />
          <Select
            label="Độ ưu tiên"
            required
            options={criticalOptions}
            value={formData.critical || 'Medium'}
            onChange={(v) => setFormData({ ...formData, critical: v as ProjectCritical })}
            error={errors.critical}
            disabled={isPending}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select
            label="Rank"
            required
            options={rankOptions}
            value={formData.rank || 1}
            onChange={(v) => setFormData({ ...formData, rank: Number(v) })}
            error={errors.rank}
            disabled={isPending}
          />
          <Input
            label="Team ID (tùy chọn)"
            type="number"
            value={formData.team_id?.toString() || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              team_id: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Nhập Team ID"
            disabled={isPending}
          />
        </div>

        <TextArea
          label="Mô tả"
          required
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập mô tả dự án"
          error={errors.description}
          disabled={isPending}
          rows={3}
        />

        <TextArea
          label="Phạm vi"
          required
          value={formData.scope || ''}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          placeholder="Nhập phạm vi dự án"
          error={errors.scope}
          disabled={isPending}
          rows={3}
        />

        <Input
          label="Thông tin hợp đồng (tùy chọn)"
          value={formData.contract_information || ''}
          onChange={(e) => setFormData({ ...formData, contract_information: e.target.value })}
          placeholder="Nhập thông tin hợp đồng"
          disabled={isPending}
        />

        <TextArea
          label="Ghi chú (tùy chọn)"
          value={formData.note || ''}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Nhập ghi chú"
          disabled={isPending}
          rows={2}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <DatePicker
              label="Ngày bắt đầu"
              required
              value={parseDateFromString(formData.start_date || '')}
              onChange={(date) => {
                setFormData({ 
                  ...formData, 
                  start_date: formatDateForInput(date) 
                });
              }}
              error={errors.start_date}
              disabled={isPending}
            />
          </div>
          <div>
            <DatePicker
              label="Ngày kết thúc"
              required
              value={parseDateFromString(formData.end_date || '')}
              onChange={(date) => {
                setFormData({ 
                  ...formData, 
                  end_date: formatDateForInput(date) 
                });
              }}
              error={errors.end_date}
              disabled={isPending}
              minDate={parseDateFromString(formData.start_date || '') || undefined}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;

