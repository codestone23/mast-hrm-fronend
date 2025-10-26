import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserData } from "@/store/slices/userSlice";

export const useOverview = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error, isInitialized } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!isInitialized && !data) {
            const loadData = async () => {
                await dispatch(fetchUserData());
            };
            loadData();
        }
    }, [dispatch, isInitialized, data]);

    return {
        data: data,
        isLoading,
        error,
        isInitialized,
    };
};
