"use client";

import React, { useState } from "react";
import { Plus, Eye, Edit, Trash2, User, Users } from "lucide-react";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  SearchInput,
  CreateButton,
  AccountTable,
  TableHeader,
  TableRow,
  TableCell,
  TableActions,
  ActionButton,
  Avatar,
  UserInfo,
  UserName,
  UserEmail,
  StatusBadge,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./accountStyle";
import CreateAccountModal from "./modals/CreateAccountModal";
import EditAccountModal from "./modals/EditAccountModal";
import { ConfirmDeleteModal } from "@/components/common";
import { Account } from "@/constants/types";
import { useRouter } from "next/navigation";

const AccountManagement: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Mock data - sẽ được thay thế bằng API call
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@company.com",
      role: "Admin",
      status: "active",
      phone: "0123456789",
      department: "IT",
      position: "Developer",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@company.com",
      role: "User",
      status: "active",
      phone: "0987654321",
      department: "HR",
      position: "Manager",
      joinDate: "2023-03-20",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "levanc@company.com",
      role: "User",
      status: "inactive",
      phone: "0369258147",
      department: "Finance",
      position: "Accountant",
      joinDate: "2023-05-10",
    },
  ]);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAccount = (accountData: Omit<Account, "id">) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
    };
    setAccounts([...accounts, newAccount]);
    setIsCreateModalOpen(false);
  };

  const handleEditAccount = (accountData: Account) => {
    setAccounts(
      accounts.map((account) =>
        account.id === accountData.id ? accountData : account
      )
    );
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      setAccounts(
        accounts.filter((account) => account.id !== selectedAccount.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedAccount(null);
    }
  };

  const handleViewDetail = (account: Account) => {
    router.push(`/company/accounts/${account.id}`);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#10b981" : "#ef4444";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Không hoạt động";
  };

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
            <SearchInput
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
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
              <strong style={{ color: "var(--text-primary)" }}>
                {accounts.length}
              </strong>
            </span>
            <span>
              Đang hoạt động:{" "}
              <strong style={{ color: "var(--success-600)" }}>
                {accounts.filter((acc) => acc.status === "active").length}
              </strong>
            </span>
            <span>
              Admin:{" "}
              <strong style={{ color: "var(--primary-600)" }}>
                {accounts.filter((acc) => acc.role === "Admin").length}
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

            {filteredAccounts.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <User size={48} />
                </EmptyIcon>
                <EmptyText>
                  {searchTerm
                    ? "Không tìm thấy tài khoản nào"
                    : "Chưa có tài khoản nào"}
                </EmptyText>
              </EmptyState>
            ) : (
              <AccountTable>
                <TableHeader>
                  <TableCell>Thông tin</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableHeader>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <UserInfo>
                        <Avatar>
                          {account.avatar ? (
                            <img src={account.avatar} alt={account.name} />
                          ) : (
                            <User size={20} />
                          )}
                        </Avatar>
                        <div>
                          <UserName>{account.name}</UserName>
                          <UserEmail>{account.email}</UserEmail>
                        </div>
                      </UserInfo>
                    </TableCell>
                    <TableCell>{account.role}</TableCell>
                    <TableCell>
                      <StatusBadge $color={getStatusColor(account.status)}>
                        {getStatusText(account.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {account.department || "Chưa phân công"}
                    </TableCell>
                    <TableCell>
                      <TableActions>
                        <ActionButton
                          $variant="view"
                          onClick={() => handleViewDetail(account)}
                        >
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton
                          $variant="edit"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit size={16} />
                        </ActionButton>
                        <ActionButton
                          $variant="delete"
                          onClick={() => handleDelete(account)}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </TableActions>
                    </TableCell>
                  </TableRow>
                ))}
              </AccountTable>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      {/* Modals */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAccount}
      />

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSave={handleEditAccount}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={handleDeleteAccount}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${selectedAccount?.name}"?`}
      />
    </PersonalContainer>
  );
};

export default AccountManagement;
