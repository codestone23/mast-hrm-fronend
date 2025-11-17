"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Eye, Edit, Trash2, User, Users } from "lucide-react";
import {
  PersonalContainer,
  DashboardGrid,
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
} from "./userStyle";
import { Account } from "@/constants/types";
import { useRouter } from "next/navigation";
import { DashboardGridAccount } from "@/components/company/account/accountStyle";
import ROUTERS from "@/config/router";

const UserManagement: React.FC = () => {
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
      roles: ["Admin"],
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
      roles: ["User"],
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
      roles: ["User"],
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
    router.push(`${ROUTERS.HR.USERS}/${account.id}`); 
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
            <CardTitle>Quản lý người dùng</CardTitle>
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
              Tạo người dùng mới
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
                {accounts.filter((acc) => acc.roles.includes("Admin")).length}
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
              <CardTitle>Danh sách người dùng</CardTitle>
            </CardHeader>

            {filteredAccounts.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <User size={48} />
                </EmptyIcon>
                <EmptyText>
                  {searchTerm
                    ? "Không tìm thấy người dùng nào"
                    : "Chưa có người dùng nào"}
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
                            <Image src={account.avatar} alt={account.name} width={40} height={40} />
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
                    <TableCell>{account.roles}</TableCell>
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

      {isCreateModalOpen && (
        <div>Create Modal</div>
      )}
      {isEditModalOpen && (
        <div>Edit Modal</div>
      )}
      {isDeleteModalOpen && (
        <div>Delete Modal</div>
      )}
    </PersonalContainer>
  );
};

export default UserManagement;

