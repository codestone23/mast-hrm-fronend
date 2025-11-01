import axiosInstance from "@/lib/axios";
import {
  DivisionListItem,
  DivisionListParams,
  DivisionDetail,
  CreateDivisionRequest,
  UpdateDivisionRequest,
  DivisionUserAssignmentItem,
  PaginatedMeta,
} from "@/types/api";

class DivisionsService {
  async createDivision(payload: CreateDivisionRequest): Promise<DivisionDetail> {
    const response = await axiosInstance.post(`/divisions`, payload);
    return response.data;
  }

  async getDivisions(params?: DivisionListParams): Promise<{
    data: DivisionListItem[];
    pagination: PaginatedMeta;
  }> {
    const response = await axiosInstance.get(`/divisions`, {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        type: params?.type,
        status: params?.status,
      },
    });
    return response.data;
  }

  async getDivisionById(id: number | string): Promise<DivisionDetail> {
    const response = await axiosInstance.get(`/divisions/${id}`);
    return response.data;
  }

  async updateDivision(
    id: number | string,
    payload: UpdateDivisionRequest
  ): Promise<DivisionDetail> {
    const response = await axiosInstance.patch(`/divisions/${id}`, payload);
    return response.data;
  }

  async deleteDivision(id: number | string): Promise<void> {
    await axiosInstance.delete(`/divisions/${id}`);
  }

  async addMemberToDivision(userId: number, divisionId: number): Promise<void> {
    await axiosInstance.post(`/divisions/user-assignments`, {
      userId,
      divisionId,
    });
  }

  async removeMemberFromDivision(
    userId: number,
  ): Promise<void> {
    await axiosInstance.delete(`/divisions/user-assignments/${userId}`);
  }

  async listMembersOfDivision(
    divisionId: number,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: DivisionUserAssignmentItem[]; pagination: PaginatedMeta }> { 
    const response = await axiosInstance.get(`/divisions/${divisionId}/users`, {
      params: { page, limit, search, divisionId },
    });
    return response.data;
  }

  async listUserForAddToDivision(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: DivisionUserAssignmentItem[]; pagination: PaginatedMeta }> {
    const response = await axiosInstance.get(`/divisions/unassigned-users`, {
      params: { page, limit, search },
    });
    return response.data;
  }
}

export const divisionsService = new DivisionsService();
export default divisionsService;
