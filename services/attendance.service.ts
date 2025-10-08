import axiosInstance from "@/lib/axios";

export interface AttendanceStatistics {
  period: {
    start_date: string;
    end_date: string;
  };
  // Các field chính theo UI
  total_work_days: string; // "2/22" - số ngày đã làm / tổng ngày làm việc
  overtime_hours: number; // 0 - số giờ làm thêm
  late_minutes: number; // 2059 - số phút muộn
  violation_time: string; // "0/0" - thời gian vi phạm
  paid_leave_hours: number; // 0 - nghỉ có phép (giờ)
  unpaid_leave_hours: number; // 0 - nghỉ không phép (giờ)
  
  // Thông tin chi tiết (để tương thích với code cũ)
  attendance: {
    total_days: string;
    complete_days: number;
    working_days_in_month: number;
    late: number;
    late_days: number;
    early_leave: string;
    early_leave_days: number;
    early_leave_minutes: number;
  };
  overtime: {
    total_hours: number;
    total_requests: number;
  };
  leave: {
    paid_leave: number;
    unpaid_leave: number;
    total_leave_requests: number;
  };
  summary: {
    attendance_rate: number;
    punctuality_rate: number;
  };
}

export interface AttendanceReport {
  report_type: "summary" | "detailed" | "penalty";
  period: string;
  user_stats?: Array<{
    user_id: number;
    total_days: number;
    on_time_days: number;
    late_days: number;
    early_leave_days: number;
    remote_days: number;
    total_work_hours: number;
    total_late_minutes: number;
    total_early_minutes: number;
    total_penalties: number;
  }>;
  generated_at: string;
}

export interface AttendanceSummary {
  total_work_days: string;
  overtime_hours: number;
  late_minutes: number;
  violation_time: string;
  penalty_amount: number;
  paid_leave_hours: number;
  unpaid_leave_hours: number;
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

  // Lấy dashboard thống kê chấm công (Admin/Manager only)
  async getAttendanceDashboard(params?: {
    start_date?: string;
    end_date?: string;
    division_id?: number;
    team_id?: number;
    period_type?: "daily" | "weekly" | "monthly" | "yearly";
  }): Promise<AttendanceStatistics> {
    const response = await axiosInstance.get("/attendance/dashboard", {
      params,
    });
    return response.data;
  }

  // Tạo báo cáo chấm công chi tiết (Admin/Manager only)
  async generateAttendanceReport(params: {
    month?: string;
    year?: number;
    user_ids?: number[];
    report_type?: "summary" | "detailed" | "penalty";
  }): Promise<AttendanceReport> {
    const response = await axiosInstance.get("/attendance/reports/attendance", { params });
    return response.data;
  }


  // Lấy số dư phép năm
  async getLeaveBalance(userId: number, year: number) {
    const response = await axiosInstance.get(
      `/attendance/leave-balance/${userId}/${year}`
    );
    return response.data;
  }

  // Tạo yêu cầu nghỉ phép
  async createLeaveRequest(data: {
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string;
    is_half_day?: boolean;
    half_day_period?: string;
    attachment_url?: string;
    note?: string;
  }) {
    const response = await axiosInstance.post(
      "/attendance/leave-request",
      data
    );
    return response.data;
  }

}

const attendanceService = new AttendanceService();
export default attendanceService;
