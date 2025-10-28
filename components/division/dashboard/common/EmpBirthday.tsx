"use client";
import React, { useEffect, useState } from "react";
import { Cake } from "lucide-react";
import { DatePicker } from "@/components/common";

import {
  Container,
  Header,
  Title,
  List,
  ListItem,
  Avatar,
  Info,
  Name,
  Email,
  RightArea,
  Tag,
  Days,
  LoadingContainer,
  LoadingText,
  EmptyDataContainer,
  EmptyDataText,
} from "./empBirthdayStyle";

import divisionDashboardService from "@/services/division_dashboard.service";
import { BirthdayEmployeeData } from "@/types/api";

const SAMPLE_DATA = {
  division: {
    id: 1,
    name: "string",
  },
  month: 10,
  employees: [
    {
      user_id: 1,
      name: "Nguyen Van A",
      email: "someone@example.com",
      avatar: "https://i.pravatar.cc/100?img=1",
      birthday: "1990-10-15",
      days_until_birthday: 0,
    },
    {
      user_id: 2,
      name: "Nguyen Van A",
      email: "someone@example.com",
      avatar: "https://i.pravatar.cc/100?img=1",
      birthday: "1990-10-15",
      days_until_birthday: 1,
    },
    {
      user_id: 3,
      name: "Nguyen Van A",
      email: "someone@example.com",
      avatar: "https://i.pravatar.cc/100?img=1",
      birthday: "1990-10-15",
      days_until_birthday: 5,
    },
  ],
};

const EmployeeBirthday: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<
    BirthdayEmployeeData | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  const DIVISION_ID = 1; // Replace with actual division ID as needed

  useEffect(() => {
    // const filtered = getUpcomingBirthdays(SAMPLE_DATA(60), selectedTime);
    // setEmployeeData(filtered);

    try {
      setLoading(true);
      const month = selectedTime
        ? selectedTime.getMonth() + 1
        : new Date().getMonth() + 1;
      divisionDashboardService
        .getBirthdayEmployeeData(DIVISION_ID, month)
        .then((res) => {
          console.log("Fetched employee birthday data:", res);
          setEmployeeData(res);
          // setEmployeeData(SAMPLE_DATA); // For testing purpose
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.error("Failed to fetch employee birthday data:", err);
    }
  }, [selectedTime]);

  const formatBirthday = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} tháng ${date.getMonth() + 1}`;
  };

  return (
    <Container>
      <Header>
        <Title>
          <Cake size={26} />
          Nhân viên sinh nhật
        </Title>

        <DatePicker
          value={selectedTime}
          onChange={(date) => setSelectedTime(date)}
          placeholder="Chọn thời gian"
          format="MM-yyyy"
          mode="month"
          fullWidth={false}
          align={"right"}
        />
      </Header>

      {loading ? (
        <LoadingContainer>
          <LoadingText>Đang tải dữ liệu...</LoadingText>
        </LoadingContainer>
      ) : employeeData && employeeData?.employees ? (
        <List>
          {employeeData.employees.map((emp) => (
            <ListItem key={emp.user_id}>
              <Avatar src={emp.avatar} alt={emp.name} />
              <Info>
                <Name>{emp.name}</Name>
                <Email>{emp.email}</Email>
              </Info>

              <RightArea>
                {emp.days_until_birthday === 0 ? (
                  <Tag variant="today">Hôm nay</Tag>
                ) : (
                  <Tag variant="upcoming">
                    {emp.days_until_birthday} ngày tới
                  </Tag>
                )}
                <Days>{formatBirthday(emp.birthday)}</Days>
              </RightArea>
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyDataContainer>
          <Cake size={100} style={{ color: "#e0e0e0" }} />
          <EmptyDataText style={{ color: "#6b7280" }}>
            Không có nhân viên nào sinh nhật trong tháng này
          </EmptyDataText>
        </EmptyDataContainer>
      )}
    </Container>
  );
};

export default EmployeeBirthday;
