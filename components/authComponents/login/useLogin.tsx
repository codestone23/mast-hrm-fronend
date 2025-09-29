import { useToast } from "@/hooks/useToast";
import authService from "@/services/auth.service";
import { ApiResponse, LoginResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";

interface LoginFormData {
    username: string;
    password: string;
}

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { error, success } = useToast();

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {    
            const response = await authService.login({ email: data.username, password: data.password });
            return response;
        },
        onSuccess: (data: LoginResponse) => {
            if (data.access_token) {
                success('Đăng nhập thành công');
                Cookie.set('access_token', data.access_token);
                Cookie.set('refresh_token', data.refresh_token);
                router.push(ROUTERS.OVERVIEW.BASE);
            }
            setIsLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Đăng nhập thất bại');
            setIsLoading(false);
        },
    });

    return {
        isLoading,
        setIsLoading,
        loginMutation,
    }
}