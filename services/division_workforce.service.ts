import axiosInstance from "@/lib/axios";
import {
  PaginatedResponse,
  DivisionMemberData,
  DivisionTeamData,
  DivisionTeamDetailData,
  DivisionTeamCreateRequest,
  DivisionTeamUpdateRequest,
  ApiResponse,
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
  ): Promise<PaginatedResponse<DivisionTeamData>> {
    const response = await axiosInstance.get(`/teams`, {
      params: {
        division_id: divisionId,
        search,
        page,
        limit,
      },
    });
    return response.data;
  }

  async getTeamDetail(teamId: number): Promise<ApiResponse<DivisionTeamDetailData>> {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    return response.data;
  }

  async createTeam(data: DivisionTeamCreateRequest): Promise<void> {
    const response = await axiosInstance.post(
      `/teams`,
      {
        leader_id: data.leaderId,
        name: data.name,
        founding_date: data.foundingDate,
        division_id: data.divisionId,
      }
    );
    return response.data;
  }

  async updateTeam(
    teamId: number,
    data: DivisionTeamUpdateRequest
  ): Promise<void> {
    const response = await axiosInstance.patch(`/teams/${teamId}`, {
      name: data.name,
      founding_date: data.foundingDate,
      leader_id: data.leaderId,
    });
    return response.data;
  }

  async deleteTeam(teamId: number): Promise<void> {
    const response = await axiosInstance.delete(`/teams/${teamId}`);
    return response.data;
  }

  async getTeamMembers(teamId: number): Promise<PaginatedResponse<DivisionMemberData>> {
    const response = await axiosInstance.get(`/teams/${teamId}/members`);
    return response.data;
  }

  async addMembersToTeam(teamId: number, userIds: number[]): Promise<void> {
    const response = await axiosInstance.post(`/teams/${teamId}/members`, {
      user_ids: userIds,
    });
    return response.data;
  }

  async removeMemberFromTeam(teamId: number, userId: number): Promise<void> {
    const response = await axiosInstance.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  }
}

export const divisionWorkforceService = new DivisionWorkforceService();
export default divisionWorkforceService;
