import { useToast } from "@/hooks/useToast";
import TimekeepingService from "@/services/timekeeping.service";
import { ApiResponse, LoginResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { CheckOutData } from "@/types/api";

export const useCheckOut = () => {
    const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);
    const { error, success } = useToast();

    const checkOutMutation = useMutation({
        mutationFn: async (data: CheckOutData): Promise<unknown> => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await TimekeepingService.checkOut(formData);
            return response;
        },
        onSuccess: (data: unknown) => {
            success('Check out thành công');
            setIsCheckOutLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Check out thất bại');
            setIsCheckOutLoading(false);
        },
    });

    return {
        isCheckOutLoading,
        setIsCheckOutLoading,
        checkOutMutation,
    }
}