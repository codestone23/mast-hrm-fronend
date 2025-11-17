"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DatePicker, Input, Select } from "@/components/common";
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
import { DivisionTeamCreateRequest, DivisionMemberData } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DivisionTeamCreateRequest) => Promise<void>;
  divisionId: number;
  isLoading?: boolean;
}

const AddTeamModal: React.FC<Props> = ({ isOpen, onClose, onSave, divisionId, isLoading = false }) => {
  const [data, setData] = useState<DivisionTeamCreateRequest>({
    divisionId: divisionId,
    name: "",
    foundingDate: "",
    leaderId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setData({
        divisionId: divisionId,
        name: "",
        foundingDate: "",
        leaderId: 0,
      });
      setErrors({});
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [isOpen, divisionId]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = "Tên team là bắt buộc";
    }

    if (!data.leaderId || data.leaderId === 0) {
      newErrors.leaderId = "Vui lòng chọn người quản lý";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave(data);
      setData({
        divisionId: divisionId,
        name: "",
        foundingDate: "",
        leaderId: 0,
      });
      setErrors({});
      onClose();
    } catch {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setData({
      divisionId: divisionId,
      name: "",
      foundingDate: "",
      leaderId: 0,
    });
    setErrors({});
    setLeaderSearchTerm("");
    setDebouncedLeaderSearch("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tạo team</ModalTitle>
            <ModalCloseButton onClick={handleClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>
                Tên team <span style={{ color: "#ef4444" }}>*</span>
              </FormLabel>
              <Input
                value={data.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
                placeholder="Nhập tên team"
                error={errors.name}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <DatePicker
                label="Ngày thành lập"
                value={parseDateFromAPI(data.foundingDate)}
                onChange={(date) =>
                  setData({
                    ...data,
                    foundingDate: date ? formatDateForAPI(date) : "",
                  })
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
                value={data.leaderId ? String(data.leaderId) : ""}
                onChange={(value) => {
                  setData({ ...data, leaderId: value ? Number(value) : 0 });
                  if (errors.leaderId) {
                    setErrors({ ...errors, leaderId: "" });
                  }
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
            <CancelButton type="button" onClick={handleClose} disabled={isLoading}>
              Hủy
            </CancelButton>
            <SaveButton type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo team"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddTeamModal;
