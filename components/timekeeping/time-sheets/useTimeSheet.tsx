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
    const [payload, setPayload] = useState<{    
        start_date?: string;    
        end_date?: string;
    }>({});

    const { data, isLoading, error } = useQuery({
        queryKey: ['time-sheets', payload],
        queryFn: () => TimekeepingService.getMyTimeSheets(payload.start_date, payload.end_date),
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
        paid_leave: number | null;
        unpaid_leave: number | null;
    }>, item: TimeSheet) => {
        // Sử dụng UTC để đảm bảo consistency với backend
        const date = dayjs.utc(item.work_date).format('YYYY-MM-DD');
        
        // Format time với timezone +7 để hiển thị đúng giờ địa phương
        const checkinTime = item.checkin ? dayjs.utc(item.checkin)
            .utcOffset(7).format('HH:mm') : null;
        
        const checkoutTime = item.checkout ? dayjs.utc(item.checkout)
            .utcOffset(7).format('HH:mm') : null;
        
        let totalWorkHours = 0;
        if (item.checkin && item.checkout) {
            totalWorkHours = 8;
        } else if (item.checkin && !item.checkout) {
            totalWorkHours = 4;
        }
        
        // Xác định status dựa trên dữ liệu
        let status: string = 'absent';
        
        // Ưu tiên request_type trước
        if (item.request_type) {
            switch (item.request_type) {
                case 'LATE':
                case 'EARLY':
                case 'BOTH':
                    status = 'late-early';
                    break;
                case 'PAID_LEAVE':
                    status = 'leave';
                    break;
                case 'UNPAID_LEAVE':
                    status = 'holiday';
                    break;
                case 'REMOTE_WORK':
                case 'HYBRID':
                    status = 'remote';
                    break;
                case 'OVERTIME':
                    status = 'ot';
                    break;
                case 'FORGOT_CHECKIN':
                    status = 'absent';
                    break;
                default:
                    status = 'work';
            }
        } else if (item.checkin && item.checkout) {
            status = item.late_time > 0 ? 'late' : 'work';
        } else if (item.checkin && !item.checkout) {
            status = 'work';
        } else if (item.paid_leave || item.unpaid_leave) {
            status = item.paid_leave ? 'leave' : 'holiday';
        } else if (item.remote === 'REMOTE' || item.remote === 'HYBRID') {
            status = 'remote';
        }

        acc[date] = {
            status,
            timeIn: checkinTime || 'N/A',
            timeOut: checkoutTime || 'N/A',
            hours: totalWorkHours,
            lateTime: item.late_time,
            earlyTime: item.early_time,
            fines: item.fines,
            isComplete: item.is_complete,
            type: item.type,
            remote: item.remote,
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