import { useQuery } from "@tanstack/react-query"
import profileService from "@/services/profile.service"
import { useEffect, useState } from "react";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { User } from "@/constants/types";

export const usePersonalInfo = () => {
    const [initPersonalInfo, setInitPersonalInfo] = useState<User | null>(null);
    const { data, isLoading, error, refetch } = useQuery({       
        queryKey: ['personal-info'],
        queryFn: () => profileService.getProfile(),
    })

    useEffect(() => {
        const dataUser = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
        if(!!dataUser?.id) {
            setInitPersonalInfo(dataUser);
        }
    }, [data]);

    return {
        data,
        isLoading,
        error,
        initPersonalInfo,
        refetch,
    }
}