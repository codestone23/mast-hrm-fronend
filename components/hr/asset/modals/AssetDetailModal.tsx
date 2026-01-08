"use client";

import React from "react";
import { Package, Calendar, Tag, User } from "lucide-react";
import Image from "next/image";
import {
  ModalBody,
  DetailField,
  DetailLabel,
  DetailValue,
  IconWrapper,
} from "./modalStyle";
import { Asset } from "@/constants/types";
import { AssetStatus } from "@/constants/enums";
import { Modal } from "@/components/common";

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
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết tài sản"
    >
      <ModalBody>
        <DetailField>
          <DetailLabel>Tên tài sản:</DetailLabel>
          <DetailValue style={{ fontWeight: 600, fontSize: "16px" }}>
            {asset.name}
          </DetailValue>
        </DetailField>
        <DetailField>
          <IconWrapper>
            <Package size={20} />
          </IconWrapper>
          <DetailLabel>Mã tài sản:</DetailLabel>
          <DetailValue>{asset.asset_code || asset.code || "Không có"}</DetailValue> 
        </DetailField>


        {asset.description && (
          <DetailField>
            <IconWrapper>
              <Package size={20} />
            </IconWrapper>
            <DetailLabel>Mô tả:</DetailLabel>
            <DetailValue>{asset.description}</DetailValue>
          </DetailField>
        )}

        <DetailField>
          <IconWrapper>
            <Tag size={20} />
          </IconWrapper>
          <DetailLabel>Danh mục:</DetailLabel>
          <DetailValue>{asset.category || "Không có"}</DetailValue>
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
                {asset.user.avatar && asset.user.avatar.includes('https') && (
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
    </Modal>
  );
};

export default AssetDetailModal;

