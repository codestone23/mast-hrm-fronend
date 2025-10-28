"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Package, FileText, Edit, Trash2, Eye } from "lucide-react";
import {
  Container,
  HeaderContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  SearchInput,
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
import CreateAssetModal from "./modals/CreateAssetModal";
import EditAssetModal from "./modals/EditAssetModal";
import AssetDetailModal from "./modals/AssetDetailModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import Pagination from "./Pagination";
import ListAssetRequests from "./ListAssetRequests";
import { REQUEST_STATUS } from "@/constants/enums";

const ITEMS_PER_PAGE = 10;

const AssetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "requests">("assets");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Mock data - generate more items to demonstrate pagination
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      code: "TS001",
      name: "Laptop Dell XPS 15",
      description: "Laptop cao cấp cho nhân viên IT",
      status: "in_use",
      category: "ĐT",
      price: 25000000,
      warehouse: "Keangnam",
      importDate: "2023-01-15",
      user: {
        id: "user1",
        name: "Nguyễn Văn A",
        avatar: "",
      },
    },
    {
      id: "2",
      code: "TS002",
      name: "MacBook Pro M1",
      description: "MacBook cho designer",
      status: "available",
      category: "MAC",
      price: 35000000,
      warehouse: "Keangnam",
      importDate: "2023-02-20",
    },
    {
      id: "3",
      code: "TS003",
      name: "Màn hình Dell 27 inch",
      description: "Màn hình UltraSharp 4K",
      status: "in_use",
      category: "Màn hình",
      price: 12000000,
      warehouse: "Sông Đà",
      importDate: "2023-03-10",
      user: {
        id: "user2",
        name: "Trần Thị B",
        avatar: "",
      },
    },
    {
      id: "4",
      code: "TS004",
      name: "Chuột Logitech MX Master",
      description: "Chuột không dây cao cấp",
      status: "available",
      category: "ĐT",
      price: 2500000,
      warehouse: "Keangnam",
      importDate: "2023-04-05",
    },
    {
      id: "5",
      code: "TS005",
      name: "Bàn phím cơ Keychron K8",
      description: "Mechanical keyboard",
      status: "in_use",
      category: "ĐT",
      price: 3500000,
      warehouse: "Keangnam",
      importDate: "2023-05-10",
      user: {
        id: "user3",
        name: "Lê Văn C",
        avatar: "",
      },
    },
    {
      id: "6",
      code: "TS006",
      name: "Webcam Logitech C920",
      description: "Webcam HD 1080p",
      status: "available",
      category: "ĐT",
      price: 3500000,
      warehouse: "Sông Đà",
      importDate: "2023-06-15",
    },
    {
      id: "7",
      code: "TS007",
      name: "Microphone Blue Yeti",
      description: "USB Microphone",
      status: "in_use",
      category: "ĐT",
      price: 5500000,
      warehouse: "Keangnam",
      importDate: "2023-07-20",
      user: {
        id: "user4",
        name: "Phạm Thị D",
        avatar: "",
      },
    },
    {
      id: "8",
      code: "TS008",
      name: "iPad Pro 12.9 inch",
      description: "Tablet cho meeting",
      status: "available",
      category: "MAC",
      price: 25000000,
      warehouse: "Sông Đà",
      importDate: "2023-08-25",
    },
    {
      id: "9",
      code: "TS009",
      name: "Đèn bàn BenQ ScreenBar",
      description: "Bảo vệ mắt",
      status: "maintenance",
      category: "ĐT",
      price: 4500000,
      warehouse: "Keangnam",
      importDate: "2023-09-01",
    },
    {
      id: "10",
      code: "TS010",
      name: "Laptop Lenovo ThinkPad",
      description: "Laptop business",
      status: "in_use",
      category: "ĐT",
      price: 20000000,
      warehouse: "Sông Đà",
      importDate: "2023-10-10",
      user: {
        id: "user5",
        name: "Hoàng Văn E",
        avatar: "",
      },
    },
    {
      id: "11",
      code: "TS011",
      name: "Monitor LG 34 inch",
      description: "Ultrawide monitor",
      status: "available",
      category: "Màn hình",
      price: 15000000,
      warehouse: "Keangnam",
      importDate: "2023-11-15",
    },
  ]);

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
    {
      id: "req2",
      assetId: "2",
      asset: assets[1],
      userId: "user4",
      userName: "Phạm Thị D",
      userAvatar: "",
      reason: "Request MacBook cho dự án thiết kế, cần tool thiết kế chuyên nghiệp",
      status: REQUEST_STATUS.PENDING,
      requestedAt: "2024-01-12",
    },
    {
      id: "req3",
      assetId: "4",
      asset: assets[3],
      userId: "user6",
      userName: "Nguyễn Thị F",
      userAvatar: "",
      reason: "Chuột hiện tại bị hỏng, cần thay thế gấp",
      status: REQUEST_STATUS.APPROVED,
      requestedAt: "2024-01-08",
    },
    {
      id: "req4",
      assetId: "5",
      asset: assets[4],
      userId: "user7",
      userName: "Trần Văn G",
      userAvatar: "",
      reason: "Phòng làm việc ồn, cần keyboard im lặng hơn",
      status: REQUEST_STATUS.REJECTED,
      requestedAt: "2024-01-05",
    },
  ]);

  const filteredAssets = useMemo(() => {
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (request) =>
        request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  // Pagination logic
  const totalAssetPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const totalRequestPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAssets.slice(start, end);
  }, [filteredAssets, currentPage]);

  const paginatedRequests = useMemo(() => {
    const start = (currentRequestPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentRequestPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "#10b981";
      case "in_use":
        return "#3b82f6";
      case "maintenance":
        return "#f59e0b";
      case "disposed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Trống";
      case "in_use":
        return "Đang sử dụng";
      case "maintenance":
        return "Bảo trì";
      case "disposed":
        return "Thanh lý";
      default:
        return status;
    }
  };

  // Handlers
  const handleCreateAsset = (assetData: Omit<Asset, "id">) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
    };
    setAssets([...assets, newAsset]);
    setIsCreateModalOpen(false);
  };

  const handleEditAsset = (assetData: Asset) => {
    setAssets(assets.map(asset => asset.id === assetData.id ? assetData : asset));
    setIsEditModalOpen(false);
    setSelectedAsset(null);
  };

  const handleDeleteAsset = () => {
    if (selectedAsset) {
      setAssets(assets.filter(asset => asset.id !== selectedAsset.id));
      setIsDeleteModalOpen(false);
      setSelectedAsset(null);
    }
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
          <div style={{ marginBottom: "12px" }}>
            <CreateButton onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} />
              Thêm tài sản
            </CreateButton>
          </div>
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
              {paginatedAssets.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <Package size={48} />
                  </EmptyIcon>
                  <EmptyText>
                    {searchTerm
                      ? "Không tìm thấy tài sản nào"
                      : "Chưa có tài sản nào"}
                  </EmptyText>
                </EmptyState>
              ) : (
                paginatedAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.code}</TableCell>
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
                      {asset.user ? (
                        <UserInfo>
                          <Avatar>
                            {asset.user.avatar ? (
                              <Image src={asset.user.avatar} alt={asset.user.name} width={40} height={40} />
                            ) : (
                              <span>{asset.user.name.charAt(0)}</span>
                            )}
                          </Avatar>
                          <div>
                            <UserName>{asset.user.name}</UserName>
                          </div>
                        </UserInfo>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.price
                        ? new Intl.NumberFormat("vi-VN").format(asset.price)
                        : "N/A"}
                    </TableCell>
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
                        <ActionButton $variant="delete" onClick={() => handleDeleteClick(asset)}>
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </AssetTable>
            {paginatedAssets.length > 0 && filteredAssets.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalAssetPages}
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
    </Container>
  );
};

export default AssetManagement;
