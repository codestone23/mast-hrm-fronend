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
import { REQUEST_STATUS } from "@/constants/enums";

interface ListAssetRequestsProps {
  requests: AssetRequest[];
  onApprove?: (requestId: string | number) => void;
  onReject?: (requestId: string | number) => void;
}

const ListAssetRequests: React.FC<ListAssetRequestsProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case REQUEST_STATUS.PENDING:
        return { bg: "#FFF3CD", color: "#856404" };
      case REQUEST_STATUS.APPROVED:
        return { bg: "#D1F2DD", color: "#155724" };
      case REQUEST_STATUS.REJECTED:
        return { bg: "#F8D7DA", color: "#721C24" };
      case "FULFILLED":
        return { bg: "#D1ECF1", color: "#0C5460" };
      default:
        return { bg: "#f0f0f0", color: "#6b7280" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case REQUEST_STATUS.PENDING:
        return "Chờ duyệt";
      case REQUEST_STATUS.APPROVED:
        return "Đã duyệt";
      case REQUEST_STATUS.REJECTED:
        return "Từ chối";
      case "FULFILLED":
        return "Đã hoàn thành";
      default:
        return status;
    }
  };

  const handleApprove = (requestId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove?.(requestId);
  };

  const handleReject = (requestId: string | number, e: React.MouseEvent) => {
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
        return (
          <RequestItem key={request.id} $status={request.status}>
            <RequestHeader>
              <div style={{ flex: 1 }}>
                <RequestTitle>{request.asset?.name || request.description || "Yêu cầu tài sản"}</RequestTitle>
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
                    {request.user && (
                      <>
                        <span>{request.user.user_information?.name || request.user.email}</span>
                      </>
                    )}
                    {request.userName && <span>{request.userName}</span>}
                  </div>
                </div>
              </div>
              <RequestStatus $color={getStatusColor(request.status).color}>
                {getStatusText(request.status)}
              </RequestStatus>
            </RequestHeader>

            <RequestMeta>
              <RequestMetaItem>
                <span>ID: {request.id}</span>
              </RequestMetaItem>
              <RequestMetaItem>
                <span>
                  Ngày yêu cầu:{" "}
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString("vi-VN")
                    : request.requestedAt || "N/A"}
                </span>
              </RequestMetaItem>
              {request.asset && (
                <RequestMetaItem>
                  <span>Mã TS: {request.asset.asset_code}</span>
                </RequestMetaItem>
              )}
            </RequestMeta>

            <RequestReason>
              <div style={{ marginBottom: "8px" }}>
                <strong>Mô tả:</strong> {request.description}
              </div>
              <div>
                <strong>Lý do:</strong> {request.justification || request.reason}
              </div>
            </RequestReason>

            {request.status === REQUEST_STATUS.PENDING && onApprove && onReject && (
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

