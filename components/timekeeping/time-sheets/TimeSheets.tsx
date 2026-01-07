"use client";

import {
  REQUEST_STATUS,
  REQUEST_TYPE,
  REQUEST_TYPE_LABEL,
} from "@/constants/enums";
import { Request } from "@/services/requests.service";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  ScanFace,
  Home,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMobile } from "@/hooks/useMobile";
import FaceIdentify from "../face-identify/FaceIdentify";
import CreateRequestModal from "../modals/CreateRequestModal";
import ForgotTimekeepingModal from "../modals/ForgotTimekeepingModal";
import LateEarlyModal from "../modals/LateEarlyModal";
import { RequestModalState, RequestModalType } from "../modals/modalTypes";
import PaidLeaveModal from "../modals/PaidLeaveModal";
import RegularOvertimeModal from "../modals/RegularOvertimeModal";
import RemoteWorkModal from "../modals/RemoteWorkModal";
import RequestDetailModal from "../modals/RequestDetailModal";
import RequestTypeModal from "../modals/RequestTypeModal";
import MyRequestsList from "../MyRequestsList";
import RegisterFace from "../register-face/RegisterFace";
import {
  CalendarContainer,
  CalendarGrid,
  CalendarHeader,
  CreateButton,
  DayCell,
  DayHeader,
  DayMenu,
  DayNumber,
  DayStatus,
  RequestIconsContainer,
  RequestIcon,
  Header,
  HeaderButtons,
  LeaveHours,
  Legend,
  LegendColor,
  LegendItem,
  MainContent,
  MonthButton,
  MonthDisplay,
  MonthNavigation,
  SidebarCard,
  SidebarContainer,
  SidebarContent,
  SidebarTitle,
  StatItem,
  StatLabel,
  StatNumber,
  StatsGrid,
  Tab,
  TabsContainer,
  TimeDisplay,
  TimeSheetsContainer,
  TotalWork,
  WeekDay,
  WorkSchedule,
  WorkScheduleTime,
  TabContentWrapper,
} from "./timeSheetStyle";
import { useTimeSheet } from "./useTimeSheet";
import { WEEK_DAYS } from "@/constants/constants";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
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
  day_off?: {
    id: number;
    duration: string;
    type: string;
    created_at: string;
    updated_at: string;
    request_id: number;
  } | null;
  overtime?: {
    id: number;
    start_time: string;
    end_time: string;
    total_hours: number;
    project_id: number;
    request_id: number;
    project?: {
      id: number;
      name: string;
      code: string;
    };
  } | null;
  late_early_request?: {
    id: number;
    late_minutes: number;
    early_minutes: number;
    request_id: number;
  } | null;
  forgot_checkin_request?: {
    id: number;
    checkin_time: string;
    checkout_time: string;
    request_id: number;
  } | null;
  remote_work_request?: {
    id: number;
    remote_type: string;
    request_id: number;
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
    paid_leave: number | null;
    unpaid_leave: number | null;
    requests?: RequestsStructure | TimeSheetRequest[];
  };
}

const TimeSheets: React.FC = () => {
  const isMobile = useMobile();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("BẢNG CHẤM CÔNG");
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] =
    useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<TimeSheetRequest | null>(null);

  const [requestModalState, setRequestModalState] = useState<RequestModalState>(
    {
      isRequestTypeModalOpen: false,
      activeModal: RequestModalType.NONE,
      selectedDate: "",
    }
  );
  const [editRequest, setEditRequest] = useState<Request | null>(null);

  const getTodayInVietnamTimezone = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toISOString().split("T")[0];
  };

  const { data: timeSheetData, isLoading, setPayload } = useTimeSheet();
  const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);

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

  const tabs = useMemo(() => {
    const baseTabs = ["BẢNG CHẤM CÔNG"];

    baseTabs.splice(1, 0, "DANH SÁCH ĐỀ XUẤT");

    return baseTabs;
  }, []);

  // Read tab from URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "requests" && tabs.includes("DANH SÁCH ĐỀ XUẤT")) {
      setActiveTab("DANH SÁCH ĐỀ XUẤT");
    }
  }, [searchParams, tabs]);

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

  // Handle day menu click
  const handleDayMenuClick = (date: string) => {
    setRequestModalState({
      isRequestTypeModalOpen: true,
      activeModal: RequestModalType.NONE,
      selectedDate: date,
    });
  };

  // Handle request actions
  const handleApproveRequest = (requestId: string) => {
    console.log("Approve request:", requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Reject request:", requestId);
  };

  // Handle request type selection
  const handleSelectRequestType = (requestType: string) => {
    const modalType = requestType as RequestModalType;
    setEditRequest(null); // Reset editRequest when creating new request
    setRequestModalState((prev) => {
      const newState = {
        ...prev,
        isRequestTypeModalOpen: false,
        activeModal: modalType,
      };
      return newState;
    });
  };

  // Close all modals
  const closeAllModals = () => {
    setRequestModalState({
      isRequestTypeModalOpen: false,
      activeModal: RequestModalType.NONE,
      selectedDate: "",
    });
    setEditRequest(null);
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

  // Handle request icon click
  const handleRequestIconClick = (request: TimeSheetRequest) => {
    setSelectedRequestForDetail(request);
    setIsDetailModalOpen(true);
  };

  // Helper function to map REQUEST_TYPE to API endpoint type
  const getRequestTypeEndpoint = (requestType: REQUEST_TYPE): string => {
    const typeMap: Record<REQUEST_TYPE, string> = {
      [REQUEST_TYPE.REMOTE_WORK]: "remote-work",
      [REQUEST_TYPE.DAY_OFF]: "day-off",
      [REQUEST_TYPE.OVERTIME]: "overtime",
      [REQUEST_TYPE.LATE_EARLY]: "late-early",
      [REQUEST_TYPE.FORGOT_CHECKIN]: "forgot-checkin",
    };
    return typeMap[requestType] || requestType.toLowerCase();
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
    <TimeSheetsContainer>
      <Header>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              $active={activeTab === tab}
              $isMobile={isMobile}
              onClick={() => setActiveTab(tab)}
            >
              {isMobile && tab.length > 15 ? tab.substring(0, 15) + "..." : tab}
            </Tab>
          ))}
        </TabsContainer>
        <HeaderButtons $isMobile={isMobile}>
          <CreateButton
            $isMobile={isMobile}
            onClick={() => {
              const today = getTodayInVietnamTimezone();
              setRequestModalState({
                isRequestTypeModalOpen: true,
                activeModal: RequestModalType.NONE,
                selectedDate: today,
              });
            }}
          >
            <Plus size={isMobile ? 14 : 16} />
            {isMobile ? "Đề xuất" : "Tạo đề xuất"}
          </CreateButton>
          <CreateButton 
            $isMobile={isMobile}
            onClick={() => setActiveTab("FaceIdentify")}
          >
            <ScanFace size={isMobile ? 14 : 16} />
            {isMobile ? "Chấm công" : "Chấm công"}
          </CreateButton>
        </HeaderButtons>
      </Header>

      <RequestTypeModal
        isOpen={Boolean(
          requestModalState.isRequestTypeModalOpen &&
            requestModalState.activeModal === RequestModalType.NONE &&
            requestModalState.selectedDate
        )}
        onClose={closeAllModals}
        onSelectRequestType={handleSelectRequestType}
        selectedDate={requestModalState.selectedDate}
      />

      <MainContent>
        {activeTab === "BẢNG CHẤM CÔNG" && (
          <>
            <CalendarContainer>
              <MonthNavigation>
                <MonthButton onClick={() => navigateMonth("prev")}>
                  <ChevronLeft size={20} />
                </MonthButton>
                <MonthDisplay>
                  {monthNames[currentDate.getMonth()]} /{" "}
                  {currentDate.getFullYear()}
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
                          onMouseEnter={(e) => {
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
                              {getAllRequests(dayData.requests).map((request, idx) => (
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
                          <DayMenu
                            onClick={() => handleDayMenuClick(day.fullDate)}
                          >
                            ...
                          </DayMenu>
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

            <SidebarContainer>
              <SidebarCard>
                <SidebarTitle>Ca làm chuẩn</SidebarTitle>
                <SidebarContent>
                  <WorkSchedule>08:30 - 12:00</WorkSchedule>
                  <WorkScheduleTime>13:30 - 17:30</WorkScheduleTime>
                </SidebarContent>
              </SidebarCard>

              <SidebarCard>
                <SidebarTitle>
                  <Calendar size={14} />
                  Số giờ phép còn lại
                </SidebarTitle>
                <SidebarContent>
                  <LeaveHours>{userData?.remaining_leave_days || 0}</LeaveHours>
                </SidebarContent>
              </SidebarCard>

              <SidebarCard>
                <SidebarTitle>Tổng số công</SidebarTitle>
                <SidebarContent>
                  <TotalWork>
                      {isLoadingStats
                        ? "..."
                        : Math.round(attendanceStats?.total_work_hours || 0)}
                      /{(attendanceStats?.expected_work_days || 0) * 8}
                    </TotalWork>
                  </SidebarContent>
                </SidebarCard>

              <StatsGrid>
                <StatItem>
                  <StatNumber>
                    {isLoadingStats
                      ? "..."
                      : attendanceStats?.late_minutes || 0}
                  </StatNumber>
                  <StatLabel>Số phút muộn</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoading
                      ? "..."
                      : Object.values(timeSheetData).reduce(
                          (
                            total: number,
                            day: ProcessedTimeSheetData[string]
                          ) => total + (day.earlyTime || 0),
                          0
                        )}
                    /120
                  </StatNumber>
                  <StatLabel>Quỹ phút đi muộn, về sớm</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoadingStats
                      ? "..."
                      : attendanceStats?.paid_leave_hours || 0}
                  </StatNumber>
                  <StatLabel>Nghỉ có lương (h)</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoadingStats
                      ? "..."
                      : attendanceStats?.unpaid_leave_hours || 0}
                  </StatNumber>
                  <StatLabel>Nghỉ không lương (h)</StatLabel>
                </StatItem>
              </StatsGrid>
            </SidebarContainer>
          </>
        )}

        {activeTab === "DANH SÁCH ĐỀ XUẤT" && (
          <div style={{ width: "100%" }}>
            <MyRequestsList
              onRequestClick={(request) => {
                setSelectedRequest(request);
                setIsDetailModalOpen(true);
              }}
              onEditRequest={(request) => {
                setEditRequest(request);
                const endpointType = getRequestTypeEndpoint(request.request_type as REQUEST_TYPE);
                const modalTypeMap: Record<string, RequestModalType> = {
                  'remote-work': RequestModalType.REMOTE_WORK,
                  'day-off': RequestModalType.PAID_LEAVE,
                  'overtime': RequestModalType.REGULAR_OVERTIME,
                  'late-early': RequestModalType.LATE_EARLY,
                  'forgot-checkin': RequestModalType.FORGOT_TIMEKEEPING,
                };
                const modalType = modalTypeMap[endpointType];
                if (modalType) {
                  setRequestModalState({
                    isRequestTypeModalOpen: false,
                    activeModal: modalType,
                    selectedDate: request.work_date || "",
                  });
                }
              }}
            />
          </div>
        )}

        {activeTab === "FaceIdentify" && (
          <TabContentWrapper $isMobile={isMobile}>
            <h3 style={{ marginBottom: "1rem" }}>Xác thực khuôn mặt</h3>
            <FaceIdentify />
          </TabContentWrapper>
        )}

        {activeTab === "RegisterFace" && (
          <TabContentWrapper $isMobile={isMobile}>
            <h3 style={{ marginBottom: "1rem" }}>Đăng ký khuôn mặt</h3>
            <RegisterFace />
          </TabContentWrapper>
        )}
      </MainContent>

      <CreateRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
      />

      {/* Specific Request Modals */}
      <LateEarlyModal
        isOpen={requestModalState.activeModal === RequestModalType.LATE_EARLY}
        onClose={() => {
          closeAllModals();
          setEditRequest(null);
        }}
        selectedDate={requestModalState.selectedDate}
        requestId={editRequest?.id}
        requestType={editRequest ? getRequestTypeEndpoint(editRequest.request_type as REQUEST_TYPE) : undefined}
      />

      <RemoteWorkModal
        isOpen={requestModalState.activeModal === RequestModalType.REMOTE_WORK}
        onClose={() => {
          closeAllModals();
          setEditRequest(null);
        }}
        selectedDate={requestModalState.selectedDate}
        requestId={editRequest?.id}
        requestType={editRequest ? getRequestTypeEndpoint(editRequest.request_type as REQUEST_TYPE) : undefined}
      />

      <PaidLeaveModal
        isOpen={requestModalState.activeModal === RequestModalType.PAID_LEAVE}
        onClose={() => {
          closeAllModals();
          setEditRequest(null);
        }}
        selectedDate={requestModalState.selectedDate}
        requestId={editRequest?.id}
        requestType={editRequest ? getRequestTypeEndpoint(editRequest.request_type as REQUEST_TYPE) : undefined}
      />

      <RegularOvertimeModal
        isOpen={
          requestModalState.activeModal === RequestModalType.REGULAR_OVERTIME
        }
        onClose={() => {
          closeAllModals();
          setEditRequest(null);
        }}
        selectedDate={requestModalState.selectedDate}
        requestId={editRequest?.id}
        requestType={editRequest ? getRequestTypeEndpoint(editRequest.request_type as REQUEST_TYPE) : undefined}
      />

      <ForgotTimekeepingModal
        isOpen={
          requestModalState.activeModal === RequestModalType.FORGOT_TIMEKEEPING
        }
        onClose={() => {
          closeAllModals();
          setEditRequest(null);
        }}
        selectedDate={requestModalState.selectedDate}
        requestId={editRequest?.id}
        requestType={editRequest ? getRequestTypeEndpoint(editRequest.request_type as REQUEST_TYPE) : undefined}
      />

      <RequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
          setSelectedRequestForDetail(null);
        }}
        request={selectedRequest || (selectedRequestForDetail ? {
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
        } as Request : null)}
        canApprove={
          (selectedRequest || selectedRequestForDetail)
            ? activeTab === "LIST ĐỀ XUẤT" &&
              (selectedRequest?.status || selectedRequestForDetail?.status) === REQUEST_STATUS.PENDING
            : false
        }
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </TimeSheetsContainer>
  );
};

export default TimeSheets;
