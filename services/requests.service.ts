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
  approved_by_user?: {
    id: number;
    email: string;
    user_information: {
      name: string;
      code?: string;
    };
  } | null;
  user: {
    id: number;
    email: string;
    user_information: {
      name: string;
      position: string;
    };
    user_roles?: Array<{
      role: {
        name: string;
      };
    }>;
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
  leads_only?: boolean;
  requester_role?: string;
}

export interface ApproveRejectPayload {
  rejected_reason?: string;
}

export interface UpdateRequestPayload {
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
        const response = await axiosInstance.get(`/requests/my/all`, { 
          params: {
            ...params,
            sort_order: 'desc',
          },
         });
        return response.data;
    }

    async getMyRequestsStats(): Promise<RequestStats> {
        const response = await axiosInstance.get(`/requests/my/stats`);
        return response.data;
    }

    async getRequestById(type: string, id: string): Promise<Request> {
        const response = await axiosInstance.get(`/requests/${type}/${id}`);
        return response.data;
    }

    async getRequestAdmin(params: RequestParams = {}): Promise<PaginatedResponse<Request>> {
        const response = await axiosInstance.get(`/requests`, { params });
        return response.data;
    }

    async approveRequest(type: string, id: string): Promise<void> {
        await axiosInstance.post(`/requests/${type}/${id}/approve`);
    }

    async rejectRequest(type: string, id: string, payload: ApproveRejectPayload = {}): Promise<void> {
        await axiosInstance.post(`/requests/${type}/${id}/reject`, payload);
    }

    async updateRequest(type: string, id: string, payload: UpdateRequestPayload): Promise<void> {
        await axiosInstance.patch(`/requests/${type}/${id}`, payload);
    }

    async deleteRequest(type: string, id: string): Promise<void> {
        await axiosInstance.delete(`/requests/${type}/${id}`);
    }
}

const requestsService = new RequestsService();
export default requestsService;