"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import {
  RequestList,
  RequestItem,
  RequestHeader,
  RequestTitle,
  RequestStatus,
  RequestMeta,
  RequestMetaItem,
  RequestReason,
  RequestActions,
  ApproveButton,
  RejectButton,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "@/components/timekeeping/modals/modalStyles";
import { FileText } from "lucide-react";
import { AssetRequest } from "@/constants/types";

interface ListAssetRequestsProps {
  requests: AssetRequest[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const ListAssetRequests: React.FC<ListAssetRequestsProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#FFF3CD", color: "#856404" };
      case "approved":
        return { bg: "#D1F2DD", color: "#155724" };
      case "rejected":
        return { bg: "#F8D7DA", color: "#721C24" };
      default:
        return { bg: "#f0f0f0", color: "#6b7280" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const handleApprove = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove?.(requestId);
  };

  const handleReject = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onReject?.(requestId);
  };

  if (requests.length === 0) {
    return (
      <EmptyStateContainer>
        <EmptyStateIcon>
          <FileText size={48} />
        </EmptyStateIcon>
        <EmptyStateTitle>Chưa có request nào</EmptyStateTitle>
        <EmptyStateDescription>
          Chưa có yêu cầu tài sản nào được gửi đến
        </EmptyStateDescription>
      </EmptyStateContainer>
    );
  }

  return (
    <RequestList>
      {requests.map((request) => {
        const statusColors = getStatusColor(request.status);
        return (
          <RequestItem key={request.id} $status={request.status as any}>
            <RequestHeader>
              <div style={{ flex: 1 }}>
                <RequestTitle>{request.asset?.name || "N/A"}</RequestTitle>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    {request.userAvatar && (
                      <Image
                        src={request.userAvatar}
                        alt={request.userName || ""}
                        width={32}
                        height={32}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    <span>{request.userName}</span>
                  </div>
                </div>
              </div>
              <RequestStatus $status={request.status as any}>
                {getStatusText(request.status)}
              </RequestStatus>
            </RequestHeader>

            <RequestMeta>
              <RequestMetaItem>
                <span>ID: {request.id}</span>
              </RequestMetaItem>
              <RequestMetaItem>
                <span>Ngày yêu cầu: {request.requestedAt}</span>
              </RequestMetaItem>
            </RequestMeta>

            <RequestReason>{request.reason}</RequestReason>

            {request.status === "pending" && onApprove && onReject && (
              <RequestActions>
                <ApproveButton onClick={(e) => handleApprove(request.id, e)}>
                  <CheckCircle size={16} />
                  Duyệt
                </ApproveButton>
                <RejectButton onClick={(e) => handleReject(request.id, e)}>
                  <XCircle size={16} />
                  Từ chối
                </RejectButton>
              </RequestActions>
            )}
          </RequestItem>
        );
      })}
    </RequestList>
  );
};

export default ListAssetRequests;

