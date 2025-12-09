"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DatePicker, Loading } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Header,
  Title,
  StatWrapper,
  CardsRow,
  Card,
  CardTitle,
  CardValue,
  ChartContainer,
} from "../dashboard/statistic/statisticStyle";
import reportService from "@/services/report.service";
import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const AttendanceStatistics: React.FC = () => {
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date;
  });

  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const params = useMemo(
    () => ({
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      division_id: selectedDivisionId || undefined,
    }),
    [startDate, endDate, selectedDivisionId]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance-dashboard", params],
    queryFn: () => reportService.reportsAttendanceDashboard(params),
    enabled: !!selectedDivisionId && !!startDate && !!endDate,
  });

  // Format daily stats for charts
  const dailyStatsData = useMemo(() => {
    if (!data?.daily_stats) return [];
    return data.daily_stats.map((stat) => ({
      ...stat,
      period: format(new Date(stat.period), "dd/MM"),
    }));
  }, [data]);

  // Format violation stats for chart
  const violationStatsData = useMemo(() => {
    if (!data?.violation_stats) return [];
    return data.violation_stats.slice(0, 10).map((stat) => ({
      name: `User ${stat.user_id}`,
      total_violations: stat.total_violations,
      late_count: stat.late_count,
      early_leave_count: stat.early_leave_count,
    }));
  }, [data]);


  if (isLoading) {
    return (
      <StatWrapper>
        <Loading />
      </StatWrapper>
    );
  }

  if (error || !selectedDivisionId) {
    return (
      <StatWrapper>
        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
          {!selectedDivisionId
            ? "Vui lòng chọn phòng ban"
            : "Không thể tải dữ liệu thống kê"}
        </div>
      </StatWrapper>
    );
  }

  return (
    <div>
      <StatWrapper>
        <Header>
          <Title>Thống kê chấm công</Title>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              placeholder="Từ ngày"
              fullWidth={false}
            />
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              placeholder="Đến ngày"
              fullWidth={false}
            />
          </div>
        </Header>

        {data?.overview && (
          <>
            <CardsRow>
              <Card style={{ background: "#f0f0f0" }}>
                <CardTitle>Tổng số bản ghi</CardTitle>
                <CardValue>{data.overview.total_records}</CardValue>
              </Card>

              <Card style={{ background: "#fff9c4" }}>
                <CardTitle>Tổng số phạt</CardTitle>
                <CardValue>{data.overview.total_penalties}</CardValue>
              </Card>
            </CardsRow>

            {/* Chart for rates */}
            <ChartContainer style={{ marginTop: "16px" }}>
              <h3
                style={{
                  marginBottom: "16px",
                  color: "#333",
                  fontSize: "19px",
                  fontWeight: 600,
                }}
              >
                Tỷ lệ chấm công
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Đúng giờ",
                      value: parseFloat(data.overview.on_time_rate) || 0,
                    },
                    {
                      name: "Đi muộn",
                      value: parseFloat(data.overview.late_rate) || 0,
                    },
                    {
                      name: "Về sớm",
                      value: parseFloat(data.overview.early_leave_rate) || 0,
                    },
                    {
                      name: "Làm từ xa",
                      value: parseFloat(data.overview.remote_rate) || 0,
                    },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#2196F3"
                    name="Tỷ lệ (%)"
                    label={{
                      position: "right",
                      formatter: (value: number) => `${value.toFixed(2)}%`,
                    }}
                  >
                    {[
                      parseFloat(data.overview.on_time_rate) || 0,
                      parseFloat(data.overview.late_rate) || 0,
                      parseFloat(data.overview.early_leave_rate) || 0,
                      parseFloat(data.overview.remote_rate) || 0,
                    ].map((value, index) => {
                      let color = "#2196F3";
                      if (index === 0) color = "#00C49F"; // Đúng giờ - xanh lá
                      if (index === 1) color = "#FF8042"; // Đi muộn - đỏ cam
                      if (index === 2) color = "#FFBB28"; // Về sớm - vàng
                      if (index === 3) color = "#0088FE"; // Làm từ xa - xanh dương
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </>
        )}

        {data?.leave_stats && (
          <CardsRow style={{ marginTop: "16px" }}>
            <Card style={{ background: "#f0f0f0" }}>
              <CardTitle>Tổng ngày nghỉ</CardTitle>
              <CardValue>{data.leave_stats.total_leave_days}</CardValue>
            </Card>

            <Card style={{ background: "#e8f5e9" }}>
              <CardTitle>Nghỉ có lương</CardTitle>
              <CardValue>{data.leave_stats.paid_leave}</CardValue>
            </Card>

            <Card style={{ background: "#fff3e0" }}>
              <CardTitle>Nghỉ không lương</CardTitle>
              <CardValue>{data.leave_stats.unpaid_leave}</CardValue>
            </Card>

            <Card style={{ background: "#fce4ec" }}>
              <CardTitle>Nghỉ phép năm</CardTitle>
              <CardValue>{data.leave_stats.annual_leave}</CardValue>
            </Card>

            <Card style={{ background: "#e3f2fd" }}>
              <CardTitle>Nghỉ ốm</CardTitle>
              <CardValue>{data.leave_stats.sick_leave}</CardValue>
            </Card>

            <Card style={{ background: "#fff9c4" }}>
              <CardTitle>Nghỉ cá nhân</CardTitle>
              <CardValue>{data.leave_stats.personal_leave}</CardValue>
            </Card>
          </CardsRow>
        )}
      </StatWrapper>

      {data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {/* Daily Work Hours Line Chart */}
          <ChartContainer>
            <h3
              style={{
                marginBottom: "16px",
                color: "#333",
                fontSize: "19px",
                fontWeight: 600,
              }}
            >
              Tổng giờ làm việc theo ngày
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_work_hours"
                  stroke="#0088FE"
                  name="Tổng giờ làm"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Daily Records Bar Chart */}
          <ChartContainer>
            <h3
              style={{
                marginBottom: "16px",
                color: "#333",
                fontSize: "19px",
                fontWeight: 600,
              }}
            >
              Số bản ghi theo ngày
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_records" fill="#00C49F" name="Số bản ghi" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Violation Stats Bar Chart */}
          {violationStatsData.length > 0 && (
            <ChartContainer>
              <h3
                style={{
                  marginBottom: "16px",
                  color: "#333",
                  fontSize: "19px",
                  fontWeight: 600,
                }}
              >
                Thống kê vi phạm (Top 10)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="late_count"
                    fill="#FF8042"
                    name="Số lần đi muộn"
                  />
                  <Bar
                    dataKey="early_leave_count"
                    fill="#FFBB28"
                    name="Số lần về sớm"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceStatistics;

