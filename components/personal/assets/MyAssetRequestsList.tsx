"use client";

import React from "react";
import { AssetRequest } from "@/constants/types";
import { REQUEST_STATUS } from "@/constants/enums";
import {
  RequestList,
  RequestItem,
  RequestHeader,
  RequestTitle,
  RequestStatus,
  RequestMeta,
  RequestMetaItem,
  RequestReason,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "@/components/timekeeping/modals/modalStyles";
import { FileText, Calendar, User, Package } from "lucide-react";

interface MyAssetRequestsListProps {
  requests: AssetRequest[];
}

const MyAssetRequestsList: React.FC<MyAssetRequestsListProps> = ({ requests }) => {
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

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case "REQUEST":
        return "Yêu cầu cấp phát";
      case "RETURN":
        return "Yêu cầu trả lại";
      case "MAINTENANCE":
        return "Yêu cầu bảo trì";
      default:
        return type;
    }
  };

  if (requests.length === 0) {
    return (
      <EmptyStateContainer>
        <EmptyStateIcon>
          <FileText size={48} />
        </EmptyStateIcon>
        <EmptyStateTitle>Chưa có yêu cầu nào</EmptyStateTitle>
        <EmptyStateDescription>
          Bạn chưa có yêu cầu tài sản nào được gửi
        </EmptyStateDescription>
      </EmptyStateContainer>
    );
  }

  return (
    <RequestList>
      {requests.map((request) => {
        const statusColor = getStatusColor(request.status);
        return (
          <RequestItem key={request.id} $status={request.status as REQUEST_STATUS}> 
            <RequestHeader>
              <div style={{ flex: 1 }}>
                <RequestTitle>
                  {request.asset?.name || "Yêu cầu tài sản"}
                </RequestTitle>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    <Package size={14} />
                    <span>{getRequestTypeText(request.request_type)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    <Calendar size={14} />
                    <span>
                      {request.expected_date
                        ? new Date(request.expected_date).toLocaleDateString("vi-VN")
                        : "Không có"} 
                    </span>
                  </div>
                </div>
              </div>
              <RequestStatus $color={statusColor.color}>
                {getStatusText(request.status)}
              </RequestStatus>
            </RequestHeader>

            <RequestMeta>
              <RequestMetaItem>
                <span>ID: {request.id}</span>
              </RequestMetaItem>
              <RequestMetaItem>
                <span>
                  Ngày tạo:{" "}
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString("vi-VN")
                    : "Không có"} 
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
                <strong>Lý do:</strong> {request.justification}
              </div>
            </RequestReason>

            {request.rejection_reason && (
              <div
                style={{
                  padding: "12px",
                  background: "#fee2e2",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontSize: "14px",
                  color: "#dc2626",
                }}
              >
                <strong>Lý do từ chối:</strong> {request.rejection_reason}
              </div>
            )}

            {request.approver && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                <User size={14} />
                <span>
                  Được duyệt bởi: {request.approver.user_information?.name || request.approver.email}
                </span>
                {request.approved_at && (
                  <span>
                    - {new Date(request.approved_at).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            )}

            {request.notes && (
              <div
                style={{
                  padding: "12px",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                  marginTop: "12px",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                <strong>Ghi chú:</strong> {request.notes}
              </div>
            )}
          </RequestItem>
        );
      })}
    </RequestList>
  );
};

export default MyAssetRequestsList;

