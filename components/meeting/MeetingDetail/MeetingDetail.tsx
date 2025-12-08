"use client";

import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Calendar, Clock, MapPin, FileText, User } from "lucide-react";
import { Meeting } from "@/types/api";
import Button from "@/components/common/Button/Button";
import {
  DetailContainer,
  DetailSection,
  DetailRow,
  DetailLabel,
  DetailValue,
  DetailActions,
} from "./meetingDetailStyle";

interface MeetingDetailProps {
  meeting: Meeting;
  currentUserId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({
  meeting,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const isMyMeeting = currentUserId && meeting.organizer_id === currentUserId;
  const startDate = new Date(meeting.start_time);
  const endDate = new Date(meeting.end_time);

  return (
    <DetailContainer>
      <DetailSection>
        <DetailRow>
          <DetailLabel>
            <FileText size={18} />
            <span>Tiêu đề</span>
          </DetailLabel>
          <DetailValue>{meeting.title}</DetailValue>
        </DetailRow>

        {meeting.description && (
          <DetailRow>
            <DetailLabel>
              <FileText size={18} />
              <span>Mô tả</span>
            </DetailLabel>
            <DetailValue>{meeting.description || "Không có mô tả"}</DetailValue>
          </DetailRow>
        )}

        <DetailRow>
          <DetailLabel>
            <MapPin size={18} />
            <span>Phòng họp</span>
          </DetailLabel>
          <DetailValue>{meeting.room?.name || "Chưa xác định"}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>
            <Calendar size={18} />
            <span>Ngày</span>
          </DetailLabel>
          <DetailValue>
            {format(startDate, "dd/MM/yyyy", { locale: vi })}
          </DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>
            <Clock size={18} />
            <span>Thời gian</span>
          </DetailLabel>
          <DetailValue>
            {format(startDate, "HH:mm", { locale: vi })} -{" "}
            {format(endDate, "HH:mm", { locale: vi })}
          </DetailValue>
        </DetailRow>

        {meeting.organizer && (
          <DetailRow>
            <DetailLabel>
              <User size={18} />
              <span>Người tổ chức</span>
            </DetailLabel>
            <DetailValue>
              {meeting.organizer.name || "Chưa xác định"}
            </DetailValue>
          </DetailRow>
        )}
      </DetailSection>

      {isMyMeeting && (onEdit || onDelete) && (
        <DetailActions>
          {onEdit && (
            <Button variant="primary" onClick={onEdit}>
              Sửa
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={onDelete}
            >
              Xóa
            </Button>
          )}
        </DetailActions>
      )}
    </DetailContainer>
  );
};

export default MeetingDetail;
