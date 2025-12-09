"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Modal from "@/components/common/Modal/Modal";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { useDivisionsList } from "@/hooks/useDivisions";
import { DivisionType } from "@/constants/enums";
import { CreateDivisionRequest, User } from "@/types/api";
import userService from "@/services/user.service";

interface CreateDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateDivisionRequest) => void;
}

const CreateDivisionModal: React.FC<CreateDivisionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<CreateDivisionRequest>({ name: "", description: "", parent_id: undefined, type: DivisionType.TECHNICAL, leader_id: undefined });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leaderSearchTerm, setLeaderSearchTerm] = useState("");
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");

  const parentsQuery = useDivisionsList({ page: 1, limit: 100 });
  const parentOptions = useMemo(() => (parentsQuery.data?.data ?? []).map(d => ({ value: d.id, label: d.name })), [parentsQuery.data]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLeaderSearch(leaderSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [leaderSearchTerm]);

  // Fetch users for leader selection with infinite scroll
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    queryKey: ["users", "for-leader", debouncedLeaderSearch],
    queryFn: ({ pageParam = 1 }) =>
      userService.getUsers(pageParam, 20, debouncedLeaderSearch || undefined),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isOpen,
  });

  const getUserName = (user: User) => {
    if (user.user_information && typeof user.user_information === 'object' && !Array.isArray(user.user_information) && 'name' in user.user_information) {
      return (user.user_information as { name: string }).name;
    }
    return user.name || user.email;
  };

  const allUsers = useMemo(() => {
    return usersData?.pages.flatMap((page) => page.data || []) || [];
  }, [usersData]);

  const leaderOptions = useMemo(() => {
    return [
      { value: "", label: "Chưa chọn trưởng phòng" },
      ...allUsers.map((user: User) => ({
        value: user.id,
        label: getUserName(user),
      })),
    ];
  }, [allUsers]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", description: "", parent_id: undefined, type: DivisionType.TECHNICAL, leader_id: undefined });
      setErrors({});
      setLeaderSearchTerm("");
      setDebouncedLeaderSearch("");
    }
  }, [isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Tên phòng ban là bắt buộc";
    if (!form.type) e.type = "Loại phòng ban là bắt buộc";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8 }}>Hủy</button>
      <button onClick={() => { if (validate()) { onSave(form); } }} style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: 'var(--primary-500)', color: 'white' }}>Tạo phòng ban</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phòng ban mới" footer={footer} size="md">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Tên phòng ban" required value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Select
          label="Trưởng phòng"
          options={leaderOptions}
          value={form.leader_id ?? ''}
          onChange={(v)=>setForm({ ...form, leader_id: v ? Number(v) : undefined })}
          placeholder="Chọn trưởng phòng"
          searchable
          onSearchChange={setLeaderSearchTerm}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          loadingText="Đang tải thêm..."
        />
        <Input label="Mô tả" multiline rows={4} value={form.description || ''} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
        <Select
          options={[
            { value: DivisionType.TECHNICAL, label: 'Kỹ thuật' },
            { value: DivisionType.BUSINESS, label: 'Kinh doanh' },
            { value: DivisionType.OPERATIONS, label: 'Vận hành' },
            { value: DivisionType.OTHER, label: 'Khác' },
          ]}
          value={form.type}
          onChange={(v)=>setForm({ ...form, type: v as DivisionType })} 
        />
        <Select
          label="Phòng ban cha"
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
