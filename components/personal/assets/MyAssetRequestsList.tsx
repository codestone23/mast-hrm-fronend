"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AssetRequest } from "@/constants/types";
import { REQUEST_STATUS } from "@/constants/enums";
import {
  RequestList,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "@/components/timekeeping/modals/modalStyles";
import { FileText, Calendar, Package, Hash, Clock, CheckCircle2, XCircle, AlertCircle, Info, Search } from "lucide-react";
import { Input, Select } from "@/components/common";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RequestCard = styled.div<{ $status?: string }>`
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => {
      const status = props.$status?.toUpperCase();
      switch (status) {
        case REQUEST_STATUS.APPROVED:
          return "#22c55e";
        case REQUEST_STATUS.REJECTED:
          return "#ef4444";
        case "FULFILLED":
          return "#3b82f6";
        default:
          return "#f59e0b";
      }
    }};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const CardTitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const AssetName = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  
  svg {
    width: 14px;
    height: 14px;
    color: #6b7280;
  }
`;

const StatusBadge = styled.span<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${props => props.$bg};
  color: ${props => props.$color};
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MetaSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  svg {
    width: 14px;
    height: 14px;
    color: #9ca3af;
    flex-shrink: 0;
  }
  
  span {
    white-space: nowrap;
  }
`;

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.5rem;
  border-radius: 8px;
`;

const DescriptionItem = styled.div`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
  
  strong {
    font-weight: 600;
    color: #111827;
    margin-right: 0.5rem;
  }
`;

const AlertBox = styled.div<{ $type: "error" | "info" | "success" }>`
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  
  ${props => {
    switch (props.$type) {
      case "error":
        return `
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        `;
      case "info":
        return `
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
        `;
      case "success":
        return `
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        `;
    }
  }}
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  strong {
    font-weight: 600;
    margin-right: 0.5rem;
  }
`;

const ApproverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: #f0fdf4;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #166534;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

interface MyAssetRequestsListProps {
  requests: AssetRequest[];
}

const MyAssetRequestsList: React.FC<MyAssetRequestsListProps> = ({ requests }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Filter by search term (asset name)
      const matchesSearch = !debouncedSearch || 
        (request.asset?.name || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (request.asset?.asset_code || "").toLowerCase().includes(debouncedSearch.toLowerCase());

      // Filter by status
      const matchesStatus = !statusFilter || 
        request.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [requests, debouncedSearch, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case REQUEST_STATUS.PENDING:
        return { 
          bg: "#fef3c7", 
          color: "#92400e",
          text: "Chờ duyệt",
          icon: <AlertCircle size={14} />
        };
      case REQUEST_STATUS.APPROVED:
        return { 
          bg: "#d1fae5", 
          color: "#065f46",
          text: "Đã duyệt",
          icon: <CheckCircle2 size={14} />
        };
      case REQUEST_STATUS.REJECTED:
        return { 
          bg: "#fee2e2", 
          color: "#991b1b",
          text: "Từ chối",
          icon: <XCircle size={14} />
        };
      case "FULFILLED":
        return { 
          bg: "#dbeafe", 
          color: "#1e40af",
          text: "Đã hoàn thành",
          icon: <CheckCircle2 size={14} />
        };
      default:
        return { 
          bg: "#f3f4f6", 
          color: "#6b7280",
          text: status,
          icon: <Info size={14} />
        };
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

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: REQUEST_STATUS.PENDING, label: "Chờ duyệt" },
    { value: REQUEST_STATUS.APPROVED, label: "Đã duyệt" },
    { value: REQUEST_STATUS.REJECTED, label: "Từ chối" },
    { value: "FULFILLED", label: "Đã hoàn thành" },
    { value: "RETURNED", label: "Đã trả lại" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

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
    <>
      <FilterContainer>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã tài sản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            fullWidth={true}
          />
        </div>
        <div style={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
          <Select
            label="Lọc theo trạng thái"
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value === "" ? "" : String(value))}
            placeholder="Chọn trạng thái"
            fullWidth
          />
        </div>
      </FilterContainer>

      {filteredRequests.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateIcon>
            <FileText size={48} />
          </EmptyStateIcon>
          <EmptyStateTitle>Không tìm thấy yêu cầu nào</EmptyStateTitle>
          <EmptyStateDescription>
            {searchTerm || statusFilter
              ? "Thử thay đổi bộ lọc để tìm kiếm"
              : "Bạn chưa có yêu cầu tài sản nào được gửi"}
          </EmptyStateDescription>
        </EmptyStateContainer>
      ) : (
        <RequestList>
          {filteredRequests.map((request) => {
        const statusConfig = getStatusConfig(request.status);
        return (
          <RequestCard key={request.id} $status={request.status}>
            <CardHeader>
              <CardTitleSection>
                <AssetName>
                  {request.asset?.name || "Yêu cầu tài sản"}
                  <InfoRow>
                    <InfoBadge>
                      <Package size={14} />
                      <span>{getRequestTypeText(request.request_type)}</span>
                    </InfoBadge>
                    {request.expected_date && (
                      <InfoBadge>
                        <Calendar size={14} />
                        <span>
                          Dự kiến: {new Date(request.expected_date).toLocaleDateString("vi-VN")}
                        </span>
                      </InfoBadge>
                    )}
                  </InfoRow>
                </AssetName>
              </CardTitleSection>
              <StatusBadge $color={statusConfig.color} $bg={statusConfig.bg}>
                {statusConfig.icon}
                <span>{statusConfig.text}</span>
              </StatusBadge>
            </CardHeader>

            <CardBody>
              {(request.description || request.justification) && (
                <DescriptionSection>
                  <div>
                    {request.description && (
                      <DescriptionItem>
                        <strong>Mô tả:</strong>
                        <span>{request.description}</span>
                      </DescriptionItem>
                    )}
                    {request.justification && (
                      <DescriptionItem>
                        <strong>Lý do:</strong>
                        <span>{request.justification}</span>
                      </DescriptionItem>
                    )}
                  </div>
                  <MetaSection>
                    {request.created_at && (
                      <MetaItem>
                        <Clock size={14} />
                        <span>
                          Tạo: {new Date(request.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </MetaItem>
                    )}
                    {request.asset?.asset_code && (
                      <MetaItem>
                        <Package size={14} />
                        <span>Mã TS: {request.asset.asset_code}</span>
                      </MetaItem>
                    )}
                  </MetaSection>
                </DescriptionSection>
              )}

              {request.rejected_reason && (
                <AlertBox $type="error">
                  <XCircle size={18} />
                  <div>
                    <strong>Lý do từ chối:</strong>
                    {request.rejected_reason}
                  </div>
                </AlertBox>
              )}

              {request.approver && (
                <ApproverInfo>
                  <CheckCircle2 size={16} />
                  <span>
                    Được duyệt bởi: <strong>{request.approver.user_information?.name || request.approver.email}</strong>
                    {request.approved_at && (
                      <> - {new Date(request.approved_at).toLocaleDateString("vi-VN")}</>
                    )}
                  </span>
                </ApproverInfo>
              )}

              {request.notes && (
                <AlertBox $type="info">
                  <Info size={18} />
                  <div>
                    <strong>Ghi chú:</strong>
                    {request.notes}
                  </div>
                </AlertBox>
              )}
            </CardBody>
          </RequestCard>
        );
      })}
    </RequestList>
      )}
    </>
  );
};

export default MyAssetRequestsList;

