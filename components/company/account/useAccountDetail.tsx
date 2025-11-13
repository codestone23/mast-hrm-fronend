import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
import { UserProfile, User } from "@/constants/types";

export const useAccountDetail = (accountId: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['account-detail', accountId],
        queryFn: async () => {
            const response = await userService.getUserById(accountId);
            const user = response as unknown as User;
            const userProfile: UserProfile = {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
                updated_at: user.updated_at,
                deleted_at: user.deleted_at,
                role_assignments: user.role_assignments || [],
                user_information: user.user_information as UserProfile['user_information'],
                education: undefined,
                experience: undefined,
                user_skills: undefined,
                assigned_devices: user.assigned_devices as UserProfile['assigned_devices'],
                annual_leave_quota: user.annual_leave_quota,
                join_date: user.join_date || undefined,
                today_attendance: user.today_attendance || undefined,
                remaining_leave_days: user.remaining_leave_days,
            };
            return userProfile;
        },
        enabled: !!accountId,
    });

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};

