"use client";
import React, { useState } from "react";
import { Container, Header, TabsContainer, Tab, Placeholder } from "./workforceStyle";
import { Button } from "@/components/common";
import EmployeeList from "./employee/EmployeeList";
import TeamList from "./team/TeamList";

const Tabs = ["Danh sách nhân sự", "Quản lý đội nhóm"];

const Employee: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs[0]);

  return (
    <Container>
      <Header>
        <TabsContainer>
          {Tabs.map((tab) => (
            <Tab
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabsContainer>

        <div>
          {activeTab === "Danh sách nhân sự" && (
            <Button variant="warning" size="md">
              Luân chuyển
            </Button>
          )}
        </div>
      </Header>

      {activeTab === "Danh sách nhân sự" ? (
        <EmployeeList />
      ) : activeTab === "Quản lý đội nhóm" ? (    
        <TeamList />
      ) : (
        <Placeholder>
          <h3>{activeTab}</h3>
          <p>
            Chức năng này đang được xây dựng. Hiện thời hiển thị placeholder.
          </p>
        </Placeholder>
      )}
    </Container>
  );
};

export default Employee;
