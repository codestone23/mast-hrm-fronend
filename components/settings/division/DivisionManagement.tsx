"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Building2, Users } from "lucide-react";
import {
  PersonalContainer,
  DashboardGrid,
  Card,
  WelcomeCard,
  WelcomeContent,
  StatsCard,
  StatsNumber,
  CardHeader,
  CardTitle,
  CardLink,
  IconWrapper,
  StatsHeader,
  DashboardCol,
  AssetsGradientBox,
  AssetsNumber,
  AssetsLabel,
  AssetsListContainer,
  AssetsListTitle,
  AssetsItem,
  SearchInput,
  CreateButton,
  DivisionGrid,
  DivisionCard,
  DivisionIcon,
  DivisionInfo,
  DivisionName,
  DivisionDescription,
  DivisionStats,
  DivisionActions as CardActions,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./divisionStyle";
import CreateDivisionModal from "./modals/CreateDivisionModal";
import EditDivisionModal from "./modals/EditDivisionModal";
import { Division } from "@/constants/types";
import { ConfirmDeleteModal } from "@/components/common";

const DivisionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  // Mock data - sẽ được thay thế bằng API call
  const [divisions, setDivisions] = useState<Division[]>([
    {
      id: "1",
      name: "Phòng Công nghệ thông tin",
      description: "Quản lý và phát triển hệ thống công nghệ thông tin",
      employeeCount: 25,
      manager: "Nguyễn Văn A",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Phòng Nhân sự",
      description: "Quản lý nhân sự và các chính sách lao động",
      employeeCount: 12,
      manager: "Trần Thị B",
      status: "active",
      createdAt: "2023-02-20",
    },
    {
      id: "3",
      name: "Phòng Tài chính",
      description: "Quản lý tài chính và kế toán",
      employeeCount: 8,
      manager: "Lê Văn C",
      status: "active",
      createdAt: "2023-03-10",
    },
    {
      id: "4",
      name: "Phòng Marketing",
      description: "Quản lý marketing và truyền thông",
      employeeCount: 15,
      manager: "Phạm Thị D",
      status: "inactive",
      createdAt: "2023-04-05",
    },
  ]);

  const filteredDivisions = divisions.filter(
    (division) =>
      division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDivision = (divisionData: Omit<Division, "id" | "createdAt">) => {
    const newDivision: Division = {
      ...divisionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDivisions([...divisions, newDivision]);
    setIsCreateModalOpen(false);
  };

  const handleEditDivision = (divisionData: Division) => {
    setDivisions(
      divisions.map((division) =>
        division.id === divisionData.id ? divisionData : division
      )
    );
    setIsEditModalOpen(false);
    setSelectedDivision(null);
  };

  const handleDeleteDivision = () => {
    if (selectedDivision) {
      setDivisions(divisions.filter((division) => division.id !== selectedDivision.id));
      setIsDeleteModalOpen(false);
      setSelectedDivision(null);
    }
  };

  const handleEdit = (division: Division) => {
    setSelectedDivision(division);
    setIsEditModalOpen(true);
  };

  const handleDelete = (division: Division) => {
    setSelectedDivision(division);
    setIsDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#10b981" : "#ef4444";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

  const renderHeader = () => {
    const activeDivisions = divisions.filter(div => div.status === 'active').length;
    const totalEmployees = divisions.reduce((total, div) => total + div.employeeCount, 0);
    
    return (
      <DashboardCol>
        <WelcomeCard>
          <WelcomeContent>
            <h3>Quản lý phòng ban hệ thống</h3>
            <p>Tổng số phòng ban: {divisions.length} | Đang hoạt động: {activeDivisions} | Tổng nhân viên: {totalEmployees}</p>
          </WelcomeContent>
        </WelcomeCard>

        <Card>
          <CardHeader>
            <IconWrapper>
              <Building2 size={20} />
            </IconWrapper>
            <CardTitle>Tìm kiếm và quản lý</CardTitle>
          </CardHeader>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchInput
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả phòng ban..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <CreateButton onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} />
              Tạo phòng ban mới
            </CreateButton>
          </div>
        </Card>

        <StatsCard>
          <StatsHeader $marginBottom="0.5rem">
            <IconWrapper>
              <Building2 size={18} />
            </IconWrapper>
            <CardTitle>Tổng quan phòng ban</CardTitle>
          </StatsHeader>
          <StatsNumber className="large">{divisions.length}</StatsNumber>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            phòng ban
          </div>
        </StatsCard>

        <Card>
          <CardHeader>
            <IconWrapper>
              <Users size={20} />
            </IconWrapper>
            <CardTitle>Thống kê nhân viên</CardTitle>
          </CardHeader>
          <AssetsGradientBox>
            <AssetsNumber>{totalEmployees}</AssetsNumber>
            <AssetsLabel>Tổng nhân viên</AssetsLabel>
          </AssetsGradientBox>
          <AssetsListContainer>
            <AssetsListTitle>
              <strong>Phân bố nhân viên theo phòng ban</strong>
            </AssetsListTitle>
            {divisions.slice(0, 4).map((division) => (
              <AssetsItem $marginBottom="0.25rem" key={division.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>{division.name}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: division.status === 'active' ? 'var(--success-600)' : 'var(--text-muted)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: division.status === 'active' ? 'var(--success-100)' : 'var(--background-secondary)'
                  }}>
                    {division.employeeCount} nhân viên
                  </span>
                </div>
              </AssetsItem>
            ))}
            {divisions.length > 4 && (
              <AssetsItem $marginBottom="0.25rem" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                ... và {divisions.length - 4} phòng ban khác
              </AssetsItem>
            )}
          </AssetsListContainer>
        </Card>
      </DashboardCol>
    );
  };

  return (
    <PersonalContainer>
      <DashboardGrid>
        {renderHeader()}
        <DashboardCol $span={2}>
          <Card>
            <CardHeader>
              <IconWrapper>
                <Building2 size={20} />
              </IconWrapper>
              <CardTitle>Danh sách phòng ban</CardTitle>
              <CardLink>Xem tất cả</CardLink>
            </CardHeader>
            
            {filteredDivisions.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <Building2 size={48} />
                </EmptyIcon>
                <EmptyText>
                  {searchTerm ? "Không tìm thấy phòng ban nào phù hợp với từ khóa tìm kiếm" : "Chưa có phòng ban nào trong hệ thống"}
                </EmptyText>
                {!searchTerm && (
                  <div style={{ marginTop: '16px' }}>
                    <CreateButton onClick={() => setIsCreateModalOpen(true)}>
                      <Plus size={20} />
                      Tạo phòng ban đầu tiên
                    </CreateButton>
                  </div>
                )}
              </EmptyState>
            ) : (
              <DivisionGrid>
                {filteredDivisions.map((division) => (
                  <DivisionCard key={division.id}>
                    <DivisionIcon>
                      <Building2 size={24} />
                    </DivisionIcon>
                    <DivisionInfo>
                      <DivisionName>{division.name}</DivisionName>
                      <DivisionDescription>{division.description}</DivisionDescription>
                      <DivisionStats>
                        <div className="stat">
                          <Users size={16} />
                          <span>{division.employeeCount} nhân viên</span>
                        </div>
                        <div className="stat">
                          <span 
                            className="status" 
                            style={{ 
                              color: getStatusColor(division.status),
                              backgroundColor: division.status === 'active' ? 'var(--success-100)' : 'var(--error-100)',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {getStatusText(division.status)}
                          </span>
                        </div>
                      </DivisionStats>
                      {division.manager && (
                        <div style={{ 
                          fontSize: "13px", 
                          color: "var(--text-secondary)", 
                          marginTop: "8px",
                          padding: "6px 8px",
                          backgroundColor: "var(--background-secondary)",
                          borderRadius: "var(--radius-sm)",
                          display: "inline-block"
                        }}>
                          👤 Quản lý: {division.manager}
                        </div>
                      )}
                    </DivisionInfo>
                    <CardActions>
                      <ActionButton
                        $variant="edit"
                        onClick={() => handleEdit(division)}
                        title="Chỉnh sửa phòng ban"
                      >
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton
                        $variant="delete"
                        onClick={() => handleDelete(division)}
                        title="Xóa phòng ban"
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </CardActions>
                  </DivisionCard>
                ))}
              </DivisionGrid>
            )}
          </Card>
        </DashboardCol>
      </DashboardGrid>

      {/* Modals */}
      <CreateDivisionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateDivision}
      />

      <EditDivisionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDivision(null);
        }}
        division={selectedDivision}
        onSave={handleEditDivision}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDivision(null);
        }}
        onConfirm={handleDeleteDivision}
        title="Xóa phòng ban"
        message={`Bạn có chắc chắn muốn xóa phòng ban "${selectedDivision?.name}"? Hành động này không thể hoàn tác.`}
      />
    </PersonalContainer>
  );
};

export default DivisionManagement;
