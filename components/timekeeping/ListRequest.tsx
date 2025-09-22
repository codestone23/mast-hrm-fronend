"use client";

import React, { useState } from 'react';
import { FileText, Calendar, Clock, User, Plus, Filter } from 'lucide-react';
import { Button, Select } from '@/components/common';
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
  EmptyState
} from './modals/modalStyles';

interface RequestData {
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
}

interface ListRequestProps {
  onCreateRequest?: () => void;
}

const ListRequest: React.FC<ListRequestProps> = ({ onCreateRequest }) => {
  const [requests, setRequests] = useState<RequestData[]>([
    {
      id: 'request_1',
      type: 'leave',
      title: 'Xin nghỉ phép',
      startDate: '2024-09-25',
      endDate: '2024-09-26',
      reason: 'Về quê thăm gia đình',
      status: 'pending',
      submittedAt: '2024-09-20T09:00:00Z'
    },
    {
      id: 'request_2',
      type: 'overtime',
      title: 'Đăng ký làm thêm giờ',
      startDate: '2024-09-22',
      endDate: '2024-09-22',
      startTime: '18:00',
      endTime: '20:00',
      reason: 'Hoàn thành dự án MAST trước deadline',
      status: 'approved',
      submittedAt: '2024-09-21T14:30:00Z'
    },
    {
      id: 'request_3',
      type: 'forgot_checkin',
      title: 'Quên chấm công',
      startDate: '2024-09-19',
      endDate: '2024-09-19',
      startTime: '08:30',
      endTime: '17:30',
      reason: 'Quên mang thẻ và điện thoại hết pin',
      status: 'rejected',
      submittedAt: '2024-09-19T18:00:00Z'
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

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    if (onCreateRequest) {
      onCreateRequest();
    }
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    const typeMatch = typeFilter === 'all' || request.type === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Danh sách yêu cầu ({filteredRequests.length})
          </h3>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleOpenCreateModal}
          >
            <Plus size={16} />
            Tạo yêu cầu
          </Button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-secondary)" />
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
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState>
          <FileText size={48} />
          <h3>Không có yêu cầu nào</h3>
          <p>
            {statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Không tìm thấy yêu cầu nào với bộ lọc hiện tại'
              : 'Tạo yêu cầu đầu tiên của bạn'
            }
          </p>
        </EmptyState>
      ) : (
        <RequestList>
          {filteredRequests.map((request) => (
            <RequestItem key={request.id}>
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
