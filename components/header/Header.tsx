"use client";

import React from "react";
import { LogOut, User } from "lucide-react";
import {
    HeaderContainer,
    Logo,
    UserInfo,
    UserName,
    UserAvatar,
    LogoutButton,
    HeaderRight,
} from "./headerStyle";
import IMAGES from "@/config/images";
import Image from "next/image";
import { CookieManager } from "@/utils/cookies";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import { useUser } from "@/hooks/useUser";
import { useMobile } from "@/hooks/useMobile";

interface HeaderProps {
    userName?: string;
}

const Header = (props: HeaderProps) => {
    const { userName = "Admin User" } = props;
    const router = useRouter();
    const isMobile = useMobile();
    const { clearUserData } = useUser();

    const handleLogout = () => {
        CookieManager.deleteCookie("access_token");
        CookieManager.deleteCookie("refresh_token");
        clearUserData();
        LocalStorageUtil.removeItem(LOCAL_KEY.USER);
        LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
        LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
        router.push(ROUTERS.AUTH.LOGIN);
    };

    return (
        <HeaderContainer $isMobile={isMobile}>
            <Logo $isMobile={isMobile}>
                <Image src={IMAGES.common.logoWhite} alt="logo" height={isMobile ? 36 : 46} />
            </Logo>
            <HeaderRight $isMobile={isMobile}>
                <UserInfo $isMobile={isMobile}>
                    {!isMobile && <UserName $isMobile={isMobile}>{userName}</UserName>}
                    <UserAvatar $isMobile={isMobile}>
                        <User size={isMobile ? 14 : 16} />
                    </UserAvatar>
                </UserInfo>
                <LogoutButton $isMobile={isMobile} onClick={handleLogout}>
                    <LogOut size={isMobile ? 14 : 16} />
                </LogoutButton>
            </HeaderRight>
        </HeaderContainer>
    );
};

export default Header;
