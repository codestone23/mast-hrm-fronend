"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal, Loading } from "@/components/common";
import { ArrowRight } from "lucide-react";
import divisionsService from "@/services/divisions.service";
import {
  DetailSection,
  DetailLabel,
  DetailValue,
  DetailGrid,
  RotationBadge,
  DivisionTransfer,
  DivisionName,
  ArrowIcon,
} from "../rotationStyle";

interface RotationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rotationId: number | null;
}

const fmtDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

const RotationDetailModal: React.FC<RotationDetailModalProps> = ({
  isOpen,
  onClose,
  rotationId,
}) => {
  const { data: rotation, isLoading } = useQuery({
    queryKey: ["rotation-member", rotationId],
    queryFn: () => divisionsService.getRotationMemberById(rotationId!),
    enabled: !!rotationId && isOpen,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết luân chuyển" size="md">
      {isLoading ? (
        <Loading />
      ) : rotation ? (
        <div>
          <DetailSection>
            <DetailLabel>Nhân viên</DetailLabel>
            <DetailValue>{rotation.user?.user_information?.name || "N/A"}</DetailValue>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              {rotation.user?.email}
            </div>
          </DetailSection>

          <DetailSection>
            <DetailLabel>Luân chuyển</DetailLabel>
            <DivisionTransfer>
              <DivisionName>{rotation.from_division?.name || "N/A"}</DivisionName>
              <ArrowIcon>
                <ArrowRight size={16} />
              </ArrowIcon>
              <DivisionName>{rotation.to_division?.name || "N/A"}</DivisionName>
            </DivisionTransfer>
          </DetailSection>

          <DetailGrid>
            <DetailSection>
              <DetailLabel>Loại luân chuyển</DetailLabel>
              <RotationBadge $type={rotation.type}>
                {rotation.type === "PERMANENT" ? "Vĩnh viễn" : "Tạm thời"}
              </RotationBadge>
            </DetailSection>

            <DetailSection>
              <DetailLabel>Ngày luân chuyển</DetailLabel>
              <DetailValue>{fmtDate(rotation.date_rotation)}</DetailValue>
            </DetailSection>
          </DetailGrid>

          <DetailGrid>
            <DetailSection>
              <DetailLabel>Ngày tạo</DetailLabel>
              <DetailValue>{fmtDate(rotation.created_at)}</DetailValue>
            </DetailSection>

            <DetailSection>
              <DetailLabel>Cập nhật lần cuối</DetailLabel>
              <DetailValue>{fmtDate(rotation.updated_at)}</DetailValue>
            </DetailSection>
          </DetailGrid>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          Không tìm thấy thông tin luân chuyển
        </div>
      )}
    </Modal>
  );
};

export default RotationDetailModal;

