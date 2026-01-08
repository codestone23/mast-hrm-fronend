"use client";

import {
  REQUEST_TYPE,
  REQUEST_TYPE_LABEL,
  REQUEST_STATUS,
} from "@/constants/enums";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarContainer,
  CalendarGrid,
  CalendarHeader,
  DayCell,
  DayHeader,
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
  SidebarContainer,
  SidebarCard,
  SidebarTitle,
  SidebarContent,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel,
  MainContent,
  WorkSchedule,
  WorkScheduleTime,
  TotalWork,
  LeaveHours,
  RequestIconsContainer,
  RequestIcon,
} from "./timeSheetStyle";

import { useTimeSheet } from "./useTimeSheet";
import { WEEK_DAYS } from "@/constants/constants";
import RequestDetailModal from "@/components/timekeeping/modals/RequestDetailModal";
import { Request } from "@/services/requests.service";
import { usePersonalAttendanceStats } from "@/hooks/useAttendanceStats";

interface TimeSheetRequest {
  id: number;
  user_id: number;
  timesheet_id: number;
  work_date: string;
  request_type: string;
  title: string;
  reason: string;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    user_information?: {
      name: string;
      code?: string;
      avatar?: string | null;
    };
  };
  approved_by_user?: {
    id: number;
    email: string;
    user_information?: {
      name: string;
      code?: string;
    };
  } | null;
}

interface RequestsStructure {
  remote_work?: TimeSheetRequest[];
  day_off?: TimeSheetRequest[];
  overtime?: TimeSheetRequest[];
  late_early?: TimeSheetRequest[];
  forgot_checkin?: TimeSheetRequest[];
}

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
    request_type: string | null;
    requests?: RequestsStructure | TimeSheetRequest[];
    paid_leave: number | null;
    unpaid_leave: number | null;
  };
}

interface TimeSheetsProps {
  employeeId?: string;
}

const TimeSheets: React.FC<TimeSheetsProps> = ({ employeeId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<TimeSheetRequest | null>(null);

  const getTodayInVietnamTimezone = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime());
    return vietnamTime.toISOString().split("T")[0];
  };

  const { data: timeSheetData, isLoading, setPayload } = useTimeSheet(employeeId);

  // Tính toán start_date và end_date cho tháng hiện tại
  const monthDateRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    // Thêm 1 ngày vào cả start và end
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + 1);
    
    return {
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  }, [currentDate]);

  // Lấy thống kê từ API
  const { data: attendanceStats, isLoading: isLoadingStats } = usePersonalAttendanceStats({
    start_date: monthDateRange.start_date,
    end_date: monthDateRange.end_date,
  });

  useEffect(() => {
    setPayload({
      start_date: monthDateRange.start_date,
      end_date: monthDateRange.end_date,
    });
  }, [currentDate, setPayload, monthDateRange]);

  const legendItems = [
    { color: "#c9f8c9", label: "Đủ công", status: "work", type: "color" },
    { color: "#FFE0B2", label: "Thiếu công/Đi muộn", status: "late", type: "color" },
    { color: "#f3a7a7", label: "Không có công", status: "absent", type: "color" },
    { requestType: REQUEST_TYPE.REMOTE_WORK, label: REQUEST_TYPE_LABEL.REMOTE_WORK, type: "icon" },
    { requestType: REQUEST_TYPE.DAY_OFF, label: REQUEST_TYPE_LABEL.DAY_OFF, type: "icon" },
    { requestType: REQUEST_TYPE.OVERTIME, label: REQUEST_TYPE_LABEL.OVERTIME, type: "icon" },
    { requestType: REQUEST_TYPE.LATE_EARLY, label: REQUEST_TYPE_LABEL.LATE_EARLY, type: "icon" },
    { requestType: REQUEST_TYPE.FORGOT_CHECKIN, label: REQUEST_TYPE_LABEL.FORGOT_CHECKIN, type: "icon" },
  ];

  // Helper function to get all requests from new structure
  const getAllRequests = (requests: RequestsStructure | TimeSheetRequest[] | undefined): TimeSheetRequest[] => {
    if (!requests) return [];
    
    // Nếu là mảng (cấu trúc cũ)
    if (Array.isArray(requests)) {
      return requests;
    }
    
    // Nếu là object với các mảng (cấu trúc mới)
    const allRequests: TimeSheetRequest[] = [];
    if (requests.remote_work && Array.isArray(requests.remote_work)) {
      allRequests.push(...requests.remote_work);
    }
    if (requests.day_off && Array.isArray(requests.day_off)) {
      allRequests.push(...requests.day_off);
    }
    if (requests.overtime && Array.isArray(requests.overtime)) {
      allRequests.push(...requests.overtime);
    }
    if (requests.late_early && Array.isArray(requests.late_early)) {
      allRequests.push(...requests.late_early);
    }
    if (requests.forgot_checkin && Array.isArray(requests.forgot_checkin)) {
      allRequests.push(...requests.forgot_checkin);
    }
    
    return allRequests;
  };

  // Helper function to get icon for request type
  const getRequestIcon = (requestType: string) => {
    switch (requestType.toUpperCase()) {
      case REQUEST_TYPE.REMOTE_WORK:
        return <Home size={12} />;
      case REQUEST_TYPE.DAY_OFF:
        return <CalendarIcon size={12} />;
      case REQUEST_TYPE.OVERTIME:
        return <Clock size={12} />;
      case REQUEST_TYPE.LATE_EARLY:
        return <AlertCircle size={12} />;
      case REQUEST_TYPE.FORGOT_CHECKIN:
        return <Briefcase size={12} />;
      default:
        return null;
    }
  };

  // Helper function to format request type to display text
  const getRequestTypeLabel = (requestType: string): string => {
    switch (requestType.toUpperCase()) {
      case REQUEST_TYPE.REMOTE_WORK:
        return REQUEST_TYPE_LABEL.REMOTE_WORK;
      case REQUEST_TYPE.DAY_OFF:
        return REQUEST_TYPE_LABEL.DAY_OFF;
      case REQUEST_TYPE.OVERTIME:
        return REQUEST_TYPE_LABEL.OVERTIME;
      case REQUEST_TYPE.LATE_EARLY:
        return REQUEST_TYPE_LABEL.LATE_EARLY;
      case REQUEST_TYPE.FORGOT_CHECKIN:
        return REQUEST_TYPE_LABEL.FORGOT_CHECKIN;
      default:
        return "";
    }
  };

  // Handle request icon click
  const handleRequestIconClick = (request: TimeSheetRequest) => {
    setSelectedRequestForDetail(request);
    setIsDetailModalOpen(true);
  };

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
      <MainContent>
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
                {item.type === "color" && item.color ? (
                  <>
                    <LegendColor $color={item.color} />
                    {item.label}
                  </>
                ) : item.type === "icon" && item.requestType ? (
                  <>
                    <RequestIcon
                      $type={item.requestType}
                      $status="APPROVED"
                      style={{ 
                        margin: 0, 
                        cursor: "default",
                        pointerEvents: "none"
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {getRequestIcon(item.requestType)}
                    </RequestIcon>
                    {item.label}
                  </>
                ) : null}
              </LegendItem>
            ))}
          </Legend>

        <CalendarHeader>
          {WEEK_DAYS.map((day) => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
        </CalendarHeader>

        <CalendarGrid>
          {getCurrentMonthDays().map((day, index) => {
            const dayData = timeSheetData[day.fullDate];

            const todayString = getTodayInVietnamTimezone();
            const isToday = day.fullDate === todayString;

            // Kiểm tra ngày trong quá khứ hoặc ngày hôm nay không có data
            const dayDate = new Date(day.fullDate);
            const currentDate = new Date(todayString);
            currentDate.setHours(0, 0, 0, 0);
            dayDate.setHours(0, 0, 0, 0);
            const isPastOrToday = dayDate <= currentDate;
            const hasNoData = !dayData && isPastOrToday && day.isCurrentMonth;

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
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {dayData && dayData.requests && (
                      <RequestIconsContainer>
                        {getAllRequests(dayData.requests as RequestsStructure | TimeSheetRequest[]).map((request, idx) => (
                          <RequestIcon
                            key={idx}
                            $type={request.request_type}
                            $status={request.status}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestIconClick(request);
                            }}
                            title={getRequestTypeLabel(request.request_type)}
                          >
                            {getRequestIcon(request.request_type)}
                          </RequestIcon>
                        ))}
                      </RequestIconsContainer>
                    )}
                  </div>
                </DayHeader>

                {day.isCurrentMonth && (
                  <DayStatus>
                    {hasNoData ? (
                      <TimeDisplay>
                        <span>Vào: 00:00</span>
                        <span>Ra: 00:00</span>
                      </TimeDisplay>
                    ) : dayData ? (
                      <>
                        <div>
                          {dayData.lateTime > 0 && (
                            <span>
                              Đi Muộn: {dayData.lateTime || 0} phút
                            </span>
                          )}
                          {dayData.earlyTime > 0 && <br />}
                          {dayData.earlyTime > 0 && (
                            <span>
                              Về Sớm: {dayData.earlyTime || 0} phút
                            </span>
                          )}
                        </div>
                        {(dayData.timeIn && dayData.timeIn !== "Không có") ? ( 
                          <TimeDisplay>
                            <span>Vào: {dayData.timeIn}</span>
                            <span>Ra: {dayData.timeOut || "Không có"}</span>
                          </TimeDisplay>
                        ) : (
                          <TimeDisplay>
                            <span>Vào: 00:00</span>
                            <span>Ra: 00:00</span>
                          </TimeDisplay>
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
      </MainContent>

      <RequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequestForDetail(null);
        }}
        request={selectedRequestForDetail ? {
          id: selectedRequestForDetail.id,
          type: selectedRequestForDetail.request_type,
          request_type: selectedRequestForDetail.request_type as REQUEST_TYPE,
          user_id: selectedRequestForDetail.user_id,
          title: selectedRequestForDetail.title,
          reason: selectedRequestForDetail.reason,
          status: selectedRequestForDetail.status as REQUEST_STATUS,
          work_date: selectedRequestForDetail.work_date,
          created_at: selectedRequestForDetail.created_at,
          rejected_reason: selectedRequestForDetail.rejected_reason,
          approved_at: selectedRequestForDetail.approved_at,
          approved_by: selectedRequestForDetail.approved_by,
          approved_by_user: selectedRequestForDetail.approved_by_user ? {
            id: selectedRequestForDetail.approved_by_user.id,
            email: selectedRequestForDetail.approved_by_user.email,
            user_information: {
              name: selectedRequestForDetail.approved_by_user.user_information?.name || "",
              code: selectedRequestForDetail.approved_by_user.user_information?.code,
            },
          } : null,
          user: selectedRequestForDetail.user || {
            id: selectedRequestForDetail.user_id,
            email: "",
            user_information: {
              name: "",
              position: "",
            },
          },
        } as Request : null}
        canApprove={false}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </Container>
  );
};

export default TimeSheets;
