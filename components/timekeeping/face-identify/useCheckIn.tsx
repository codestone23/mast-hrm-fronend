import { useToast } from "@/hooks/useToast";
import TimekeepingService from "@/services/timekeeping.service";
import { ApiResponse, LoginResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { CheckInData } from "@/types/api";

export const useCheckIn = () => {
    const [isCheckInLoading, setIsCheckInLoading] = useState(false);
    const { error, success } = useToast();

    const checkInMutation = useMutation({
        mutationFn: async (data: CheckInData): Promise<unknown> => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await TimekeepingService.checkIn(formData);
            return response;
        },
        onSuccess: (data: unknown) => {
            success('Check in thành công');
            setIsCheckInLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Check in thất bại');
            setIsCheckInLoading(false);
        },
    });

    return {
        isCheckInLoading,
        setIsCheckInLoading,
        checkInMutation,
    }
}