"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, FileText } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import { useDailyReports } from "./useDailyReports";
import CreateDailyReportModal from "./modals/CreateDailyReportModal";
import MyDailyReportsList from "./MyDailyReportsList";
import {
  DailyReportsContainer,
  Header,
  TabsContainer,
  Tab,
  HeaderButtons,
  CreateButton,
  MainContent,
  CalendarContainer,
  MonthNavigation,
  MonthButton,
  MonthDisplay,
  Legend,
  LegendItem,
  LegendColor,
  CalendarHeader,
  WeekDay,
  CalendarGrid,
  DayCell,
  DayNumber,
  DayStatus,
  DayHeader,
  DayMenu,
  HoursDisplay,
  TabContentWrapper,
} from "./dailyReportsStyle";
import { REQUEST_STATUS } from "@/constants/enums";

const DailyReports: React.FC = () => {
  const isMobile = useMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Bảng báo cáo hằng ngày");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { data: dailyReportData, isLoading, setPayload } = useDailyReports();

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

  const tabs = ["Bảng báo cáo hằng ngày", "Danh sách báo cáo của tôi"];

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
    { color: "#c9f8c9", label: "Đã duyệt đủ 8 giờ" },
    { color: "#FFCDD2", label: "Chưa duyệt đủ 8 giờ" },
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

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Adjust to Monday = 0, Sunday = 6
    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dayNumber: number;
      fullDate: string;
    }> = [];

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const date = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        daysInPrevMonth - i
      );
      days.push({
        date,
        isCurrentMonth: false,
        dayNumber: date.getDate(),
        fullDate: formatDateToVietnamTimezone(date),
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dayNumber: day,
        fullDate: formatDateToVietnamTimezone(date),
      });
    }

    // Add days from next month to complete the week
    const lastDayOfWeek = lastDay.getDay();
    const adjustedLastDay = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
    const daysFromNextMonth = 6 - adjustedLastDay;

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

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  const getTodayInVietnamTimezone = () => {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toISOString().split("T")[0];
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
    <DailyReportsContainer>
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
              setSelectedDate(today);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus size={isMobile ? 14 : 16} />
            {isMobile ? "Tạo báo cáo" : "Tạo báo cáo"}
          </CreateButton>
        </HeaderButtons>
      </Header>

      <MainContent>
        {activeTab === "Bảng báo cáo hằng ngày" && (
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
                const dayData = dailyReportData[day.fullDate];
                const todayString = getTodayInVietnamTimezone();
                const isToday = day.fullDate === todayString;

                let status: REQUEST_STATUS | undefined = undefined;
                let totalHours = 0;

                if (dayData) {
                  totalHours = dayData.totalHours;
                  if (dayData.isApproved && totalHours >= 8) {
                    status = REQUEST_STATUS.APPROVED;
                  } else if (totalHours > 0) {
                    status = REQUEST_STATUS.PENDING;
                  }
                } else if (day.fullDate < todayString) {
                    status = REQUEST_STATUS.PENDING;
                }

                return (
                  <DayCell
                    key={index}
                    $isCurrentMonth={day.isCurrentMonth}
                    $status={status}
                    $isToday={isToday}
                    onClick={() => day.isCurrentMonth && handleDayClick(day.fullDate)}
                  >
                    <DayHeader>
                      <DayNumber
                        $isCurrentMonth={day.isCurrentMonth}
                        $isToday={isToday}
                      >
                        {String(day.dayNumber).padStart(2, "0")}/
                        {String(day.date.getMonth() + 1).padStart(2, "0")}
                      </DayNumber>
                      {day.isCurrentMonth && (
                        <DayMenu onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day.fullDate);
                        }}>
                          ...
                        </DayMenu>
                      )}
                    </DayHeader>

                    {day.isCurrentMonth && dayData && (
                      <DayStatus>
                        <HoursDisplay>
                          {totalHours.toFixed(1)}h
                        </HoursDisplay>
                      </DayStatus>
                    )}
                  </DayCell>
                );
              })}
            </CalendarGrid>
          </CalendarContainer>
        )}

        {activeTab === "Danh sách báo cáo của tôi" && (
          <TabContentWrapper $isMobile={isMobile}>
            <MyDailyReportsList />
          </TabContentWrapper>
        )}
      </MainContent>

      <CreateDailyReportModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDate("");
        }}
        selectedDate={selectedDate}
      />
    </DailyReportsContainer>
  );
};

export default DailyReports;
