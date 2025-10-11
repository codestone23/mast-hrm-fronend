"use client";
import React, { useState } from "react";
import { Container, Header, TopTabs, Tab, Placeholder } from "./workforceStyle";
import { Button } from "@/components/common";
import EmployeeList from "./employee/EmployeeList";
import TeamList from "./team/TeamList";
import Rental from "./rental/Rental";

const Tabs = ["Danh sách nhân sự", "Quản lý team", "Quản lý thuê người"];

const Employee: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs[0]);

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TopTabs>
            {Tabs.map((tab) => (
              <Tab
                key={tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </TopTabs>
        </div>

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
      ) : activeTab === "Quản lý team" ? (
        <TeamList />
      ) : activeTab === "Quản lý thuê người" ? (
        <Rental />
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
