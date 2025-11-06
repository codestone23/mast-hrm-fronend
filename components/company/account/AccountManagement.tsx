"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Edit, Trash2, User, Users, Search } from "lucide-react";
import { Button, Input, Table, Pagination } from "@/components/common";
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
} from "./accountStyle";
import CreateAccountModal from "./modals/CreateAccountModal";
import EditAccountModal from "./modals/EditAccountModal";
import { ConfirmDeleteModal } from "@/components/common";
import { User as UserType, UpdateUserRequest } from "@/types/api";
import userService from "@/services/user.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

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

const AccountManagement: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query users
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", currentPage, debouncedSearch],
    queryFn: () =>
      userService.getUsers(currentPage, ITEMS_PER_PAGE, debouncedSearch || undefined),
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
    router.push(`/company/accounts/${user.id}`);
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
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
      width: "2fr",
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
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
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
      width: "1fr",
      render: () => "User", // TODO: Get role from user data
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "1fr",
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
      key: "department",
      label: "Phòng ban",
      width: "1fr",
      render: (_, row) => {
        const userInfo = getUserInfo(row);
        return userInfo?.department || "Chưa phân công";
      },
    },
    {
      key: "actions",
      label: "Hành động",
      width: "120px",
      align: "center",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(row);
            }}
            icon={<Eye size={14} />}
          >
            <span style={{ display: "none" }}>Xem</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            icon={<Edit size={14} />}
          >
            <span style={{ display: "none" }}>Sửa</span>
          </Button>
          <Button
            size="sm"
            variant="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            icon={<Trash2 size={14} />}
          >
            <span style={{ display: "none" }}>Xóa</span>
          </Button>
        </div>
      ),
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
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1, maxWidth: "400px" }}>
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                fullWidth={true}
              />
            </div>
            <CreateButton onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} />
              Tạo tài khoản mới
            </CreateButton>
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
          >
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
          </div>
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
    </PersonalContainer>
  );
};

export default AccountManagement;
