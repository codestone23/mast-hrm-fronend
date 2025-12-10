"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Clock, User, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Select } from '@/components/common';
import CreateRequestModal from './modals/CreateRequestModal';
import {
  RequestList,
  RequestItem,
  RequestContent,
  RequestHeader,
  RequestTitle,
  RequestStatus,
  RequestMeta,
  RequestMetaItem,
  RequestReason,
  ListRequestContainer,
  ListRequestHeader,
  ListRequestTitle,
  ListRequestSubtitle,
  ListRequestHighlight,
  FilterContainer,
  FilterLabel,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  RequestActions,
  ApproveButton,
  RejectButton,
  BulkActionButtons,
  BulkApproveButton,
  BulkRejectButton,
} from './modals/modalStyles';
import { REQUEST_STATUS, REQUEST_TYPE } from '@/constants/enums';

export interface RequestData {
  id: string;
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  employeeName?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

interface ListRequestProps {
  onCreateRequest?: () => void;
  onRequestClick?: (request: RequestData) => void;
  isMyRequestsOnly?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onApproveAll?: () => void;
  onRejectAll?: () => void;
}

const ListRequest: React.FC<ListRequestProps> = ({ 
  onRequestClick, 
  isMyRequestsOnly = false,
  onApprove,
  onReject,
  onApproveAll,
  onRejectAll
}) => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'rejected', label: 'Từ chối' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'leave', label: 'Xin nghỉ phép' },
    { value: 'sick_leave', label: 'Nghỉ ốm' },
    { value: 'personal_leave', label: 'Nghỉ việc riêng' },
    { value: 'overtime', label: 'Làm thêm giờ' },
    { value: 'remote_work', label: 'Làm việc từ xa' },
    { value: 'forgot_checkin', label: 'Quên chấm công' },
    { value: 'other', label: 'Khác' }
  ];

  const getStatusColor = (status: REQUEST_STATUS) => {
    const statusColors: { [key in REQUEST_STATUS]: string } = {
      [REQUEST_STATUS.PENDING]: "#FFA726",
      [REQUEST_STATUS.APPROVED]: "#66BB6A",
      [REQUEST_STATUS.REJECTED]: "#EF5350",
    };
    return statusColors[status as REQUEST_STATUS] || "#666";
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      [REQUEST_TYPE.DAY_OFF]: 'Nghỉ phép',
      [REQUEST_TYPE.OVERTIME]: 'Làm thêm giờ',
      [REQUEST_TYPE.REMOTE_WORK]: 'Làm việc từ xa',
      [REQUEST_TYPE.FORGOT_CHECKIN]: 'Quên chấm công',
      [REQUEST_TYPE.LATE_EARLY]: 'Đi muộn/Về sớm',
    };
    return typeMap[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Chờ duyệt',
      'approved': 'Đã duyệt',
      'rejected': 'Từ chối'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN');
  };

  const handleCreateRequest = (requestData: RequestData) => {
    setRequests(prev => [requestData, ...prev]);
  };


  const filteredRequests = requests.filter(request => {
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    const typeMatch = typeFilter === 'all' || request.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const hasPendingRequests = pendingRequests.length > 0 && !isMyRequestsOnly;

  const handleApprove = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove?.(requestId);
  };

  const handleReject = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onReject?.(requestId);
  };

  const handleApproveAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApproveAll?.();
  };

  const handleRejectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRejectAll?.();
  };

  return (
    <>
      <ListRequestContainer>
        <ListRequestHeader>
          <div>
            <ListRequestTitle>
              Danh sách yêu cầu
            </ListRequestTitle>
            <ListRequestSubtitle>
              Tổng cộng: <ListRequestHighlight>{filteredRequests.length}</ListRequestHighlight> yêu cầu
            </ListRequestSubtitle>
          </div>
        </ListRequestHeader>

        {/* Filters */}
        <FilterContainer>
          <FilterLabel>
            <Filter size={16} />
            <span>Bộ lọc:</span>
          </FilterLabel>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            options={statusOptions}
            size="sm"
            fullWidth={false}
          />
          <Select
            value={typeFilter}
            onChange={(value) => setTypeFilter(String(value))}
            options={typeOptions}
            size="sm"
            fullWidth={false}
          />
        </FilterContainer>
      </ListRequestContainer>

      {hasPendingRequests && (
        <BulkActionButtons>
          <BulkApproveButton onClick={handleApproveAll}>
            <CheckCircle size={18} />
            Duyệt tất cả ({pendingRequests.length})
          </BulkApproveButton>
          <BulkRejectButton onClick={handleRejectAll}>
            <XCircle size={18} />
            Từ chối tất cả ({pendingRequests.length})
          </BulkRejectButton>
        </BulkActionButtons>
      )}

      {filteredRequests.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateIcon>
            <FileText size={48} />
          </EmptyStateIcon>
          <EmptyStateTitle>
            Không có yêu cầu nào
          </EmptyStateTitle>
          <EmptyStateDescription>
            {statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Không tìm thấy yêu cầu nào với bộ lọc hiện tại'
              : 'Tạo yêu cầu đầu tiên của bạn'
            }
          </EmptyStateDescription>
        </EmptyStateContainer>
      ) : (
        <RequestList>
          {filteredRequests.map((request) => (
            <RequestItem 
              key={request.id}
              $status={request.status as REQUEST_STATUS}
              onClick={() => onRequestClick && onRequestClick(request)}
              style={{ cursor: onRequestClick ? 'pointer' : 'default' }}
            >
              <RequestContent>
                <RequestHeader>
                  <RequestTitle>{request.title}</RequestTitle>
                  <RequestStatus $color={getStatusColor(request.status as REQUEST_STATUS)}>
                    {getStatusLabel(request.status)}
                  </RequestStatus>
                </RequestHeader>
                
                <RequestMeta>
                  <RequestMetaItem>
                    <User size={14} />
                    <span>{getTypeLabel(request.type)}</span>
                  </RequestMetaItem>
                  <RequestMetaItem>
                    <Calendar size={14} />
                    <span>
                      {request.endDate && request.startDate !== request.endDate 
                        ? `${formatDate(request.startDate)} - ${formatDate(request.endDate)}`
                        : formatDate(request.startDate)
                      }
                    </span>
                  </RequestMetaItem>
                  {request.startTime && request.endTime && (
                    <RequestMetaItem>
                      <Clock size={14} />
                      <span>{request.startTime} - {request.endTime}</span>
                    </RequestMetaItem>
                  )}
                  <RequestMetaItem>
                    <span>Ngày gửi: {formatDateTime(request.submittedAt)}</span>
                  </RequestMetaItem>
                </RequestMeta>
                
                <RequestReason>{request.reason}</RequestReason>
              </RequestContent>

              {!isMyRequestsOnly && request.status === 'pending' && (
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
          ))}
        </RequestList>
      )}

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRequest}
      />
    </>
  );
};

export default ListRequest;
