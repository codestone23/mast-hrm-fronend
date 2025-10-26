"use client";

import React from "react";
import { Modal } from "@/components/common";
import {
  ModalContent,
  DetailSection,
  StatusBadge,
  Divider,
  ReasonBox,
  InfoGrid,
  InfoCard,
  InfoCardLabel,
  InfoCardValue,
  DetailHeader,
  DetailHeaderContent,
  DetailHeaderTitle,
  DetailHeaderSubtitle,
  DetailInfoGrid,
  SectionTitle,
  ApprovalSection,
  ApprovalSectionTitle,
  RejectionSection,
  RejectionSectionTitle,
  WhiteReasonBox,
  IconWrapper,
  RequestActions,
  ApproveButton,
  RejectButton,
} from "./modalStyles";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader, FileText } from "lucide-react";

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
  employeeName?: string;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestData | null;
  canApprove?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  canApprove = false,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const handleApprove = () => {
    onApprove?.(request.id);
    onClose();
  };

  const handleReject = () => {
    onReject?.(request.id);
    onClose();
  };

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

  const getStatusIcon = () => {
    switch (request.status) {
      case 'approved':
        return <CheckCircle size={20} color="#22c55e" />;
      case 'rejected':
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <Loader size={20} color="#f59e0b" className="animate-spin" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết đề xuất"
      size="lg"
    >
      <ModalContent style={{ padding: '0' }}>
        {/* Header Section */}
        <DetailHeader>
          <DetailHeaderContent>
            <div>
              <DetailHeaderTitle>
                {request.title}
              </DetailHeaderTitle>
              <DetailHeaderSubtitle>
                {getTypeLabel(request.type)}
              </DetailHeaderSubtitle>
            </div>
            <StatusBadge $status={request.status}>
              {getStatusIcon()}
              {getStatusLabel(request.status)}
            </StatusBadge>
          </DetailHeaderContent>
        </DetailHeader>

        {/* Info Cards Grid */}
        <DetailInfoGrid>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><Calendar size={12} /></IconWrapper>
              Ngày bắt đầu
            </InfoCardLabel>
            <InfoCardValue>{formatDate(request.startDate)}</InfoCardValue>
          </InfoCard>
          {request.endDate && request.endDate !== request.startDate && (
            <InfoCard>
              <InfoCardLabel>
                <IconWrapper><Calendar size={12} /></IconWrapper>
                Ngày kết thúc
              </InfoCardLabel>
              <InfoCardValue>{formatDate(request.endDate)}</InfoCardValue>
            </InfoCard>
          )}
          {request.startTime && request.endTime && (
            <>
              <InfoCard>
                <InfoCardLabel>
                  <IconWrapper><Clock size={12} /></IconWrapper>
                  Thời gian bắt đầu
                </InfoCardLabel>
                <InfoCardValue>{request.startTime}</InfoCardValue>
              </InfoCard>
              <InfoCard>
                <InfoCardLabel>
                  <IconWrapper><Clock size={12} /></IconWrapper>
                  Thời gian kết thúc
                </InfoCardLabel>
                <InfoCardValue>{request.endTime}</InfoCardValue>
              </InfoCard>
            </>
          )}
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><FileText size={12} /></IconWrapper>
              Ngày gửi
            </InfoCardLabel>
            <InfoCardValue>{formatDateTime(request.submittedAt)}</InfoCardValue>
          </InfoCard>
          {request.employeeName && (
            <InfoCard>
              <InfoCardLabel>
                <IconWrapper><User size={12} /></IconWrapper>
                Người tạo
              </InfoCardLabel>
              <InfoCardValue>{request.employeeName}</InfoCardValue>
            </InfoCard>
          )}
        </DetailInfoGrid>

        {/* Reason Section */}
        <DetailSection>
          <SectionTitle>
            <FileText size={16} />
            Lý do yêu cầu
          </SectionTitle>
          <ReasonBox>
            {request.reason}
          </ReasonBox>
        </DetailSection>

        {/* Approval Section */}
        {request.approverName && (
          <>
            <Divider />
            <ApprovalSection>
              <ApprovalSectionTitle>
                <CheckCircle size={16} />
                Thông tin duyệt
              </ApprovalSectionTitle>
              <InfoGrid>
                <InfoCard style={{ background: 'white' }}>
                  <InfoCardLabel>
                    <IconWrapper><User size={12} /></IconWrapper>
                    Người duyệt
                  </InfoCardLabel>
                  <InfoCardValue>{request.approverName}</InfoCardValue>
                </InfoCard>
                {request.approvedAt && (
                  <InfoCard style={{ background: 'white' }}>
                    <InfoCardLabel>
                      <IconWrapper><Clock size={12} /></IconWrapper>
                      Thời gian duyệt
                    </InfoCardLabel>
                    <InfoCardValue>{formatDateTime(request.approvedAt)}</InfoCardValue>
                  </InfoCard>
                )}
              </InfoGrid>
            </ApprovalSection>
          </>
        )}

        {/* Rejection Section */}
        {request.rejectionReason && (
          <>
            <Divider />
            <RejectionSection>
              <RejectionSectionTitle>
                <XCircle size={16} />
                Lý do từ chối
              </RejectionSectionTitle>
              <WhiteReasonBox>
                {request.rejectionReason}
              </WhiteReasonBox>
            </RejectionSection>
          </>
        )}

        {/* Action Buttons for Pending Requests */}
        {canApprove && request.status === 'pending' && (
          <>
            <Divider />
            <RequestActions style={{ padding: '1rem' }}>
              <ApproveButton onClick={handleApprove}>
                <CheckCircle size={18} />
                Duyệt đề xuất
              </ApproveButton>
              <RejectButton onClick={handleReject}>
                <XCircle size={18} />
                Từ chối đề xuất
              </RejectButton>
            </RequestActions>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RequestDetailModal;

