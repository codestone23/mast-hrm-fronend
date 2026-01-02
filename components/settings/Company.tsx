"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Users,
  Building,
  User,
} from "lucide-react";
import Image from "next/image";
import {
  CompanyContainer,
  Header,
  TabsContainer,
  Tab,
  MainContent,
  EmployeeSection,
  SectionTitle,
  EmployeeCard,
  EmployeeAvatar,
  EmployeeInfo,
  EmployeeName,
  EmployeeEmail,
  EmployeePosition,
  DivisionSection,
  DivisionHeader,
  DivisionEmployeeGrid,
  Sidebar,
  SidebarCard,
  SidebarTitle,
  SidebarCardTitle,
  FilterList,
  FilterItem,
  FilterIcon,
  FilterLabel,
  FilterCount,
  EmptyStateMessage,
  AvatarImageWrapper,
  ShowMoreContainer,
  ShowMoreButton,
  FilterItemContent,
} from "./companyStyle";
import userService from "@/services/user.service";
import { User as UserType, News } from "@/types/api";
import { Loading, Input } from "@/components/common";
import NewsList from "@/components/news/NewsList";
import NewsDetail from "@/components/news/NewsDetail";
import { NewsStatus } from "@/types/api";
import ROUTERS from "@/config/router";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  division: string;
  avatar?: string;
}

interface GroupedEmployees {
  [divisionName: string]: Employee[];
}

interface UserWithDetails {
  id: number;
  name: string;
  email: string;
  user_division?: {
    division?: {
      id: number;
      name: string;
      description?: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
      status?: string;
      type?: string;
    };
  };
  position?: {
    id: number;
    name: string;
  };
  user_information?: {
    name?: string;
    avatar?: string;
    expertise?: string;
  };
}

const Company: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newsId = searchParams.get("newsId");
  const tabParam = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(() => {
    if (newsId || tabParam === "news") {
      return "TIN TỨC";
    }
    return "DANH SÁCH NHÂN VIÊN CÔNG TY";
  });
  const [selectedDivision, setSelectedDivision] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  // Debounced search term for API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Track số lượng hiển thị cho mỗi division
  const [displayCounts, setDisplayCounts] = useState<Record<string, number>>({});

  // Sync activeTab with newsId or tab param from URL
  useEffect(() => {
    if (newsId || tabParam === "news") {
      setActiveTab("TIN TỨC");
    }
  }, [newsId, tabParam]);

  const handleNewsClick = (news: News) => {
    router.push(`${ROUTERS.PERSONAL.COMPANY}?newsId=${news.id}`);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['company-users', debouncedSearch],
    queryFn: ({ pageParam = 1 }) => userService.getUsers(pageParam, 100, debouncedSearch || undefined),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Load all pages if there are more
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDisplayCounts({}); 
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setDisplayCounts({});
  }, [selectedDivision]);

  const { employees, groupedEmployees, divisions } = useMemo(() => {
    const allUsers = data?.pages.flatMap(page => page.data || []) || [];
    
    // Convert to Employee format
    const employeesList: Employee[] = allUsers.map((user: UserType) => {
      const userWithDetails = user as UserWithDetails;
      
      // Get division name - user_division is an array
      const userDivision = userWithDetails.user_division;
      const divisionName = userDivision
        ? userDivision?.division?.name 
        : null;
      
      // Get position name
      const position = userWithDetails?.user_information?.expertise ?? "Không có"; 
      
      // Get user_information for avatar
      const userInfo = Array.isArray(userWithDetails.user_information) 
        ? null 
        : (userWithDetails.user_information as { avatar?: string });
      const avatar = userInfo?.avatar || undefined;
      
      const code = user.user_information?.code;
      const userId = typeof code === 'string' ? parseInt(code, 10) : (code ?? user.id);
      
      return {
        id: user.user_information?.code ?? user.id,
        name: user?.name ?? user?.user_information?.name ?? "Không có", 
        email: user.email || "",
        position: position,
        division: divisionName || "Còn lại",
        avatar: avatar,
      };
    });

    // Group ALL employees by division (for divisions list in sidebar)
    const allGrouped: GroupedEmployees = {};
    employeesList.forEach((employee) => {
      const divName = employee.division;
      if (!allGrouped[divName]) {
        allGrouped[divName] = [];
      }
      allGrouped[divName].push(employee);
    });

    // Create divisions list with counts from ALL employees (not filtered)
    const divisionsList = [
      { name: "Tất cả", count: employeesList.length },
      ...Object.keys(allGrouped)
        .filter(divName => divName !== "Còn lại")
        .map(divName => ({
          name: divName,
          count: allGrouped[divName].length,
        }))
        .sort((a, b) => b.count - a.count), // Sort by count descending
    ];

    // Add "Còn lại" at the end if it exists
    if (allGrouped["Còn lại"] && allGrouped["Còn lại"].length > 0) {
      divisionsList.push({
        name: "Còn lại",
        count: allGrouped["Còn lại"].length,
      });
    }

    // Filter employees based on division (search is handled by API)
    const filteredEmployees = employeesList.filter((employee) => {
    const matchesDivision =
      selectedDivision === "Tất cả" || employee.division === selectedDivision;
      return matchesDivision;
    });

    // Group filtered employees by division (for display)
    const grouped: GroupedEmployees = {};
    filteredEmployees.forEach((employee) => {
      const divName = employee.division;
      if (!grouped[divName]) {
        grouped[divName] = [];
      }
      grouped[divName].push(employee);
    });

    return {
      employees: filteredEmployees,
      groupedEmployees: grouped,
      divisions: divisionsList,
    };
  }, [data, selectedDivision]);

  const tabs = ["DANH SÁCH NHÂN VIÊN CÔNG TY", "TIN TỨC"];

  return (
    <CompanyContainer>
      <Header>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabsContainer>
      </Header>

        {activeTab === "DANH SÁCH NHÂN VIÊN CÔNG TY" ? (
          <>
      <MainContent>
            <EmployeeSection>
              <SectionTitle>
                <Users size={20} />
                Danh sách nhân viên
              </SectionTitle>
              {isLoading && employees.length === 0 ? (
                <Loading text="Đang tải..." $center={true} />
              ) : Object.keys(groupedEmployees).length === 0 ? (
                <EmptyStateMessage>
                  Không có nhân viên nào
                </EmptyStateMessage>
              ) : (
                Object.entries(groupedEmployees)
                  .sort((a, b) => {
                    if (a[0] === "Còn lại") return 1;
                    if (b[0] === "Còn lại") return -1;
                    return a[0].localeCompare(b[0]);
                  })
                  .map(([divisionName, divisionEmployees]) => {
                    const displayCount = displayCounts[divisionName] || 10;
                    const visibleEmployees = divisionEmployees.slice(0, displayCount);
                    const hasMore = divisionEmployees.length > displayCount;
                    
                    const handleShowMore = () => {
                      setDisplayCounts((prev) => ({
                        ...prev,
                        [divisionName]: (prev[divisionName] || 10) + 10,
                      }));
                    };

                    return (
                  <DivisionSection key={divisionName}>
                    <DivisionHeader>
                      <Users size={18} />
                      {divisionName} ({divisionEmployees.length} nhân viên)
                    </DivisionHeader>
                    <DivisionEmployeeGrid>
                          {visibleEmployees.map((employee, index) => (
                            <EmployeeCard key={`${employee.name}-${index}-${employee.id}`}>
                          <EmployeeAvatar>
                                {(employee.avatar && employee.avatar.includes("https://")) ? (
                                  <AvatarImageWrapper>
                                    <Image
                                      src={employee.avatar}
                                      alt={employee.name}
                                      width={48}
                                      height={48}
                                    />
                                  </AvatarImageWrapper>
                                ) : (
                            <User size={24} />
                                )}
                          </EmployeeAvatar>
                          <EmployeeInfo>
                            <EmployeeName>{employee.name}</EmployeeName>
                            <EmployeeEmail>{employee.email}</EmployeeEmail>
                            <EmployeePosition>
                              {employee.id} - {employee.position}
                            </EmployeePosition>
                          </EmployeeInfo>
                        </EmployeeCard>
                      ))}
                    </DivisionEmployeeGrid>
                        {hasMore && (
                          <ShowMoreContainer>
                            <ShowMoreButton onClick={handleShowMore}>
                              Xem thêm ({divisionEmployees.length - displayCount} nhân viên)
                            </ShowMoreButton>
                          </ShowMoreContainer>
                        )}
                  </DivisionSection>
                    );
                  })
              )}
            </EmployeeSection>

            <Sidebar>
          <SidebarTitle>
            <Users size={20} />
            Tổng số nhân viên: {employees.length}
          </SidebarTitle>

          <SidebarCard>
            <SidebarCardTitle>
              <Search size={18} />
              Tìm kiếm
            </SidebarCardTitle>
            <Input
                type="text"
              placeholder="Tìm tên hoặc email nhân viên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              iconPosition="left"
              fullWidth={true}
              size="md"
              />
          </SidebarCard>

          <SidebarCard>
            <SidebarCardTitle>
              <Building size={18} />
              Phòng ban
            </SidebarCardTitle>
            <FilterList>
              {divisions.map((division) => (
                <FilterItem
                  key={division.name}
                  $active={selectedDivision === division.name}
                  onClick={() => setSelectedDivision(division.name)}
                >
                  <FilterItemContent>
                    <FilterIcon $active={selectedDivision === division.name} />
                    <FilterLabel>{division.name}</FilterLabel>
                  </FilterItemContent>
                  <FilterCount $active={selectedDivision === division.name}>
                    {division.count}
                  </FilterCount>
                </FilterItem>
              ))}
            </FilterList>
          </SidebarCard>
        </Sidebar>
        </MainContent>
          </>
        ) : activeTab === "TIN TỨC" ? (
          newsId ? (
            <NewsDetail newsId={newsId} />
          ) : (
            <NewsList 
              status={NewsStatus.APPROVED} 
              showFilters={true}
              onNewsClick={handleNewsClick}
            />
          )
        ) : null}
    </CompanyContainer>
  );
};

export default Company;

