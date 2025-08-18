import React, { useState } from 'react';
import { Edit, Plus, Trash2, Clock } from 'lucide-react';
import { 
  PersonalInfoContainer,
  LeftSidebar,
  UserProfile,
  UserAvatar,
  UserName,
  UserRole,
  ProfileProgress,
  ProgressLabel,
  ProgressBar,
  ProgressFill,
  UserDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
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
  FamilyTable,
  TableHeader,
  TableRow,
  TableCell,
  ActionButtons,
  ActionButton
} from './personalInfoStyle';
import Image from "next/image";
import IMAGES from "@/config/images";

const PersonalInfo = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const familyMembers = [
    {
      name: 'Phạm Gia AA',
      relationship: 'Bố',
      gender: 'Nam',
      birthDate: '30/04/2003',
      phone: '0974924857',
      dependent: 'Không',
      notes: 'N/A'
    },
  ];

  return (
    <PersonalInfoContainer>
      <LeftSidebar>
        <UserProfile>
          <UserAvatar>
            <Image src={IMAGES.common.backgroundLogin} alt="User Avatar" width={120} height={120} />
          </UserAvatar>
          <UserName>Phạm Gia Đạt</UserName>
          <UserRole>Developer</UserRole>
        </UserProfile>

        <UserDetails>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>abc@outlook.com</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Mã nhân viên</DetailLabel>
            <DetailValue>NV000001</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Người quản lý</DetailLabel>
            <DetailValue>
              <a href="#">Trung Thu</a>
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Loại chấm công</DetailLabel>
            <DetailValue>Loại thường</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Loại thưởng</DetailLabel>
            <DetailValue>-</DetailValue>
          </DetailItem>
        </UserDetails>

        <StatsGrid>
          <StatCard $color="#3b82f6">
            <StatNumber>14</StatNumber>
            <StatLabel>Số giờ phép còn lại</StatLabel>
          </StatCard>
          <StatCard $color="#6b7280">
            <StatNumber>54</StatNumber>
            <StatLabel>Số giờ đã nghỉ</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <StatCard $color="#f59e0b">
          <StatNumber>10.5</StatNumber>
          <StatLabel>
            <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
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
            $active={activeTab === 'contract'} 
            onClick={() => setActiveTab('contract')}
          >
            THÔNG TIN HỢP ĐỒNG
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
                <SectionAction>
                  <Edit size={16} />
                </SectionAction>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Ngày sinh</InfoLabel>
                  <InfoValue>30/04/2003</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Quốc tịch</InfoLabel>
                  <InfoValue>Việt Nam</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Giới tính</InfoLabel>
                  <InfoValue>Nam</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Trạng thái tài khoản</InfoLabel>
                  <InfoValue>Active</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>094545857</InfoValue>
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
                  <InfoValue>44444</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                  <InfoValue> hà nội</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Loại hợp đồng</InfoLabel>
                  <InfoValue>Hợp đồng xác định thời hạn</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ thường trú</InfoLabel>
                  <InfoValue>Thanh Hóa</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email cá nhân</InfoLabel>
                  <InfoValue>abc@outlook.com</InfoValue>
                </InfoItem>
              </InfoGrid>

              <SectionHeader>
                <SectionTitle>Thông tin thân nhân</SectionTitle>
                <SectionAction>
                  <Plus size={16} />
                </SectionAction>
              </SectionHeader>

              <FamilyTable>
                <TableHeader>
                  <div>Họ và tên</div>
                  <div>Mối quan hệ</div>
                  <div>Giới tính</div>
                  <div>Ngày sinh</div>
                  <div>Số điện thoại</div>
                  <div>Người phụ thuộc</div>
                  <div>Ghi nhận phụ thuộc</div>
                  <div></div>
                </TableHeader>
                
                {familyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.relationship}</TableCell>
                    <TableCell>{member.gender}</TableCell>
                    <TableCell>{member.birthDate}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.dependent}</TableCell>
                    <TableCell>{member.notes}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ActionButton $type="edit">
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton $type="delete">
                          <Trash2 size={14} />
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </FamilyTable>
            </>
          )}

          {activeTab === 'contract' && (
            <div>
              <h3>Thông tin hợp đồng sẽ được hiển thị ở đây</h3>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h3>Skill sheet sẽ được hiển thị ở đây</h3>
            </div>
          )}
        </TabContent>
      </MainContent>
    </PersonalInfoContainer>
  );
};

export default PersonalInfo;
