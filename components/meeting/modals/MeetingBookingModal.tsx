"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/common/Modal/Modal";
import { Loading } from "@/components/common";
import MeetingBooking from "../MeetingBooking/MeetingBooking";
import meetingService from "@/services/meeting.service";
import { MeetingRoom, CreateMeetingPayload, Meeting } from "@/types/api";

interface MeetingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTimeSlot?: { start: string; end: string };
  selectedMeeting?: Meeting | null;
  onSubmit: (data: CreateMeetingPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

const MeetingBookingModal: React.FC<MeetingBookingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeSlot,
  selectedMeeting,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditMode = false,
}) => {
  // Fetch rooms
  const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["meeting-rooms", { is_active: true }],
    queryFn: () => meetingService.getRooms({ is_active: true }),
  });

  const rooms = roomsData?.data || [];

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode && selectedMeeting
          ? "Cập nhật lịch đặt phòng"
          : "Đặt phòng họp"
      }
      size="lg"
    >
      {isLoadingRooms ? (
        <Loading />
      ) : (
        <MeetingBooking
          rooms={rooms}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          selectedMeeting={selectedMeeting}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEditMode={isEditMode}
          isReadOnly={false}
        />
      )}
    </Modal>
  );
};

export default MeetingBookingModal;

