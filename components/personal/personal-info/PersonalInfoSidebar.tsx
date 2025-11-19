import React from "react";
import { Camera, Clock } from "lucide-react";
import Image from "next/image";
import IMAGES from "@/config/images";
import { User, UserProfile as UserProfileType } from "@/constants/types";
import {
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserRole,
  UserDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
} from "./personalInfoStyle";

interface PersonalInfoSidebarProps {
  data?: UserProfileType;
  avatarUrl: string | null;
  isUploading: boolean;
  onAvatarClick: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  initPersonalInfo?: User;
}

const PersonalInfoSidebar: React.FC<PersonalInfoSidebarProps> = ({
  data,
  avatarUrl,
  isUploading,
  onAvatarClick,
  onAvatarChange,
  fileInputRef,
  initPersonalInfo,
}) => {
  console.log(data);
  return (
    <LeftSidebar>
      <UserProfile>
        <UserAvatar onClick={onAvatarClick} style={{ cursor: 'pointer', position: 'relative' }}>
          {avatarUrl && avatarUrl.includes('https') ? (
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={120}
              height={120}
            />
          ) : (
            <Image
              src={IMAGES.common.backgroundLogin}
              alt="User Avatar"
              width={120}
              height={120}
            />
          )}
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'var(--primary-500)',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Camera size={16} color="white" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onAvatarChange}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
        </UserAvatar>
        <UserName>
          {data?.user_information?.name || data?.name}
        </UserName>
        <UserRole>
          {data?.user_information?.expertise || "Không có"} 
        </UserRole>
      </UserProfile>

      <UserDetails>
        <DetailItem>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>
            {data?.user_information?.email || data?.email}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Mã nhân viên</DetailLabel>
          <DetailValue>
            {data?.user_information?.code || "Không có"} 
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Người quản lý</DetailLabel>
          <DetailValue>
            {data?.division.division_head.name !== data?.user_information?.name ? data?.division.division_head.name : 'Không có'}
          </DetailValue>
        </DetailItem>
      </UserDetails>
      <StatsGrid>
        <StatCard $color="#3b82f6">
          <StatNumber>
            {initPersonalInfo?.remaining_leave_days || 0}
          </StatNumber>
          <StatLabel>Số giờ phép còn lại</StatLabel>
        </StatCard>
      </StatsGrid>
      <StatsGrid>
        <StatCard $color="#6b7280">
          <StatNumber>0</StatNumber>
          <StatLabel>Số giờ đã nghỉ</StatLabel>
        </StatCard>
        <StatCard $color="#f59e0b">
          <StatNumber>0</StatNumber>
          <StatLabel>
            <Clock
              size={16}
              style={{
                display: "inline",
                marginRight: "0.5rem",
              }}
            />
            Số giờ OT
          </StatLabel>
        </StatCard>
      </StatsGrid>
    </LeftSidebar>
  );
};

export default PersonalInfoSidebar;

