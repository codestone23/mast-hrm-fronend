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

interface HeaderProps {
    userName?: string;
}

const Header = (props: HeaderProps) => {
    const { userName = "Admin User" } = props;
    const router = useRouter();

    const handleLogout = () => {
        CookieManager.deleteCookie("access_token");
        CookieManager.deleteCookie("refresh_token");
        LocalStorageUtil.removeItem(LOCAL_KEY.USER);
        LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
        LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
        router.push(ROUTERS.AUTH.LOGIN);
    };

    return (
        <HeaderContainer>
            <Logo>
                <Image src={IMAGES.common.logoWhite} alt="logo" height={46} />
            </Logo>
            <HeaderRight>
                <UserInfo>
                    <UserName>{userName}</UserName>
                    <UserAvatar>
                        <User size={16} />
                    </UserAvatar>
                </UserInfo>
                <LogoutButton onClick={handleLogout}>
                    <LogOut size={16} />
                </LogoutButton>
            </HeaderRight>
        </HeaderContainer>
    );
};

export default Header;
