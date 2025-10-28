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
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
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

class RequestsService {
    async getMyRequests(params: RequestParams = {}): Promise<PaginatedResponse<Request>> {
        const response = await axiosInstance.get(`/requests/my/all`, { params });
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
}

const requestsService = new RequestsService();
export default requestsService;