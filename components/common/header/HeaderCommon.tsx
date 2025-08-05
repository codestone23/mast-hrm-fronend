"use client";

import React from "react";
import { Bell, Grid3X3, Settings, User } from "lucide-react";
import {
  HeaderContainer,
  Logo,
  Navigation,
  NavItem,
  UserSection,
  IconButton,
  UserAvatar,
} from "./headerCommonStyle";
import IMAGES from "@/config/images";
import Image from "next/image";

interface HeaderCommonProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const HeaderCommon = (props: HeaderCommonProps) => {
  const { activeTab = "dashboard", onTabChange } = props;
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "member-info", label: "Thông tin member" },
    { id: "assets", label: "Tài sản số hữu" },
    { id: "projects", label: "Dự án tham gia" },
    { id: "attendance", label: "Chấm công" },
    { id: "company", label: "Công ty" },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <HeaderContainer>
      <Logo>
        <Image src={IMAGES.common.logoWhite} alt="logo" height={46} />
      </Logo>

      <Navigation>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            $active={activeTab === item.id}
            onClick={() => handleTabClick(item.id)}
          >
            {item.label}
          </NavItem>
        ))}
      </Navigation>

      <UserSection>
        <IconButton>
          <Bell size={18} />
        </IconButton>
        <IconButton>
          <Grid3X3 size={18} />
        </IconButton>
        <IconButton>
          <Settings size={18} />
        </IconButton>
        <UserAvatar>
          <User size={16} color="white" />
        </UserAvatar>
      </UserSection>
    </HeaderContainer>
  );
};

export default HeaderCommon;
