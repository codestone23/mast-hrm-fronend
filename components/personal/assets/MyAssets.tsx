"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, FileText, Eye, Plus } from "lucide-react";
import {
  Container,
  HeaderContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  CreateButton,
} from "@/components/hr/asset/assetStyle";
import { Asset } from "@/constants/types";
import assetsService from "@/services/assets.service";
import { Table, TableColumn } from "@/components/common";
import { Button } from "@/components/common";
import AssetDetailModal from "@/components/hr/asset/modals/AssetDetailModal";
import CreateAssetRequestModal from "./modals/CreateAssetRequestModal";
import MyAssetRequestsList from "./MyAssetRequestsList";
import Pagination from "@/components/hr/asset/Pagination";

const ITEMS_PER_PAGE = 10;

const MyAssets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assets" | "requests">("assets");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);

  // Fetch my assets
  const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['my-assets'],
    queryFn: () => assetsService.getMyAssets(),
  });

  const assets = assetsData?.data || [];

  // Fetch my requests
  const { data: requestsData } = useQuery({
    queryKey: ['my-asset-requests', currentRequestPage],
    queryFn: () => assetsService.getMyRequests(),
  });

  const requests = requestsData?.data || [];
  const pagination = requestsData?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };


  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailModalOpen(true);
  };

  // Table columns
  const assetColumns: TableColumn<Asset>[] = [
    {
      key: "asset_code",
      label: "Mã TS",
      width: "120px",
      render: (_, row) => row.asset_code || row.code || "Không có", 
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
      key: "category",
      label: "Danh mục",
      width: "1fr",
      render: (_, row) => row.category || "Không có", 
    },
    {
      key: "actions",
      label: "Hành động",
      width: "100px",
      align: "center",
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleViewAsset(row);
          }}
          icon={<Eye size={14} />}
        >
          <span style={{ display: "none" }}>Xem</span>
        </Button>
      ),
    },
  ];

  const handleTabChange = (tab: "assets" | "requests") => {
    setActiveTab(tab);
    setCurrentRequestPage(1);
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
            Danh sách yêu cầu tài sản
          </TabButton>
        </TabContainer>
      </HeaderContainer>

      <ContentContainer>
        {activeTab === "assets" && (
          <>
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "flex-end" }}>
              <CreateButton onClick={() => setIsCreateRequestModalOpen(true)}>
                <Plus size={20} />
                Tạo yêu cầu tài sản
              </CreateButton>
            </div>

            <Table
              columns={assetColumns}
              data={assets}
              loading={isLoadingAssets}
              emptyState={{
                icon: <Package size={48} />,
                message: "Bạn chưa có tài sản nào được gán",
              }}
              rowKey="id"
            />
          </>
        )}

        {activeTab === "requests" && (
          <>
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "flex-end" }}>
              <CreateButton onClick={() => setIsCreateRequestModalOpen(true)}>
                <Plus size={20} />
                Tạo yêu cầu tài sản
              </CreateButton>
            </div>

            <MyAssetRequestsList requests={requests} />
            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={currentRequestPage}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentRequestPage}
              />
            )}
          </>
        )}
      </ContentContainer>

      {/* Modals */}
      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
      />

      <CreateAssetRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
      />
    </Container>
  );
};

export default MyAssets;

