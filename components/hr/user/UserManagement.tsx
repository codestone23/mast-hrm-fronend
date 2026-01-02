"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Edit, Trash2, User, Users, Search, MoreVertical, Download, FileText, Calendar, Clock, TrendingUp } from "lucide-react";
import { Input, Table, Pagination, Select, Modal } from "@/components/common";
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
} from "@/components/company/account/accountStyle";
import CreateAccountModal from "@/components/company/account/modals/CreateAccountModal";
import EditAccountModal from "@/components/company/account/modals/EditAccountModal";
import { ConfirmDeleteModal } from "@/components/common";
import { User as UserType, MonthlyWorkSummaryItem } from "@/types/api";
import userService from "@/services/user.service";
import reportService from "@/services/report.service";
import divisionWorkforceService from "@/services/division_workforce.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import divisionsService from "@/services/divisions.service";
import { DivisionListItem, DivisionTeamData } from "@/types/api";
import { ITEMS_PER_PAGE_20 } from "@/constants/constants";

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

// Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const UserManagement: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useMobile();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | undefined>(undefined);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDailySummaryModalOpen, setIsDailySummaryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedSummaryUser, setSelectedSummaryUser] = useState<MonthlyWorkSummaryItem | null>(null);
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

  // Reset team when division changes
  useEffect(() => {
    setSelectedTeamId(undefined);
  }, [selectedDivisionId]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const button = buttonRefs.current[openMenuId];
      const dropdown = dropdownRefs.current[openMenuId];
      
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

  // Fetch divisions for filter
  const { data: divisionsData } = useQuery({
    queryKey: ["divisions", "filter"],
    queryFn: () => divisionsService.getDivisions({ limit: 100 }),
  });

  const divisions = divisionsData?.data || [];

  // Fetch teams when division is selected
  const { data: teamsData } = useQuery({
    queryKey: ["teams", selectedDivisionId],
    queryFn: () => divisionWorkforceService.getTeams(selectedDivisionId!, undefined, 1, 100),
    enabled: !!selectedDivisionId,
  });

  const teams = teamsData?.data || [];

  // Query monthly work summary
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthly-work-summary", selectedMonth, selectedDivisionId, selectedTeamId, debouncedSearch, currentPage],
    queryFn: () =>
      reportService.getMonthlyWorkSummary({
        month: selectedMonth,
        division_id: selectedDivisionId,
        team_id: selectedTeamId,
        search: debouncedSearch || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE_20,
        sort_order: 'desc',
      }),
    enabled: !!selectedMonth,
  });

  // Query daily work summary for modal
  const { data: dailySummaryData, isLoading: isDailySummaryLoading } = useQuery({
    queryKey: ["daily-work-summary", selectedSummaryUser?.user_id, selectedMonth],
    queryFn: () =>
      reportService.getDailyWorkSummary({
        user_id: selectedSummaryUser!.user_id,
        month: selectedMonth,
      }),
    enabled: !!selectedSummaryUser && isDailySummaryModalOpen,
  });

  const summaryItems = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE_20,
  };
  const summary = data?.summary;
  const period = data?.period;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (userData: CreateAccountData) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-work-summary"] });
      showSuccessToast("Tạo người dùng thành công");
      setIsCreateModalOpen(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-work-summary"] });
      showSuccessToast("Xóa người dùng thành công");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng");
    },
  });

  // Export handler
  const handleExport = async () => {
    try {
      const blob = await reportService.exportMonthlyWorkSummary({
        month: selectedMonth,
        division_id: selectedDivisionId,
        team_id: selectedTeamId,
        search: debouncedSearch || undefined,
        sort_order: 'desc',
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `work-summary-${selectedMonth}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccessToast("Xuất báo cáo thành công");
    } catch {
      showErrorToast("Có lỗi xảy ra khi xuất báo cáo");
    }
  };

  // Handlers
  const handleCreateAccount = (accountData: CreateAccountData) => {
    createMutation.mutate(accountData);
  };

  const handleDeleteAccount = () => {
    if (selectedUser) {
      deleteMutation.mutate(String(selectedUser.id));
    }
  };

  const handleViewDetail = (item: MonthlyWorkSummaryItem) => {
    router.push(`${ROUTERS.HR.USERS}/${item.user_id}`);
  };

  const handleEdit = async (item: MonthlyWorkSummaryItem) => {
    try {
      const user = await userService.getUserById(String(item.user_id));
      setSelectedUser(user);
      setIsEditModalOpen(true);
    } catch {
      showErrorToast("Không thể tải thông tin người dùng");
    }
  };

  const handleDelete = async (item: MonthlyWorkSummaryItem) => {
    try {
      const user = await userService.getUserById(String(item.user_id));
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    } catch {
      showErrorToast("Không thể tải thông tin người dùng");
    }
  };

  const handleViewDailySummary = (item: MonthlyWorkSummaryItem) => {
    setSelectedSummaryUser(item);
    setIsDailySummaryModalOpen(true);
  };

  // Generate month options (last 12 months)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
      options.push({ value, label });
    }
    return options;
  }, []);

  // Table columns
  const columns: TableColumn<MonthlyWorkSummaryItem>[] = [
    {
      key: "userInfo",
      label: "Thông tin",
      width: "250px",
      render: (_, row) => (
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
            }}
          >
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "#111827", marginBottom: "2px" }}>{row.user_name}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{row.user_code}</div>
          </div>
        </div>
      ),
    },
    {
      key: "division_name",
      label: "Phòng ban",
    },
    {
      key: "team_name",
      label: "Team",
    },
    {
      key: "total_work_days",
      label: "Tổng số công",
      width: "120px",
      align: "center",
      render: (_, row) => (
        <span>{row.total_work_days}/{row.expected_work_days}</span>
      ),
    },
    {
      key: "attendance_rate",
      label: "Tỷ lệ CC",
      width: "100px",
      align: "center",
      render: (value) => (
        <span style={{
          color: (value as number) >= 90 ? "#10b981" : (value as number) >= 80 ? "#f59e0b" : "#ef4444",
          fontWeight: 500,
        }}>
          {(value as number).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "late_count",
      label: "Đi muộn",
      width: "80px",
      align: "center",
      render: (value) => (
        <span style={{ color: (value as number) > 0 ? "#ef4444" : "#6b7280" }}>
          {value as number}
        </span>
      ),
    },
    {
      key: "total_leave_days",
      label: "Nghỉ phép",
      width: "90px",
      align: "center",
    },
    {
      key: "overtime_hours",
      label: "OT (giờ)",
      width: "90px",
      align: "center",
    },
    {
      key: "actions",
      label: "Hành động",
      width: "100px",
      align: "center",
      render: (_, row) => {
        const menuId = `menu-${row.user_id}`;
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
              const dropdownHeight = 250;
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
                        handleViewDailySummary(row);
                      }}
                    >
                      <FileText size={16} />
                      <span>Chi tiết công</span>
                    </ActionMenuLink>
                  </ActionMenuItem>
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
                      <span>Xóa người dùng</span>
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

  const renderSummaryCards = () => {
    if (!summary || !period) return null;

    return (
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", 
        gap: "16px", 
        marginBottom: "20px" 
      }}>
        <Card style={{ padding: isMobile ? "12px" : "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: isMobile ? "40px" : "48px", 
              height: isMobile ? "40px" : "48px", 
              borderRadius: isMobile ? "10px" : "12px", 
              backgroundColor: "#e0e7ff", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <Users size={isMobile ? 20 : 24} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#6b7280" }}>Tổng nhân sự</div>
              <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111827" }}>{summary.total_employees}</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: isMobile ? "12px" : "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: isMobile ? "40px" : "48px", 
              height: isMobile ? "40px" : "48px", 
              borderRadius: isMobile ? "10px" : "12px", 
              backgroundColor: "#dcfce7", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <Calendar size={isMobile ? 20 : 24} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#6b7280" }}>Ngày làm việc TB</div>
              <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111827" }}>{summary.average_work_days.toFixed(1)}</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: isMobile ? "12px" : "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: isMobile ? "40px" : "48px", 
              height: isMobile ? "40px" : "48px", 
              borderRadius: isMobile ? "10px" : "12px", 
              backgroundColor: "#fef3c7", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <TrendingUp size={isMobile ? 20 : 24} color="#d97706" />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#6b7280" }}>Tỷ lệ CC TB</div>
              <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111827" }}>{summary.average_attendance_rate.toFixed(1)}%</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: isMobile ? "12px" : "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: isMobile ? "40px" : "48px", 
              height: isMobile ? "40px" : "48px", 
              borderRadius: isMobile ? "10px" : "12px", 
              backgroundColor: "#fee2e2", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <Clock size={isMobile ? 20 : 24} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? "11px" : "12px", color: "#6b7280" }}>Ngày công tháng</div>
              <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111827" }}>{period.total_work_days}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <DashboardCol>
        <Card>
          <CardHeader>
            <IconWrapper>
              <Users size={20} />
            </IconWrapper>
            <CardTitle>Thống kê công nhân sự</CardTitle>
          </CardHeader>
          <FilterContainer>
            <HeaderRow $isMobile={isMobile}>
              <SearchContainer $isMobile={isMobile}>
                <Input
                  placeholder="Tìm kiếm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                  fullWidth={true}
                />
              </SearchContainer>
              <div style={{ 
                display: "flex", 
                gap: "12px",
                flexDirection: isMobile ? "column" : "row",
                width: isMobile ? "100%" : "auto"
              }}>
                <CreateButton 
                  $isMobile={isMobile}
                  onClick={handleExport}
                  style={{ backgroundColor: "#10b981", width: isMobile ? "100%" : "auto" }}
                >
                  <Download size={isMobile ? 18 : 20} />
                  Xuất báo cáo
                </CreateButton>
                <CreateButton 
                  $isMobile={isMobile}
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{ width: isMobile ? "100%" : "auto" }}
                >
                  <Plus size={isMobile ? 18 : 20} />
                  Tạo người dùng
                </CreateButton>
              </div>
            </HeaderRow>
            <FilterRow $isMobile={isMobile}>
              <FilterItem $isMobile={isMobile}>
                <Select
                  label="Thời gian"
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(value) => {
                    setSelectedMonth(String(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn tháng"
                  fullWidth
                />
              </FilterItem>
              <FilterItem $isMobile={isMobile}>
                <Select
                  label="Phòng ban"
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
                  label="Team"
                  options={[
                    { value: "", label: "Tất cả team" },
                    ...teams.map((team: DivisionTeamData) => ({
                      value: team.id,
                      label: team.name,
                    })),
                  ]}
                  value={selectedTeamId || ""}
                  onChange={(value) => {
                    setSelectedTeamId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn team"
                  fullWidth
                  disabled={!selectedDivisionId}
                />
              </FilterItem>
            </FilterRow>
            <StatsRow>
              <span>
                Tổng số:{" "}
                <strong style={{ color: "var(--text-primary)" }}>{pagination.total || summaryItems.length}</strong>
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
          {renderSummaryCards()}
          
          <Card>
            <CardHeader>
              <IconWrapper>
                <Users size={20} />
              </IconWrapper>
              <CardTitle>Danh sách nhân sự</CardTitle>
            </CardHeader>

            <Table
              columns={columns}
              data={summaryItems}
              loading={isLoading}
              error={error as Error | null}
              emptyState={{
                icon: <User size={48} />,
                message: searchTerm ? "Không tìm thấy nhân sự nào" : "Chưa có dữ liệu",
              }}
              rowKey="user_id"
            />

            {pagination.total_pages > 1 && (
              <div style={{ marginTop: "16px" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE_20}
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
        onSave={() => {}}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteAccount}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng này?`}
        isLoading={deleteMutation.isPending}
      />

      {/* Daily Summary Modal */}
      <Modal
        isOpen={isDailySummaryModalOpen}
        onClose={() => {
          setIsDailySummaryModalOpen(false);
          setSelectedSummaryUser(null);
        }}
        title={`Chi tiết công - ${selectedSummaryUser?.user_name || ''}`}
        size="lg"
      >
        {isDailySummaryLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Đang tải...</div>
        ) : dailySummaryData ? (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Tháng: </strong>{selectedMonth}
            </div>
            <div style={{ maxHeight: isMobile ? "300px" : "400px", overflowY: "auto", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "600px" : "auto" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={{ padding: isMobile ? "8px" : "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>Ngày</th>
                    <th style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>Check in</th>
                    <th style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>Check out</th>
                    <th style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>Giờ làm</th>
                    <th style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummaryData.daily_records?.map((record, index) => (
                    <tr key={index}>
                      <td style={{ padding: isMobile ? "8px" : "12px", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>{record.date}</td>
                      <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>
                        {record.check_in || "-"}
                      </td>
                      <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>
                        {record.check_out || "-"}
                      </td>
                      <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "12px" : "14px" }}>
                        {record.work_hours}h
                      </td>
                      <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                        <span style={{
                          padding: isMobile ? "3px 6px" : "4px 8px",
                          borderRadius: "4px",
                          fontSize: isMobile ? "11px" : "12px",
                          backgroundColor: record.is_late ? "#fee2e2" : "#dcfce7",
                          color: record.is_late ? "#dc2626" : "#16a34a",
                        }}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            Không có dữ liệu
          </div>
        )}
      </Modal>
    </PersonalContainer>
  );
};

export default UserManagement;
