import authService from "@/services/auth.service"
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";



export const useOverview = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['overview'],
        queryFn: () => authService.getCurrentUser(),
    })

    useEffect(() => {
        if(!!data?.id) {
            LocalStorageUtil.setItemObject(LOCAL_KEY.USER, data);
        }
    }, [data]);

    return {
        data: data,
        isLoading,
        error,
    }
}
