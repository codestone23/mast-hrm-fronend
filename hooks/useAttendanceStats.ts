import { useQuery } from "@tanstack/react-query";
import attendanceService, { AttendanceStatistics } from "@/services/attendance.service";

interface UseAttendanceStatsParams {
  start_date?: string;
  end_date?: string;
}

export const usePersonalAttendanceStats = (
  params?: UseAttendanceStatsParams
) => {
  return useQuery<AttendanceStatistics>({
    queryKey: ["personal-attendance-stats", params],
    queryFn: () => attendanceService.getPersonalAttendanceStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAttendanceStats = usePersonalAttendanceStats;
