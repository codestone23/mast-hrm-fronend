"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Clock, User, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Select } from '@/components/common';
import CreateRequestModal from './modals/CreateRequestModal';
import {
  RequestList,
  RequestItem,
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
  const [requests, setRequests] = useState<RequestData[]>([
    {
      id: 'request_1',
      type: 'leave',
      title: 'Xin nghỉ phép',
      startDate: '2024-09-25',
      endDate: '2024-09-26',
      reason: 'Về quê thăm gia đình, có việc gia đình cần giải quyết. Xin phép nghỉ 2 ngày để sắp xếp công việc.',
      status: 'pending',
      submittedAt: '2024-09-20T09:00:00Z',
      employeeName: 'Nguyễn Văn A'
    },
    {
      id: 'request_2',
      type: 'overtime',
      title: 'Đăng ký làm thêm giờ',
      startDate: '2024-09-22',
      endDate: '2024-09-22',
      startTime: '18:00',
      endTime: '20:00',
      reason: 'Hoàn thành dự án MAST trước deadline. Cần hoàn thiện các tính năng còn lại và kiểm thử toàn diện.',
      status: 'approved',
      submittedAt: '2024-09-21T14:30:00Z',
      employeeName: 'Trần Thị B',
      approverName: 'Lê Văn C',
      approvedAt: '2024-09-21T15:00:00Z'
    },
    {
      id: 'request_3',
      type: 'forgot_checkin',
      title: 'Quên chấm công',
      startDate: '2024-09-19',
      endDate: '2024-09-19',
      startTime: '08:30',
      endTime: '17:30',
      reason: 'Quên mang thẻ và điện thoại hết pin. Đã có mặt đúng giờ và làm việc đầy đủ. Xin xác nhận lại.',
      status: 'rejected',
      submittedAt: '2024-09-19T18:00:00Z',
      employeeName: 'Phạm Văn D',
      approverName: 'Nguyễn Thị E',
      rejectionReason: 'Lý do không hợp lệ, đã kiểm tra camera và xác nhận không có mặt tại văn phòng vào thời gian này.'
    }
  ]);
  
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

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'leave': 'Xin nghỉ phép',
      'sick_leave': 'Nghỉ ốm',
      'personal_leave': 'Nghỉ việc riêng',
      'maternity_leave': 'Nghỉ thai sản',
      'overtime': 'Làm thêm giờ',
      'remote_work': 'Làm việc từ xa',
      'late_arrival': 'Đi muộn',
      'early_departure': 'Về sớm',
      'forgot_checkin': 'Quên chấm công',
      'business_trip': 'Công tác',
      'other': 'Khác'
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
              $status={request.status}
              onClick={() => onRequestClick && onRequestClick(request)}
              style={{ cursor: onRequestClick ? 'pointer' : 'default' }}
            >
              <RequestHeader>
                <RequestTitle>{request.title}</RequestTitle>
                <RequestStatus $status={request.status}>
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
                  <span>•</span>
                  <span>Gửi: {formatDateTime(request.submittedAt)}</span>
                </RequestMetaItem>
              </RequestMeta>
              
              <RequestReason>{request.reason}</RequestReason>

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
