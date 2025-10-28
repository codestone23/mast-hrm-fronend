"use client";
import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/common";

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
import divisionDashboardService from "@/services/division_dashboard.service";
import { WorkStatisticData } from "@/types/api";

const Statistic: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [data, setData] = useState<WorkStatisticData | null>(null);
  const [total, setTotal] = useState({ late_hours: 0, actual_late_hours: 0, overtime_hours: 0 });

  const DIVISION_ID = 1; // Replace with actual division ID as needed

  useEffect(() => {
    try{
      const year = selectedTime ? selectedTime.getFullYear() : new Date().getFullYear();
      divisionDashboardService.getWorkStatisticData(DIVISION_ID, year).then((res)=>{
        console.log("Fetched work statistic data:", res);
        setData(res);

        let late_hours = 0;
        let actual_late_hours = 0;
        let overtime_hours = 0;
        res.attendance_stats.forEach(stat => {
          late_hours += stat.late_hours;
          actual_late_hours += stat.actual_late_hours;
          overtime_hours += stat.overtime_hours;
        })
        setTotal({
          late_hours,
          actual_late_hours,
          overtime_hours,
        });
      })
    } catch (error) {
      console.error("Error fetching work statistic data:", error);
    }
   
  }, [selectedTime]);

  return (
    <StatWrapper>
      <Header>
        <Title>
          Thống kê số giờ đi muộn và OT
        </Title>

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
            data={data ? data.attendance_stats : []}
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
