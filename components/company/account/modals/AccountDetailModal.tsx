"use client";

import React, { useState } from "react";
import { X, User, Calendar, Edit, Trash2, Star, Briefcase, Award, GraduationCap, Plus } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  StatusBadge,
  ActionButtons,
  ActionButton,
  PersonalInfoContainer,
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserPosition,
  UserDetails,
  DetailItem as SidebarDetailItem,
  DetailLabel as SidebarDetailLabel,
  DetailValue as SidebarDetailValue,
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
} from "./modalStyle";
import { Account } from "@/constants/types";

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onEdit: () => void;
  onDelete: () => void;
}

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  isOpen,
  onClose,
  account,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen || !account) return null;

  const getStatusColor = (status: string) => {
    return status === "active" ? "#10b981" : "#ef4444";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $isLarge onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Chi tiết tài khoản - {account.name}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <PersonalInfoContainer>
            <LeftSidebar>
              <UserProfile>
                <UserAvatar>
                  {account.avatar && account.avatar.includes('https') ? (
                    <img src={account.avatar} alt={account.name} width={120} height={120} />
                  ) : (
                    <User size={60} />
                  )}
                </UserAvatar>
                <UserName>{account.name}</UserName>
                <UserPosition>{account.position}</UserPosition>
              </UserProfile>

              <UserDetails>
                <SidebarDetailItem>
                  <SidebarDetailLabel>Email</SidebarDetailLabel>
                  <SidebarDetailValue>{account.email}</SidebarDetailValue>
                </SidebarDetailItem>
                <SidebarDetailItem>
                  <SidebarDetailLabel>Mã nhân viên</SidebarDetailLabel>
                  <SidebarDetailValue>{account.id}</SidebarDetailValue>
                </SidebarDetailItem>
                <SidebarDetailItem>
                  <SidebarDetailLabel>Trạng thái</SidebarDetailLabel>
                  <SidebarDetailValue>
                    <StatusBadge $color={getStatusColor(account.status)}>
                      {getStatusText(account.status)}
                    </StatusBadge>
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
                  <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Số giờ OT
                </StatLabel>
              </StatCard>
            </LeftSidebar>

            <MainContent>
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
                  THÔNG TIN CÔNG VIỆC
                </TabItem>
              </ContentTabs>

              <TabContent>
                {activeTab === 'basic' && (
                  <>
                    <SectionHeader>
                      <SectionTitle>Thông tin cá nhân</SectionTitle>
                      <SectionAction onClick={onEdit}>
                        <Edit size={16} />
                      </SectionAction>
                    </SectionHeader>

                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>Ngày sinh</InfoLabel>
                        <InfoValue>Chưa cập nhật</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Quốc tịch</InfoLabel>
                        <InfoValue>Việt Nam</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Giới tính</InfoLabel>
                        <InfoValue>Chưa cập nhật</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Trạng thái tài khoản</InfoLabel>
                        <InfoValue>
                          <StatusBadge $color={getStatusColor(account.status)}>
                            {getStatusText(account.status)}
                          </StatusBadge>
                        </InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Số điện thoại</InfoLabel>
                        <InfoValue>{account.phone || "Chưa cập nhật"}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Loại nhân sự</InfoLabel>
                        <InfoValue>Chính thức</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Tình trạng hôn nhân</InfoLabel>
                        <InfoValue>Chưa kết hôn</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Phòng ban (Nhóm)</InfoLabel>
                        <InfoValue>{account.department || "Chưa phân công"}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                        <InfoValue>Chưa cập nhật</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Loại hợp đồng</InfoLabel>
                        <InfoValue>Hợp đồng xác định thời hạn</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Địa chỉ thường trú</InfoLabel>
                        <InfoValue>Chưa cập nhật</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Email cá nhân</InfoLabel>
                        <InfoValue>Chưa cập nhật</InfoValue>
                      </InfoItem>
                    </InfoGrid>
                  </>
                )}

                {activeTab === 'skills' && (
                  <>
                    {/* Skills Section */}
                    <SectionHeader>
                      <SectionTitle>
                        <Star size={20} style={{ marginRight: '8px' }} />
                        Kỹ năng
                      </SectionTitle>
                      <SectionAction>
                        <Plus size={16} />
                      </SectionAction>
                    </SectionHeader>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#6b7280',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px dashed #d1d5db'
                      }}>
                        <Star size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ margin: '0', fontSize: '16px' }}>Chưa có kỹ năng nào</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Nhấn nút + để thêm kỹ năng mới</p>
                      </div>
                    </div>

                    {/* Experience Section */}
                    <SectionHeader>
                      <SectionTitle>
                        <Briefcase size={20} style={{ marginRight: '8px' }} />
                        Kinh nghiệm làm việc
                      </SectionTitle>
                      <SectionAction>
                        <Plus size={16} />
                      </SectionAction>
                    </SectionHeader>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#6b7280',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px dashed #d1d5db'
                      }}>
                        <Briefcase size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ margin: '0', fontSize: '16px' }}>Chưa có kinh nghiệm nào</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Nhấn nút + để thêm kinh nghiệm mới</p>
                      </div>
                    </div>

                    {/* Education Section */}
                    <SectionHeader>
                      <SectionTitle>
                        <GraduationCap size={20} style={{ marginRight: '8px' }} />
                        Học vấn
                      </SectionTitle>
                      <SectionAction>
                        <Plus size={16} />
                      </SectionAction>
                    </SectionHeader>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#6b7280',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px dashed #d1d5db'
                      }}>
                        <GraduationCap size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ margin: '0', fontSize: '16px' }}>Chưa có học vấn nào</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Nhấn nút + để thêm học vấn mới</p>
                      </div>
                    </div>
                  </>
                )}
              </TabContent>
            </MainContent>
          </PersonalInfoContainer>
        </ModalBody>

        <ModalFooter>
          <ActionButtons>
            <ActionButton $variant="edit" onClick={onEdit}>
              <Edit size={16} />
              Chỉnh sửa
            </ActionButton>
            <ActionButton $variant="delete" onClick={onDelete}>
              <Trash2 size={16} />
              Xóa
            </ActionButton>
          </ActionButtons>
          <Button $variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AccountDetailModal;