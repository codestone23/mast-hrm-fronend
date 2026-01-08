"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button } from "@/components/common";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import TextArea from "@/components/common/TextArea/TextArea";
import { Division } from "@/constants/types";
import { useDivisionsList } from "@/hooks/useDivisions";
import { DivisionStatus, DivisionType } from "@/constants/enums";
import { UpdateDivisionRequest } from "@/types/api";
import { FormContainer, FormGrid } from "./modalStyle";

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  onSave: (payload: UpdateDivisionRequest & { id?: number | string }) => void;
}

interface EditDivisionFormData {
  name: string;
  description: string;
  parent_id?: number;
  type: DivisionType;
  status: DivisionStatus;
}

const EditDivisionModal: React.FC<EditDivisionModalProps> = ({
  isOpen,
  onClose,
  division,
  onSave,
}) => {
  const parentsQuery = useDivisionsList({ page: 1, limit: 100 });
  const parentOptions = useMemo(() => (parentsQuery.data?.data ?? []).map(d => ({ value: d.id, label: d.name })), [parentsQuery.data]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditDivisionFormData>({
    defaultValues: {
      name: "",
      description: "",
      parent_id: undefined,
      type: DivisionType.TECHNICAL,
      status: DivisionStatus.ACTIVE,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (division) {
      reset({
        name: division.name || "",
        description: division.description || "",
        parent_id: undefined,
        type: DivisionType.TECHNICAL,
        status: division.status === DivisionStatus.ACTIVE ? DivisionStatus.ACTIVE : DivisionStatus.INACTIVE,
      });
    }
  }, [division, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: EditDivisionFormData) => {
    onSave({ ...data, status: data.status });
  };

  if (!isOpen || !division) return null;

  const footer = (
    <>
      <Button type="button" variant="ghost" onClick={onClose}>
        Hủy
      </Button>
      <Button type="button" variant="primary" onClick={handleSubmit(onSubmit)}>
        Lưu thay đổi
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa phòng ban" footer={footer} size="lg">
      <FormContainer>
        <FormGrid>
          <Input
            label="Tên phòng ban"
            required
            {...register("name", {
              required: "Tên phòng ban là bắt buộc",
            })}
            error={errors.name?.message}
            fullWidth
          />
          
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Loại phòng ban"
                options={[
                  { value: DivisionType.TECHNICAL, label: 'Kỹ thuật' },
                  { value: DivisionType.BUSINESS, label: 'Kinh doanh' },
                  { value: DivisionType.OPERATIONS, label: 'Vận hành' },
                  { value: DivisionType.OTHER, label: 'Khác' },
                ]}
                value={field.value}
                onChange={(v) => field.onChange(String(v))}
                fullWidth
              />
            )}
          />
        </FormGrid>
        
        <FormGrid>
          <Controller
            name="parent_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Phòng ban cha"
                options={[{ value: '', label: 'Không có phòng ban cha' }, ...parentOptions]}
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                placeholder="Phòng ban cha"
                fullWidth
              />
            )}
          />
          
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Trạng thái"
                options={[
                  { value: DivisionStatus.ACTIVE, label: 'Hoạt động' },
                  { value: DivisionStatus.INACTIVE, label: 'Không hoạt động' }
                ]}
                value={field.value}
                onChange={(v) => field.onChange(String(v) as DivisionStatus)}
                fullWidth
              />
            )}
          />
        </FormGrid>
        
        <TextArea
          label="Mô tả"
          rows={4}
          {...register("description", {
            required: "Mô tả là bắt buộc",
          })}
          error={errors.description?.message}
          fullWidth
        />
      </FormContainer>
    </Modal>
  );
};

export default EditDivisionModal;
