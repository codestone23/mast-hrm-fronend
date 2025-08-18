"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import {
  CompanyContainer,
  Header,
  TabsContainer,
  Tab,
  CompanyInfoSection,
  InfoCard,
  CompanyLogo,
  CompanyDetails,
  CompanyName,
  CompanyAddress,
  ContactInfo,
  ContactItem,
  MainContent,
  EmployeeSection,
  SectionTitle,
  SearchContainer,
  SearchInput,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  EmployeeGrid,
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
} from "./companyStyle";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  division: string;
  avatar?: string;
}

const Company: React.FC = () => {
  const [activeTab, setActiveTab] = useState("CẢM NANG NHÂN VIÊN");
  const [selectedDivision, setSelectedDivision] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const employees: Employee[] = [
    {
      id: "NV000001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@mast.vn",
      position: "Division Leader",
      division: "BOD",
    },
    {
      id: "NV000002",
      name: "Trần Thị Bình",
      email: "binh.tran@mast.vn",
      position: "Chairman",
      division: "BOD",
    },
    {
      id: "NV000003",
      name: "Lê Minh Cường",
      email: "cuong.le@mast.vn",
      position: "Sales Manager",
      division: "Sales",
    },
    {
      id: "NV000004",
      name: "Phạm Thu Dung",
      email: "dung.pham@mast.vn",
      position: "Marketing Specialist",
      division: "Marketing",
    },
    {
      id: "NV000005",
      name: "Hoàng Văn Em",
      email: "em.hoang@mast.vn",
      position: "Software Engineer",
      division: "Engineering",
    },
    {
      id: "NV000006",
      name: "Vũ Thị Phương",
      email: "phuong.vu@mast.vn",
      position: "QA Engineer",
      division: "QA",
    },
    {
      id: "NV000007",
      name: "Đỗ Minh Giang",
      email: "giang.do@mast.vn",
      position: "HR Manager",
      division: "HR",
    },
    {
      id: "NV000008",
      name: "Bùi Thị Hoa",
      email: "hoa.bui@mast.vn",
      position: "Finance Analyst",
      division: "Finance",
    },
  ];

  const divisions = [
    { name: "Tất cả", count: employees.length },
    {
      name: "BOD",
      count: employees.filter((e) => e.division === "BOD").length,
    },
    {
      name: "Engineering",
      count: employees.filter((e) => e.division === "Engineering").length,
    },
    {
      name: "Sales",
      count: employees.filter((e) => e.division === "Sales").length,
    },
    {
      name: "Marketing",
      count: employees.filter((e) => e.division === "Marketing").length,
    },
    { name: "QA", count: employees.filter((e) => e.division === "QA").length },
    { name: "HR", count: employees.filter((e) => e.division === "HR").length },
    {
      name: "Finance",
      count: employees.filter((e) => e.division === "Finance").length,
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesDivision =
      selectedDivision === "Tất cả" || employee.division === selectedDivision;
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  // Group employees by division
  const groupedEmployees = divisions.reduce((acc, division) => {
    if (division.name === "Tất cả") return acc;

    // If a specific division is selected, only show that division
    if (selectedDivision !== "Tất cả" && division.name !== selectedDivision) {
      return acc;
    }

    const divisionEmployees = filteredEmployees.filter(
      (emp) => emp.division === division.name
    );
    if (divisionEmployees.length > 0) {
      acc[division.name] = divisionEmployees;
    }
    return acc;
  }, {} as Record<string, Employee[]>);

  const tabs = ["CẢM NANG NHÂN VIÊN", "DANH SÁCH NHÂN VIÊN CÔNG TY"];

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

      {activeTab === "CẢM NANG NHÂN VIÊN" ? (
        <CompanyInfoSection>
          <SectionTitle>
            <Building size={20} />
            Thông tin công ty
          </SectionTitle>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <InfoCard>
              <CompanyLogo>
                <Building size={40} color="#FF9800" />
              </CompanyLogo>
              <CompanyDetails>
                <CompanyName>MAST Việt Nam</CompanyName>
                <CompanyAddress>
                  <MapPin size={16} />
                  Tầng 12, Tòa nhà Innovation
                  <br />
                  Khu Công nghệ cao, Quận 9, TP.HCM
                </CompanyAddress>
                <ContactInfo>
                  <ContactItem>
                    <Phone size={16} />
                    (+84) 28-1234-5678
                  </ContactItem>
                  <ContactItem>
                    <Mail size={16} />
                    info@mast.vn
                  </ContactItem>
                </ContactInfo>
              </CompanyDetails>
            </InfoCard>

            <InfoCard>
              <CompanyLogo>
                <Building size={40} color="#2196F3" />
              </CompanyLogo>
              <CompanyDetails>
                <CompanyName>MAST Singapore</CompanyName>
                <CompanyAddress>
                  <MapPin size={16} />
                  Level 15, Marina Bay Financial Centre
                  <br />8 Marina Boulevard, Singapore 018981
                </CompanyAddress>
                <ContactInfo>
                  <ContactItem>
                    <Phone size={16} />
                    (+65) 6789-0123
                  </ContactItem>
                  <ContactItem>
                    <Mail size={16} />
                    info@mast.sg
                  </ContactItem>
                </ContactInfo>
              </CompanyDetails>
            </InfoCard>
          </div>
        </CompanyInfoSection>
      ) : (
        <MainContent>
          <EmployeeSection>
            <SectionTitle>
              <Users size={20} />
              Danh sách nhân viên
            </SectionTitle>
            {Object.entries(groupedEmployees).map(
              ([divisionName, divisionEmployees]) => (
                <DivisionSection key={divisionName}>
                  <DivisionHeader>
                    <Users size={18} />
                    {divisionName} ({divisionEmployees.length} nhân viên)
                  </DivisionHeader>
                  <DivisionEmployeeGrid>
                    {divisionEmployees.map((employee) => (
                      <EmployeeCard key={employee.id}>
                        <EmployeeAvatar>
                          <User size={24} />
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
                </DivisionSection>
              )
            )}
          </EmployeeSection>

          <Sidebar>
            <SidebarTitle>
              <Users size={20} />
              Tổng số nhân viên: {filteredEmployees.length}
            </SidebarTitle>

            <SidebarCard>
              <SidebarCardTitle>
                <Search size={18} />
                Tìm kiếm
              </SidebarCardTitle>
              <SearchInput>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Tìm tên nhân viên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchInput>
            </SidebarCard>

            <SidebarCard>
              <SidebarCardTitle>
                <Building size={18} />
                Division
              </SidebarCardTitle>
              <FilterList>
                {divisions.map((division) => (
                  <FilterItem
                    key={division.name}
                    $active={selectedDivision === division.name}
                    onClick={() => setSelectedDivision(division.name)}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FilterIcon
                        $active={selectedDivision === division.name}
                      />
                      <FilterLabel>{division.name}</FilterLabel>
                    </div>
                    <FilterCount $active={selectedDivision === division.name}>
                      {division.count}
                    </FilterCount>
                  </FilterItem>
                ))}
              </FilterList>
            </SidebarCard>
          </Sidebar>
        </MainContent>
      )}
    </CompanyContainer>
  );
};

export default Company;
