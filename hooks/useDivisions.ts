"use client";

import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import divisionsService from "@/services/divisions.service";
import { CreateDivisionRequest, DivisionDetail, DivisionListItem, DivisionListParams, PaginatedMeta, UpdateDivisionRequest, DivisionUserAssignmentItem } from "@/types/api";
import { AxiosError } from "axios";

const queryKeys = {
  list: (params: DivisionListParams) => ["divisions", "list", params] as const,
  detail: (id: number | string) => ["divisions", "detail", id] as const,
  members: (divisionId: number, search: string) => ["divisions", divisionId, "members", search] as const,
  membersPaged: (divisionId: number, page: number, limit: number, search: string) => ["divisions", divisionId, "members", { page, limit, search }] as const,
  candidates: (divisionId: number, search: string) => ["divisions", divisionId, "candidates", search] as const,
};

export type DivisionListResponse = { data: DivisionListItem[]; pagination: PaginatedMeta };

export function useDivisionsList(params?: DivisionListParams, options?: { enabled?: boolean }) {
  return useQuery<DivisionListResponse>({
    queryKey: queryKeys.list(params || {}),
    queryFn: () => divisionsService.getDivisions(params),
    enabled: options?.enabled !== false,
  });
}

export function useDivisionDetail(id: number | string) {
  return useQuery<DivisionDetail>({
    queryKey: queryKeys.detail(id),
    queryFn: () => divisionsService.getDivisionById(id),
    enabled: !!id,
  });
}

export function useCreateDivision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDivisionRequest) => divisionsService.createDivision(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["divisions", "list"] });
    },
  });
}

export function useUpdateDivision(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDivisionRequest) => divisionsService.updateDivision(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ["divisions", "list"] });
    },
  });
}

export function useDeleteDivision(onError: (error: string) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => divisionsService.deleteDivision(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["divisions", "list"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        onError(error.response?.data?.message || "Có lỗi xảy ra khi xóa phòng ban");
      }
    },
  });
}

export function useDivisionMembers(divisionId: number, search: string) {
  return useInfiniteQuery<{ data: DivisionUserAssignmentItem[]; pagination: PaginatedMeta }>(
    {
      queryKey: queryKeys.members(divisionId, search),
      queryFn: ({ pageParam = 1 }) => divisionsService.listMembersOfDivision(divisionId, pageParam as number, 10, search),
      getNextPageParam: (lastPage) => {
        if (!lastPage?.pagination) return undefined;
        const { current_page, total_pages } = lastPage.pagination;
        return current_page < total_pages ? current_page + 1 : undefined;
      },
      enabled: !!divisionId,
      initialPageParam: 1,
    }
  );
}

export function useDivisionMembersPaged(divisionId: number, page: number, limit: number, search: string) {
  return useQuery<{ data: DivisionUserAssignmentItem[]; pagination: PaginatedMeta}>({
    queryKey: queryKeys.membersPaged(divisionId, page, limit, search),
    queryFn: () => divisionsService.listMembersOfDivision(divisionId, page, limit, search),
    enabled: !!divisionId,
  });
}

export function useDivisionCandidates(divisionId: number, search: string) {
  return useInfiniteQuery<{ data: DivisionUserAssignmentItem[]; pagination: PaginatedMeta }>(
    {
      queryKey: queryKeys.candidates(divisionId, search),
      queryFn: ({ pageParam = 1 }) => divisionsService.listUserForAddToDivision(pageParam as number, 10, search),
      getNextPageParam: (lastPage) => {
        if (!lastPage?.pagination) return undefined;
        const { current_page, total_pages } = lastPage.pagination;
        return current_page < total_pages ? current_page + 1 : undefined;
      },
      enabled: !!divisionId,
      initialPageParam: 1,
    }
  );
}

export function useAddMemberToDivision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, divisionId }: { userId: number; divisionId: number }) => divisionsService.addMemberToDivision(userId, divisionId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.members(variables.divisionId, "") });
    },
  });
}

export function useRemoveMemberFromDivision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, divisionId }: { userId: number; divisionId: number }) => divisionsService.removeMemberFromDivision(userId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.members(variables.divisionId, "") });
    },
  });
}


