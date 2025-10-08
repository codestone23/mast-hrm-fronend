import React, { useState } from 'react';
import { Edit, Plus, Trash2, Clock } from 'lucide-react';
import EditPersonalInfoModal from './EditPersonalInfoModal';
import FamilyMemberModal from './FamilyMemberModal';
import DeleteFamilyMemberModal from './DeleteFamilyMemberModal';
import { 
  PersonalInfoContainer,
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
import { usePersonalInfo } from './usePersonalInfo';

interface FamilyMemberData {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  birthDate: string;
  phone: string;
  dependent: string;
  notes: string;
}

const PersonalInfo = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const { data, isLoading, error, initPersonalInfo } = usePersonalInfo(); 
  // Modal states
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isDeleteFamilyModalOpen, setIsDeleteFamilyModalOpen] = useState(false);
  const [familyModalMode, setFamilyModalMode] = useState<'add' | 'edit'>('add');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMemberData | null>(null);

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([
    // {
    //   id: '123',
    //   name: 'Phạm Gia AA',
    //   relationship: 'Bố',
    //   gender: 'Nam',
    //   birthDate: '30/04/2003',
    //   phone: '0974924857',
    //   dependent: 'Không',
    //   notes: 'N/A'
    // },
  ]);

  const handleEditPersonalInfo = () => {
    setIsEditPersonalModalOpen(true);
  };

  const handleAddFamilyMember = () => {
    setFamilyModalMode('add');
    setSelectedFamilyMember(null);
    setIsFamilyModalOpen(true);
  };

  const handleEditFamilyMember = (member: FamilyMemberData) => {
    setFamilyModalMode('edit');
    setSelectedFamilyMember(member);
    setIsFamilyModalOpen(true);
  };

  const handleDeleteFamilyMember = (member: FamilyMemberData) => {
    setSelectedFamilyMember(member);
    setIsDeleteFamilyModalOpen(true);
  };

  const handleSaveFamilyMember = (memberData: FamilyMemberData) => {
    if (familyModalMode === 'add') {
      setFamilyMembers(prev => [...prev, memberData]);
    } else {
      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === memberData.id ? memberData : member
        )
      );
    }
  };

  const handleConfirmDeleteFamilyMember = () => {
    if (selectedFamilyMember) {
      setFamilyMembers(prev => 
        prev.filter(member => member.id !== selectedFamilyMember.id)
      );
    }
  };

  return (
    <PersonalInfoContainer>
      <LeftSidebar>
        <UserProfile>
          <UserAvatar>
            <Image src={IMAGES.common.backgroundLogin} alt="User Avatar" width={120} height={120} />
          </UserAvatar>
          <UserName>{data?.name}</UserName> 
          <UserRole>Frontend Developer</UserRole>
        </UserProfile>

        <UserDetails>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{data?.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Mã nhân viên</DetailLabel>
            <DetailValue>{data?.id || 'N/A'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Người quản lý</DetailLabel>
            <DetailValue>
              <div>Không có</div>
            </DetailValue>
          </DetailItem>
        </UserDetails>

        <StatsGrid>
          <StatCard $color="#3b82f6">
            <StatNumber>{initPersonalInfo?.remaining_leave_days || 0}</StatNumber>
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
                <SectionAction onClick={handleEditPersonalInfo}>
                  <Edit size={16} />
                </SectionAction>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Ngày sinh</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Quốc tịch</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Giới tính</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Trạng thái tài khoản</InfoLabel>
                  <InfoValue>{"Hoạt động"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
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
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ tạm trú</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Loại hợp đồng</InfoLabel>
                  <InfoValue>Hợp đồng xác định thời hạn</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Địa chỉ thường trú</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email cá nhân</InfoLabel>
                  <InfoValue>{"Không có"}</InfoValue>
                </InfoItem>
              </InfoGrid>

              <SectionHeader>
                <SectionTitle>Thông tin thân nhân</SectionTitle>
                <SectionAction onClick={handleAddFamilyMember}>
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
                        <ActionButton 
                          $type="edit"
                          onClick={() => handleEditFamilyMember(member)}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton 
                          $type="delete"
                          onClick={() => handleDeleteFamilyMember(member)}
                        >
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

      <EditPersonalInfoModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => setIsEditPersonalModalOpen(false)}
      />

      <FamilyMemberModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        mode={familyModalMode}
        initialData={selectedFamilyMember ?? undefined}
        onSave={handleSaveFamilyMember}
      />

      <DeleteFamilyMemberModal
        isOpen={isDeleteFamilyModalOpen}
        onClose={() => setIsDeleteFamilyModalOpen(false)}
        memberName={selectedFamilyMember?.name || ''}
        onConfirm={handleConfirmDeleteFamilyMember}
      />
    </PersonalInfoContainer>
  );
};

export default PersonalInfo;
