"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { vi } from "date-fns/locale/vi";
import meetingService from "@/services/meeting.service";
import {
    Meeting,
    MeetingRoom,
    CreateMeetingPayload,
    UpdateMeetingPayload,
} from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { useAuthContext } from "@/contexts/AuthContext";
import Calendar from "../Calendar/Calendar";
import MeetingBooking from "../MeetingBooking/MeetingBooking";
import MeetingDetail from "../MeetingDetail/MeetingDetail";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import Select from "@/components/common/Select/Select";
import { Loading } from "@/components/common";
import {
    MeetingRoomsContainer,
    MeetingRoomsHeader,
    MeetingRoomsTitle,
    MeetingRoomsActions,
    MeetingRoomsContent,
    CalendarSection,
    BookingSection,
    FiltersContainer,
    FilterRow,
    MeetingList,
    MeetingItem,
    MeetingItemHeader,
    MeetingItemContent,
    MeetingItemActions,
    EmptyState,
} from "./meetingRoomsStyle";

const MeetingRooms: React.FC = () => {
    const queryClient = useQueryClient();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const { user } = useAuthContext();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(
        null
    );
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(
        undefined
    );
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

    const currentUserId = user?.id;

    // Fetch rooms
    const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
        queryKey: ["meeting-rooms", { is_active: true }],
        queryFn: () => meetingService.getRooms({ is_active: true }),
    });

    const rooms = roomsData?.data || [];

    // Set default room to first room when rooms are loaded
    useEffect(() => {
        if (rooms.length > 0 && !selectedRoomId) {
            setSelectedRoomId(rooms[0].id);
        }
    }, [rooms, selectedRoomId]);

    // Fetch meetings
    const meetingParams = useMemo(() => {
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
        const params: any = {
            from_date: format(weekStart, "yyyy-MM-dd"),
            to_date: format(weekEnd, "yyyy-MM-dd"),
        };
        // Luôn filter theo room được chọn (mặc định là phòng đầu tiên)
        if (selectedRoomId) {
            params.room_id = selectedRoomId;
        }
        return params;
    }, [currentWeek, selectedRoomId]);

    const { data: meetingsData, isLoading: isLoadingMeetings } = useQuery({
        queryKey: ["meetings", meetingParams],
        queryFn: () => meetingService.getMeetings(meetingParams),
    });

    const meetings = meetingsData?.data || [];

    // Lọc chỉ lấy meetings của user hiện tại
    const myMeetings = useMemo(() => {
        if (!currentUserId) return [];
        return meetings.filter(
            (meeting) => meeting.organizer_id === currentUserId
        );
    }, [meetings, currentUserId]);

    // Create meeting mutation
    const createMutation = useMutation({
        mutationFn: (payload: CreateMeetingPayload) =>
            meetingService.createMeeting(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            showSuccessToast("Đặt phòng họp thành công!");
            setIsBookingModalOpen(false);
            setSelectedDate(undefined);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || "Có lỗi xảy ra khi đặt phòng";
            showErrorToast(errorMessage);
        },
    });

    // Update meeting mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateMeetingPayload;
        }) => meetingService.updateMeeting(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            showSuccessToast("Cập nhật lịch đặt phòng thành công!");
            setIsBookingModalOpen(false);
            setIsDetailModalOpen(false);
            setSelectedMeeting(null);
            setIsEditMode(false);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
            showErrorToast(errorMessage);
        },
    });

    // Delete meeting mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => meetingService.deleteMeeting(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
            showSuccessToast("Xóa lịch đặt phòng thành công!");
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || "Có lỗi xảy ra khi xóa";
            showErrorToast(errorMessage);
        },
    });

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsBookingModalOpen(true);
        setIsEditMode(false);
        setSelectedMeeting(null);
        setIsDetailModalOpen(false);
    };

    const handleEventClick = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setIsDetailModalOpen(true);
        setIsEditMode(false);
        setSelectedDate(new Date(meeting.start_time));
    };

    const handleEditClick = () => {
        if (selectedMeeting) {
            setIsDetailModalOpen(false);
            setIsBookingModalOpen(true);
            setIsEditMode(true);
        }
    };

    const handleBookingSubmit = (data: CreateMeetingPayload) => {
        if (isEditMode && selectedMeeting) {
            updateMutation.mutate({
                id: selectedMeeting.id.toString(),
                payload: data,
            });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = () => {
        if (
            selectedMeeting &&
            window.confirm("Bạn có chắc chắn muốn xóa lịch đặt phòng này?")
        ) {
            deleteMutation.mutate(selectedMeeting.id.toString());
            setIsDetailModalOpen(false);
            setIsBookingModalOpen(false);
            setSelectedMeeting(null);
        }
    };

    const roomOptions = rooms.map((room) => ({
        value: room.id.toString(),
        label: room.name,
    }));

    const selectedTimeSlot = selectedMeeting
        ? {
              start: format(new Date(selectedMeeting.start_time), "HH:mm"),
              end: format(new Date(selectedMeeting.end_time), "HH:mm"),
          }
        : undefined;

    return (
        <MeetingRoomsContainer>
            <MeetingRoomsHeader>
                <MeetingRoomsTitle>Đặt phòng họp</MeetingRoomsTitle>
                <MeetingRoomsActions>
                    <Button
                        variant="primary"
                        icon={<Plus size={20} />}
                        onClick={() => {
                            setSelectedDate(undefined);
                            setIsBookingModalOpen(true);
                            setIsDetailModalOpen(false);
                            setIsEditMode(false);
                            setSelectedMeeting(null);
                        }}
                    >
                        Đặt phòng
                    </Button>
                </MeetingRoomsActions>
            </MeetingRoomsHeader>

            <MeetingRoomsContent>
                <CalendarSection>
                    <Calendar
                        meetings={meetings}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onEventClick={handleEventClick}
                        onMonthChange={(week) => setCurrentWeek(week)}
                        currentUserId={currentUserId}
                    />
                </CalendarSection>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <FiltersContainer>
                        <FilterRow>
                            <Select
                                label="Phòng họp"
                                options={roomOptions}
                                value={selectedRoomId?.toString() || (rooms[0]?.id?.toString() || "")}
                                onChange={(value) =>
                                    setSelectedRoomId(
                                        value ? Number(value) : rooms[0]?.id
                                    )
                                }
                                placeholder="Chọn phòng"
                            />
                        </FilterRow>
                    </FiltersContainer>
                    <BookingSection>
                        <h3>Lịch đặt phòng của tôi</h3>
                        {isLoadingMeetings ? (
                            <Loading />
                        ) : myMeetings.length === 0 ? (
                            <EmptyState>
                                <CalendarIcon size={48} />
                                <p>Chưa có lịch đặt phòng nào</p>
                            </EmptyState>
                        ) : (
                            <MeetingList>
                                {myMeetings.map((meeting) => {
                                    return (
                                        <MeetingItem
                                            key={meeting.id}
                                            $isMyMeeting={true}
                                        >
                                            <MeetingItemHeader>
                                                <h4>{meeting.title}</h4>
                                                <span>
                                                    {meeting.room?.name}
                                                </span>
                                            </MeetingItemHeader>
                                            <MeetingItemContent>
                                                <p>{meeting.description}</p>
                                                <div>
                                                    <strong>Thời gian:</strong>{" "}
                                                    {format(
                                                        new Date(
                                                            meeting.start_time
                                                        ),
                                                        "dd/MM/yyyy HH:mm",
                                                        {
                                                            locale: vi,
                                                        }
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                        new Date(
                                                            meeting.end_time
                                                        ),
                                                        "HH:mm",
                                                        { locale: vi }
                                                    )}
                                                </div>
                                            </MeetingItemContent>
                                            <MeetingItemActions>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEventClick(
                                                            meeting
                                                        )
                                                    }
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </MeetingItemActions>
                                        </MeetingItem>
                                    );
                                })}
                            </MeetingList>
                        )}
                    </BookingSection>
                </div>
            </MeetingRoomsContent>

            {/* Modal chi tiết cuộc họp */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    // Không set selectedMeeting = null ở đây để giữ dữ liệu khi chuyển sang edit mode
                }}
                title="Chi tiết lịch đặt phòng"
                size="lg"
            >
                {selectedMeeting && (
                    <MeetingDetail
                        meeting={selectedMeeting}
                        currentUserId={currentUserId}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        isDeleting={deleteMutation.isPending}
                    />
                )}
            </Modal>

            {/* Modal đặt phòng/chỉnh sửa */}
            <Modal
                isOpen={isBookingModalOpen}
                onClose={() => {
                    setIsBookingModalOpen(false);
                    setIsDetailModalOpen(false);
                    setSelectedMeeting(null);
                    setIsEditMode(false);
                    setSelectedDate(undefined);
                }}
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
                        onSubmit={handleBookingSubmit}
                        onCancel={() => {
                            setIsBookingModalOpen(false);
                            setSelectedMeeting(null);
                            setIsEditMode(false);
                        }}
                        isLoading={
                            createMutation.isPending || updateMutation.isPending
                        }
                        isEditMode={isEditMode && selectedMeeting ? true : false}
                        isReadOnly={false}
                    />
                )}
            </Modal>
        </MeetingRoomsContainer>
    );
};

export default MeetingRooms;
