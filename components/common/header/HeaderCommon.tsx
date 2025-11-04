import React, { useState, useRef, useEffect } from "react";
import { Grid3X3, User, User as UserIcon, Lock, LogOut, Bell } from "lucide-react";
import { ChangePasswordModal } from "@/components/common";
import NotificationDropdown from "@/components/common/NotificationDropdown/NotificationDropdown";
import {
  HeaderContainer,
  Logo,
  Navigation,
  NavItem,
  UserSection,
  IconButton,
  UserAvatar,
  UserDropdown,
  DropdownHeader,
  DropdownUserName,
  DropdownUserEmail,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLink,
  DropdownDivider
} from "./headerCommonStyle";
import IMAGES from "@/config/images";
import Image from "next/image";
import Link from "next/link";
import ROUTERS from "@/config/router";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { useRouter } from "next/navigation";
import CookieManager from "@/utils/cookies";

interface NavItem {
  id: string;
  label: string;
}

interface HeaderCommonProps {
  activeTab?: string;
  navItems?: NavItem[];
}

interface User {
  name?: string;
  email?: string;
  user_information?: {
    name?: string;
  }
}

const HeaderCommon = (props: HeaderCommonProps) => {
  const router = useRouter();
  const { activeTab = ROUTERS.PERSONAL.BASE, navItems = [] } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tabId: string) => {
    router.push(tabId);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (action: string) => {
    setIsDropdownOpen(false);
    
    switch (action) {
      case 'profile':
        router.push(ROUTERS.PERSONAL.INFO);
        break;
      case 'password':
        setIsChangePasswordModalOpen(true);
        break;
      case 'logout':
        CookieManager.deleteCookie('access_token');
        CookieManager.deleteCookie('refresh_token');
        LocalStorageUtil.removeItem(LOCAL_KEY.USER);
        LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
        LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
        router.push(ROUTERS.AUTH.LOGIN);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo>
          <Image src={IMAGES.common.logoWhite} alt="logo" height={46} />
        </Logo>

        <Navigation>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              $active={activeTab.startsWith(item.id.slice(1))}
              onClick={() => handleTabClick(item.id)}
            >
              {item.label}
            </NavItem>
          ))}
        </Navigation>

        <UserSection>
          <div style={{ position: 'relative' }}>
            <IconButton onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <Bell size={18} />
            </IconButton>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>
          <IconButton>
            <Link href={ROUTERS.OVERVIEW.BASE}><Grid3X3 size={18} /></Link>
          </IconButton>
          <UserAvatar ref={dropdownRef} onClick={toggleDropdown}>
            <User size={16} color="white" />
            <UserDropdown $isOpen={isDropdownOpen}>
              <DropdownHeader>
                <DropdownUserName>{user?.user_information?.name || user?.name || ''}</DropdownUserName>
                <DropdownUserEmail>{user?.email || ''}</DropdownUserEmail>
              </DropdownHeader>
              
              <DropdownMenu>
                <DropdownMenuItem>
                  <DropdownMenuLink onClick={() => handleMenuClick('profile')}>
                    <UserIcon size={16} />
                    Thông tin cá nhân
                  </DropdownMenuLink>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <DropdownMenuLink onClick={() => handleMenuClick('password')}>
                    <Lock size={16} />
                    Đổi mật khẩu
                  </DropdownMenuLink>
                </DropdownMenuItem>
                
                <DropdownDivider />
                
                <DropdownMenuItem>
                  <DropdownMenuLink onClick={() => handleMenuClick('logout')}>
                    <LogOut size={16} />
                    Đăng xuất
                  </DropdownMenuLink>
                </DropdownMenuItem>
              </DropdownMenu>
            </UserDropdown>
          </UserAvatar>
        </UserSection>
      </HeaderContainer>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
};

export default HeaderCommon;
