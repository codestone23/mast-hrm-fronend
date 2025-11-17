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
  UserInfo,
  Avatar,
  UserName,
  StatusBadge,
  ActionButton,
} from "./assetStyle";
import { Asset } from "@/constants/types";
import { AssetCategory, AssetStatus } from "@/constants/enums";
import CreateAssetModal from "./modals/CreateAssetModal";
import EditAssetModal from "./modals/EditAssetModal";
import AssetDetailModal from "./modals/AssetDetailModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import AssignAssetModal from "./modals/AssignAssetModal";
import ListAssetRequests from "./ListAssetRequests";
import assetsService, { GetAssetsParams } from "@/services/assets.service";
import { Select, Input, Table, TableColumn, Loading, Pagination } from "@/components/common";
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

  // Fetch requests
  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['asset-requests', currentRequestPage],
    queryFn: () => assetsService.getRequestHr(),
  });

  const requests = requestsData?.data || [];
  const requestPagination = requestsData?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  const totalRequestPages = requestPagination.total_pages || 1;

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

  const approveRequestMutation = useMutation({
    mutationFn: ({ requestId, data }: { requestId: number | string; data: { action: "APPROVED" | "REJECTED"; asset_id?: number | string; rejection_reason?: string; notes?: string } }) =>
      assetsService.approveRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      showSuccessToast("Duyệt yêu cầu thành công");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi duyệt yêu cầu");
    },
  });

  const handleApproveRequest = (requestId: string | number) => {
    approveRequestMutation.mutate({
      requestId,
      data: {
        action: "APPROVED",
      },
    });
  };

  const handleRejectRequest = (requestId: string | number) => {
    approveRequestMutation.mutate({
      requestId,
      data: {
        action: "REJECTED",
      },
    });
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

  // Table columns for assets
  const assetColumns: TableColumn<Asset>[] = [
    {
      key: "asset_code",
      label: "Mã TS",
      width: "120px",
      render: (_, row) => getAssetCode(row),
    },
    {
      key: "name",
      label: "Tên tài sản",
      width: "2fr",
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.name}</div>
          {row.description && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "user",
      label: "Người sử dụng",
      width: "1.5fr",
      render: (_, row) => {
        const user = getAssetUser(row);
        return user ? (
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
          <span style={{ color: "#9ca3af" }}>Chưa có người sử dụng</span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "1fr",
      render: (_, row) => (
        <StatusBadge $color={getStatusColor(row.status)}>
          {getStatusText(row.status)}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      label: "Hành động",
      width: "150px",
      align: "center",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <ActionButton $variant="view" onClick={(e) => {
            e.stopPropagation();
            handleViewAsset(row);
          }}>
            <Eye size={16} />
          </ActionButton>
          <ActionButton $variant="edit" onClick={(e) => {
            e.stopPropagation();
            handleEditClick(row);
          }}>
            <Edit size={16} />
          </ActionButton>
          <ActionButton $variant="edit" onClick={(e) => {
            e.stopPropagation();
            handleAssignClick(row);
          }} title="Gán tài sản">
            <UserPlus size={16} />
          </ActionButton>
          <ActionButton $variant="delete" onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(row);
          }}>
            <Trash2 size={16} />
          </ActionButton>
        </div>
      ),
    },
  ];

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
            Danh sách yêu cầu tài sản
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
            <Table
              columns={assetColumns}
              data={assets}
              loading={isLoadingAssets}
              emptyState={{
                icon: <Package size={48} />,
                message: debouncedSearch || categoryFilter || statusFilter
                  ? "Không tìm thấy tài sản nào"
                  : "Chưa có tài sản nào",
              }}
              rowKey="id"
            />
            {assets.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={pagination.total}
                itemsPerPage={ITEMS_PER_PAGE}
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
                  Tổng cộng: <strong style={{ color: "#2196F3" }}>{requestPagination.total || requests.length}</strong> yêu cầu
                </p>
              </div>
              
              {isLoadingRequests ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
                  <Loading />
                </div>
              ) : (
                <>
                  <ListAssetRequests
                    requests={requests}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                  />
                  {totalRequestPages > 1 && (
                    <Pagination
                      currentPage={currentRequestPage}
                      totalPages={totalRequestPages}
                      totalItems={requestPagination.total}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setCurrentRequestPage}
                    />
                  )}
                </>
              )}
            </div>
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
