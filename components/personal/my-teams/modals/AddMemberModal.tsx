"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Search, Trash2 } from "lucide-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, TextArea, Button } from "@/components/common";
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
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

interface SelectedMember {
  user_id: number;
  description?: string;
  role_id?: number;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, teamId }) => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  
  const [selectedMembers, setSelectedMembers] = useState<Map<number, SelectedMember>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMembers(new Map());
      setSearchTerm("");
      setDebouncedSearch("");
      setEditingMemberId(null);
      setEditingDescription("");
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

  // Filter out members already in the team
  const availableMembers = useMemo(() => {
    return members.filter((member: DivisionMemberData) => 
      !member.team_id || member.team_id !== teamId
    );
  }, [members, teamId]);

  const toggleMember = (userId: number) => {
    setSelectedMembers((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(userId)) {
        newMap.delete(userId);
      } else {
        newMap.set(userId, { user_id: userId });
      }
      return newMap;
    });
    setEditingMemberId(null);
    setEditingDescription("");
  };

  const updateMemberDescription = (userId: number, description: string) => {
    setSelectedMembers((prev) => {
      const newMap = new Map(prev);
      const member = newMap.get(userId);
      if (member) {
        newMap.set(userId, { ...member, description: description.trim() || undefined });
      }
      return newMap;
    });
  };

  const removeMember = (userId: number) => {
    setSelectedMembers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
    if (editingMemberId === userId) {
      setEditingMemberId(null);
      setEditingDescription("");
    }
  };

  const addMembersMutation = useMutation({
    mutationFn: (payload: { members: SelectedMember[] }) =>
      divisionWorkforceService.addMembersToTeam(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      showSuccessToast("Thêm thành viên thành công");
      setSelectedMembers(new Map());
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSave = () => {
    if (selectedMembers.size === 0) {
      showErrorToast("Vui lòng chọn ít nhất một thành viên");
      return;
    }

    const membersArray = Array.from(selectedMembers.values());
    addMembersMutation.mutate({ members: membersArray });
  };

  if (!isOpen) return null;

  const selectedMembersList = Array.from(selectedMembers.entries());

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Thêm thành viên vào team</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormLabel>Chọn thành viên</FormLabel>
              <Input
                placeholder="Tìm kiếm thành viên..."
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
                padding: "8px",
                marginTop: "8px"
              }}>
                {availableMembers.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                    {debouncedSearch ? "Không tìm thấy thành viên nào" : "Không có thành viên nào"}
                  </div>
                ) : (
                  <>
                    {availableMembers.map((member: DivisionMemberData) => {
                      const isSelected = selectedMembers.has(member.user_id);
                      const memberData = selectedMembers.get(member.user_id);
                      return (
                        <div
                          key={member.user_id}
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
                            type="checkbox"
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
                              <Image 
                                src={member.avatar} 
                                alt={member.name} 
                                width={40} 
                                height={40} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                loading="lazy" 
                              />
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
                          {isSelected && (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingMemberId(member.user_id);
                                  setEditingDescription(memberData?.description || "");
                                }}
                                style={{ padding: "4px 8px", fontSize: "12px" }}
                              >
                                Mô tả
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={sentinelRef} style={{ height: "1px" }} />
                    {isFetchingNextPage && (
                      <div style={{ padding: "12px", textAlign: "center", color: "#6b7280" }}>
                        Đang tải thêm thành viên...
                      </div>
                    )}
                  </>
                )}
              </div>
            </FormGroup>

            {selectedMembersList.length > 0 && (
              <FormGroup>
                <FormLabel>Thành viên đã chọn ({selectedMembersList.length})</FormLabel>
                <div style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px",
                  padding: "12px",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}>
                  {selectedMembersList.map(([userId, memberData]) => {
                    const member = availableMembers.find((m: DivisionMemberData) => m.user_id === userId);
                    if (!member) return null;
                    
                    return (
                      <div
                        key={userId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "6px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
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
                            <Image 
                              src={member.avatar} 
                              alt={member.name} 
                              width={32} 
                              height={32} 
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            />
                          ) : (
                            <span style={{ fontWeight: 500, fontSize: "12px" }}>
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, color: "#111827", fontSize: "14px" }}>
                            {member.name}
                          </div>
                          {memberData.description && (
                            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                              {memberData.description}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editingMemberId === userId) {
                              setEditingMemberId(null);
                              setEditingDescription("");
                            }
                            removeMember(userId);
                          }}
                          style={{ padding: "4px", color: "#dc2626" }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </FormGroup>
            )}

            {editingMemberId && (
              <FormGroup>
                <FormLabel>Mô tả cho {availableMembers.find((m: DivisionMemberData) => m.user_id === editingMemberId)?.name}</FormLabel>
                <TextArea
                  placeholder="Nhập mô tả (tùy chọn)..."
                  value={editingDescription}
                  onChange={(e) => {
                    setEditingDescription(e.target.value);
                    updateMemberDescription(editingMemberId, e.target.value);
                  }}
                  rows={3}
                  fullWidth
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingMemberId(null);
                      setEditingDescription("");
                    }}
                  >
                    Đóng
                  </Button>
                </div>
              </FormGroup>
            )}
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose} disabled={addMembersMutation.isPending}>
              Hủy
            </CancelButton>
            <SaveButton 
              type="button" 
              onClick={handleSave} 
              disabled={addMembersMutation.isPending || selectedMembers.size === 0}
            >
              {addMembersMutation.isPending ? "Đang thêm..." : `Thêm ${selectedMembers.size} thành viên`}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddMemberModal;
