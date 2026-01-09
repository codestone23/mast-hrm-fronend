"use client";

import React from "react";
import { Modal } from "@/components/common";
import { Request } from '@/services/requests.service';
import {
  ModalContent,
  StatusBadge,
  Divider,
  InfoGrid,
  InfoCard,
  InfoCardLabel,
  InfoCardValue,
  DetailHeader,
  DetailHeaderContent,
  DetailHeaderTitle,
  DetailHeaderSubtitle,
  DetailInfoGrid,
  ApprovalSection,
  ApprovalSectionTitle,
  RejectionSection,
  RejectionSectionTitle,
  WhiteReasonBox,
  IconWrapper,
  RequestActions,
  ApproveButton,
  RejectButton,
  TitleCard,
} from "./modalStyles";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader, FileText } from "lucide-react";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/constants/enums";
import { useAppSelector } from "@/store/hooks";

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
  const { data: user } = useAppSelector((state) => state.user);

  console.log(request);
  
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
      [REQUEST_TYPE.REMOTE_WORK]: 'Làm việc từ xa',
      [REQUEST_TYPE.DAY_OFF]: 'Nghỉ phép',
      [REQUEST_TYPE.OVERTIME]: 'Làm thêm giờ',
      [REQUEST_TYPE.LATE_EARLY]: 'Đi muộn/Về sớm',
      [REQUEST_TYPE.FORGOT_CHECKIN]: 'Quên chấm công',
    };
    return typeMap[type] || type;
  };

  const getStatusLabel = (status: REQUEST_STATUS) => {
    const statusMap: { [key: string]: string } = {
      [REQUEST_STATUS.PENDING]: 'Chờ duyệt',
      [REQUEST_STATUS.APPROVED]: 'Đã duyệt',
      [REQUEST_STATUS.REJECTED]: 'Từ chối'
    };
    return statusMap[status as REQUEST_STATUS] || status;
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
      case REQUEST_STATUS.APPROVED:
        return <CheckCircle size={20} color="#22c55e" />;
      case REQUEST_STATUS.REJECTED:
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <Loader size={20} color="#f59e0b" className="animate-spin" />;
    }
  };

  const getTitle = (type: REQUEST_TYPE) => {
    switch (type) {
      case REQUEST_TYPE.REMOTE_WORK:
        return 'Làm việc từ xa';
      case REQUEST_TYPE.DAY_OFF:
        return 'Nghỉ phép';
      case REQUEST_TYPE.OVERTIME:
        return 'Làm thêm giờ';
      case REQUEST_TYPE.LATE_EARLY:
        return 'Đi muộn/Về sớm';
      case REQUEST_TYPE.FORGOT_CHECKIN:
        return 'Quên chấm công';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Loại yêu cầu: ${getTitle(request.request_type as REQUEST_TYPE)}`}
      size="lg"
    >
      <ModalContent style={{ padding: '0' }}>
        {/* Header Section */}
        <DetailHeader>
          <DetailHeaderContent>
            <div>
              <TitleCard>Tiêu đề: {request.title}</TitleCard>
              <DetailHeaderTitle>
                {getTypeLabel(request.type)}
              </DetailHeaderTitle>
              <DetailHeaderSubtitle>
                Lý do: {request.reason}
              </DetailHeaderSubtitle>
            </div>
            <StatusBadge $status={request.status}>
              {getStatusIcon()}
              {getStatusLabel(request.status)}
            </StatusBadge>
          </DetailHeaderContent>
        </DetailHeader>

        <DetailInfoGrid>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><Calendar size={12} /></IconWrapper>
              Ngày làm việc
            </InfoCardLabel>
            <InfoCardValue>{request.work_date ? formatDate(request.work_date) : "..."}</InfoCardValue>
          </InfoCard>
          <InfoCard>
            <InfoCardLabel>
              <IconWrapper><FileText size={12} /></IconWrapper>
              Ngày gửi
            </InfoCardLabel>
            <InfoCardValue>{formatDateTime(request.created_at)}</InfoCardValue>
          </InfoCard>

          {!!request?.user_id && request?.user_id !== user?.id && (
            <>
            <InfoCard>
              <InfoCardLabel>
                <IconWrapper><User size={12} /></IconWrapper>
                Người tạo
              </InfoCardLabel>
              <InfoCardValue>{request?.user?.user_information?.name || request?.user?.email || "..."}</InfoCardValue>
            </InfoCard>
            {request?.user?.user_information?.position && (
            <InfoCard>
              <InfoCardLabel>
                <IconWrapper><User size={12} /></IconWrapper>
                Chức vụ
              </InfoCardLabel>
              <InfoCardValue>{request?.user?.user_information?.position}</InfoCardValue>
            </InfoCard>
            )}
            </>
          )}
          {request?.approved_by_user && (
            <InfoCard>
              <InfoCardLabel>
                <IconWrapper><User size={12} /></IconWrapper>
                Người duyệt
              </InfoCardLabel>
              <InfoCardValue>{request?.approved_by_user?.user_information?.name || request?.approved_by_user?.email}</InfoCardValue>
            </InfoCard>
          )}
        </DetailInfoGrid>

        {/* Approval Section - chỉ hiển thị khi đã được duyệt */}
        {request.status === REQUEST_STATUS.APPROVED && (
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
                  <InfoCardValue>{request.approved_at ? formatDateTime(request.approved_at) : formatDateTime(request.created_at)}</InfoCardValue>
                </InfoCard>
              </InfoGrid>
            </ApprovalSection>
          </>
        )}

        {/* Rejection Section - chỉ hiển thị khi bị từ chối */}
        {request.status === REQUEST_STATUS.REJECTED && (
          <>
            <Divider />
            <RejectionSection>
              <RejectionSectionTitle>
                <XCircle size={16} />
                Đã bị từ chối
              </RejectionSectionTitle>
              <WhiteReasonBox>
                {request.rejected_reason || 'Request này đã bị từ chối.'}
              </WhiteReasonBox>
            </RejectionSection>
          </>
        )}

        {/* Action Buttons for Pending Requests */}
        {/* {canApprove && request.status === REQUEST_STATUS.PENDING && (
          <>
            <Divider />
            <RequestActions style={{ padding: '1rem' }}>
              <ApproveButton onClick={handleApprove}>
                <CheckCircle size={18} />
                Duyệt yêu cầu
              </ApproveButton>
              <RejectButton onClick={handleReject}>
                <XCircle size={18} />
                Từ chối yêu cầu
              </RejectButton>
            </RequestActions>
          </>
        )} */}
      </ModalContent>
    </Modal>
  );
};

export default RequestDetailModal;

