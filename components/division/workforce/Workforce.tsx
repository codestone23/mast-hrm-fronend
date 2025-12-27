"use client";
import React, { useState } from "react";
import { Container, Header, TabsContainer, Tab } from "./workforceStyle";
import { Button } from "@/components/common";
import EmployeeList from "./employee/EmployeeList";
import TeamList from "./team/TeamList";
import RotationList from "./rotation/RotationList";
import CreateRotationModal from "./rotation/modals/CreateRotationModal";

interface TabItem {
  id: string;
  name: string;
  component?: React.ReactNode;
}

const Tabs: TabItem[] = [
  { id: "employee", name: "Danh sách nhân sự", component: <EmployeeList /> },
  { id: "team", name: "Quản lí đội nhóm", component: <TeamList /> },
  { id: "rotation", name: "Danh sách luân chuyển", component: <RotationList /> },
];

const Workforce: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs[0].id);
  const [isCreateRotationModalOpen, setIsCreateRotationModalOpen] = useState(false);

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
          {activeTab === "rotation" && (
            <Button variant="primary" size="md" onClick={() => setIsCreateRotationModalOpen(true)}>
              Tạo luân chuyển
            </Button>
          )}
        </div>
      </Header>

      {Tabs.find((tab) => tab.id === activeTab)?.component}

      <CreateRotationModal
        isOpen={isCreateRotationModalOpen}
        onClose={() => setIsCreateRotationModalOpen(false)}
      />
    </Container>
  );
};

export default Workforce;
