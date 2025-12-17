"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Modal, Button, Select } from "@/components/common";
import divisionsService from "@/services/divisions.service";
import { RotationType } from "@/types/api";
import { useToast } from "@/hooks/useToast";

interface CreateRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 20;

const CreateRotationModal: React.FC<CreateRotationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const [userId, setUserId] = useState<number | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(memberSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [memberSearch]);

  // Fetch members with infinite scroll
  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["division-members-infinite", selectedDivisionId, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisionsService.listMembersOfDivision(
        selectedDivisionId!,
        pageParam,
        ITEMS_PER_PAGE,
        debouncedSearch || undefined
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!selectedDivisionId && isOpen,
  });

  // Fetch all divisions for target selection
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions-list"],
    queryFn: () => divisionsService.getDivisions({ page: 1, limit: 100 }),
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      divisionsService.createRotationMember({
        user_id: userId!,
        division_id: divisionId!,
        type: RotationType.PERMANENT,
        date_rotation: new Date().toISOString().split("T")[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotation-members"] });
      queryClient.invalidateQueries({ queryKey: ["division-workforce"] });
      showSuccessToast("Tạo luân chuyển thành công");
      handleClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleClose = () => {
    setUserId(null);
    setDivisionId(null);
    setMemberSearch("");
    setDebouncedSearch("");
    onClose();
  };

  const handleSubmit = () => {
    if (!userId || !divisionId) {
      showErrorToast("Vui lòng chọn nhân viên và phòng ban đích");
      return;
    }
    createMutation.mutate();
  };

  const memberOptions = useMemo(() => {
    const allMembers = membersData?.pages.flatMap((page) => page.data) || [];
    return allMembers.map((member) => ({
      value: String(member.user_id),
      label: member.user?.user_information?.name || member.name || member.email,
    }));
  }, [membersData]);

  const divisionOptions =
    divisionsData?.data
      ?.filter((d) => d.id !== selectedDivisionId)
      .map((division) => ({
        value: String(division.id),
        label: division.name,
      })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo luân chuyển nhân sự"
      size="md"
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createMutation.isPending || !userId || !divisionId}
          >
            {createMutation.isPending ? "Đang tạo..." : "Tạo luân chuyển"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Select
          label="Nhân viên"
          options={memberOptions}
          value={userId ? String(userId) : ""}
          onChange={(value) => setUserId(value ? Number(value) : null)}
          placeholder="Chọn nhân viên"
          fullWidth
          searchable
          onSearchChange={setMemberSearch}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />

        <Select
          label="Phòng ban đích"
          options={divisionOptions}
          value={divisionId ? String(divisionId) : ""}
          onChange={(value) => setDivisionId(value ? Number(value) : null)}
          placeholder="Chọn phòng ban"
          fullWidth
        />
      </div>
    </Modal>
  );
};

export default CreateRotationModal;

