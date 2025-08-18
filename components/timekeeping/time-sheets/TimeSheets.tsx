"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  TimeSheetsContainer,
  Header,
  TabsContainer,
  Tab,
  MonthNavigation,
  MonthButton,
  MonthDisplay,
  CalendarContainer,
  CalendarHeader,
  WeekDay,
  CalendarGrid,
  DayCell,
  DayNumber,
  DayStatus,
  TimeDisplay,
  Legend,
  LegendItem,
  LegendColor,
  SidebarContainer,
  SidebarCard,
  SidebarTitle,
  SidebarContent,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel,
  CreateButton,
  MainContent,
  DayHeader,
  DayMenu,
  WorkSchedule,
  WorkScheduleTime,
  LeaveHours,
  TotalWork,
} from "./timeSheetStyle";

interface TimeSheetData {
  [date: string]: {
    status: "work" | "late" | "absent" | "remote" | "ot" | "leave" | "holiday";
    timeIn?: string;
    timeOut?: string;
    hours?: number;
  };
}

const TimeSheets: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("BẢNG CHẤM CÔNG");
  const [timeSheetData] = useState<TimeSheetData>({
    "2025-08-03": { status: "work", timeIn: "12:10", timeOut: "N/A", hours: 8 },
    "2025-08-04": { status: "absent", timeIn: "N/A", timeOut: "N/A", hours: 0 },
    "2025-08-05": { status: "absent", timeIn: "N/A", timeOut: "N/A", hours: 0 },
    "2025-08-06": { status: "absent", timeIn: "N/A", timeOut: "N/A", hours: 0 },
    "2025-08-07": { status: "work", timeIn: "N/A", timeOut: "N/A", hours: 8 },
    "2025-08-10": { status: "work", timeIn: "17:44", timeOut: "N/A", hours: 8 },
    "2025-08-11": {
      status: "work",
      timeIn: "17:45",
      timeOut: "19:15",
      hours: 8,
    },
    "2025-08-12": { status: "work", timeIn: "N/A", timeOut: "N/A", hours: 8 },
    "2025-08-13": { status: "absent", timeIn: "N/A", timeOut: "N/A", hours: 0 },
    "2025-08-14": { status: "work", timeIn: "N/A", timeOut: "N/A", hours: 8 },
    "2025-08-17": { status: "work", timeIn: "N/A", timeOut: "N/A", hours: 8 },
    "2025-08-18": { status: "work", timeIn: "N/A", timeOut: "N/A", hours: 8 },
    "2025-08-19": { status: "absent", timeIn: "N/A", timeOut: "N/A", hours: 0 },
  });

  const tabs = [
    "BẢNG CHẤM CÔNG",
    "LỊCH BIỂU",
    "BẢNG OT",
    "LIST ĐỀ XUẤT",
    "REQUEST OT",
  ];

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
        fullDate: date.toISOString().split("T")[0],
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dayNumber: day,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    const totalDays = days.length;
    const nextMonthDays = 42 - totalDays;

    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        dayNumber: day,
        fullDate: date.toISOString().split("T")[0],
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "work":
        return "#4CAF50";
      case "late":
        return "#FFA726";
      case "absent":
        return "#9C27B0";
      case "holiday":
        return "#F44336";
      case "leave":
        return "#FF9800";
      case "remote":
        return "#795548";
      case "ot":
        return "#009688";
      default:
        return "#E0E0E0";
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
        <CreateButton>
          <Plus size={16} />
          Tạo request
        </CreateButton>
      </Header>

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
              const isToday =
                day.fullDate === new Date().toISOString().split("T")[0];

              return (
                <DayCell
                  key={index}
                  $isCurrentMonth={day.isCurrentMonth}
                  $status={dayData?.status}
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

                  {dayData && day.isCurrentMonth && (
                    <DayStatus>
                      <div>Công {dayData.hours} - Muộn 0</div>
                      {dayData.timeIn && (
                        <TimeDisplay>
                          <span>In: {dayData.timeIn}</span>
                          <span>Out: {dayData.timeOut || "N/A"}</span>
                        </TimeDisplay>
                      )}
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
              <TotalWork>88/168</TotalWork>
            </SidebarContent>
          </SidebarCard>

          <StatsGrid>
            <StatItem>
              <StatNumber>0</StatNumber>
              <StatLabel>Số phút muộn</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>0/120</StatNumber>
              <StatLabel>Quý phút đi muộn, về sớm</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>0 VNĐ</StatNumber>
              <StatLabel>Tiền phạt</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>8</StatNumber>
              <StatLabel>Nghỉ có lương (h)</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>8</StatNumber>
              <StatLabel>Nghỉ không lương (h)</StatLabel>
            </StatItem>
          </StatsGrid>
        </SidebarContainer>
      </MainContent>
    </TimeSheetsContainer>
  );
};

export default TimeSheets;
