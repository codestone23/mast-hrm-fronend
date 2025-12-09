"use client";

import React, { useState } from "react";
import AdminRequestsList from "@/components/timekeeping/AdminRequestsList";
import AttendanceStatistics from "./AttendanceStatistics";
import {
  TimekeepingContainer,
  Header,
  TabsContainer,
  Tab,
  TabContent,
} from "./timekeepingStyle";

const Tabs = ["Thống kê chấm công", "DANH SÁCH ĐỀ XUẤT NHÂN VIÊN"];

const Timekeeping: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs[0]);

  return (
    <TimekeepingContainer>
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
      </Header>

      <TabContent>
        {activeTab === "Thống kê chấm công" && <AttendanceStatistics />}
        {activeTab === "DANH SÁCH ĐỀ XUẤT NHÂN VIÊN" && <AdminRequestsList />}
      </TabContent>
    </TimekeepingContainer>
  );
};

export default Timekeeping;

