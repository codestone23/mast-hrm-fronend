"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/common/Modal/Modal";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { Division } from "@/constants/types";
import { useDivisionsList } from "@/hooks/useDivisions";
import { DivisionStatus, DivisionType } from "@/constants/enums";
import { UpdateDivisionRequest } from "@/types/api";

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  onSave: (payload: UpdateDivisionRequest & { id?: number | string }) => void;
}

const EditDivisionModal: React.FC<EditDivisionModalProps> = ({
  isOpen,
  onClose,
  division,
  onSave,
}) => {
  const [form, setForm] = useState<UpdateDivisionRequest>({ name: "", description: "", parent_id: undefined, type: DivisionType.TECHNICAL, status: DivisionStatus.ACTIVE });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const parentsQuery = useDivisionsList({ page: 1, limit: 100 });
  const parentOptions = useMemo(() => (parentsQuery.data?.data ?? []).map(d => ({ value: d.id, label: d.name })), [parentsQuery.data]);

  useEffect(() => {
    if (division) {
      setForm({
        name: division.name || "",
        description: division.description || "",
        parent_id: undefined,
        type: DivisionType.TECHNICAL,
        status: division.status === "active" ? DivisionStatus.ACTIVE : DivisionStatus.INACTIVE,
      });
    }
  }, [division]);

  // no-op

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên phòng ban là bắt buộc";
    }

    if (!form.description?.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && division) {
      onSave({ ...form, status: form.status });
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !division) return null;

  const footer = (
    <>
      <button type="button" onClick={handleClose} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'white' }}>Hủy</button>
      <button type="submit" form="edit-division-form" style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: 'var(--primary-500)', color: 'white' }}>Lưu thay đổi</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Chỉnh sửa phòng ban" footer={footer} size="md">
      <form id="edit-division-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Tên phòng ban" required value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Mô tả" multiline rows={4} value={form.description || ''} onChange={(e)=>setForm({ ...form, description: e.target.value })} error={errors.description} />
          <Select
            options={[
              { value: DivisionType.TECHNICAL, label: 'Kỹ thuật' },
              { value: DivisionType.BUSINESS, label: 'Kinh doanh' },
              { value: DivisionType.OPERATIONS, label: 'Vận hành' },
              { value: DivisionType.OTHER, label: 'Khác' },
            ]}
            value={form.type}
            onChange={(v)=>setForm({ ...form, type: String(v) })}
          />
          <Select
            options={[{ value: '', label: 'Không có phòng ban cha' }, ...parentOptions]}
            value={form.parent_id ?? ''}
            onChange={(v)=>setForm({ ...form, parent_id: v ? Number(v) : undefined })}
            placeholder="Phòng ban cha"
          />
          <Select
            options={[{ value: DivisionStatus.ACTIVE, label: 'ACTIVE' }, { value: DivisionStatus.INACTIVE, label: 'INACTIVE' }]}
            value={form.status}
            onChange={(v)=>setForm({ ...form, status: String(v) as unknown as DivisionStatus })}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditDivisionModal;
