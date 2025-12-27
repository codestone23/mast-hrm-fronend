import React, { useState, useRef, useEffect } from "react";
import { Grid3X3, User, User as UserIcon, Lock, LogOut, Bell, Menu, X } from "lucide-react";
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
  DropdownDivider,
  NotificationWrapper,
  MobileMenuButton,
  MobileMenuOverlay,
  MobileMenuDropdown,
  MobileNavItem
} from "./headerCommonStyle";
import IMAGES from "@/config/images";
import Image from "next/image";
import Link from "next/link";
import ROUTERS from "@/config/router";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";
import { useRouter } from "next/navigation";
import CookieManager from "@/utils/cookies";
import { useMobile } from "@/hooks/useMobile";
import ChangePasswordModal from "@/components/authComponents/change-password-model/ChangePasswordModal";

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
  const isMobile = useMobile();
  const { activeTab = ROUTERS.PERSONAL.BASE, navItems = [] } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      const target = event.target as Node;
      const isClickOnMenuButton = mobileMenuRef.current?.contains(target);
      const isClickOnDropdown = mobileMenuDropdownRef.current?.contains(target);
      
      if (!isClickOnMenuButton && !isClickOnDropdown && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleTabClick = (tabId: string) => {
    router.push(tabId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      <HeaderContainer $isMobile={isMobile}>
        <Logo $isMobile={isMobile}>
          <Image src={IMAGES.common.logoWhite} alt="logo" height={isMobile ? 36 : 46} />
        </Logo>

        {!isMobile ? (
          <Navigation $isMobile={isMobile}>
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                $active={activeTab.startsWith(item.id.slice(1))}
                $isMobile={isMobile}
                onClick={() => handleTabClick(item.id)}
              >
                {item.label}
              </NavItem>
            ))}
          </Navigation>
        ) : (
          <>
            <MobileMenuButton $isMobile={isMobile} ref={mobileMenuRef} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
            <MobileMenuOverlay 
              $isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileMenuDropdown 
              $isOpen={isMobileMenuOpen}
              ref={mobileMenuDropdownRef}
            >
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.id}
                  $active={activeTab.startsWith(item.id.slice(1))}
                  onClick={() => handleTabClick(item.id)}
                >
                  {item.label}
                </MobileNavItem>
              ))}
            </MobileMenuDropdown>
          </>
        )}

        <UserSection $isMobile={isMobile}>
          <NotificationWrapper>
            <IconButton $isMobile={isMobile} onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <Bell size={isMobile ? 16 : 18} />
            </IconButton>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </NotificationWrapper>
          <IconButton $isMobile={isMobile}>
            <Link href={ROUTERS.OVERVIEW.BASE}><Grid3X3 size={isMobile ? 16 : 18} /></Link>
          </IconButton>
          <UserAvatar $isMobile={isMobile} ref={dropdownRef} onClick={toggleDropdown}>
            <User size={isMobile ? 14 : 16} color="white" />
            <UserDropdown $isOpen={isDropdownOpen} $isMobile={isMobile}>
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
