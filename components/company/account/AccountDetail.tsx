"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Star, Briefcase, Award, GraduationCap, Plus, Clock } from "lucide-react";
import {
  PersonalInfoContainer,
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserRole,
  UserDetails,
  SidebarDetailItem,
  SidebarDetailLabel,
  SidebarDetailValue,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  MainContent,
  ContentTabs,
  TabItem,
  TabContent,
  SectionHeader,
  SectionTitle,
  SectionAction,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  BackButton,
  HeaderActions,
  ActionButton,
} from "./accountDetailStyle";
import { Account } from "@/constants/types";
import Image from "next/image";
import IMAGES from "@/config/images";

interface AccountDetailProps {
  accountId: string;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ accountId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAccount: Account = {
      id: accountId,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      roles: ["admin"],
      status: "active",
      avatar: "https://i.pravatar.cc/150?img=1",
      phone: "0987654321",
      department: "IT",
      position: "Software Engineer",
      joinDate: "2022-01-15",
    };
    
    setAccount(mockAccount);
    setLoading(false);
  }, [accountId]);

  const getStatusColor = (status: string) => {
    return status === "active" ? "#10b981" : "#ef4444";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleBack = () => {
    router.push('/company/accounts');
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
  };

  const handleDelete = () => {
    // Show delete confirmation
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <PersonalInfoContainer>
      <LeftSidebar>
          <UserProfile>
            <UserAvatar>
              {account.avatar ? (
                <img src={account.avatar} alt={account.name} />
              ) : (
                <Image src={IMAGES.common.backgroundLogin} alt="User Avatar" width={120} height={120} />
              )}
            </UserAvatar>
            <UserName>{account.name}</UserName>
            <UserRole>{account.position || 'N/A'}</UserRole>
          </UserProfile>

          <UserDetails>
            <SidebarDetailItem>
              <SidebarDetailLabel>Email</SidebarDetailLabel>
              <SidebarDetailValue>{account.email}</SidebarDetailValue>
            </SidebarDetailItem>
            <SidebarDetailItem>
              <SidebarDetailLabel>Chức vụ</SidebarDetailLabel>
              <SidebarDetailValue>{account.position}</SidebarDetailValue>
            </SidebarDetailItem>
            <SidebarDetailItem>
              <SidebarDetailLabel>Phòng ban</SidebarDetailLabel>
              <SidebarDetailValue>{account.department || 'Chưa phân công'}</SidebarDetailValue>
            </SidebarDetailItem>
            <SidebarDetailItem>
              <SidebarDetailLabel>Trạng thái</SidebarDetailLabel>
              <SidebarDetailValue style={{ color: getStatusColor(account.status) }}>
                {getStatusText(account.status)}
              </SidebarDetailValue>
            </SidebarDetailItem>
          </UserDetails>

          <StatsGrid>
            <StatCard $color="#3b82f6">
              <StatNumber>0</StatNumber>
              <StatLabel>Số giờ phép còn lại</StatLabel>
            </StatCard>
            <StatCard $color="#6b7280">
              <StatNumber>0</StatNumber>
              <StatLabel>Số giờ đã nghỉ</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <StatCard $color="#f59e0b">
            <StatNumber>0</StatNumber>
            <StatLabel>
              <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Số giờ OT
            </StatLabel>
          </StatCard>
        </LeftSidebar>

      <MainContent>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Chi tiết tài khoản</h1>
            </div>
            <HeaderActions>
              <ActionButton $variant="edit" onClick={handleEdit}>
                <Edit size={16} />
                Chỉnh sửa
              </ActionButton>
              <ActionButton $variant="delete" onClick={handleDelete}>
                <Trash2 size={16} />
                Xóa
              </ActionButton>
            </HeaderActions>
          </div>
        </div>

        <ContentTabs>
          <TabItem 
            $active={activeTab === 'basic'} 
            onClick={() => setActiveTab('basic')}
          >
            THÔNG TIN CƠ BẢN
          </TabItem>
          <TabItem 
            $active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')}
          >
            SKILL SHEET
          </TabItem>
        </ContentTabs>

        <TabContent>
          {activeTab === 'basic' && (
            <>
              <SectionHeader>
                <SectionTitle>Thông tin cá nhân</SectionTitle>
                <SectionAction onClick={handleEdit}>
                  <Edit size={16} />
                </SectionAction>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Ngày gia nhập</InfoLabel>
                  <InfoValue>{formatDate(account.joinDate)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>{account.phone || "Chưa có thông tin"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Vị trí</InfoLabel>
                  <InfoValue>{account.position || "Chưa có thông tin"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email cá nhân</InfoLabel>
                  <InfoValue>Chưa có thông tin</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                  <InfoValue>Chưa có thông tin</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ thường trú</InfoLabel>
                  <InfoValue>Chưa có thông tin</InfoValue>
                </InfoItem>
              </InfoGrid>
            </>
          )}

          {activeTab === 'skills' && (
            <>
              <SectionHeader>
                <SectionTitle>
                  <Star size={20} style={{ marginRight: '8px' }} />
                  Kỹ năng
                </SectionTitle>
                <SectionAction onClick={() => console.log('Add skill')}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chưa có kỹ năng nào</p>

              <SectionHeader style={{ marginTop: '32px' }}>
                <SectionTitle>
                  <Briefcase size={20} style={{ marginRight: '8px' }} />
                  Kinh nghiệm làm việc
                </SectionTitle>
                <SectionAction onClick={() => console.log('Add experience')}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chưa có kinh nghiệm nào</p>

              <SectionHeader style={{ marginTop: '32px' }}>
                <SectionTitle>
                  <GraduationCap size={20} style={{ marginRight: '8px' }} />
                  Học vấn
                </SectionTitle>
                <SectionAction onClick={() => console.log('Add education')}>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chưa có học vấn nào</p>
            </>
          )}
        </TabContent>
      </MainContent>
    </PersonalInfoContainer>
  );
};

export default AccountDetail;
