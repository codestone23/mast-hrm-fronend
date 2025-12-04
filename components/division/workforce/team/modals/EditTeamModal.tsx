"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, Select } from "@/components/common";
import { formatDateForAPI, parseDateFromAPI } from "@/utils/dateUtils";
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
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamData, DivisionTeamUpdateRequest, DivisionMemberData } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  team?: DivisionTeamData | null;
  onSave: (team: DivisionTeamUpdateRequest) => Promise<void>;
  isLoading?: boolean;
}

const EditTeamModal: React.FC<Props> = ({ isOpen, onClose, team, onSave, isLoading = false }) => {
  const [data, setData] = useState<DivisionTeamUpdateRequest | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");

  useEffect(() => {
    if (team && isOpen) {
      setData({
        name: team.name,
        foundingDate: team.founding_date,
        leaderId: team.manager.id || 0,
      });
      setErrors({});
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [team, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLeaderSearch(leaderSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [leaderSearchTerm]);

  const divisionId = team?.division_id;

  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["division-members", divisionId, debouncedLeaderSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisionWorkforceService.getMembers(
        divisionId!,
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data?.name?.trim()) {
      newErrors.name = "Tên team là bắt buộc";
    }

    if (!data?.leaderId || data.leaderId === 0) {
      newErrors.leaderId = "Vui lòng chọn người quản lý";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!data || !validateForm()) return;
    try {
      await onSave(data);
      onClose();
    } catch {
      // Error handling is done in parent component
    }
  };

  const updateField = (field: keyof DivisionTeamUpdateRequest, value: string | number) => {
    if (!data) return;
    setData({ ...data, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Chỉnh sửa team</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>
                Tên team <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Input
                value={data?.name || ""}
                onChange={(e) => {
                  updateField("name", e.target.value);
                }}
                placeholder="Nhập tên team"
                error={errors.name}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <DatePicker
                label="Ngày thành lập"
                value={parseDateFromAPI(data?.foundingDate || "")}
                onChange={(date) =>
                  updateField("foundingDate", date ? formatDateForAPI(date) : "")
                }
                placeholder="Chọn ngày thành lập"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                Người quản lý <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Select
                options={leaderOptions}
                value={data?.leaderId ? String(data.leaderId) : ""}
                onChange={(value) => {
                  updateField("leaderId", value ? Number(value) : 0);
                }}
                placeholder="Chọn người quản lý"
                fullWidth
                searchable={true}
                onSearchChange={setLeaderSearchTerm}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                loadingText="Đang tải thêm thành viên..."
                disabled={isLoading}
              />
              {errors.leaderId && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
                  {errors.leaderId}
                </span>
              )}
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose} disabled={isLoading}>
              Hủy
            </CancelButton>
            <SaveButton type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditTeamModal;
