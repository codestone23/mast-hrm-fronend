"use client";
import React, { useState } from "react";
import { Button } from "@/components/common";
import {
  Container,
  Header,
  Title,
  Actions,
  TopTabs,
  Tab,
} from "./invoiceStyle";
import InvoiceTable from "./InvoiceTable/InvoiceTable";
import InvoiceStatistic from "./InvoiceStatistic/InvoiceStatistic";

const Invoice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Danh sách" | "Thống kê">(
    "Danh sách"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Title>Thông tin hóa đơn</Title>
          <TopTabs>
            <Tab
              $active={activeTab === "Danh sách"}
              onClick={() => setActiveTab("Danh sách")}
            >
              Danh sách
            </Tab>
            <Tab
              $active={activeTab === "Thống kê"}
              onClick={() => setActiveTab("Thống kê")}
            >
              Thống kê
            </Tab>
          </TopTabs>
        </div>

        {activeTab === "Danh sách" && (
          <Actions>
            <Button
              variant="warning"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Tạo request
            </Button>
          </Actions>
        )}
      </Header>

      {activeTab === "Danh sách" ? (
        <InvoiceTable
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      ) : (
        <InvoiceStatistic />
      )}
    </Container>
  );
};

export default Invoice;
