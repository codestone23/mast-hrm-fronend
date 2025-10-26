import { useQuery } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { useEffect, useState } from "react";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import ROUTERS from "@/config/router";
import { useRouter } from "next/navigation";
import { User } from "@/constants/types";
import { convertUserToUserProfile } from "@/store/slices/userSlice";

export const usePersonal = () => {
  const [initLogin, setInitLogin] = useState(false);
  const router = useRouter();   
  const [user, setUser] = useState<User | null>(null);  
  const { data, isLoading, error } = useQuery({
    queryKey: ["personal", initLogin],
    queryFn: () => authService.getCurrentUser(),
    enabled: initLogin,
  });

  useEffect(() => { 
    if (initLogin) {
      if(data) {
        const userProfile = convertUserToUserProfile(data);
        LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
        setUser(data);
        setInitLogin(false);
        return;
      }
      router.push(ROUTERS.AUTH.LOGIN);
    }
  }, [data, initLogin]);

  useEffect(() => {
    const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
    if(!!userData?.id) {
      setUser(userData);
    } else {
      setInitLogin(true);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    setInitLogin,
    user,
    setUser,
  };
};
