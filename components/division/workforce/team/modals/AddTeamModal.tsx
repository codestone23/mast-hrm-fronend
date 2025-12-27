"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Select } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
import { Modal } from "@/components/common";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamCreateRequest, DivisionMemberData } from "@/types/api";
import { FormContainer } from "./addTeamModalStyle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DivisionTeamCreateRequest) => Promise<void>;
  divisionId: number;
  isLoading?: boolean;
}

interface AddTeamFormData {
  name: string;
  foundingDate: Date | null;
  leaderId: number;
}

const AddTeamModal: React.FC<Props> = ({ isOpen, onClose, onSave, divisionId, isLoading = false }) => {
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddTeamFormData>({
    defaultValues: {
      name: "",
      foundingDate: null,
      leaderId: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLeaderSearch(leaderSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [leaderSearchTerm]);

  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["division-members", divisionId, debouncedLeaderSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisionWorkforceService.getMembers(
        divisionId,
        pageParam,
        20,
        debouncedLeaderSearch || undefined
      ),
    enabled: isOpen && !!divisionId,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const members = useMemo(
    () => membersData?.pages.flatMap((page) => page.data || []) || [],
    [membersData]
  );

  const leaderOptions = useMemo(
    () =>
      members.map((member: DivisionMemberData) => ({
        value: String(member.user_id),
        label: `${member.code || ""} - ${member.name}`.trim(),
      })),
    [members]
  );

  const onSubmit = async (data: AddTeamFormData) => {
    const payload: DivisionTeamCreateRequest = {
      divisionId: divisionId,
      name: data.name.trim(),
      foundingDate: data.foundingDate ? formatDateForAPI(data.foundingDate) : "",
      leaderId: data.leaderId,
    };
    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo team"
      size="md"
      closable
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            Tạo team
          </Button>
        </>
      }
    >
      <FormContainer>
        <Input
          label="Tên team"
          required
          {...register("name", {
            required: "Tên team là bắt buộc",
          })}
          placeholder="Nhập tên team"
          error={errors.name?.message}
          fullWidth
          disabled={isLoading}
        />

        <Controller
          name="foundingDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Ngày thành lập"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              placeholder="Chọn ngày thành lập"
              fullWidth
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="leaderId"
          control={control}
          rules={{
            required: "Vui lòng chọn người quản lý",
            validate: (value) => value !== 0 || "Vui lòng chọn người quản lý",
          }}
          render={({ field }) => (
            <Select
              label="Người quản lý"
              required
              options={leaderOptions}
              value={field.value ? String(field.value) : ""}
              onChange={(value) => field.onChange(value ? Number(value) : 0)}
              placeholder="Chọn người quản lý"
              fullWidth
              searchable={true}
              onSearchChange={setLeaderSearchTerm}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              loadingText="Đang tải thêm thành viên..."
              disabled={isLoading}
              error={errors.leaderId?.message}
            />
          )}
        />
      </FormContainer>
    </Modal>
  );
};

export default AddTeamModal;
