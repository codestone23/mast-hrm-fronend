import { useQuery } from "@tanstack/react-query";
import divisionWorkforceService from "@/services/division_workforce.service";
import { ApiResponse, DivisionTeamDetailData } from "@/types/api";

export const useTeamDetail = (teamId: string | number | null) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['team-detail', teamId],
        queryFn: async () => {
            const response = await divisionWorkforceService.getTeamDetail(Number(teamId));
            return response as unknown as ApiResponse<DivisionTeamDetailData>;
        },
        enabled: !!teamId,
    });

    return {
        data: data?.data,
        isLoading,
        error,
        refetch,
    };
};
