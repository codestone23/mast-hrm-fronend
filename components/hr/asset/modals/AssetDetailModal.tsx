"use client";

import React from "react";
import { X, Package, DollarSign, MapPin, Calendar, Tag, User } from "lucide-react";
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
  DetailField,
  DetailLabel,
  DetailValue,
  IconWrapper,
} from "./modalStyle";
import { Asset } from "@/constants/types";
import { AssetStatus } from "@/constants/enums";

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  if (!isOpen || !asset) return null;

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
      case AssetStatus.AVAILABLE  : 
        return "Trống";
      case AssetStatus.ASSIGNED:
        return "Đang sử dụng";
      case AssetStatus.MAINTENANCE:
        return "Bảo trì";
      case AssetStatus.RETIRED:
        return "Thanh lý";
      default:
        return status;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer size="md" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Chi tiết tài sản</ModalTitle>
            <ModalCloseButton onClick={onClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <DetailField>
              <IconWrapper>
                <Package size={20} />
              </IconWrapper>
              <DetailLabel>Mã tài sản:</DetailLabel>
              <DetailValue>{asset.asset_code || asset.code || "N/A"}</DetailValue>
            </DetailField>

            <DetailField>
              <DetailLabel>Tên tài sản:</DetailLabel>
              <DetailValue style={{ fontWeight: 600, fontSize: "16px" }}>
                {asset.name}
              </DetailValue>
            </DetailField>

            {asset.description && (
              <DetailField>
                <DetailLabel>Mô tả:</DetailLabel>
                <DetailValue>{asset.description}</DetailValue>
              </DetailField>
            )}

            <DetailField>
              <IconWrapper>
                <Tag size={20} />
              </IconWrapper>
              <DetailLabel>Danh mục:</DetailLabel>
              <DetailValue>{asset.category || "N/A"}</DetailValue>
            </DetailField>

            {asset.purchase_date && (
              <DetailField>
                <IconWrapper>
                  <Calendar size={20} />
                </IconWrapper>
                <DetailLabel>Ngày mua:</DetailLabel>
                <DetailValue>
                  {new Date(asset.purchase_date).toLocaleDateString("vi-VN")}
                </DetailValue>
              </DetailField>
            )}

            {asset.assigned_date && (
              <DetailField>
                <IconWrapper>
                  <Calendar size={20} />
                </IconWrapper>
                <DetailLabel>Ngày gán:</DetailLabel>
                <DetailValue>
                  {new Date(asset.assigned_date).toLocaleDateString("vi-VN")}
                </DetailValue>
              </DetailField>
            )}

            {asset.user && (
              <DetailField>
                <IconWrapper>
                  <User size={20} />
                </IconWrapper>
                <DetailLabel>Người sử dụng:</DetailLabel>
                <DetailValue>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {asset.user.avatar && (
                      <Image 
                        src={asset.user.avatar} 
                        alt={asset.user.name} 
                        width={32} 
                        height={32}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    <span>{asset.user.name}</span>
                  </div>
                </DetailValue>
              </DetailField>
            )}
          </ModalBody>

          <ModalFooter>
            <CancelButton onClick={onClose}>
              Đóng
            </CancelButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AssetDetailModal;

