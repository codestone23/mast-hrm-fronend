"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import divisionWorkforceService from "@/services/division_workforce.service";
import {
  DivisionMemberData,
  DivisionTeamData,
  DivisionTeamCreateRequest,
  DivisionTeamUpdateRequest,
  PaginatedMeta,
} from "@/types/api";
import { AxiosError } from "axios";

const queryKeys = {
  members: (
    divisionId: number | null,
    page: number,
    limit: number,
    search: string,
    filters: {
      teamId?: number;
      positionId?: number;
      skillId?: number;
      levelId?: number;
      sortBy?: string;
      sortOrder?: string;
    }
  ) => ["division-workforce", "members", divisionId, page, limit, search, filters] as const,
  teams: (
    divisionId: number | null,
    search: string,
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: string
  ) => ["division-workforce", "teams", divisionId, search, page, limit, sortBy, sortOrder] as const,
  teamDetail: (teamId: number) => ["division-workforce", "team", teamId] as const,
};

export interface MembersResponse {
  data: DivisionMemberData[];
  pagination: PaginatedMeta;
}

export interface TeamsResponse {
  data: DivisionTeamData[];
  pagination: PaginatedMeta;
}

export function useDivisionMembers(
  divisionId: number | null,
  page: number,
  limit: number,
  search: string,
  filters?: {
    teamId?: number;
    positionId?: number;
    skillId?: number;
    levelId?: number;
    sortBy?: string;
    sortOrder?: string;
  }
) {
  return useQuery<MembersResponse>({
    queryKey: queryKeys.members(divisionId, page, limit, search, filters || {}),
    queryFn: () =>
      divisionWorkforceService.getMembers(
        divisionId!,
        page,
        limit,
        search,
        filters?.teamId,
        filters?.positionId,
        filters?.skillId,
        filters?.levelId,
        filters?.sortBy || "id",
        filters?.sortOrder || "asc"
      ),
    enabled: !!divisionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useDivisionTeams(
  divisionId: number | null,
  search: string,
  page: number,
  limit: number,
  sortBy?: string,
  sortOrder?: string
) {
  return useQuery<TeamsResponse>({
    queryKey: queryKeys.teams(divisionId, search, page, limit, sortBy, sortOrder),
    queryFn: () =>
      divisionWorkforceService.getTeams(divisionId!, search, page, limit, sortBy, sortOrder),
    enabled: !!divisionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DivisionTeamCreateRequest) => divisionWorkforceService.createTeam(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["division-workforce", "teams", variables.divisionId],
      });
    },
  });
}

export function useUpdateTeam(teamId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DivisionTeamUpdateRequest) =>
      divisionWorkforceService.updateTeam(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teamDetail(teamId) });
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: number) => divisionWorkforceService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce", "teams"] });
    },
  });
}

