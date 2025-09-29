import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResponse,
  TimeSheet,
  TimeSheetRequest,
  TimeSheetStatus,
  LeaveRequest,
  CreateLeaveRequest,
  RequestStatus
} from '@/types/api';

class TimekeepingService {
  // TimeSheet APIs
  // Lấy danh sách timesheet của user hiện tại
  async getMyTimeSheets(page: number = 1, limit: number = 10, month?: string, year?: string): Promise<PaginatedResponse<TimeSheet>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(month && { month }),
      ...(year && { year })
    });
    
    const response = await axiosInstance.get(`/timekeeping/timesheets?${params}`);
    return response.data;
  }

  // Lấy timesheet theo ID
  async getTimeSheetById(timesheetId: string): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.get(`/timekeeping/timesheets/${timesheetId}`);
    return response.data;
  }

  // Tạo timesheet mới
  async createTimeSheet(timesheetData: TimeSheetRequest): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('/timekeeping/timesheets', timesheetData);
    return response.data;
  }

  // Cập nhật timesheet
  async updateTimeSheet(timesheetId: string, timesheetData: Partial<TimeSheetRequest>): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.put(`/timekeeping/timesheets/${timesheetId}`, timesheetData);
    return response.data;
  }

  // Xóa timesheet
  async deleteTimeSheet(timesheetId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/timekeeping/timesheets/${timesheetId}`);
    return response.data;
  }

  // Check in
  async checkIn(notes?: string): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('/timekeeping/check-in', { notes });
    return response.data;
  }

  // Check out
  async checkOut(notes?: string): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('/timekeeping/check-out', { notes });
    return response.data;
  }

  // Lấy timesheet theo ngày
  async getTimeSheetByDate(date: string): Promise<ApiResponse<TimeSheet | null>> {
    const response = await axiosInstance.get(`/timekeeping/timesheets/date/${date}`);
    return response.data;
  }

  // Lấy thống kê timesheet
  async getTimeSheetStats(month?: string, year?: string): Promise<ApiResponse<{
    totalWorkHours: number;
    totalOvertimeHours: number;
    workingDays: number;
    averageWorkHours: number;
  }>> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await axiosInstance.get(`/timekeeping/stats?${params}`);
    return response.data;
  }

  // Leave Request APIs
  // Lấy danh sách leave requests của user hiện tại
  async getMyLeaveRequests(page: number = 1, limit: number = 10, status?: RequestStatus): Promise<PaginatedResponse<LeaveRequest>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    
    const response = await axiosInstance.get(`/timekeeping/leave-requests?${params}`);
    return response.data;
  }

  // Tạo leave request mới
  async createLeaveRequest(requestData: CreateLeaveRequest): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.post('/timekeeping/leave-requests', requestData);
    return response.data;
  }

  // Lấy leave request theo ID
  async getLeaveRequestById(requestId: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.get(`/timekeeping/leave-requests/${requestId}`);
    return response.data;
  }

  // Cập nhật leave request
  async updateLeaveRequest(requestId: string, requestData: Partial<CreateLeaveRequest>): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.put(`/timekeeping/leave-requests/${requestId}`, requestData);
    return response.data;
  }

  // Hủy leave request
  async cancelLeaveRequest(requestId: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.patch(`/timekeeping/leave-requests/${requestId}/cancel`);
    return response.data;
  }

  // Xóa leave request
  async deleteLeaveRequest(requestId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/timekeeping/leave-requests/${requestId}`);
    return response.data;
  }

  // Manager APIs - Duyệt leave requests
  async getPendingLeaveRequests(page: number = 1, limit: number = 10): Promise<PaginatedResponse<LeaveRequest>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: RequestStatus.PENDING
    });
    
    const response = await axiosInstance.get(`/timekeeping/leave-requests/pending?${params}`);
    return response.data;
  }

  // Duyệt/từ chối leave request
  async reviewLeaveRequest(requestId: string, action: 'approve' | 'reject', comments?: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.patch(`/timekeeping/leave-requests/${requestId}/review`, {
      action,
      comments
    });
    return response.data;
  }

  // Lấy thống kê leave requests
  async getLeaveRequestStats(month?: string, year?: string): Promise<ApiResponse<{
    totalRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    pendingRequests: number;
    totalLeaveDays: number;
  }>> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await axiosInstance.get(`/timekeeping/leave-requests/stats?${params}`);
    return response.data;
  }
}

export const timekeepingService = new TimekeepingService();
export default timekeepingService;
