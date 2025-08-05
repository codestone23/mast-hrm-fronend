'use client';

import React from 'react';
import { User } from 'lucide-react';
import {
  HeaderContainer,
  Logo,
  UserInfo,
  UserName,
  UserAvatar
} from './headerStyle';
import IMAGES from "@/config/images";
import Image from "next/image";

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = "Admin User" }) => {
  return (
    <HeaderContainer>
      <Logo>
        <Image src={IMAGES.common.logo} alt="logo" height={46} />
      </Logo>
      <UserInfo>
        <UserName>{userName}</UserName>
        <UserAvatar>
          <User size={16} />
        </UserAvatar>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;