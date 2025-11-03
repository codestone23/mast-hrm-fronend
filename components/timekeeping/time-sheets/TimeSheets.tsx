"use client";

import { Calendar, ChevronLeft, ChevronRight, ImageUp, Plus, ScanFace } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import FaceIdentify from "../face-identify/FaceIdentify";
import MyRequestsList from '../MyRequestsList';
import AdminRequestsList from '../AdminRequestsList';
import CreateRequestModal from '../modals/CreateRequestModal';
import RequestDetailModal from '../modals/RequestDetailModal';
import RegisterFace from "../register-face/RegisterFace";
import RequestTypeModal from '../modals/RequestTypeModal';
import LateEarlyModal from '../modals/LateEarlyModal';
import RemoteWorkModal from '../modals/RemoteWorkModal';
import PaidLeaveModal from '../modals/PaidLeaveModal';
import RegularOvertimeModal from '../modals/RegularOvertimeModal';
import ForgotTimekeepingModal from '../modals/ForgotTimekeepingModal';
import { RequestModalType, RequestModalState } from '../modals/modalTypes';
import { useAppSelector } from "@/store/hooks";
import { REQUEST_STATUS, REQUEST_TYPE, REQUEST_TYPE_LABEL, ROLE_NAMES } from "@/constants/enums";
import { Request } from '@/services/requests.service';
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
  RequestBadge,
} from "./timeSheetStyle";
import { useTimeSheet } from './useTimeSheet';

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
  };
}

const TimeSheets: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("BẢNG CHẤM CÔNG");
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // Get user role
  const userData = useAppSelector((state) => state.user.data);
  const userRole = userData?.user_information?.role?.name?.toLowerCase() || '';
  const role = useMemo(() => {
    if (!userRole) return null;
    const roleNames = Object.values(ROLE_NAMES);
    return roleNames.find(r => r.toLowerCase() === userRole) as string;
  }, [userRole]);
  
  const canSeeOtherRequests = useMemo(() => {
    if (!role) return false;
    return [
      ROLE_NAMES.TEAM_LEADER,
      ROLE_NAMES.DIVISION_HEAD,
      ROLE_NAMES.HR_MANAGER,
      ROLE_NAMES.ADMIN,
      ROLE_NAMES.SUPER_ADMIN
    ].includes(role as ROLE_NAMES);
  }, [role]);
  
  // Request modals state - optimized with single state
  const [requestModalState, setRequestModalState] = useState<RequestModalState>({
    isRequestTypeModalOpen: false,
    activeModal: RequestModalType.NONE,
    selectedDate: ''
  });

  const getTodayInVietnamTimezone = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    return vietnamTime.toISOString().split("T")[0];
  };
  
  const { data: timeSheetData, isLoading, setPayload } = useTimeSheet();

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    setPayload({
      start_date: startDate,
      end_date: endDate
    });
  }, [currentDate, setPayload]);

  const tabs = useMemo(() => {
    const baseTabs = ["BẢNG CHẤM CÔNG"];
    
    baseTabs.splice(1, 0, "LIST ĐỀ XUẤT CỦA TÔI");
    
    if (canSeeOtherRequests) {
      baseTabs.splice(2, 0, "LIST ĐỀ XUẤT");
    }
    
    return baseTabs;
  }, [canSeeOtherRequests]);

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
    { color: "#c9f8c9", label: "Đủ công", status: "work" },
    { color: "#FFE0B2", label: "Thiếu công/Đi muộn", status: "late" },
    { color: "#f3a7a7", label: "Không có công", status: "absent" },
    { color: "#B3E5FC", label: "Nghỉ có lương", status: "leave" },
    { color: "#FFE0B2", label: "Nghỉ không lương", status: "holiday" },
    { color: "#E1BEE7", label: "Làm việc từ xa", status: "remote" },
    { color: "#C8E6C9", label: "Làm thêm giờ (OT)", status: "ot" },
    { color: "#FFF59D", label: "Đi muộn/Về sớm", status: "late-early" },
    { color: "#FFCDD2", label: "Quên chấm công", status: "forgot-checkin" },
  ];

  const formatDateToVietnamTimezone = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
      selectedDate: date
    });
  };

  // Handle request actions
  const handleApproveRequest = (requestId: string) => {
    console.log('Approve request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
  };

  // Handle request type selection
  const handleSelectRequestType = (requestType: string) => {
    const modalType = requestType as RequestModalType;
    setRequestModalState(prev => {
      const newState = {
        ...prev,
        isRequestTypeModalOpen: false,
        activeModal: modalType
      };
      return newState;
    });
  };

  // Close all modals
  const closeAllModals = () => {
    setRequestModalState({
      isRequestTypeModalOpen: false,
      activeModal: RequestModalType.NONE,
      selectedDate: ''
    });
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
        return '';
    }
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
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabsContainer>
        <HeaderButtons>
          <CreateButton onClick={() => {
            const today = getTodayInVietnamTimezone();
            setRequestModalState({
              isRequestTypeModalOpen: true,
              activeModal: RequestModalType.NONE,
              selectedDate: today
            });
          }}>
            <Plus size={16} />
            Tạo request
          </CreateButton>
          <CreateButton onClick={() => setActiveTab("FaceIdentify")}>
            <ScanFace size={16} />
            Quét mặt
          </CreateButton>
          <CreateButton onClick={() => setActiveTab("RegisterFace")}>
            <ImageUp size={16} />
          </CreateButton>
         </HeaderButtons>
      </Header>

      <RequestTypeModal
        isOpen={Boolean(requestModalState.isRequestTypeModalOpen && requestModalState.activeModal === RequestModalType.NONE && requestModalState.selectedDate)}
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
                    console.log(dayData);
                    
                    const todayString = getTodayInVietnamTimezone();
                    const isToday = day.fullDate === todayString;
                    
                    // Kiểm tra ngày trong quá khứ không có data
                    const dayDate = new Date(day.fullDate);
                    const currentDate = new Date(todayString);
                    const isPastDay = dayDate < currentDate;
                    const hasNoData = !dayData && isPastDay && day.isCurrentMonth;
                    
                    let displayStatus = dayData?.status;
                    if (hasNoData) {
                      displayStatus = 'absent'; 
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
                          <DayMenu onClick={() => handleDayMenuClick(day.fullDate)}>...</DayMenu>
                        </DayHeader>

                        {day.isCurrentMonth && (
                          <DayStatus>
                            {hasNoData ? (
                              <>
                                <TimeDisplay>
                                  <span>In: 00:00</span>
                                  <span>Out: 00:00</span>
                                </TimeDisplay>
                              </>
                            ) : dayData ? (
                              <>
                                {dayData?.requests && dayData.requests.length > 0 && (
                                  <>
                                    {dayData.requests.map((request, requestIndex) => (
                                      request?.request_type && (
                                        <RequestBadge key={requestIndex} $type={request.request_type}>
                                          {getRequestTypeLabel(request.request_type)}
                                        </RequestBadge>
                                      )
                                    ))}
                                  </>
                                )}
                                <div>
                                  {dayData.lateTime > 0 && (
                                    <span>
                                      Đi Muộn: {dayData.lateTime || 0} phút
                                    </span>
                                  )} 
                                  {dayData.earlyTime > 0 && <br/>}
                                  {dayData.earlyTime > 0 && (
                                    <span>
                                      Về Sớm: {dayData.earlyTime || 0} phút
                                    </span>
                                  )}
                                </div>
                                {dayData.timeIn && dayData.timeIn !== 'N/A' && (
                                  <TimeDisplay>
                                    <span>In: {dayData.timeIn}</span>
                                    <span>Out: {dayData.timeOut || "N/A"}</span>
                                  </TimeDisplay>
                                )}
                              </>
                            ) : null}
                          </DayStatus>
                        )}
                      </DayCell>
                    );
                  })
                }
              </CalendarGrid>
            </CalendarContainer>

            <SidebarContainer>
              <SidebarCard>
                <SidebarTitle>Ca làm chuẩn</SidebarTitle>
                <SidebarContent>
                  <WorkSchedule>08:00 - 12:00</WorkSchedule>
                  <WorkScheduleTime>13:30 - 17:30</WorkScheduleTime>
                </SidebarContent>
              </SidebarCard>

              <SidebarCard>
                <SidebarTitle>
                  <Calendar size={14} />
                  Số giờ phép còn lại
                </SidebarTitle>
                <SidebarContent>
                  <LeaveHours>14</LeaveHours>
                </SidebarContent>
              </SidebarCard>

              <SidebarCard>
                <SidebarTitle>Tổng số công</SidebarTitle>
                <SidebarContent>
                  <TotalWork>
                    {isLoading ? '...' : 
                      Object.values(timeSheetData).reduce((total: number, day: ProcessedTimeSheetData[string]) => 
                        total + (day.hours || 0), 0
                      ).toFixed(1)
                    }/168
                  </TotalWork>
                </SidebarContent>
              </SidebarCard>

              <StatsGrid>
                <StatItem>
                  <StatNumber>
                    {isLoading ? '...' : 
                      Object.values(timeSheetData).reduce((total: number, day: ProcessedTimeSheetData[string]) => 
                        total + (day.lateTime || 0), 0
                      )
                    }
                  </StatNumber>
                  <StatLabel>Số phút muộn</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoading ? '...' : 
                      Object.values(timeSheetData).reduce((total: number, day: ProcessedTimeSheetData[string]) => 
                        total + (day.earlyTime || 0), 0
                      )
                    }/120
                  </StatNumber>
                  <StatLabel>Quý phút đi muộn, về sớm</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoading ? '...' : 
                      Object.values(timeSheetData).reduce((total: number, day: ProcessedTimeSheetData[string]) => 
                        total + (day.status === 'leave' ? 8 : 0), 0
                      )
                    }
                  </StatNumber>
                  <StatLabel>Nghỉ có lương (h)</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>
                    {isLoading ? '...' : 
                      Object.values(timeSheetData).reduce((total: number, day: ProcessedTimeSheetData[string]) => 
                        total + (day.status === 'holiday' ? 8 : 0), 0
                      )
                    }
                  </StatNumber>
                  <StatLabel>Nghỉ không lương (h)</StatLabel>
                </StatItem>
              </StatsGrid>

            </SidebarContainer>
          </>
        )}

        {(activeTab === "LIST ĐỀ XUẤT CỦA TÔI" || activeTab === "LIST ĐỀ XUẤT") && (
          <div style={{ width: '100%' }}>
            {activeTab === "LIST ĐỀ XUẤT CỦA TÔI" ? (
              <MyRequestsList 
                onRequestClick={(request) => {
                  setSelectedRequest(request);
                  setIsDetailModalOpen(true);
                }}
              />
            ) : (
              <AdminRequestsList 
                onRequestClick={(request) => {
                  setSelectedRequest(request);
                  setIsDetailModalOpen(true);
                }}
              />
            )}
          </div>
        )}
        
        {activeTab === "FaceIdentify" && (
          <div style={{ padding: '1rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Xác thực khuôn mặt</h3>
            <FaceIdentify />
          </div>
        )}

        {activeTab === "RegisterFace" && (
          <div style={{ padding: '1rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Đăng ký khuôn mặt</h3>
            <RegisterFace />
          </div>
        )}

      </MainContent>

      <CreateRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
      />


      {/* Specific Request Modals */}
      <LateEarlyModal
        isOpen={requestModalState.activeModal === RequestModalType.LATE_EARLY}
        onClose={closeAllModals}
        selectedDate={requestModalState.selectedDate}
      />

      <RemoteWorkModal
        isOpen={requestModalState.activeModal === RequestModalType.REMOTE_WORK}
        onClose={closeAllModals}
        selectedDate={requestModalState.selectedDate}
      />

      <PaidLeaveModal
        isOpen={requestModalState.activeModal === RequestModalType.PAID_LEAVE}
        onClose={closeAllModals}
        selectedDate={requestModalState.selectedDate}
      />

      <RegularOvertimeModal
        isOpen={requestModalState.activeModal === RequestModalType.REGULAR_OVERTIME}
        onClose={closeAllModals}
        selectedDate={requestModalState.selectedDate}
      />

      <ForgotTimekeepingModal
        isOpen={requestModalState.activeModal === RequestModalType.FORGOT_TIMEKEEPING}
        onClose={closeAllModals}
        selectedDate={requestModalState.selectedDate}
      />

      <RequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        canApprove={selectedRequest ? (activeTab === "LIST ĐỀ XUẤT" && selectedRequest.status === REQUEST_STATUS.PENDING) : false} 
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </TimeSheetsContainer>
  );
};

export default TimeSheets;
