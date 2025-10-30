"use client";

import React, { useMemo, useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { useDivisionsList } from "@/hooks/useDivisions";
import { DivisionType } from "@/constants/enums";
import { CreateDivisionRequest } from "@/types/api";

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateDivisionRequest) => void;
}

const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<CreateDivisionRequest>({ name: "", description: "", parent_id: undefined, type: DivisionType.TECHNICAL });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parentsQuery = useDivisionsList({ page: 1, limit: 100 });
  const parentOptions = useMemo(() => (parentsQuery.data?.data ?? []).map(d => ({ value: d.id, label: d.name })), [parentsQuery.data]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Tên phòng ban là bắt buộc";
    if (!form.type) e.type = "Loại phòng ban là bắt buộc";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'white' }}>Hủy</button>
      <button onClick={() => { if (validate()) { onSave(form); } }} style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: 'var(--primary-500)', color: 'white' }}>Tạo phòng ban</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phòng ban mới" footer={footer} size="md">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Tên phòng ban" required value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Mô tả" multiline rows={4} value={form.description || ''} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
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
      </div>
    </Modal>
  );
};

export default CreateDivisionModal;
