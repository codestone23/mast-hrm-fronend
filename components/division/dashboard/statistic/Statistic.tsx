"use client";
import React, { useEffect, useState } from "react";
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
  StatWrapper,
  CardsRow,
  Card,
  CardTitle,
  CardValue,
  ChartContainer,
} from "./statisticStyle";

const SAMPLE_DATA = [
  { month: "1", late: 30, actualLate: 25, ot: 15 },
  { month: "2", late: 45, actualLate: 40, ot: 50 },
  { month: "3", late: 35, actualLate: 30, ot: 55 },
  { month: "4", late: 25, actualLate: 22, ot: 60 },
  { month: "5", late: 60, actualLate: 70, ot: 30 },
  { month: "6", late: 70, actualLate: 85, ot: 80 },
  { month: "7", late: 20, actualLate: 30, ot: 25 },
  { month: "8", late: 40, actualLate: 50, ot: 20 },
  { month: "9", late: 50, actualLate: 65, ot: 35 },
  { month: "10", late: 32, actualLate: 42, ot: 18 },
  { month: "11", late: 15, actualLate: 30, ot: 45 },
  { month: "12", late: 20, actualLate: 25, ot: 30 },
];

const Statistic: React.FC = () => {
  const [data, setData] = useState(SAMPLE_DATA);
  const [total, setTotal] = useState({ late: 0, actualLate: 0, ot: 0 });
  const calculateTotal = (key: keyof (typeof data)[0]) =>
    data.reduce((s, d) => s + (d[key] as number), 0);

  useEffect(() => {
    setTotal({
      late: calculateTotal("late"),
      actualLate: calculateTotal("actualLate"),
      ot: calculateTotal("ot"),
    });
  }, [data]);

  return (
    <StatWrapper>
      <h3>Thống kê số giờ đi muộn và OT</h3>

      <CardsRow>
        <Card style={{ background: "#f0f0f0" }}>
          <CardTitle>Số giờ đi muộn</CardTitle>
          <CardValue>{total.late}</CardValue>
        </Card>

        <Card style={{ background: "#fde8e8" }}>
          <CardTitle>Số giờ muộn thực tế</CardTitle>
          <CardValue>{total.actualLate}</CardValue>
        </Card>

        <Card style={{ background: "#fff1d6" }}>
          <CardTitle>Số giờ OT</CardTitle>
          <CardValue>{total.ot}</CardValue>
        </Card>
      </CardsRow>

      <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="late" fill="#8b8b8b" name="Đi muộn" />
            <Bar dataKey="actualLate" fill="#ff6b6b" name="Muộn thực tế" />
            <Bar dataKey="ot" fill="#ffc069" name="OT" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </StatWrapper>
  );
};

export default Statistic;
