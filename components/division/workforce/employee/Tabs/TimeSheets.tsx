"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CalendarContainer,
  CalendarGrid,
  CalendarHeader,
  DayCell,
  DayHeader,
  DayMenu,
  DayNumber,
  DayStatus,
  Legend,
  LegendColor,
  LegendItem,
  MonthButton,
  MonthDisplay,
  MonthNavigation,
  TimeDisplay,
  Container,
  WeekDay,
} from "./timeSheetStyle";

import { useTimeSheet } from "./useTimeSheet";

interface ProcessedTimeSheetData {
  [date: string]: {
    status: string;
    timeIn: string | null;
    timeOut: string | null;
    hours: number;
    lateTime: number;
    earlyTime: number;
    fines: number;
    isComplete: boolean;
    type: string;
    remote: string;
  };
}

const TimeSheets: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTodayInVietnamTimezone = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toISOString().split("T")[0];
  };

  const { data: timeSheetData, isLoading, error, setPayload } = useTimeSheet();

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    setPayload({
      start_date: startDate,
      end_date: endDate,
    });
  }, [currentDate, setPayload]);

  const weekDays = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const legendItems = [
    { color: "#4CAF50", label: "Đủ công", status: "work" },
    { color: "#FFA726", label: "Thiếu công", status: "late" },
    { color: "#9C27B0", label: "Không có công", status: "absent" },
    { color: "#F44336", label: "Nghỉ", status: "holiday" },
    { color: "#FF9800", label: "Ngày lễ", status: "leave" },
    { color: "#4CAF50", label: "Nghỉ có lương", status: "remote" },
    { color: "#2196F3", label: "Nghỉ không lương", status: "ot" },
    { color: "#FF5722", label: "Đi muộn/ về sớm", status: "late" },
    { color: "#607D8B", label: "Quên chấm công", status: "absent" },
    { color: "#795548", label: "Remote", status: "remote" },
    { color: "#009688", label: "OT", status: "ot" },
  ];

  const formatDateToVietnamTimezone = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysFromPrevMonth = adjustedFirstDay;
    const prevMonth = new Date(year, month, 0);

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dayNumber: number;
      fullDate: string;
    }> = [];

    // Thêm ngày từ tháng trước (chỉ cần đủ để bắt đầu tuần)
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        prevMonth.getDate() - i
      );
      days.push({
        date,
        isCurrentMonth: false,
        dayNumber: date.getDate(),
        fullDate: formatDateToVietnamTimezone(date),
      });
    }

    // Thêm tất cả ngày trong tháng hiện tại
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dayNumber: day,
        fullDate: formatDateToVietnamTimezone(date),
      });
    }

    // Tính số ngày cần thêm từ tháng sau để hoàn thành tuần cuối
    const lastDayOfWeek = lastDay.getDay();
    const adjustedLastDay = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
    const daysFromNextMonth = 6 - adjustedLastDay;

    // Chỉ thêm đủ ngày để hoàn thành tuần cuối
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        dayNumber: day,
        fullDate: formatDateToVietnamTimezone(date),
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    "Tháng 01",
    "Tháng 02",
    "Tháng 03",
    "Tháng 04",
    "Tháng 05",
    "Tháng 06",
    "Tháng 07",
    "Tháng 08",
    "Tháng 09",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return (
    <Container>
      <CalendarContainer>
        <MonthNavigation>
          <MonthButton onClick={() => navigateMonth("prev")}>
            <ChevronLeft size={20} />
          </MonthButton>
          <MonthDisplay>
            {monthNames[currentDate.getMonth()]} / {currentDate.getFullYear()}
          </MonthDisplay>
          <MonthButton onClick={() => navigateMonth("next")}>
            <ChevronRight size={20} />
          </MonthButton>
        </MonthNavigation>

        <Legend>
          {legendItems.map((item, index) => (
            <LegendItem key={index}>
              <LegendColor $color={item.color} />
              {item.label}
            </LegendItem>
          ))}
        </Legend>

        <CalendarHeader>
          {weekDays.map((day) => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
        </CalendarHeader>

        <CalendarGrid>
          {getCurrentMonthDays().map((day, index) => {
            const dayData = timeSheetData[day.fullDate];

            const todayString = getTodayInVietnamTimezone();
            const isToday = day.fullDate === todayString;

            // Kiểm tra ngày trong quá khứ không có data
            const dayDate = new Date(day.fullDate);
            const currentDate = new Date(todayString);
            const isPastDay = dayDate < currentDate;
            const hasNoData = !dayData && isPastDay && day.isCurrentMonth;

            let displayStatus = dayData?.status;
            if (hasNoData) {
              displayStatus = "absent";
            }

            return (
              <DayCell
                key={index}
                $isCurrentMonth={day.isCurrentMonth}
                $status={displayStatus}
                $isToday={isToday}
              >
                <DayHeader>
                  <DayNumber
                    $isCurrentMonth={day.isCurrentMonth}
                    $isToday={isToday}
                  >
                    {String(day.dayNumber).padStart(2, "0")}/
                    {String(day.date.getMonth() + 1).padStart(2, "0")}
                  </DayNumber>
                  <DayMenu>...</DayMenu>
                </DayHeader>

                {day.isCurrentMonth && (
                  <DayStatus>
                    {hasNoData ? (
                      <>
                        <div>
                          Đi Muộn: 0
                          <br />
                          Về Sớm: 0
                        </div>
                        <TimeDisplay>
                          <span>In: 00:00</span>
                          <span>Out: 00:00</span>
                        </TimeDisplay>
                      </>
                    ) : dayData ? (
                      <>
                        <div>
                          Đi Muộn: {dayData.lateTime || 0}
                          <br />
                          Về Sớm: {dayData.earlyTime || 0}
                        </div>
                        {dayData.timeIn && dayData.timeIn !== "N/A" && (
                          <TimeDisplay>
                            <span>In: {dayData.timeIn}</span>
                            <span>Out: {dayData.timeOut || "N/A"}</span>
                          </TimeDisplay>
                        )}
                        {dayData.fines > 0 && (
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--error-color)",
                            }}
                          >
                            Phạt: {dayData.fines} VNĐ
                          </div>
                        )}
                      </>
                    ) : null}
                  </DayStatus>
                )}
              </DayCell>
            );
          })}
        </CalendarGrid>
      </CalendarContainer>
    </Container>
  );
};

export default TimeSheets;
