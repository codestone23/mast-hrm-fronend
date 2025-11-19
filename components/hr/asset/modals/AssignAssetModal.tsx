"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  CancelButton,
  SaveButton,
  FormGroup,
  FormInput,
  FormTextArea,
} from "./modalStyle";
import { Asset } from "@/constants/types";
import userService from "@/services/user.service";
import { useToast } from "@/hooks/useToast";
import { Loading } from "@/components/common";

interface AssignAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onAssign: (assetId: number | string, userId: number, notes?: string) => Promise<void>;
}

const AssignAssetModal: React.FC<AssignAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['users', searchTerm],
    queryFn: ({ pageParam = 1 }) => userService.getUsers(pageParam, 20, searchTerm),
    enabled: isOpen,
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const users = data?.pages.flatMap(page => page.data || []) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedUserId(null);
      setNotes("");
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!asset || !selectedUserId) {
      showErrorToast("Vui lòng chọn người dùng");
      return;
    }

    try {
      await onAssign(asset.id, selectedUserId, notes || undefined);
      showSuccessToast("Gán tài sản thành công");
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showErrorToast(error?.response?.data?.message || "Có lỗi xảy ra khi gán tài sản");
    }
  };

  if (!isOpen || !asset) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Gán tài sản: {asset.name}</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <FormInput
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "16px" }}
              />
            </FormGroup>

            <div style={{ 
              maxHeight: "300px", 
              overflowY: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px"
            }}>
              {isLoading && users.length === 0 ? (
                <Loading />
              ) : users.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  Không tìm thấy người dùng nào
                </div>
              ) : (
                <>
                  {users.map((user) => {
                  const userInfo = Array.isArray(user.user_information) 
                    ? null 
                    : user.user_information as { name?: string; avatar?: string } | null;
                  const userName = userInfo?.name || user.name || "Không có";
                  const userAvatar = userInfo?.avatar && userInfo.avatar.includes('https') ? userInfo.avatar : "";
                  const isSelected = selectedUserId === user.id;

                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#e3f2fd" : "white",
                        border: isSelected ? "2px solid #2196F3" : "1px solid #e5e7eb",
                        marginBottom: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2196F3",
                        fontWeight: 500,
                        overflow: "hidden",
                      }}>
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={userName}
                            width={40}
                            height={40}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <span>{userName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: "#111827" }}>
                          {userName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {user.email}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#2196F3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                  })}
                  {hasNextPage && (
                    <div 
                      ref={observerRef}
                      style={{ 
                        padding: "12px", 
                        textAlign: "center",
                        color: "#666",
                        fontSize: "14px"
                      }}
                    >
                      {isFetchingNextPage ? (
                        <Loading />
                      ) : (
                        <button
                          onClick={() => fetchNextPage()}
                          style={{
                            background: "transparent",
                            border: "1px solid #2196F3",
                            color: "#2196F3",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          Tải thêm
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <FormGroup style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
                Ghi chú (tùy chọn)
              </label>
              <FormTextArea
                placeholder="Nhập ghi chú về việc gán tài sản..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose}>
              Hủy
            </CancelButton>
            <SaveButton onClick={handleAssign} disabled={!selectedUserId || isLoading}>
              Gán tài sản
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AssignAssetModal;

