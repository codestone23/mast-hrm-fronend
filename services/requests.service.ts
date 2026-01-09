import { REQUEST_STATUS, REQUEST_TYPE } from "@/constants/enums";
import axiosInstance from "@/lib/axios";
import { PaginatedResponse } from "@/types/api";

export interface Request {
  id: number;
  type: string;
  request_type: REQUEST_TYPE;
  user_id: number;
  title: string;
  reason: string;
  status: REQUEST_STATUS;
  work_date: string;
  created_at: string;
  duration?: string;
  remote_type?: string;
  late_minutes?: number;
  early_minutes?: number;
  start_time?: string;
  end_time?: string;
  project_id?: number;
  rejected_reason?: string | null;
  approved_at?: string | null;
  approved_by?: number | null;
  user_name?: string;
}

export interface RequestDetail {
    id: number;
    user_id: number;
    timesheet_id: number;
    work_date: string;
    request_type: REQUEST_TYPE;
    type?: string;
    title: string;
    reason: string;
    status: REQUEST_STATUS;
    approved_by: number | null;
    approved_at: string | null;
    rejected_reason: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    
    user: {
        id: number;
        email: string;
        user_information: {
            name: string;
        };
    };
    approved_by_user: {
        id: number;
        email: string;
        user_information: {
            name: string;
        };
    } | null;
    timesheet: {
      id: number;
      user_id: number;
      work_date: string;
      type: string;
      checkin: string | null;
      checkout: string | null;
      remote: string;
      total_work_time: string | null;
      is_complete: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    late_early_request?: {
      request_id: number;
      request_type: 'LATE' | 'EARLY' | 'BOTH';
      late_minutes: number | null;
      early_minutes: number | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };

    overtime?: {
      request_id: number;
      start_time: string;
      end_time: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };

    remote_work_request?: {
      request_id: number;
      remote_type: string;
      duration: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };

    day_off?: {
      request_id: number;
      duration: string;
      type: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };

    forgot_checkin_request?: {
      request_id: number;
      checkin_time: string | null;
      checkout_time: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
}

export interface RequestParams {
  page?: number;
  limit?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  division_id?: number;
  priority?: string;
  lead_only?: boolean;
  requester_role?: string;
}

export interface ApproveRejectPayload {
  reason?: string;
}

export interface RequestActionPayload {
  action: 'approve' | 'reject';
  reason?: string;
}

export interface UpdateRequestPayload {
  user_id?: number;
  request_type?: string;
  title?: string;
  reason?: string;
  work_date?: string;
  duration?: string;
  type?: string;
  remote_type?: string;
  late_minutes?: number;
  early_minutes?: number;
  start_time?: string;
  end_time?: string;
  project_id?: number;
}

export interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

class RequestsService {
    async getMyRequests(params: RequestParams = {}): Promise<PaginatedResponse<Request>> {
        const response = await axiosInstance.get(`/requests/my`, { 
          params: {
            ...params,
          },
         });
        return response.data;
    }

    async getMyRequestsStats(): Promise<RequestStats> {
        const response = await axiosInstance.get(`/requests/my/stats`);
        return response.data;
    }

    async getRequestById(id: string): Promise<RequestDetail> {
      console
        const response = await axiosInstance.get(`/requests/${id}`);
        return response.data;
    }

    async getRequestAdmin(params: RequestParams = {}): Promise<PaginatedResponse<Request>> {
        const response = await axiosInstance.get(`/requests`, { params });
        return response.data;
    }

    async actionRequest(id: string, payload: RequestActionPayload): Promise<void> {
        await axiosInstance.patch(`/requests/${id}/action`, payload);
    }

    async updateRequest(type: string, id: string, payload: UpdateRequestPayload): Promise<void> {
        await axiosInstance.patch(`/requests/${type}/${id}`, payload);
    }

    async deleteRequest(id: string): Promise<void> {
        await axiosInstance.delete(`/requests/${id}`);
    }
}

const requestsService = new RequestsService();
export default requestsService;
