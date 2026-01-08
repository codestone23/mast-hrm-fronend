"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, X } from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import Select, { SelectOption } from '@/components/common/Select/Select';
import projectService, { AvailableMember } from '@/services/project.service';
import { useToast } from '@/hooks/useToast';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess?: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch available members
  const { data: availableMembersData, isLoading } = useQuery({
    queryKey: ['available-members', projectId, debouncedSearch],
    queryFn: () => projectService.getAvailableMembersForProject(projectId, debouncedSearch || undefined),
    enabled: isOpen && !!projectId,
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (userId: number) =>
      projectService.addMemberToProject(projectId, { user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['available-members', projectId] });
      showSuccessToast('Thêm thành viên vào dự án thành công!');
      setSelectedUserId(undefined);
      setSearchTerm('');
      onClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi thêm thành viên';
      showErrorToast(errorMessage);
    },
  });

  // Convert available members to select options
  const memberOptions: SelectOption[] = useMemo(() => {
    if (!availableMembersData?.availableMembers) return [];
    return availableMembersData.availableMembers.map((member: AvailableMember) => ({
      value: member.id,
      label: `${member.name} (${member.email}) - ${member.position.name}`,
    }));
  }, [availableMembersData]);

  const handleSubmit = () => {
    if (!selectedUserId) return;
    addMemberMutation.mutate(selectedUserId);
  };

  const handleClose = () => {
    setSelectedUserId(undefined);
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm thành viên vào dự án"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={addMemberMutation.isPending}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={addMemberMutation.isPending}
            disabled={!selectedUserId}
            icon={<UserPlus size={16} />}
          >
            Thêm thành viên
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Select
          label="Chọn thành viên"
          options={memberOptions}
          value={selectedUserId}
          onChange={(value) => setSelectedUserId(Number(value))}
          placeholder="Tìm kiếm và chọn thành viên..."
          searchable
          onSearchChange={setSearchTerm}
          required
          fullWidth
          loadingText="Đang tải..."
        />
        {isLoading && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Đang tải danh sách thành viên...
          </div>
        )}
        {!isLoading && availableMembersData && availableMembersData.totalAvailable === 0 && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Không có thành viên nào có thể thêm vào dự án
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddMemberModal;

