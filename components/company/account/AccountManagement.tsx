"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Edit, Trash2, User, Users, Search, Shield, MoreVertical, UserMinus, ScanFace } from "lucide-react";
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
} from "./accountStyle";
import CreateAccountModal from "./modals/CreateAccountModal";
import EditAccountModal from "./modals/EditAccountModal";
import AssignRoleModal from "./modals/AssignRoleModal";
import UnassignRoleModal from "./modals/UnassignRoleModal";
import RegisterFaceModal from "./modals/RegisterFaceModal";
import { ConfirmDeleteModal } from "@/components/common";
import { User as UserType, UpdateUserRequest } from "@/types/api";
import userService from "@/services/user.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { ROLE_NAMES, DivisionStatus } from "@/constants/enums";
import ROUTERS from "@/config/router";
import rolesService from "@/services/roles.service";
import divisionsService from "@/services/divisions.service";
import { Role, DivisionListItem } from "@/types/api";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

interface EditAccountData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
}

export const getRoleName = (roleName: ROLE_NAMES) => {
  switch (roleName) {
    case ROLE_NAMES.EMPLOYEE: 
      return "Nhân viên";
    case ROLE_NAMES.TEAM_LEADER:
      return "Trưởng nhóm";
    case ROLE_NAMES.DIVISION_HEAD:
      return "Trưởng phòng";
    case ROLE_NAMES.PROJECT_MANAGER:
      return "Trưởng dự án";
    case ROLE_NAMES.HR_MANAGER:
      return "Trưởng HR";
    case ROLE_NAMES.ADMIN:
      return "Quản trị viên";
    default:
      return roleName;
  }
};

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [isUnassignRoleModalOpen, setIsUnassignRoleModalOpen] = useState(false);
  const [isRegisterFaceModalOpen, setIsRegisterFaceModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
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
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Cập nhật tài khoản thành công");
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật tài khoản");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Xóa tài khoản thành công");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa tài khoản");
    },
  });


  // Handlers
  const handleCreateAccount = (accountData: CreateAccountData) => {
    createMutation.mutate(accountData);
  };

  const handleEditAccount = (user: UserType, accountData: EditAccountData) => {
    const nameParts = accountData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const updateData: UpdateUserRequest = {
      firstName,
      lastName,
      phone: accountData.phone,
      department: accountData.department,
      position: accountData.position,
    };

    updateMutation.mutate({ userId: String(user.id), data: updateData });
  };

  const handleDeleteAccount = () => {
    if (selectedUser) {
      deleteMutation.mutate(String(selectedUser.id));
    }
  };

  const handleViewDetail = (user: UserType) => {
    router.push(`${ROUTERS.COMPANY.ACCOUNTS}/${user.id}`); 
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAssignRole = (user: UserType) => {
    setSelectedUser(user);
    setIsAssignRoleModalOpen(true);
  };

  const handleUnassignRole = (user: UserType) => {
    setSelectedUser(user);
    setIsUnassignRoleModalOpen(true);
  };

  const handleRegisterFace = (user: UserType) => {
    setSelectedUser(user);
    setIsRegisterFaceModalOpen(true);
  };

  const handleRegisterFaceSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setIsRegisterFaceModalOpen(false);
    setSelectedUser(null);
  };

  const getUserName = (user: UserType) => {
    if (user.user_information && Array.isArray(user.user_information) && user.user_information.length > 0) {
      const info = user.user_information[0] as { name?: string };
      return info?.name || user.name || user.email;
    }
    return user.name || user.email;
  };

  const getUserInfo = (user: UserType) => {
    if (user.user_information && Array.isArray(user.user_information) && user.user_information.length > 0) {
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

  const getUserStatus = (user: UserType) => {
    return user.deleted_at ? "inactive" : "active";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#10b981" : "#ef4444";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e0e7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
                overflow: "hidden",
              }}
            >
              {userInfo?.avatar && userInfo.avatar.includes('https') ? (
                <Image src={userInfo.avatar} alt={userName} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" /> 
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 500, color: "#111827", marginBottom: "2px" }}>{userName}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{row.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      label: "Vai trò",
      render: (_, row) => {
        const roles = row.user_role_assignments || [];
        // Filter only COMPANY scope roles
        const companyRoles = roles.filter(
          (assignment) => assignment.scope_type === "COMPANY"
        );
        if (companyRoles.length === 0) {
          return <span style={{ color: "#6b7280", fontSize: "14px" }}>Chưa có vai trò</span>;
        }
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {companyRoles.map((assignment, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  backgroundColor: "#e0e7ff",
                  color: "#6366f1",
                }}
              >
                {getRoleName(assignment.role.name)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "200px",
      render: (_, row) => {
        const status = getUserStatus(row);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: `${getStatusColor(status)}20`,
              color: getStatusColor(status),
            }}
          >
            {getStatusText(status)}
          </span>
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
        const isRegistered = row.register_face_url && row.register_face_at;
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: isRegistered ? "#10b98120" : "#ef444420",
              color: isRegistered ? "#10b981" : "#ef4444",
            }}
          >
            {isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
          </span>
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
          } else {
            const button = buttonRefs.current[menuId];
            if (button) {
              const rect = button.getBoundingClientRect();
              const dropdownHeight = 200; // Approximate height of dropdown
              const spaceBelow = window.innerHeight - rect.bottom;
              const spaceAbove = rect.top;
              const position: 'top' | 'bottom' = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';
              
              setMenuPositions(prev => ({
                ...prev,
                [menuId]: { rect, position }
              }));
              setOpenMenuId(menuId);
            }
          }
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
                        handleEdit(row);
                      }}
                    >
                      <Edit size={16} />
                      <span>Chỉnh sửa</span>
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
                onClick={() => setIsCreateModalOpen(true)}
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
              <span>
                Tổng số:{" "}
                <strong style={{ color: "var(--text-primary)" }}>{pagination.total || users.length}</strong>
              </span>
              <span>
                Đang hoạt động:{" "}
                <strong style={{ color: "var(--success-600)" }}>
                  {users.filter((u) => getUserStatus(u) === "active").length}
                </strong>
              </span>
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
              <div style={{ marginTop: "16px" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                />
              </div>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      {/* Modals */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAccount}
        isLoading={createMutation.isPending}
      />

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={(accountData) => {
          if (selectedUser) {
            handleEditAccount(selectedUser, accountData);
          }
        }}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteAccount}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedUser ? getUserName(selectedUser) : ""}"?`}
      />

      <AssignRoleModal
        isOpen={isAssignRoleModalOpen}
        onClose={() => {
          setIsAssignRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <UnassignRoleModal
        isOpen={isUnassignRoleModalOpen}
        onClose={() => {
          setIsUnassignRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <RegisterFaceModal
        isOpen={isRegisterFaceModalOpen}
        onClose={() => {
          setIsRegisterFaceModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id || 0}
        userName={selectedUser ? getUserName(selectedUser) : undefined}
        onSuccess={handleRegisterFaceSuccess}
      />
    </PersonalContainer>
  );
};

export default AccountManagement;
