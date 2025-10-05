import { useToast } from "@/hooks/useToast";
import TimekeepingService from "@/services/timekeeping.service";
import { ApiResponse, LoginResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { RegisterFaceData } from "@/types/api";

export const useRegisterFace = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { error, success } = useToast();

    const registerFaceMutation = useMutation({
        mutationFn: async (data: RegisterFaceData): Promise<unknown> => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await TimekeepingService.registerFace(formData);
            return response;
        },
        onSuccess: (data: unknown) => {
            console.log(data);
            success('Đăng ký khuôn mặt thành công');
            setIsLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Đăng ký khuôn mặt thất bại');
            setIsLoading(false);
        },
    });

    return {
        isLoading,
        setIsLoading,
        registerFaceMutation,
    }
}