"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, isSameDay, addWeeks, subWeeks, isBefore, startOfDay } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Meeting } from "@/types/api";
import {
  CalendarContainer,
  CalendarHeader,
  CalendarNavButton,
  CalendarTitle,
  WeeklyGrid,
  TimeColumn,
  TimeHeader,
  TimeSlot,
  DayColumn,
  DayHeader,
  DayContent,
  HourSlot,
  MeetingBlock,
} from "./calendarStyle";
import { useMobile } from "@/hooks/useMobile";
import { Modal, DatePicker, Button } from "@/components/common";

interface CalendarProps {
  meetings: Meeting[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (meeting: Meeting) => void;
  onMonthChange?: (month: Date) => void;
  currentUserId?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  meetings,
  selectedDate,
  onDateSelect,
  onEventClick,
  onMonthChange,
  currentUserId,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isWeekPickerOpen, setIsWeekPickerOpen] = useState(false);
  const [selectedWeekDate, setSelectedWeekDate] = useState<Date | null>(null);
  const isMobile = useMobile();
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  // Chỉ lấy 5 ngày từ thứ 2 đến thứ 6 (bỏ thứ 7 và CN)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  const handlePrevWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    onMonthChange?.(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    onMonthChange?.(newWeek);
  };

  // Kiểm tra meeting có trong quá khứ không
  const isMeetingInPast = (meeting: Meeting): boolean => {
    const meetingStart = new Date(meeting.start_time);
    const now = new Date();
    return isBefore(meetingStart, now);
  };

  // Lấy tất cả meetings cho một ngày (bao gồm cả meetings trong quá khứ)
  const getMeetingsForDay = (day: Date): Meeting[] => {
    return meetings.filter((meeting) => {
      const meetingStart = new Date(meeting.start_time);
      // Lấy tất cả meetings của ngày này
      return isSameDay(meetingStart, day);
    });
  };

  // Kiểm tra xem meeting có bắt đầu trong time slot này không
  const doesMeetingStartInSlot = (meeting: Meeting, day: Date, timeSlot: string): boolean => {
    const meetingStart = new Date(meeting.start_time);
    const [slotHour, slotMinute] = timeSlot.split(":").map(Number);
    return (
      isSameDay(meetingStart, day) &&
      meetingStart.getHours() === slotHour &&
      meetingStart.getMinutes() === slotMinute
    );
  };

  const isTimeSlotInPast = (day: Date, timeSlot: string): boolean => {
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotDateTime = new Date(day);
    slotDateTime.setHours(hour, minute, 0, 0);
    const now = new Date();
    return isBefore(slotDateTime, now);
  };

  const isDayInPast = (day: Date): boolean => {
    const dayStart = startOfDay(day);
    const todayStart = startOfDay(new Date());
    return isBefore(dayStart, todayStart);
  };

  const handleTimeSlotClick = (day: Date, timeSlot: string) => {
    // Không cho phép click vào time slot trong quá khứ
    if (isTimeSlotInPast(day, timeSlot)) {
      return;
    }
    const [hour, minute] = timeSlot.split(":").map(Number);
    const date = new Date(day);
    date.setHours(hour, minute, 0, 0);
    onDateSelect?.(date);
  };

  const handleMeetingClick = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    // Không cho phép click vào meetings trong quá khứ
    if (isMeetingInPast(meeting)) {
      return;
    }
    const isMyMeeting = currentUserId && meeting.organizer?.id === currentUserId;
    if (isMyMeeting) {
      onEventClick?.(meeting);
    }
  };

  const getMeetingPosition = (meeting: Meeting, day: Date, timeSlot: string): { top: number; height: number } | null => {
    const meetingStart = new Date(meeting.start_time);
    const meetingEnd = new Date(meeting.end_time);
    const [slotHour, slotMinute] = timeSlot.split(":").map(Number);
    const slotStart = new Date(day);
    slotStart.setHours(slotHour, slotMinute, 0, 0);

    // Chỉ hiển thị meeting nếu nó bắt đầu trong slot này
    if (!isSameDay(meetingStart, day) || meetingStart.getHours() !== slotHour || meetingStart.getMinutes() !== slotMinute) {
      return null;
    }

    const duration = (meetingEnd.getTime() - meetingStart.getTime()) / (1000 * 60); // duration in minutes
    const height = (duration / 30) * 40; // 40px per 30 minutes

    return {
      top: 0,
      height: Math.max(height, 40),
    };
  };

  // Tính toán ngày cuối (thứ 6)
  const weekEnd = useMemo(() => {
    const friday = new Date(weekStart);
    friday.setDate(friday.getDate() + 4); // Thứ 2 + 4 ngày = Thứ 6
    return friday;
  }, [weekStart]);
  
  const weekRangeText = `${format(weekStart, "dd/MM", { locale: vi })} - ${format(weekEnd, "dd/MM/yyyy", { locale: vi })}`;

  const handleTitleClick = () => {
    setSelectedWeekDate(currentWeek);
    setIsWeekPickerOpen(true);
  };

  const handleWeekSelect = (date: Date | null) => {
    if (date) {
      setSelectedWeekDate(date);
    }
  };

  const handleConfirmWeek = () => {
    if (selectedWeekDate) {
      const newWeek = startOfWeek(selectedWeekDate, { weekStartsOn: 1 });
      setCurrentWeek(newWeek);
      onMonthChange?.(newWeek);
    }
    setIsWeekPickerOpen(false);
  };

  const handleCloseWeekPicker = () => {
    setIsWeekPickerOpen(false);
    setSelectedWeekDate(null);
  };

  return (
    <CalendarContainer $isMobile={isMobile}>
      <CalendarHeader>
        <CalendarNavButton onClick={handlePrevWeek}>
          <ChevronLeft size={20} />
        </CalendarNavButton>
        <CalendarTitle $clickable onClick={handleTitleClick}>
          Tuần {weekRangeText}
        </CalendarTitle>
        <CalendarNavButton onClick={handleNextWeek}>
          <ChevronRight size={20} />
        </CalendarNavButton>
      </CalendarHeader>

      <WeeklyGrid>
        <TimeColumn>
          <TimeHeader>Giờ</TimeHeader>
          {timeSlots.map((slot) => {
            const [, minute] = slot.split(":").map(Number);
            // Chỉ hiển thị label cho các mốc :00, ẩn label cho :30
            const displayText = minute === 0 ? slot : "";
            return (
              <TimeSlot key={slot} $isMobile={isMobile}>
                {displayText}
              </TimeSlot>
            );
          })}
        </TimeColumn>

        {weekDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPastDay = isDayInPast(day);

          return (
            <DayColumn key={day.toISOString()}>
              <DayHeader $isToday={isToday} $isSelected={!!isSelected} $isPast={isPastDay}>
                <div className="day-name">{format(day, "EEE", { locale: vi })}</div>
                <div className="day-number">{format(day, "dd/MM")}</div>
              </DayHeader>
              <DayContent>
                {(() => {
                  const dayMeetings = getMeetingsForDay(day);
                  return timeSlots.map((timeSlot) => {
                    // Tìm meeting bắt đầu trong slot này
                    const meeting = dayMeetings.find((m) => doesMeetingStartInSlot(m, day, timeSlot));
                    const isPastSlot = isTimeSlotInPast(day, timeSlot);
                    
                    // Hiển thị tất cả meetings (bao gồm cả trong quá khứ)
                    const shouldShowMeeting = meeting && getMeetingPosition(meeting, day, timeSlot);
                    const meetingInPast = meeting && isMeetingInPast(meeting);

                    return (
                      <HourSlot
                        key={timeSlot}
                        $isPast={isPastSlot}
                        onClick={() => handleTimeSlotClick(day, timeSlot)}
                      >
                        {shouldShowMeeting && meeting && (
                          <MeetingBlock
                            $isMyMeeting={currentUserId ? meeting.organizer?.id === currentUserId : false}
                            $isClickable={currentUserId ? meeting.organizer?.id === currentUserId && !meetingInPast : false}
                            style={getMeetingPosition(meeting, day, timeSlot)!}
                            onClick={(e) => handleMeetingClick(meeting, e)}
                            title={`${meeting.title} - ${meeting.room?.name || ""} (${format(new Date(meeting.start_time), "HH:mm")} - ${format(new Date(meeting.end_time), "HH:mm")})`}
                          >
                            <div className="meeting-time">
                              {format(new Date(meeting.start_time), "HH:mm")} - {format(new Date(meeting.end_time), "HH:mm")}
                            </div>
                            <div className="meeting-title">{meeting.title}</div>
                            {/* <div className="meeting-room">{meeting.room?.name || ""}</div> */}
                          </MeetingBlock>
                        )}
                      </HourSlot>
                    );
                  });
                })()}
              </DayContent>
            </DayColumn>
          );
        })}
      </WeeklyGrid>

      <Modal
        isOpen={isWeekPickerOpen}
        onClose={handleCloseWeekPicker}
        title="Chọn tuần"
        size="sm"
      >
        <div style={{ padding: '1rem 0' }}>
          <DatePicker
            value={selectedWeekDate}
            onChange={handleWeekSelect}
            placeholder="Chọn ngày trong tuần"
            label="Chọn ngày"
            fullWidth={true}
            size="md"
          />
          <div style={{ 
            marginTop: '1.5rem', 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end' 
          }}>
            <Button
              variant="outline"
              onClick={handleCloseWeekPicker}
              size="md"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmWeek}
              size="md"
              disabled={!selectedWeekDate}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </CalendarContainer>
  );
};

export default Calendar;
