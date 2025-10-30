import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";

export const useOverview = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error, isInitialized } = useAppSelector((state) => state.user);

    useEffect(() => {
        const user = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
        if (user) {
            dispatch(fetchUserData(user));
        }
    }, []);

    useEffect(() => {
        if (!isInitialized && !data) {
            const loadData = async () => {
                await dispatch(fetchUserData());
            };
            loadData();
        }
    }, [isInitialized, data]);

    return {
        data: data,
        isLoading,
        error,
        isInitialized,
    };
};
