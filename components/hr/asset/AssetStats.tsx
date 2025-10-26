"use client";

import React from "react";
import { Package, TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
  StatsContainer,
  StatsGrid,
  StatsCard,
  StatsHeader,
  StatsTitle,
  IconWrapper,
  StatsValue,
  StatsLabel,
  ChartContainer,
} from "./assetStatsStyle";

const AssetStats: React.FC = () => {
  // Mock data
  const stats = {
    total: 200,
    inUse: 120,
    available: 60,
    maintenance: 15,
    disposed: 5,
  };

  const inUsePercentage = ((stats.inUse / stats.total) * 100).toFixed(1);
  const availablePercentage = ((stats.available / stats.total) * 100).toFixed(1);
  const maintenancePercentage = ((stats.maintenance / stats.total) * 100).toFixed(1);

  return (
    <StatsContainer>
      <StatsGrid>
        <StatsCard>
          <StatsHeader>
            <div>
              <StatsTitle>Tổng số tài sản</StatsTitle>
              <StatsValue>{stats.total}</StatsValue>
            </div>
            <IconWrapper $color="#3b82f6">
              <Package size={32} />
            </IconWrapper>
          </StatsHeader>
          <StatsLabel>
            <TrendingUp size={16} />
            Đang hoạt động: {stats.total - stats.maintenance - stats.disposed}
          </StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsHeader>
            <div>
              <StatsTitle>Đang sử dụng</StatsTitle>
              <StatsValue $color="#10b981">{stats.inUse}</StatsValue>
            </div>
            <IconWrapper $color="#10b981">
              <Activity size={32} />
            </IconWrapper>
          </StatsHeader>
          <StatsLabel>
            {inUsePercentage}% tổng số tài sản
          </StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsHeader>
            <div>
              <StatsTitle>Có sẵn</StatsTitle>
              <StatsValue $color="#f59e0b">{stats.available}</StatsValue>
            </div>
            <IconWrapper $color="#f59e0b">
              <TrendingDown size={32} />
            </IconWrapper>
          </StatsHeader>
          <StatsLabel>
            {availablePercentage}% tổng số tài sản
          </StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsHeader>
            <div>
              <StatsTitle>Bảo trì</StatsTitle>
              <StatsValue $color="#ef4444">{stats.maintenance}</StatsValue>
            </div>
            <IconWrapper $color="#ef4444">
              <Activity size={32} />
            </IconWrapper>
          </StatsHeader>
          <StatsLabel>
            {maintenancePercentage}% tổng số tài sản
          </StatsLabel>
        </StatsCard>
      </StatsGrid>

        <ChartContainer>
          <h3 style={{ marginBottom: "16px", color: "#333", fontSize: "19px", fontWeight: 600 }}>
            Biểu đồ thống kê tài sản
          </h3>
          <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#666" }}>
              <Package size={48} style={{ marginBottom: "12px" }} />
              <p style={{ fontSize: "16px" }}>Biểu đồ sẽ được tích hợp sau</p>
            </div>
          </div>
        </ChartContainer>
    </StatsContainer>
  );
};

export default AssetStats;

