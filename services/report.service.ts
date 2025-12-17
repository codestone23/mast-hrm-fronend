import axiosInstance from "@/lib/axios";
import {
  DailyReport,
  DailyReportCreateRequest,
  DailyReportUpdateRequest,
  DailyReportListParams,
  PaginatedResponse,
  AttendanceStatistics,
  MonthlyWorkSummaryResponse,
  DailyWorkSummary,
} from "@/types/api";

class ReportService {
  async getReportById(reportId: string | number): Promise<DailyReport> {
    const response = await axiosInstance.get(`/daily-reports/${reportId}`);
    return response.data;
  }

  async getMyReports(params?: DailyReportListParams): Promise<PaginatedResponse<DailyReport>> {
    const response = await axiosInstance.get(`/daily-reports/my`, { params });
    return response.data;
  }

  async getReports(params?: DailyReportListParams): Promise<PaginatedResponse<DailyReport>> {
    const response = await axiosInstance.get(`/daily-reports`, { params });
    return response.data;
  }

  async createReport(report: DailyReportCreateRequest): Promise<DailyReport> {
    const response = await axiosInstance.post(`/daily-reports`, report);
    return response.data;
  }

  async updateReport(reportId: string | number, report: DailyReportUpdateRequest): Promise<DailyReport> {
    const response = await axiosInstance.patch(`/daily-reports/${reportId}`, report);
    return response.data;
  }

  async deleteReport(reportId: string | number): Promise<void> {
    const response = await axiosInstance.delete(`/daily-reports/${reportId}`);
    return response.data;
  }

  async approveReport(reportId: string | number): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/${reportId}/approve`);
    return response.data;
  }

  async rejectReport(reportId: string | number, reject_reason: string): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/${reportId}/reject`, { reject_reason });
    return response.data;
  }

  async approveAllReports(userId: number): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/approve-all`, { user_id: userId });
    return response.data;
  }

  async rejectAllReports(userId: number, reject_reason: string): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/reject-all`, { user_id: userId, reject_reason });
    return response.data;
  }

  async approveReportsByIds(reportIds: number[], action: 'approve' | 'reject', reject_reason?: string): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/approve-batch`, { report_ids: reportIds, action, reject_reason });
    return response.data;
  }

  async reportsAttendanceDashboard(params?: {
    start_date?: string;
    end_date?: string;
    division_id?: number;
  }): Promise<AttendanceStatistics> {
    const response = await axiosInstance.get(`/reports/attendance-dashboard`, {
      params: {
        ...(params?.start_date && { start_date: params.start_date }),
        ...(params?.end_date && { end_date: params.end_date }),
        ...(params?.division_id && { division_id: params.division_id }),
      },
    });
    return response.data;
  }

  async getMonthlyWorkSummary(params: {
    month: string;
    division_id?: number;
    team_id?: number;
    search?: string;
    page?: number;
    limit?: number;
    sort_order?: 'asc' | 'desc';
  }): Promise<MonthlyWorkSummaryResponse> {
    const response = await axiosInstance.get(`/reports/monthly-work-summary`, { params });
    return response.data;
  }

  async exportMonthlyWorkSummary(params: {
    month: string;
    division_id?: number;
    team_id?: number;
    search?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<Blob> {
    const response = await axiosInstance.get(`/reports/monthly-work-summary/export`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  async getDailyWorkSummary(params: {
    user_id: number;
    month: string;
  }): Promise<DailyWorkSummary> {
    const response = await axiosInstance.get(`/reports/monthly-work-summary/${params.user_id}`, { params });
    return response.data;
  }
}

const reportService = new ReportService();

export default reportService;
