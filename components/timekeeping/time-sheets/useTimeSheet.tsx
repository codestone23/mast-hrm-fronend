import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TimekeepingService from "@/services/timekeeping.service";
import { TimeSheet } from "@/types/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Cấu hình dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const useTimeSheet = () => {
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
        queryKey: ['time-sheets', payload],
        queryFn: () => {
            const startDate = payload.start_date 
                ? dayjs(payload.start_date).format('YYYY-MM-DD')
                : undefined;
            const endDate = payload.end_date 
                ? dayjs(payload.end_date).format('YYYY-MM-DD')
                : undefined;
            return TimekeepingService.getMyTimeSheets(startDate, endDate);
        },
        enabled: Boolean(payload.start_date && payload.end_date),
    });

    let rawTimeSheetData: TimeSheet[] = [];
    if (data) {
        if (Array.isArray(data)) {
            rawTimeSheetData = data;
        } else if (typeof data === 'object' && 'data' in data) {
            rawTimeSheetData = (data as { data: TimeSheet[] }).data;
        }
    }

    const timeSheetData = rawTimeSheetData?.reduce((acc: Record<string, {
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
        requests?: {
            remote_work?: any[];
            day_off?: any[];
            overtime?: any[];
            late_early?: any[];
            forgot_checkin?: any[];
        } | any[];
        paid_leave: number | null;
        unpaid_leave: number | null;
    }>, item: TimeSheet) => {
        // Sử dụng UTC để đảm bảo consistency với backend
        const date = dayjs.utc(item.work_date).format('YYYY-MM-DD');
        
        // Format time với timezone +7 để hiển thị đúng giờ địa phương
        const checkinTime = item.checkin ? dayjs.utc(item.checkin).format('HH:mm') : null;
        
        const checkoutTime = item.checkout ? dayjs.utc(item.checkout).format('HH:mm') : null;
        
        let totalWorkHours = 0;
        if (item.checkin && item.checkout) {
            totalWorkHours = 8;
        } else if (item.checkin && !item.checkout) {
            totalWorkHours = 4;
        }
        
        // Xác định status dựa trên is_complete và total_work_time
        let status: string = 'absent';
        
        // 1. is_complete = true -> đủ công (work)
        // 2. is_complete = false + total_work_time != null -> thiếu công (late)
        // 3. is_complete = false + total_work_time = null -> không có công (absent)
        if (item.is_complete === true) {
            status = 'work';
        } else if (item.is_complete === false && item.total_work_time != null) {
            status = 'late';
        } else {
            // is_complete = false && total_work_time = null
            status = 'absent';
        }

        acc[date] = {
            status,
            timeIn: checkinTime || 'Không có',
            timeOut: checkoutTime || 'Không có', 
            hours: totalWorkHours,
            lateTime: item.late_time,
            earlyTime: item.early_time,
            fines: item.fines,
            isComplete: item.is_complete,
            type: item.type,
            remote: item.remote,
            requests: item.requests,
            request_type: item.request_type,
            paid_leave: item.paid_leave,
            unpaid_leave: item.unpaid_leave
        };
        
        return acc;
    }, {}) || {};

    return {
        data: timeSheetData,
        rawData: rawTimeSheetData,
        isLoading,
        error,
        setPayload
    }
}