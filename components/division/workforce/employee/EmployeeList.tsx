"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Select, Input, Pagination, Table, TableColumn } from "@/components/common";
import { Users, Eye, Trash2, Shield, MoreVertical, UserMinus, Search, User } from "lucide-react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  SearchContainer,
  FilterRow,
  FilterItemSmall,
  FilterContainer,
  StatsRow,
  ActionMenuContainer,
  ActionMenuButton,
  ActionMenuDropdown,
  ActionMenuList,
  ActionMenuItem,
  ActionMenuLink,
  ActionMenuDivider,
  UserInfoCell,
  AvatarContainer,
  AvatarInitial,
  UserInfoText,
  UserNameText,
  UserEmailText,
  SkillsContainer,
  SkillTag,
  MoreSkillsText,
  EmptySkillsText,
  RolesContainer,
  RoleBadge,
  EmptyRoleText,
  StatsText,
  PaginationWrapper,
} from "./employeeListStyle";
import { useRouter } from "next/navigation";
import { useDivisionMembers, useDivisionTeams } from "@/hooks/useDivisionWorkforce";
import { DivisionMemberData, User as UserType, ScopeType } from "@/types/api";
import userService from "@/services/user.service";
import { getRoleName } from "@/utils/help";
import AssignEmployeeRoleModal from "./modals/AssignEmployeeRoleModal";
import UnassignEmployeeRoleModal from "./modals/UnassignEmployeeRoleModal";
import { ConfirmDeleteModal } from "@/components/common";
import { useToast } from "@/hooks/useToast";
import { ITEMS_PER_PAGE } from "@/constants/constants";
import ROUTERS from "@/config/router";
import { useSkills, usePositions } from "@/hooks/useSettings";
import { Skill } from "@/services/settings.service";

// helper to format date
const fmtDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

// helper to format and display skills
const formatSkills = (skills: string | null | undefined) => {
  if (!skills) return [];
  
  // Split by comma, semicolon, or pipe, and trim each skill
  const skillsList = skills
    .split(/[,;|]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return skillsList;
};

enum ModalType {
  NONE = "NONE",
  ASSIGN_ROLE = "ASSIGN_ROLE",
  UNASSIGN_ROLE = "UNASSIGN_ROLE",
  DELETE = "DELETE",
}

const SkillsDisplay: React.FC<{ skills: string | null | undefined }> = ({ skills }) => {
  const skillsList = formatSkills(skills);
  const maxSkills = 3;
  const displaySkills = skillsList.slice(0, maxSkills);
  const hasMore = skillsList.length > maxSkills;

  if (skillsList.length === 0) {
    return <EmptySkillsText>-</EmptySkillsText>;
  }

  return (
    <SkillsContainer>
      {displaySkills.map((skill, index) => (
        <SkillTag key={index}>
          {skill}
        </SkillTag>
      ))}
      {hasMore && (
        <MoreSkillsText>
          +{skillsList.length - maxSkills}
        </MoreSkillsText>
      )}
    </SkillsContainer>
  );
};

const EmployeeList: React.FC = () => {
  const isMobile = useMobile();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teamId, setTeamId] = useState<number | undefined>(undefined);
  const [positionId, setPositionId] = useState<number | undefined>(undefined);
  const [skillId, setSkillId] = useState<number | undefined>(undefined);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);

  const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE);
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

  // Fetch filter options
  const { data: teamsData } = useDivisionTeams(
    selectedDivisionId,
    "",
    1,
    100
  );

  const { data: skillsData } = useSkills({ limit: 100 });

  const { data: positionsData } = usePositions({ limit: 100 });

  // Prepare filter options
  const teamOptions = useMemo(() => {
    const teams = teamsData?.data || [];
    return [
      { value: "", label: "Tất cả Team" },
      ...teams.map((team) => ({
        value: String(team.id),
        label: team.name,
      })),
    ];
  }, [teamsData]);

  const skillOptions = useMemo(() => {
    const skills = skillsData?.data || [];
    return [
      { value: "", label: "Tất cả kỹ năng" },
      ...skills.map((skill: Skill) => ({
        value: String(skill.skill_id),
        label: skill.skill?.name || "",
      })),
    ];
  }, [skillsData]);

  const positionOptions = useMemo(() => {
    const positions = positionsData?.data || [];
    return [
      { value: "", label: "Tất cả vị trí" },
      ...positions.map((position) => ({
        value: String(position.id),
        label: position.name,
      })),
    ];
  }, [positionsData]);

  const { data, isLoading, error } = useDivisionMembers(
    selectedDivisionId,
    currentPage,
    ITEMS_PER_PAGE,
    debouncedSearch,
    {
      teamId,
      positionId,
      skillId,
      levelId,
    }
  );

  // Fetch user details for each employee to get roles
  const tableData = data?.data || [];
  const userIds = tableData.map((member) => member.user_id);
  
  // Fetch user details in parallel
  const userQueries = useQuery({
    queryKey: ["employee-users", userIds],
    queryFn: async () => {
      const userPromises = userIds.map((userId) => 
        userService.getUserById(String(userId)).catch(() => null)
      );
      const users = await Promise.all(userPromises);
      return users.filter((u): u is UserType => u !== null);
    },
    enabled: userIds.length > 0 && !!selectedDivisionId,
  });

  const usersMap = useMemo(() => {
    const map = new Map<number, UserType>();
    userQueries.data?.forEach((user) => {
      map.set(user.id, user);
    });
    return map;
  }, [userQueries.data]);

  // Helper to get roles for a member (filter DIVISION and PROJECT, group duplicates)
  const getMemberRoles = (member: DivisionMemberData) => {
    if (!member?.user_role_assignments) return [];
    
    const divisionProjectRoles = member.user_role_assignments.filter(
      (assignment) => 
        assignment.scope_type === ScopeType.DIVISION || 
        assignment.scope_type === ScopeType.PROJECT ||
        assignment.scope_type === ScopeType.TEAM
    );

    const roleMap = new Map<string, typeof divisionProjectRoles[0]>();
    divisionProjectRoles.forEach((assignment) => {
      const key = assignment.role_name || "";
      if (!roleMap.has(key)) {
        roleMap.set(key, assignment);
      }
    });

    return Array.from(roleMap.values());
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["division-workforce"] });
      showSuccessToast("Xóa nhân viên thành công");
      handleCloseModal();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Có lỗi xảy ra khi xóa nhân viên");
    },
  });

  // Handlers
  const handleViewDetail = useCallback((member: DivisionMemberData) => {
    router.push(`${ROUTERS.DIVISION.WORKFORCE}/employee/${member.user_id}`);
  }, [router]);

  const handleAssignRole = useCallback(async (member: DivisionMemberData) => {
    const user = usersMap.get(member.user_id);
    if (!user) {
      try {
        const fetchedUser = await userService.getUserById(String(member.user_id));
        setSelectedUser(fetchedUser);
        setOpenModal(ModalType.ASSIGN_ROLE);
      } catch {
        showErrorToast("Không thể tải thông tin người dùng");
      }
    } else {
      setSelectedUser(user);
      setOpenModal(ModalType.ASSIGN_ROLE);
    }
  }, [usersMap, showErrorToast]);

  const handleUnassignRole = useCallback(async (member: DivisionMemberData) => {
    const user = usersMap.get(member.user_id);
    if (!user) {
      try {
        const fetchedUser = await userService.getUserById(String(member.user_id));
        setSelectedUser(fetchedUser);
        setOpenModal(ModalType.UNASSIGN_ROLE);
      } catch {
        showErrorToast("Không thể tải thông tin người dùng");
      }
    } else {
      setSelectedUser(user);
      setOpenModal(ModalType.UNASSIGN_ROLE);
    }
  }, [usersMap, showErrorToast]);

  const handleDelete = useCallback(async (member: DivisionMemberData) => {
    const user = usersMap.get(member.user_id);
    if (!user) {
      try {
        const fetchedUser = await userService.getUserById(String(member.user_id));
        setSelectedUser(fetchedUser);
        setOpenModal(ModalType.DELETE);
      } catch {
        showErrorToast("Không thể tải thông tin người dùng");
      }
    } else {
      setSelectedUser(user);
      setOpenModal(ModalType.DELETE);
    }
  }, [usersMap, showErrorToast]);

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(String(selectedUser.id));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(ModalType.NONE);
    setSelectedUser(null);
  };

  const getUserName = (user: UserType) => {
    if (user.user_information && typeof user.user_information === 'object' && !Array.isArray(user.user_information) && 'name' in user.user_information) {
      return (user.user_information as { name: string }).name;
    }
    return user.name || user.email;
  };

  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  const columns: TableColumn<DivisionMemberData>[] = useMemo(() => [
    {
      key: "code",
      label: "Mã",
      width: "100px",
    },
    {
      key: "name",
      label: "Thông tin",
      width: "200px",
      render: (_, row) => (
        <UserInfoCell>
          <AvatarContainer>
            {row.avatar && row.avatar.includes('https') ? (
              <Image src={row.avatar} alt={row.name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            ) : (
              <AvatarInitial>{row.name.charAt(0).toUpperCase()}</AvatarInitial>
            )}
          </AvatarContainer>
          <UserInfoText>
            <UserNameText>{row.name}</UserNameText>
            <UserEmailText>{row.email}</UserEmailText>
          </UserInfoText>
        </UserInfoCell>
      ),
    },
    {
      key: "birthday",
      label: "Ngày sinh",
      width: "100px",
      render: (value) => fmtDate(value as string),
    },
    {
      key: "team",
      label: "Team",
      width: "150px",
    },
    {
      key: "join_date",
      label: "Ngày vào làm",
      width: "120px",
      render: (value) => fmtDate(value as string),
    },
    {
      key: "position",
      label: "Vị trí",
      width: "150px",
    },
    {
      key: "skills",
      label: "Kỹ năng",
      minWidth: "150px",
      render: (value) => <SkillsDisplay skills={value as string | null | undefined} />,
    },
    {
      key: "user_role_assignments",
      label: "Vai trò",
      width: "160px",
      render: (_, row) => {
        const roles = getMemberRoles(row);
        if (roles.length === 0) {
          return <EmptyRoleText>Chưa có vai trò</EmptyRoleText>;
        }
        return (
          <RolesContainer>
            {roles.map((assignment, index) => (
              <RoleBadge key={index}>
                {getRoleName(assignment.role_name)}
              </RoleBadge>
            ))}
          </RolesContainer>
        );
      },
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
              const dropdownHeight = 200;
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
                      <span>Xóa nhân viên</span>
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
  ], [openMenuId, menuPositions, handleViewDetail, handleAssignRole, handleUnassignRole, handleDelete]);

  const emptyMessage = useMemo(() => {
    if (!selectedDivisionId) return "Vui lòng chọn phòng ban";
    if (debouncedSearch || teamId || positionId || skillId || levelId) {
      return "Không tìm thấy nhân viên nào";
    }
    return "Chưa có nhân viên nào";
  }, [selectedDivisionId, debouncedSearch, teamId, positionId, skillId, levelId]);

  const renderHeader = () => {
    return (
      <DashboardCol>
        <Card>
          <CardHeader>
            <IconWrapper>
              <Users size={20} />
            </IconWrapper>
            <CardTitle>Quản lý nhân sự</CardTitle>
          </CardHeader>
          <FilterContainer>
            <SearchContainer $isMobile={isMobile}>
              <Input
                placeholder="Tìm kiếm theo tên nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                fullWidth={true}
              />
            </SearchContainer>
            <FilterRow $isMobile={isMobile}>
              <FilterItemSmall $isMobile={isMobile}>
                <Select
                  label="Lọc theo Team"
                  options={teamOptions}
                  value={teamId ? String(teamId) : ""}
                  onChange={(value) => {
                    setTeamId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn Team"
                  fullWidth
                  disabled={!selectedDivisionId}
                />
              </FilterItemSmall>
              <FilterItemSmall $isMobile={isMobile}>
                <Select
                  label="Lọc theo vị trí"
                  options={positionOptions}
                  value={positionId ? String(positionId) : ""}
                  onChange={(value) => {
                    setPositionId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn vị trí"
                  fullWidth
                />
              </FilterItemSmall>
              <FilterItemSmall $isMobile={isMobile}>
                <Select
                  label="Lọc theo kỹ năng"
                  options={skillOptions}
                  value={skillId ? String(skillId) : ""}
                  onChange={(value) => {
                    setSkillId(value === "" ? undefined : Number(value));
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn kỹ năng"
                  fullWidth
                />
              </FilterItemSmall>
            </FilterRow>
            <StatsRow>
              <span>
                Tổng số:{" "}
                <StatsText>{pagination.total || tableData.length}</StatsText>
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
              <CardTitle>Danh sách nhân viên</CardTitle>
            </CardHeader>

            <Table
              columns={columns}
              data={tableData}
              loading={isLoading}
              error={error || (!selectedDivisionId ? new Error("Vui lòng chọn phòng ban") : null)}
              emptyState={{
                icon: <User size={48} />,
                message: emptyMessage,
              }}
              onRowClick={(row) => router.push(`${ROUTERS.DIVISION.WORKFORCE}/employee/${row.user_id}`)}
              rowKey="user_id"
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
      <AssignEmployeeRoleModal
        isOpen={openModal === ModalType.ASSIGN_ROLE}
        onClose={handleCloseModal}
        user={selectedUser}
      />

      <UnassignEmployeeRoleModal
        isOpen={openModal === ModalType.UNASSIGN_ROLE}
        onClose={handleCloseModal}
        user={selectedUser}
      />

      <ConfirmDeleteModal
        isOpen={openModal === ModalType.DELETE}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${selectedUser ? getUserName(selectedUser) : ""}"?`}
        isLoading={deleteMutation.isPending}
      />
    </PersonalContainer>
  );
};

export default EmployeeList;
