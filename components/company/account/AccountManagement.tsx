"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Trash2, User, Users, Search, Shield, MoreVertical, UserMinus, ScanFace } from "lucide-react";
import { Input, Table, Pagination, Select } from "@/components/common";
import { useMobile } from "@/hooks/useMobile";
import { TableColumn } from "@/components/common/Table/Table";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  CreateButton,
  ActionMenuContainer,
  ActionMenuButton,
  ActionMenuDropdown,
  ActionMenuList,
  ActionMenuItem,
  ActionMenuLink,
  ActionMenuDivider,
  SearchContainer,
  FilterRow,
  FilterItem,
  HeaderRow,
  FilterContainer,
  StatsRow,
  UserInfoCell,
  UserAvatarCell,
  UserInfoText,
  UserNameText,
  UserEmailText,
  RoleBadgeContainer,
  RoleBadge,
  EmptyRoleText,
  FaceRegistrationBadge,
  StatusToggle,
  StatusToggleThumb,
  StatsText,
  StatsValue,
  PaginationWrapper,
} from "./accountStyle";
import CreateAccountModal from "./modals/CreateAccountModal";
import AssignRoleModal from "./modals/AssignRoleModal";
import UnassignRoleModal from "./modals/UnassignRoleModal";
import RegisterFaceModal from "./modals/RegisterFaceModal";
import { ConfirmDeleteModal } from "@/components/common";
import { User as UserType } from "@/types/api";
import userService from "@/services/user.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { ROLE_NAMES, DivisionStatus, USER_STATUS } from "@/constants/enums";
import ROUTERS from "@/config/router";
import rolesService from "@/services/roles.service";
import divisionsService from "@/services/divisions.service";
import { Role, DivisionListItem } from "@/types/api";
import Image from "next/image";
import { getRoleName } from "@/utils/help";
import { ITEMS_PER_PAGE } from "@/constants/constants";

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

enum ModalType {
  NONE = "none",
  CREATE = "create",
  DELETE = "delete",
  ASSIGN_ROLE = "assignRole",
  UNASSIGN_ROLE = "unassignRole",
  REGISTER_FACE = "registerFace",
  STATUS_CONFIRM = "statusConfirm",
}

const AccountManagement: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMobile();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | undefined>(undefined);
  const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ userId: string; status: USER_STATUS } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPositions, setMenuPositions] = React.useState<Record<string, { rect: DOMRect; position: 'top' | 'bottom' }>>({});
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const button = buttonRefs.current[openMenuId];
      const dropdown = dropdownRefs.current[openMenuId];
      
      // Check if click is outside both button and dropdown
      const clickedOutsideButton = !button || !button.contains(target);
      const clickedOutsideDropdown = !dropdown || !dropdown.contains(target);
      
      if (clickedOutsideButton && clickedOutsideDropdown) {
        setOpenMenuId(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  // Fetch roles for filter
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.getRoles(),
  });

  const roles = rolesData || [];

  // Fetch divisions for filter
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions", "filter"],
    queryFn: () => divisionsService.getDivisions({ limit: 100 }),
  });

  const divisions = divisionsData?.data || [];

  // Query users
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", currentPage, debouncedSearch, selectedRoleId, selectedStatus, selectedDivisionId],
    queryFn: () =>
      userService.getUsers(
        currentPage, 
        ITEMS_PER_PAGE, 
        debouncedSearch || undefined,
        selectedRoleId,
        selectedStatus,
        selectedDivisionId
      ),
  });

  const users = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (userData: CreateAccountData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Tạo tài khoản thành công");
      setOpenModal(ModalType.NONE);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Xóa tài khoản thành công");
      setOpenModal(ModalType.NONE);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa tài khoản");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: USER_STATUS }) =>
      userService.updateUser(userId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Cập nhật trạng thái thành công");
      setOpenModal(ModalType.NONE);
      setPendingStatusUpdate(null);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      setOpenModal(ModalType.NONE);
      setPendingStatusUpdate(null);
      setSelectedUser(null);
    },
  });


  // Handlers
  const handleCreateAccount = (accountData: CreateAccountData) => {
    createMutation.mutate(accountData);
  };

  const handleDeleteAccount = () => {
    if (selectedUser) {
      deleteMutation.mutate(String(selectedUser.id));
    }
  };

  const handleViewDetail = (user: UserType) => {
    router.push(`${ROUTERS.COMPANY.ACCOUNTS}/${user.id}`); 
  };

  const handleDelete = (user: UserType) => {
    setSelectedUser(user);
    setOpenModal(ModalType.DELETE);
  };

  const handleAssignRole = (user: UserType) => {
    setSelectedUser(user);
    setOpenModal(ModalType.ASSIGN_ROLE);
  };

  const handleUnassignRole = (user: UserType) => {
    setSelectedUser(user);
    setOpenModal(ModalType.UNASSIGN_ROLE);
  };

  const handleRegisterFace = (user: UserType) => {
    setSelectedUser(user);
    setOpenModal(ModalType.REGISTER_FACE);
  };

  const handleRegisterFaceSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setOpenModal(ModalType.NONE);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: UserType) => {
    const currentStatus = getUserStatus(user);  
    const newStatus = currentStatus ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;
    setSelectedUser(user);
    setPendingStatusUpdate({ userId: String(user.id), status: newStatus });
    setOpenModal(ModalType.STATUS_CONFIRM);
  };

  const handleCloseModal = () => {
    setOpenModal(ModalType.NONE);
    setSelectedUser(null);
    setPendingStatusUpdate(null);
  };

  const handleConfirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatusMutation.mutate(pendingStatusUpdate);
    }
  };

  const getUserName = (user: UserType): string => {
    if (Array.isArray(user.user_information) && user.user_information.length > 0) {
      const info = user.user_information[0] as { name?: string };
      return info?.name || user.name || user.email;
    }
    return user.name || user.email;
  };

  const getUserInfo = (user: UserType) => {
    if (Array.isArray(user.user_information) && user.user_information.length > 0) {
      return user.user_information[0] as {
        name?: string;
        phone?: string;
        department?: string;
        position?: string;
        avatar?: string;
      };
    }
    return null;
  };

  const getUserStatus = (user: UserType): boolean => {
    return user.status === USER_STATUS.ACTIVE;
  };

  // Table columns
  const columns: TableColumn<UserType>[] = [
    {
      key: "userInfo",
      label: "Thông tin",
      width: "300px",
      render: (_, row) => {
        const userName = getUserName(row);
        const userInfo = getUserInfo(row);
        return (
          <UserInfoCell>
            <UserAvatarCell>
              {userInfo?.avatar?.includes('https') ? (
                <Image 
                  src={userInfo.avatar} 
                  alt={userName} 
                  width={40} 
                  height={40} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  loading="lazy" 
                /> 
              ) : (
                <User size={20} />
              )}
            </UserAvatarCell>
            <UserInfoText>
              <UserNameText>{userName}</UserNameText>
              <UserEmailText>{row.email}</UserEmailText>
            </UserInfoText>
          </UserInfoCell>
        );
      },
    },
    {
      key: "role",
      label: "Vai trò",
      render: (_, row) => {
        const roles = row.user_role_assignments || [];
        const companyRoles = roles.filter(
          (assignment) => assignment.scope_type === "COMPANY"
        );
        
        if (companyRoles.length === 0) {
          return <EmptyRoleText>Chưa có vai trò</EmptyRoleText>;
        }
        
        return (
          <RoleBadgeContainer>
            {companyRoles.map((assignment, index) => (
              <RoleBadge key={index}>
                {getRoleName(assignment.role.name)}
              </RoleBadge>
            ))}
          </RoleBadgeContainer>
        );
      },
    },
    {
      key: "user_division",
      label: "Phòng ban",
      width: "200px",
      render: (_, row) => {
        const userDivision = row.user_division as { division: { name: string } };
        const divisionName = userDivision?.division?.name || "-";
        return divisionName || "Chưa phân công";
      },
    },
    {
      key: "register_face",
      label: "Đăng ký khuôn mặt",
      width: "150px",
      render: (_, row) => {
        const isRegistered = !!(row.user_embeddings.length > 0);
        return (
          <FaceRegistrationBadge $isRegistered={isRegistered}>
            {isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
          </FaceRegistrationBadge>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "120px",
      align: "center",
      render: (_, row) => {
        const isActive = getUserStatus(row);
        const isLoading = updateStatusMutation.isPending;
        
        return (
          <StatusToggle
            $isActive={isActive}
            $isLoading={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) {
                handleToggleStatus(row);
              }
            }}
          >
            <StatusToggleThumb $isActive={isActive} />
          </StatusToggle>
        );
      },
    },
    {
      key: "actions",
      label: "Hành động",
      width: "100px",
      align: "center",
      render: (_, row) => {
        const menuId = `menu-${row.id}`;
        const isOpen = openMenuId === menuId;
        const menuPosition = menuPositions[menuId];

        const handleToggle = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (isOpen) {
            setOpenMenuId(null);
            return;
          }

          const button = buttonRefs.current[menuId];
          if (!button) return;

          const rect = button.getBoundingClientRect();
          const dropdownHeight = 200;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const position: 'top' | 'bottom' = 
            spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';
          
          setMenuPositions(prev => ({
            ...prev,
            [menuId]: { rect, position }
          }));
          setOpenMenuId(menuId);
        };

        return (
          <ActionMenuContainer onClick={(e) => e.stopPropagation()}>
            <ActionMenuButton
              ref={(el) => {
                buttonRefs.current[menuId] = el;
              }}
              onClick={handleToggle}
              aria-label="Menu hành động"
            >
              <MoreVertical size={18} />
            </ActionMenuButton>
            {isOpen && menuPosition && typeof window !== 'undefined' && createPortal(
              <ActionMenuDropdown 
                ref={(el) => {
                  dropdownRefs.current[menuId] = el;
                }}
                $isOpen={isOpen}
                $triggerRect={menuPosition.rect}
                $position={menuPosition.position}
                onClick={(e) => e.stopPropagation()}
              >
                <ActionMenuList>
                  <ActionMenuItem>
                    <ActionMenuLink
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenMenuId(null);
                        handleViewDetail(row);
                      }}
                    >
                      <Eye size={16} />
                      <span>Xem chi tiết</span>
                    </ActionMenuLink>
                  </ActionMenuItem>
                  <ActionMenuItem>
                    <ActionMenuLink
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenMenuId(null);
                        handleAssignRole(row);
                      }}
                    >
                      <Shield size={16} />
                      <span>Gán vai trò</span>
                    </ActionMenuLink>
                  </ActionMenuItem>
                  <ActionMenuItem>
                    <ActionMenuLink
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenMenuId(null);
                        handleUnassignRole(row);
                      }}
                    >
                      <UserMinus size={16} />
                      <span>Thu hồi vai trò</span>
                    </ActionMenuLink>
                  </ActionMenuItem>
                  {(!row.register_face_url || !row.register_face_at) && (
                    <ActionMenuItem>
                      <ActionMenuLink
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpenMenuId(null);
                          handleRegisterFace(row);
                        }}
                      >
                        <ScanFace size={16} />
                        <span>Đăng ký khuôn mặt</span>
                      </ActionMenuLink>
                    </ActionMenuItem>
                  )}
                  <ActionMenuDivider />
                  <ActionMenuItem>
                    <ActionMenuLink
                      $danger
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenMenuId(null);
                        handleDelete(row);
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Xóa tài khoản</span>
                    </ActionMenuLink>
                  </ActionMenuItem>
                </ActionMenuList>
              </ActionMenuDropdown>,
              document.body
            )}
          </ActionMenuContainer>
        );
      },
    },
  ];

  const renderHeader = () => {
    return (
      <DashboardCol>
        <Card>
          <CardHeader>
            <IconWrapper>
              <Users size={20} />
            </IconWrapper>
            <CardTitle>Quản lý tài khoản hệ thống</CardTitle>
          </CardHeader>
          <FilterContainer>
            <HeaderRow $isMobile={isMobile}>
              <SearchContainer $isMobile={isMobile}>
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                  fullWidth={true}
                />
              </SearchContainer>
              <CreateButton 
                $isMobile={isMobile}
                onClick={() => setOpenModal(ModalType.CREATE)}
              >
                <Plus size={20} />
                Tạo tài khoản mới
              </CreateButton>
            </HeaderRow>
            <FilterRow $isMobile={isMobile}>
              <FilterItem $isMobile={isMobile}>
                <Select
                  label="Lọc theo vai trò"
                  options={[
                    { value: "", label: "Tất cả vai trò" },
                    ...roles.map((role: Role) => ({
                      value: role.id,
                      label: getRoleName(role.name as ROLE_NAMES),
                    })),
                  ]}
                  value={selectedRoleId || ""}
                  onChange={(value) => {
                    setSelectedRoleId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn vai trò"
                  fullWidth
                />
              </FilterItem>
              <FilterItem $isMobile={isMobile}>
                <Select
                  label="Lọc theo phòng ban"
                  options={[
                    { value: "", label: "Tất cả phòng ban" },
                    ...divisions.map((division: DivisionListItem) => ({
                      value: division.id,
                      label: division.name,
                    })),
                  ]}
                  value={selectedDivisionId || ""}
                  onChange={(value) => {
                    setSelectedDivisionId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn phòng ban"
                  fullWidth
                />
              </FilterItem>
              <FilterItem $isMobile={isMobile}>
                <Select
                  label="Lọc theo trạng thái"
                  options={[
                    { value: "", label: "Tất cả trạng thái" },
                    { value: DivisionStatus.ACTIVE, label: "Hoạt động" },
                    { value: DivisionStatus.INACTIVE, label: "Không hoạt động" },
                  ]}
                  value={selectedStatus || ""}
                  onChange={(value) => {
                    setSelectedStatus(value === "" ? undefined : String(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn trạng thái"
                  fullWidth
                />
              </FilterItem>
            </FilterRow>
            <StatsRow>
              <StatsText>
                Tổng số: <StatsValue>{pagination.total || users.length}</StatsValue>
              </StatsText>
              <StatsText>
                Đang hoạt động: <StatsValue $color="var(--success-600)">
                  {users.filter((u) => getUserStatus(u)).length}
                </StatsValue>
              </StatsText>
            </StatsRow>
          </FilterContainer>
        </Card>
      </DashboardCol>
    );
  };

  return (
    <PersonalContainer>
      <DashboardGridAccount>
        {renderHeader()}
        <DashboardCol $span={2}>
          <Card>
            <CardHeader>
              <IconWrapper>
                <Users size={20} />
              </IconWrapper>
              <CardTitle>Danh sách tài khoản</CardTitle>
            </CardHeader>

            <Table
              columns={columns}
              data={users}
              loading={isLoading}
              error={error as Error | null}
              emptyState={{
                icon: <User size={48} />,
                message: searchTerm ? "Không tìm thấy tài khoản nào" : "Chưa có tài khoản nào",
              }}
              rowKey="id"
            />

            {pagination.total_pages > 1 && (
              <PaginationWrapper>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                />
              </PaginationWrapper>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      {/* Modals */}
      <CreateAccountModal
        isOpen={openModal === ModalType.CREATE}
        onClose={handleCloseModal}
        onSave={handleCreateAccount}
        isLoading={createMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={openModal === ModalType.DELETE}
        onClose={handleCloseModal}
        onConfirm={handleDeleteAccount}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedUser ? getUserName(selectedUser) : ""}"?`}
        isLoading={deleteMutation.isPending}
      />

      <AssignRoleModal
        isOpen={openModal === ModalType.ASSIGN_ROLE}
        onClose={handleCloseModal}
        user={selectedUser}
      />

      <UnassignRoleModal
        isOpen={openModal === ModalType.UNASSIGN_ROLE}
        onClose={handleCloseModal}
        user={selectedUser}
      />

      <RegisterFaceModal
        isOpen={openModal === ModalType.REGISTER_FACE}
        onClose={handleCloseModal}
        userId={selectedUser?.id || 0}
        userName={selectedUser ? getUserName(selectedUser) : undefined}
        onSuccess={handleRegisterFaceSuccess}
      />

      <ConfirmDeleteModal
        isOpen={openModal === ModalType.STATUS_CONFIRM}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatusUpdate}
        title="Xác nhận thay đổi trạng thái"
        message={
          selectedUser && pendingStatusUpdate
            ? `Bạn có chắc chắn muốn ${pendingStatusUpdate.status === USER_STATUS.ACTIVE ? "kích hoạt" : "vô hiệu hóa"} tài khoản "${getUserName(selectedUser)}"?`
            : "Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?"
        }
        isLoading={updateStatusMutation.isPending}
      />
    </PersonalContainer>
  );
};

export default AccountManagement;
