"use client";
import React, { useState } from "react";
import { Container, Header, TabsContainer, Tab } from "./workforceStyle";
import { Button } from "@/components/common";
import EmployeeList from "./employee/EmployeeList";
import TeamList from "./team/TeamList";

interface TabItem {
  id: string;
  name: string;
  component?: React.ReactNode;
}

const Tabs: TabItem[] = [
  { id: "employee", name: "Danh sách nhân sự", component: <EmployeeList /> },
  { id: "team", name: "Quản lí đội nhóm", component: <TeamList /> },
];

const Workforce: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs[0].id);

  return (
    <Container>
      <Header>
        <TabsContainer>
          {Tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </Tab>
          ))}
        </TabsContainer>

        <div>
          {activeTab === "employee" && (
            <Button variant="warning" size="md">
              Luân chuyển
            </Button>
          )}
        </div>
      </Header>

      {Tabs.find((tab) => tab.id === activeTab)?.component}
    </Container>
  );
};

export default Workforce;
