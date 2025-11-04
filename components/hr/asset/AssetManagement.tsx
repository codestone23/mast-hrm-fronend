"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Plus, Package, FileText, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import {
  Container,
  HeaderContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  CreateButton,
  AssetTable,
  TableHeader,
  TableRow,
  TableCell,
  UserInfo,
  Avatar,
  UserName,
  StatusBadge,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./assetStyle";
import { Asset, AssetRequest } from "@/constants/types";
import { AssetCategory, AssetStatus, REQUEST_STATUS } from "@/constants/enums";
import CreateAssetModal from "./modals/CreateAssetModal";
import EditAssetModal from "./modals/EditAssetModal";
import AssetDetailModal from "./modals/AssetDetailModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import AssignAssetModal from "./modals/AssignAssetModal";
import Pagination from "./Pagination";
import ListAssetRequests from "./ListAssetRequests";
import assetsService, { GetAssetsParams } from "@/services/assets.service";
import { Select, Input, Loading } from "@/components/common";
import { useToast } from "@/hooks/useToast";

const ITEMS_PER_PAGE = 10;

const AssetManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"assets" | "requests">("assets");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const assetsParams: GetAssetsParams = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryFilter && { category: categoryFilter }),
    ...(statusFilter && { status: statusFilter }),
    sort_by: "created_at",
    sort_order: "desc",
  }), [currentPage, debouncedSearch, categoryFilter, statusFilter]);

  const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets', assetsParams],
    queryFn: () => assetsService.getListAssets(assetsParams),
  });

  const assets = assetsData?.data || [];
  const pagination = assetsData?.pagination || { 
    total: 0, 
    current_page: 1, 
    total_pages: 1, 
    limit: ITEMS_PER_PAGE 
  };
  
  const totalPages = pagination.total_pages || 1;

  // Category options
  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    ...Object.values(AssetCategory).map(cat => ({
      value: cat,
      label: cat,
    })),
  ];

  // Status options
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    ...Object.values(AssetStatus).map(status => ({
      value: status,
      label: getStatusLabel(status),
    })),
  ];

  function getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      [AssetStatus.AVAILABLE]: "Có sẵn",
      [AssetStatus.ASSIGNED]: "Đã gán",
      [AssetStatus.MAINTENANCE]: "Bảo trì",
      [AssetStatus.RETIRED]: "Ngừng sử dụng",
      [AssetStatus.LOST]: "Mất",
      [AssetStatus.DAMAGED]: "Hỏng",
    };
    return statusMap[status] || status;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case AssetStatus.AVAILABLE:
        return "#10b981";
      case AssetStatus.ASSIGNED:
        return "#3b82f6";
      case AssetStatus.MAINTENANCE:
        return "#f59e0b";
      case AssetStatus.RETIRED:
      case AssetStatus.LOST:
      case AssetStatus.DAMAGED:
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    return getStatusLabel(status);
  };

  // Mock requests data (tạm thời giữ nguyên, sẽ tích hợp API sau)
  const [requests, setRequests] = useState<AssetRequest[]>([
    {
      id: "req1",
      assetId: "1",
      asset: assets[0],
      userId: "user3",
      userName: "Lê Văn C",
      userAvatar: "",
      reason: "Cần laptop để làm việc tại nhà vì dự án deadline gần",
      status: REQUEST_STATUS.PENDING,
      requestedAt: "2024-01-10",
    },
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (request) =>
        request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  const totalRequestPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const start = (currentRequestPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentRequestPage]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (assetData: Partial<Asset>) => assetsService.createAsset(assetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetStatistics'] });
      showSuccessToast("Tạo tài sản thành công");
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi tạo tài sản");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Asset> }) =>
      assetsService.updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetStatistics'] });
      showSuccessToast("Cập nhật tài sản thành công");
      setIsEditModalOpen(false);
      setSelectedAsset(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật tài sản");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (assetId: number | string) => assetsService.deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetStatistics'] });
      showSuccessToast("Xóa tài sản thành công");
      setIsDeleteModalOpen(false);
      setSelectedAsset(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa tài sản");
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ assetId, userId, notes }: { assetId: number | string; userId: number; notes?: string }) =>
      assetsService.assignAsset(assetId, userId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assetStatistics'] });
      setIsAssignModalOpen(false);
      setSelectedAsset(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi gán tài sản");
    },
  });

  // Handlers
  const handleCreateAsset = (assetData: Omit<Asset, "id">) => {
    createMutation.mutate(assetData);
  };

  const handleEditAsset = (assetData: Asset) => {
    if (!assetData.id) return;
    const updateData: Partial<Asset> = {
      name: assetData.name,
      description: assetData.description,
      category: assetData.category,
      serial_number: assetData.serial_number,
      purchase_date: assetData.purchase_date,
      purchase_price: assetData.purchase_price,
      warranty_end_date: assetData.warranty_end_date,
      notes: assetData.notes,
      status: assetData.status,
      location: assetData.location,
    };
    updateMutation.mutate({ id: assetData.id, data: updateData });
  };

  const handleDeleteAsset = () => {
    if (selectedAsset?.id) {
      deleteMutation.mutate(selectedAsset.id);
    }
  };

  const handleAssignAsset = async (assetId: number | string, userId: number, notes?: string) => {
    await assignMutation.mutateAsync({ assetId, userId, notes });
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteModalOpen(true);
  };

  const handleAssignClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssignModalOpen(true);
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: REQUEST_STATUS.APPROVED, reviewedAt: new Date().toISOString() } as AssetRequest
          : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: REQUEST_STATUS.REJECTED, reviewedAt: new Date().toISOString() } as AssetRequest
          : req
      )
    );
  };

  // Reset page when tab changes
  const handleTabChange = (tab: "assets" | "requests") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setCurrentRequestPage(1);
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  // Helper to get user from asset
  const getAssetUser = (asset: Asset) => {
    if (asset.assigned_user) {
      return {
        id: asset.assigned_user.id,
        name: asset.assigned_user.user_information?.name || "",
        avatar: "",
      };
    }
    if (asset.user) {
      return asset.user;
    }
    return null;
  };

  // Helper to get asset code
  const getAssetCode = (asset: Asset) => {
    return asset.asset_code || asset.code || "";
  };

  // Helper to get asset price
  const getAssetPrice = (asset: Asset) => {
    if (asset.purchase_price) {
      const price = typeof asset.purchase_price === 'string' 
        ? parseFloat(asset.purchase_price) 
        : asset.purchase_price;
      return new Intl.NumberFormat("vi-VN").format(price);
    }
    if (asset.price) {
      return new Intl.NumberFormat("vi-VN").format(asset.price);
    }
    return "";
  };

  return (
    <Container>
      <HeaderContainer>
        <TabContainer>
          <TabButton
            $active={activeTab === "assets"}
            onClick={() => handleTabChange("assets")}
          >
            <Package size={18} />
            Danh sách tài sản
          </TabButton>
          <TabButton
            $active={activeTab === "requests"}
            onClick={() => handleTabChange("requests")}
          >
            <FileText size={18} />
            List Request
          </TabButton>
        </TabContainer>
      </HeaderContainer>

      <ContentContainer>
        {activeTab === "assets" && (
          <>
            <div style={{ marginBottom: "12px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <CreateButton onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} />
              Thêm tài sản
            </CreateButton>
              
              <div style={{ flex: 1, display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                  />
                </div>
                <div style={{ width: "200px" }}>
                  <Select
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(value) => {
                      setCategoryFilter(String(value));
                      setCurrentPage(1);
                    }}
                    placeholder="Danh mục"
                    fullWidth={false}
                  />
                </div>
                <div style={{ width: "200px" }}>
                  <Select
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(value) => {
                      setStatusFilter(String(value));
                      setCurrentPage(1);
                    }}
                    placeholder="Trạng thái"
                    fullWidth={false}
                  />
                </div>
              </div>
          </div>
          </>
        )}

        {activeTab === "assets" ? (
          <>
            <AssetTable>
              <TableHeader>
                <TableCell>Mã TS</TableCell>
                <TableCell>Tên tài sản</TableCell>
                <TableCell>Người sử dụng</TableCell>
                <TableCell>Giá (VNĐ)</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableHeader>
              {isLoadingAssets ? (
                <EmptyState>
                  <Loading />
                </EmptyState>
              ) : assets.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <Package size={48} />
                  </EmptyIcon>
                  <EmptyText>
                    {debouncedSearch || categoryFilter || statusFilter
                      ? "Không tìm thấy tài sản nào"
                      : "Chưa có tài sản nào"}
                  </EmptyText>
                </EmptyState>
              ) : (
                assets.map((asset) => {
                  const user = getAssetUser(asset);
                  return (
                  <TableRow key={asset.id}>
                      <TableCell>{getAssetCode(asset)}</TableCell>
                    <TableCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{asset.name}</div>
                        {asset.description && (
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {asset.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                        {user ? (
                        <UserInfo>
                          <Avatar>
                              {user.avatar ? (
                                <Image src={user.avatar} alt={user.name} width={40} height={40} />
                            ) : (
                                <span>{user.name.charAt(0)}</span>
                            )}
                          </Avatar>
                          <div>
                              <UserName>{user.name}</UserName>
                          </div>
                        </UserInfo>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </TableCell>
                      <TableCell>{getAssetPrice(asset)}</TableCell>
                    <TableCell>
                      <StatusBadge $color={getStatusColor(asset.status)}>
                        {getStatusText(asset.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <ActionButton $variant="view" onClick={() => handleViewAsset(asset)}>
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton $variant="edit" onClick={() => handleEditClick(asset)}>
                          <Edit size={16} />
                        </ActionButton>
                          <ActionButton $variant="edit" onClick={() => handleAssignClick(asset)} title="Gán tài sản">
                            <UserPlus size={16} />
                        </ActionButton>
                        <ActionButton $variant="delete" onClick={() => handleDeleteClick(asset)}>
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </AssetTable>
            {assets.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ padding: "1rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>
                  Danh sách yêu cầu tài sản
                </h3>
                <p style={{ margin: 0, fontSize: "15px", color: "#6b7280" }}>
                  Tổng cộng: <strong style={{ color: "#2196F3" }}>{filteredRequests.length}</strong> yêu cầu
                </p>
              </div>
              
              <ListAssetRequests
                requests={paginatedRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            </div>
            
            {paginatedRequests.length > 0 && filteredRequests.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentRequestPage}
                totalPages={totalRequestPages}
                onPageChange={setCurrentRequestPage}
              />
            )}
          </>
        )}
      </ContentContainer>

      {/* Modals */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAsset}
      />

      <EditAssetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
        onSave={handleEditAsset}
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAsset(null);
        }}
        onConfirm={handleDeleteAsset}
        title="Xóa tài sản"
        message="Bạn có chắc chắn muốn xóa tài sản này?"
        assetName={selectedAsset?.name}
      />

      <AssignAssetModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
        onAssign={handleAssignAsset}
      />
    </Container>
  );
};

export default AssetManagement;
