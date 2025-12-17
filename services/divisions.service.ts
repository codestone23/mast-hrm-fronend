import axiosInstance from "@/lib/axios";
import {
  DivisionListItem,
  DivisionListParams,
  DivisionDetail,
  CreateDivisionRequest,
  UpdateDivisionRequest,
  DivisionUserAssignmentItem,
  PaginatedMeta,
  CreateRotationMemberRequest,
  RotationMember,
  RotationMemberListParams,
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
      user_id: userId,
      division_id: divisionId,
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
      params: { page, limit, search, division_id: divisionId },
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

  async createRotationMember(payload: CreateRotationMemberRequest): Promise<void> {
    await axiosInstance.post(`/divisions/rotation-members`, payload);
  }

  async getRotationMembers(params: RotationMemberListParams): Promise<{
    data: RotationMember[];
    pagination: PaginatedMeta;
  }> {
    const response = await axiosInstance.get(`/divisions/rotation-members`, {
      params: {
        division_id: params.division_id,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        type: params.type,
        date_from: params.date_from,
        date_to: params.date_to,
      },
    });
    return response.data;
  }

  async getRotationMemberById(id: number): Promise<RotationMember> {
    const response = await axiosInstance.get(`/divisions/rotation-members/${id}`);
    return response.data;
  }
}

export const divisionsService = new DivisionsService();
export default divisionsService;
