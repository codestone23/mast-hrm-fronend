"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "./overview/overviewStyle";
import CookieManager from "@/utils/cookies";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import ROUTERS from "@/config/router";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = CookieManager.getCookie("access_token");
    
    if (!accessToken) {
      // Clear all auth data
      CookieManager.deleteCookie("access_token");
      CookieManager.deleteCookie("refresh_token");
      LocalStorageUtil.removeItem(LOCAL_KEY.USER);
      LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
      LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
      
      // Redirect to login
      router.push(ROUTERS.AUTH.LOGIN);
    }
  }, [router]);

  return <PageContainer>{children}</PageContainer>;
}
