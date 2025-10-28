"use client";

import React from "react";
import { Modal } from "@/components/common";
import { Request } from '@/services/requests.service';
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

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
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
    onApprove?.(request.id.toString());
    onClose();
  };

  const handleReject = () => {
    onReject?.(request.id.toString());
    onClose();
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'remote_work': 'Làm việc từ xa',
      'day_off': 'Nghỉ phép',
      'overtime': 'Làm thêm giờ',
      'late_early': 'Đi muộn/Về sớm',
      'forgot_checkin': 'Quên chấm công',
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
                {getTypeLabel(request.type)}
              </DetailHeaderTitle>
              <DetailHeaderSubtitle>
                Ngày làm việc: {formatDate(request.work_date)}
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
              Ngày làm việc
            </InfoCardLabel>
            <InfoCardValue>{formatDate(request.work_date)}</InfoCardValue>
          </InfoCard>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><FileText size={12} /></IconWrapper>
              Ngày gửi
            </InfoCardLabel>
            <InfoCardValue>{formatDateTime(request.created_at)}</InfoCardValue>
          </InfoCard>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><User size={12} /></IconWrapper>
              Người tạo
            </InfoCardLabel>
            <InfoCardValue>{request.user.user_information.name}</InfoCardValue>
          </InfoCard>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><User size={12} /></IconWrapper>
              Chức vụ
            </InfoCardLabel>
            <InfoCardValue>{request.user.user_information.position}</InfoCardValue>
          </InfoCard>
        </DetailInfoGrid>

        {/* Approval Section - chỉ hiển thị khi đã được duyệt */}
        {request.status === 'approved' && (
          <>
            <Divider />
            <ApprovalSection>
              <ApprovalSectionTitle>
                <CheckCircle size={16} />
                Đã được duyệt
              </ApprovalSectionTitle>
              <InfoGrid>
                <InfoCard style={{ background: 'white' }}>
                  <InfoCardLabel>
                    <IconWrapper><Clock size={12} /></IconWrapper>
                    Thời gian duyệt
                  </InfoCardLabel>
                  <InfoCardValue>{formatDateTime(request.created_at)}</InfoCardValue>
                </InfoCard>
              </InfoGrid>
            </ApprovalSection>
          </>
        )}

        {/* Rejection Section - chỉ hiển thị khi bị từ chối */}
        {request.status === 'rejected' && (
          <>
            <Divider />
            <RejectionSection>
              <RejectionSectionTitle>
                <XCircle size={16} />
                Đã bị từ chối
              </RejectionSectionTitle>
              <WhiteReasonBox>
                Request này đã bị từ chối.
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

