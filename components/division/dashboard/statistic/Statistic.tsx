"use client";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DatePicker, Loading } from "@/components/common";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
} from "./statisticStyle";
import { useWorkStatistics } from "@/hooks/useDivisionDashboard";

const Statistic: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const year = selectedTime ? selectedTime.getFullYear() : new Date().getFullYear();
  const { data, isLoading, error } = useWorkStatistics(selectedDivisionId, year);

  const total = useMemo(() => {
    if (!data?.attendance_stats) {
      return { late_hours: 0, actual_late_hours: 0, overtime_hours: 0 };
    }

    return data.attendance_stats.reduce(
      (acc, stat) => ({
        late_hours: acc.late_hours + stat.late_hours,
        actual_late_hours: acc.actual_late_hours + stat.actual_late_hours,
        overtime_hours: acc.overtime_hours + stat.overtime_hours,
      }),
      { late_hours: 0, actual_late_hours: 0, overtime_hours: 0 }
    );
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
    <StatWrapper>
      <Header>
        <Title>Thống kê số giờ đi muộn và OT</Title>

        <DatePicker
          value={selectedTime}
          onChange={(date) => setSelectedTime(date)}
          placeholder="Chọn thời gian"
          format="MM-yyyy"
          mode="year"
          fullWidth={false}
          align={"right"}
        />
      </Header>

      <CardsRow>
        <Card style={{ background: "#f0f0f0" }}>
          <CardTitle>Số giờ đi muộn</CardTitle>
          <CardValue>{total.late_hours}</CardValue>
        </Card>

        <Card style={{ background: "#fde8e8" }}>
          <CardTitle>Số giờ muộn thực tế</CardTitle>
          <CardValue>{total.actual_late_hours}</CardValue>
        </Card>

        <Card style={{ background: "#fff1d6" }}>
          <CardTitle>Số giờ OT</CardTitle>
          <CardValue>{total.overtime_hours}</CardValue>
        </Card>
      </CardsRow>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data?.attendance_stats || []}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="late_hours" fill="#8b8b8b" name="Đi muộn" />
            <Bar dataKey="actual_late_hours" fill="#ff6b6b" name="Muộn thực tế" />
            <Bar dataKey="overtime_hours" fill="#ffc069" name="OT" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </StatWrapper>
  );
};

export default Statistic;
