"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
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
import assetsService from "@/services/assets.service";
import { Loading } from "@/components/common";

const COLORS = {
    assigned: "#10b981",
    available: "#f59e0b",
    maintenance: "#ef4444",
    pending: "#3b82f6",
    approved: "#10b981",
};

const AssetStats: React.FC = () => {
    const isMobile = useMobile();
    const { data, isLoading, error } = useQuery({
        queryKey: ["assetStatistics"],
        queryFn: () => assetsService.getAssetsStatistics(),
    });

    const stats = data || {
        assets: {
            total: 0,
            available: 0,
            assigned: 0,
            maintenance: 0,
            utilization_rate: 0,
        },
        requests: {
            pending: 0,
            approved: 0,
        },
        categories: [],
    };

    const assignedPercentage =
        stats.assets.total > 0
            ? ((stats.assets.assigned / stats.assets.total) * 100).toFixed(1)
            : "0";

    const availablePercentage =
        stats.assets.total > 0
            ? ((stats.assets.available / stats.assets.total) * 100).toFixed(1)
            : "0";

    const maintenancePercentage =
        stats.assets.total > 0
            ? ((stats.assets.maintenance / stats.assets.total) * 100).toFixed(1)
            : "0";

    // Data for requests pie chart
    const requestsData = [
        {
            name: "Đang chờ",
            value: stats.requests.pending,
            color: COLORS.pending,
        },
        {
            name: "Đã duyệt",
            value: stats.requests.approved,
            color: COLORS.approved,
        },
    ];

    const categoriesData = stats.categories.map((cat) => ({
        name: cat.category,
        count: cat.count,
    }));

    return (
        <StatsContainer>
            <StatsGrid>
                <StatsCard>
                    <StatsHeader>
                        <div>
                            <StatsTitle>Tổng số tài sản</StatsTitle>
                            <StatsValue>{stats.assets.total}</StatsValue>
                        </div>
                        <IconWrapper $color="#3b82f6">
                            <Package size={32} />
                        </IconWrapper>
                    </StatsHeader>
                    <StatsLabel>
                        <TrendingUp size={16} />
                        Tỷ lệ sử dụng: {stats.assets.utilization_rate}%
                    </StatsLabel>
                </StatsCard>

                <StatsCard>
                    <StatsHeader>
                        <div>
                            <StatsTitle>Đã gán</StatsTitle>
                            <StatsValue $color="#10b981">
                                {stats.assets.assigned}
                            </StatsValue>
                        </div>
                        <IconWrapper $color="#10b981">
                            <Activity size={32} />
                        </IconWrapper>
                    </StatsHeader>
                    <StatsLabel>
                        {assignedPercentage}% tổng số tài sản
                    </StatsLabel>
                </StatsCard>

                <StatsCard>
                    <StatsHeader>
                        <div>
                            <StatsTitle>Có sẵn</StatsTitle>
                            <StatsValue $color="#f59e0b">
                                {stats.assets.available}
                            </StatsValue>
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
                            <StatsValue $color="#ef4444">
                                {stats.assets.maintenance}
                            </StatsValue>
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

            {isLoading ? (
                <StatsContainer>
                    <Loading />
                </StatsContainer>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
                        gap: "16px",
                        marginTop: "16px",
                    }}
                >
                    <ChartContainer>
                        <h3
                            style={{
                                marginBottom: "16px",
                                color: "#333",
                                fontSize: isMobile ? "16px" : "19px",
                                fontWeight: 600,
                            }}
                        >
                            Thống kê yêu cầu
                        </h3>
                        <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
                            <PieChart>
                                <Pie
                                    data={requestsData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) =>
                                        value > 0 ? `${name}: ${value}` : ""
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {requestsData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <ChartContainer>
                        <h3
                            style={{
                                marginBottom: "16px",
                                color: "#333",
                                fontSize: isMobile ? "16px" : "19px",
                                fontWeight: 600,
                            }}
                        >
                            Thống kê theo danh mục
                        </h3>
                        <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
                            <BarChart data={categoriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: isMobile ? 10 : 12 }}
                                    angle={isMobile ? -90 : -45}
                                    textAnchor="end"
                                    height={isMobile ? 100 : 80}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="count"
                                    fill="#2196F3"
                                    name="Số lượng"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            )}
        </StatsContainer>
    );
};

export default AssetStats;
