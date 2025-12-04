import axiosInstance from "@/lib/axios";
import {
  DailyReport,
  DailyReportCreateRequest,
  DailyReportUpdateRequest,
  DailyReportListParams,
  PaginatedResponse,
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
    const response = await axiosInstance.put(`/daily-reports/${reportId}`, report);
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

  async approveReportsByIds(reportIds: number[]): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/approve-by-ids`, { report_ids: reportIds });
    return response.data;
  }

  async rejectReportsByIds(reportIds: number[], reject_reason: string): Promise<void> {
    const response = await axiosInstance.post(`/daily-reports/reject-by-ids`, { report_ids: reportIds, reject_reason });
    return response.data;
  }
}

const reportService = new ReportService();

export default reportService;
