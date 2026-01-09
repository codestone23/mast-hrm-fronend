import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  CreateLeaveRequest,
  LeaveRequest,
  PaginatedResponse,
  RequestStatus,
  TimeSheet,
  TimeSheetRequest,
  Holiday,
  HolidayCreateRequest,
  HolidayUpdateRequest,
  HolidayListParams,
} from '@/types/api';

class TimekeepingService {
  async getMyTimeSheets(start_date?: string, end_date?: string): Promise<TimeSheet[]> {
    const params = new URLSearchParams({
      ...(start_date && { start_date }),
      ...(end_date && { end_date })
    });
    
    const response = await axiosInstance.get(`timesheet/my-timesheets?${params}`);
    return response.data;
  }

  // Lấy timesheet theo ID
  async getTimeSheetById(timesheetId: string): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.get(`timesheet/timesheets/${timesheetId}`);
    return response.data;
  }

  // Tạo timesheet mới
  async createTimeSheet(timesheetData: TimeSheetRequest): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('timekeeping/timesheets', timesheetData);
    return response.data;
  }

  // Cập nhật timesheet
  async updateTimeSheet(timesheetId: string, timesheetData: Partial<TimeSheetRequest>): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.put(`timekeeping/timesheets/${timesheetId}`, timesheetData);
    return response.data;
  }

  // Xóa timesheet
  async deleteTimeSheet(timesheetId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`timekeeping/timesheets/${timesheetId}`);
    return response.data;
  }

  // async registerFace(data: { user_id: number; photo_url: string }): Promise<ApiResponse<{
  //   success: boolean;
  //   message: string;
  //   user_id: number;
  //   photo_url: string;
  // }>> {
  //   const response = await axiosInstance.post('timesheet/register-face', data);
  //   return response.data;
  // }

  // // Check in
  // async checkIn(data: FormData): Promise<ApiResponse<TimeSheet>> {
  //   const response = await axiosInstance.post('timesheet/checkin', data);
  //   return response.data;
  // }

  // // Check out
  // async checkOut(data: FormData): Promise<ApiResponse<TimeSheet>> {
  //   const response = await axiosInstance.post('timesheet/checkout', data);
  //   return response.data;
  // }

   async registerFace(data: FormData): Promise<ApiResponse<{
    success: boolean;
    message: string;
    user_id: number;
    photo_url: string;
    }>> {
      const response = await axiosInstance.post('/timesheet/register-face', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      return response.data;
    }

  async checkIn(data: FormData): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('/timesheet/checkin', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  
   async checkOut(data: FormData): Promise<ApiResponse<TimeSheet>> {
    const response = await axiosInstance.post('/timesheet/checkout', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async verifyFace(data: FormData): Promise<ApiResponse<{ is_registered: boolean }>> {
    const response = await axiosInstance.get('timesheet/face-recognition-status');
    return response.data;
  }

  // Lấy timesheet theo ngày
  async getTimeSheetByDate(date: string): Promise<ApiResponse<TimeSheet | null>> {
    const response = await axiosInstance.get(`timekeeping/timesheets/date/${date}`);
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
    
    const response = await axiosInstance.get(`timekeeping/stats?${params}`);
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
    
    const response = await axiosInstance.get(`timekeeping/leave-requests?${params}`);
    return response.data;
  }

  // Tạo leave request mới
  async createLeaveRequest(requestData: CreateLeaveRequest): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.post('timekeeping/leave-requests', requestData);
    return response.data;
  }

  // Lấy leave request theo ID
  async getLeaveRequestById(requestId: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.get(`timekeeping/leave-requests/${requestId}`);
    return response.data;
  }

  // Cập nhật leave request
  async updateLeaveRequest(requestId: string, requestData: Partial<CreateLeaveRequest>): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.put(`timekeeping/leave-requests/${requestId}`, requestData);
    return response.data;
  }

  // Hủy leave request
  async cancelLeaveRequest(requestId: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.patch(`timekeeping/leave-requests/${requestId}/cancel`);
    return response.data;
  }

  // Xóa leave request
  async deleteLeaveRequest(requestId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`timekeeping/leave-requests/${requestId}`);
    return response.data;
  }

  // Manager APIs - Duyệt leave requests
  async getPendingLeaveRequests(page: number = 1, limit: number = 10): Promise<PaginatedResponse<LeaveRequest>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: RequestStatus.PENDING
    });
    
    const response = await axiosInstance.get(`timekeeping/leave-requests/pending?${params}`);
    return response.data;
  }

  // Duyệt/từ chối leave request
  async reviewLeaveRequest(requestId: string, action: 'approve' | 'reject', comments?: string): Promise<ApiResponse<LeaveRequest>> {
    const response = await axiosInstance.patch(`timekeeping/leave-requests/${requestId}/review`, {
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
    
    const response = await axiosInstance.get(`timekeeping/leave-requests/stats?${params}`);
    return response.data;
  }

  // Day Off Request APIs
  async createDayOffRequest(requestData: {
    work_date: string;
    duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
    title: string;
    type: 'PAID' | 'UNPAID';
    reason: string;
  }): Promise<ApiResponse<unknown>> {
    const response = await axiosInstance.post('requests/day-off', requestData);
    return response.data;
  }

  // Remote Work Request APIs
  async createRemoteWorkRequest(requestData: {
    work_date: string;
    remote_type: 'REMOTE' | 'HYBRID';
    title: string;
    reason: string;
    duration: 'FULL_DAY' | 'MORNING' | 'AFTERNOON';
  }): Promise<ApiResponse<unknown>> {
    const response = await axiosInstance.post('requests/remote-work', requestData);
    return response.data;
  }

  // Overtime Request APIs
  async createOvertimeRequest(requestData: {
    title: string;
    work_date: string;
    start_time: string;
    end_time: string;
    reason: string;
  }): Promise<ApiResponse<unknown>> {
    const response = await axiosInstance.post('requests/overtime', requestData);
    return response.data;
  }

  // Late/Early Request APIs
  async createLateEarlyRequest(requestData: {
    work_date: string;
    request_type: 'LATE' | 'EARLY' | 'BOTH';
    title: string;
    late_minutes: number;
    early_minutes: number;
    reason: string;
  }): Promise<ApiResponse<unknown>> {
    const response = await axiosInstance.post('requests/late-early', requestData);
    return response.data;
  }

  async createForgotTimekeepingRequest(requestData: { 
    work_date: string;
    checkin_time: string;
    checkout_time: string;
    title: string;
    reason: string;
  }): Promise<ApiResponse<unknown>> {
    const response = await axiosInstance.post('requests/forgot-checkin', requestData);
    return response.data;
  }

  // Get projects list
  async getProjects(): Promise<ApiResponse<Array<{id: number, name: string}>>> {
    const response = await axiosInstance.get('projects');
    return response.data;
  }

  async getHolidays(params?: HolidayListParams): Promise<PaginatedResponse<Holiday>> {
    const response = await axiosInstance.get('timesheet/holidays', { 
      params: {
        ...params,
        sort_order: 'desc'
      }
     });
    return response.data;
  }

  async getHolidayById(holidayId: string | number): Promise<ApiResponse<Holiday>> {
    const response = await axiosInstance.get(`timesheet/holidays/${holidayId}`);
    return response.data;
  }

  async createHoliday(requestData: HolidayCreateRequest): Promise<ApiResponse<Holiday>> {
    const response = await axiosInstance.post('timesheet/holidays', requestData);
    return response.data;
  }

  async updateHoliday(holidayId: string | number, requestData: HolidayUpdateRequest): Promise<ApiResponse<Holiday>> {
    const response = await axiosInstance.patch(`timesheet/holidays/${holidayId}`, requestData);
    return response.data;
  }

  async deleteHoliday(holidayId: string | number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`timesheet/holidays/${holidayId}`);
    return response.data;
  }
}

export const timekeepingService = new TimekeepingService();
export default timekeepingService;
