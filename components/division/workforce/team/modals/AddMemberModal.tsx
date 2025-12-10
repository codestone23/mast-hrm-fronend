"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Search } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Input, TextArea } from "@/components/common";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionMemberData } from "@/types/api";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { user_id: number; description?: string }) => Promise<void>;
  teamId?: number;
  isLoading?: boolean;
}

const AddMemberModal: React.FC<Props> = ({ isOpen, onClose, onSave, teamId, isLoading = false }) => {
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUserId(null);
      setDescription("");
      setSearchTerm("");
      setDebouncedSearch("");
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: membersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["division-members", selectedDivisionId, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisionWorkforceService.getMembers(
        selectedDivisionId!,
        pageParam,
        20,
        debouncedSearch || undefined,
      ),
    enabled: isOpen && !!selectedDivisionId,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const members = useMemo(
    () => membersData?.pages.flatMap((page) => page.data || []) || [],
    [membersData]
  );

  // Filter out members already in the team if teamId is provided
  const availableMembers = useMemo(() => {
    if (!teamId) return members;
    // Filter logic: exclude members that already have this team_id
    return members.filter((member: DivisionMemberData) => 
      !member.team_id || member.team_id !== teamId
    );
  }, [members, teamId]);

  const toggleMember = (userId: number) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleSave = async () => {
    if (!selectedUserId) {
      return;
    }
    try {
      await onSave({
        user_id: selectedUserId,
        description: description.trim() || undefined,
      });
      setSelectedUserId(null);
      setDescription("");
      onClose();
    } catch {
      // Error handling is done in parent component
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Thêm nhân sự vào team</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>Chọn nhân sự</FormLabel>
              <Input
                placeholder="Tìm kiếm nhân sự..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                fullWidth
              />
              <div style={{ 
                maxHeight: "300px", 
                overflowY: "auto", 
                border: "1px solid #e5e7eb", 
                borderRadius: "8px",
                padding: "8px"
              }}>
                {availableMembers.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                    {debouncedSearch ? "Không tìm thấy nhân sự nào" : "Không có nhân sự nào"}
                  </div>
                ) : (
                  <>
                    {availableMembers.map((member: DivisionMemberData) => {
                      const isSelected = selectedUserId === member.user_id;
                      return (
                        <div
                          key={member.user_id}
                          onClick={() => toggleMember(member.user_id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            backgroundColor: isSelected ? "#e0e7ff" : "transparent",
                            border: isSelected ? "1px solid #6366f1" : "1px solid transparent",
                            marginBottom: "4px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#f9fafb";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name="selectedMember"
                            checked={isSelected}
                            onChange={() => toggleMember(member.user_id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: "pointer" }}
                          />
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "#e0e7ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#6366f1",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {member.avatar && member.avatar.includes('https') ? (
                              <Image src={member.avatar} alt={member.name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                            ) : (
                              <span style={{ fontWeight: 500 }}>{member.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, color: "#111827", marginBottom: "2px" }}>
                              {member.code ? `${member.code} - ${member.name}` : member.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>{member.email}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={sentinelRef} style={{ height: "1px" }} />
                    {isFetchingNextPage && (
                      <div style={{ padding: "12px", textAlign: "center", color: "#6b7280" }}>
                        Đang tải thêm nhân sự...
                      </div>
                    )}
                  </>
                )}
              </div>
            </FormGroup>

            {selectedUserId && (
              <FormGroup>
                <FormLabel>Mô tả (tùy chọn)</FormLabel>
                <TextArea
                  placeholder="Nhập mô tả cho nhân sự này trong team..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  fullWidth
                  disabled={isLoading}
                />
              </FormGroup>
            )}
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose} disabled={isLoading}>
              Hủy
            </CancelButton>
            <SaveButton type="button" onClick={handleSave} disabled={isLoading || !selectedUserId}>
              {isLoading ? "Đang thêm..." : "Thêm nhân sự"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddMemberModal;
