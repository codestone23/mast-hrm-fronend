"use client";

import { useQuery } from "@tanstack/react-query";
import divisionDashboardService from "@/services/division_dashboard.service";
import { WorkInfoData, BirthdayEmployeeData, WorkStatisticData } from "@/types/api";

const queryKeys = {
  workInfo: (divisionId: number | null, date: Date) => 
    ["division-dashboard", "work-info", divisionId, date] as const,
  birthdayEmployees: (divisionId: number | null, month: number) => 
    ["division-dashboard", "birthday-employees", divisionId, month] as const,
  workStatistics: (divisionId: number | null, year: number) => 
    ["division-dashboard", "work-statistics", divisionId, year] as const,
};

export function useWorkInfo(divisionId: number | null, date: Date) {
  return useQuery<WorkInfoData>({
    queryKey: queryKeys.workInfo(divisionId, date),
    queryFn: () => divisionDashboardService.getWorkInfo(divisionId!, date),
    enabled: !!divisionId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBirthdayEmployees(divisionId: number | null, month: number) {
  return useQuery<BirthdayEmployeeData>({
    queryKey: queryKeys.birthdayEmployees(divisionId, month),
    queryFn: () => divisionDashboardService.getBirthdayEmployeeData(divisionId!, month),
    enabled: !!divisionId && !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkStatistics(divisionId: number | null, year: number) {
  return useQuery<WorkStatisticData>({
    queryKey: queryKeys.workStatistics(divisionId, year),
    queryFn: () => divisionDashboardService.getWorkStatisticData(divisionId!, year),
    enabled: !!divisionId && !!year,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

