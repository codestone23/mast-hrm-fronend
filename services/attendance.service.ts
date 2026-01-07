import axiosInstance from "@/lib/axios";

export interface AttendanceStatistics {
  total_work_days: number;
  expected_work_days: number;
  total_work_hours: number;
  overtime_hours: number;
  late_minutes: number;
  paid_leave_hours: number;
  unpaid_leave_hours: number;
  
  // Thông tin chi tiết (để tương thích với code cũ - optional)
  period?: {
    start_date: string;
    end_date: string;
  };
  violation_time?: string;
  attendance?: {
    total_days: string;
    complete_days: number;
    working_days_in_month: number;
    late: number;
    late_days: number;
    early_leave: string;
    early_leave_days: number;
    early_leave_minutes: number;
  };
  overtime?: {
    total_hours: number;
    total_requests: number;
  };
  leave?: {
    paid_leave: number;
    unpaid_leave: number;
    total_leave_requests: number;
  };
  summary?: {
    attendance_rate: number;
    punctuality_rate: number;
  };
}

class AttendanceService {
  // Lấy thống kê chấm công cá nhân từ timesheet API
  async getPersonalAttendanceStats(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<AttendanceStatistics> {
    const queryParams = new URLSearchParams();

    if (params?.start_date) {
      queryParams.append("start_date", params.start_date);
    }

    if (params?.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    const response = await axiosInstance.get(
      `/timesheet/statistics/my-attendance?${queryParams.toString()}`
    );
    return response.data;
  }
}

const attendanceService = new AttendanceService();
export default attendanceService;
