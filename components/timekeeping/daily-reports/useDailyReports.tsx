import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import reportService from "@/services/report.service";
import { DailyReport } from "@/types/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useDailyReports = () => {
  const getCurrentMonthRange = () => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    return { start_date: start, end_date: end };
  };

  const [payload, setPayload] = useState<{
    start_date?: string;
    end_date?: string;
  }>(getCurrentMonthRange());

  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-reports', 'my', payload],
    queryFn: () => reportService.getMyReports({
      start_date: payload.start_date,
      end_date: payload.end_date,
    }),
    enabled: Boolean(payload.start_date && payload.end_date),
  });

  const reports = data?.data || [];

  // Process reports data for calendar display
  const dailyReportData = reports.reduce((acc: Record<string, {
    totalHours: number;
    isApproved: boolean;
    reports: DailyReport[];
  }>, report: DailyReport) => {
    const date = dayjs.utc(report.work_date).format('YYYY-MM-DD');
    
    if (!acc[date]) {
      acc[date] = {
        totalHours: 0,
        isApproved: false,
        reports: [],
      };
    }
    
    acc[date].totalHours += report.actual_time;
    acc[date].reports.push(report);
    
    return acc;
  }, {});

  // Calculate isApproved for each date after processing all reports
  Object.keys(dailyReportData).forEach((date) => {
    const dayData = dailyReportData[date];
    // All reports must be APPROVED and total hours >= 8
    const allApproved = dayData.reports.every(r => r.status === 'APPROVED');
    dayData.isApproved = allApproved && dayData.totalHours >= 8;
  });

  return {
    data: dailyReportData,
    rawData: reports,
    isLoading,
    error,
    setPayload,
  };
};
