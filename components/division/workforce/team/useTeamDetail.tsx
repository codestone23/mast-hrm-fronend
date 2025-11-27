import { useQuery } from "@tanstack/react-query";
import divisionWorkforceService from "@/services/division_workforce.service";
import { DivisionTeamDetailData } from "@/types/api";

export const useTeamDetail = (teamId: string | number | null) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['team-detail', teamId],
        queryFn: async () => {
            const response = await divisionWorkforceService.getTeamDetail(Number(teamId));
            return response as DivisionTeamDetailData;
        },
        enabled: !!teamId,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};
