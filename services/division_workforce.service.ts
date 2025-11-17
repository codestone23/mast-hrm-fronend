import axiosInstance from "@/lib/axios";
import {
  PaginatedResponse,
  DivisionMemberData,
  DivisionTeamData,
  DivisionTeamDetailData,
  DivisionTeamCreateRequest,
  DivisionTeamUpdateRequest,
} from "@/types/api";

class DivisionWorkforceService {
  async getMembers(
    divisionId: number,
    page?: number,
    limit?: number,
    search?: string,
    teamId?: number,
    positionId?: number,
    skillId?: number,
    levelId?: number,
    sortBy?: string,
    sortOrder?: string
  ): Promise<PaginatedResponse<DivisionMemberData>> {
    const response = await axiosInstance.get(
      `/divisions/${divisionId}/members`,
      {
        params: {
          page: page,
          limit: limit,
          search: search,
          teamId: teamId,
          positionId: positionId,
          skillId: skillId,
          levelId: levelId,
          sortBy: sortBy,
          sortOrder: sortOrder,
        },
      }
    );
    return response.data;
  }

  async getTeams(
    divisionId: number,
    search?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ): Promise<PaginatedResponse<DivisionTeamData>> {
    const response = await axiosInstance.get(`/divisions/teams`, {
      params: {
        divisionId,
        search,
        page,
        limit,
        sortBy,
        sortOrder,
      },
    });
    return response.data;
  }

  async getTeamDetail(teamId: number): Promise<DivisionTeamDetailData> {
    const response = await axiosInstance.get(`/divisions/teams/${teamId}`);
    return response.data;
  }

  async createTeam(data: DivisionTeamCreateRequest): Promise<void> {
    const response = await axiosInstance.post(
      `/divisions/${data.divisionId}/teams`,
      {
        leader_Id: data.leaderId,
        name: data.name,
        foundingDate: data.foundingDate,
        divisionId: data.divisionId,
      }
    );
    return response.data;
  }

  async updateTeam(
    teamId: number,
    data: DivisionTeamUpdateRequest
  ): Promise<void> {
    const response = await axiosInstance.patch(`/divisions/teams/${teamId}`, {
      name: data.name,
      foundingDate: data.foundingDate,
    });
    return response.data;
  }

  async deleteTeam(teamId: number): Promise<void> {
    const response = await axiosInstance.delete(`/divisions/teams/${teamId}`);
    return response.data;
  }
}

export const divisionWorkforceService = new DivisionWorkforceService();
export default divisionWorkforceService;
