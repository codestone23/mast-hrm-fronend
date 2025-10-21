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
  EmptyEmployee,
} from "./empBirthdayStyle";

interface EmployeeBirthdayData {
  id: number;
  name: string;
  email: string;
  birthday: string;
  avatar: string;
  remainingDays?: number;
}

const SAMPLE_DATA = (n = 60) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return new Array(n).fill(null).map((_, i) => {
    const birthMonth = (today.getMonth() + Math.floor(i / 2)) % 12;
    const birthDay = (i % 28) + 1;
    return {
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      birthday: new Date(1990, birthMonth, birthDay).toISOString(),
      avatar: "https://i.pravatar.cc/100?img=" + ((i % 70) + 1),
    };
  });
};

const EmployeeBirthday: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<
    EmployeeBirthdayData[] | undefined
  >(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  useEffect(() => {
    const filtered = getUpcomingBirthdays(SAMPLE_DATA(60), selectedTime);
    setEmployeeData(filtered);
  }, [selectedTime]);

  const getUpcomingBirthdays = (
    employees: EmployeeBirthdayData[],
    selectedTime: Date | undefined | null = null
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return employees
      .filter((emp) => {
        const birthDate = new Date(emp.birthday);
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );

        if (selectedTime) {
          const month = selectedTime.getMonth();
          return thisYearBirthday.getMonth() === month;
        } else {
          return thisYearBirthday.getMonth() === today.getMonth();
        }
      })
      .map((emp) => {
        const birthDate = new Date(emp.birthday);
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );
        const nextBirthday =
          thisYearBirthday < today
            ? new Date(
                today.getFullYear() + 1,
                birthDate.getMonth(),
                birthDate.getDate()
              )
            : thisYearBirthday;
        const diffTime = nextBirthday.getTime() - today.getTime();
        const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...emp,
          remainingDays,
        };
      })
      .sort((a, b) => a.remainingDays - b.remainingDays);
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

      {employeeData && employeeData?.length ? (
        <List>
          {employeeData.map((emp) => (
            <ListItem key={emp.id}>
              <Avatar src={emp.avatar} alt={emp.name} />
              <Info>
                <Name>{emp.name}</Name>
                <Email>{emp.email}</Email>
              </Info>

              <RightArea>
                {emp.remainingDays === 0 ? (
                  <Tag variant="today">Hôm nay</Tag>
                ) : (
                  <Tag variant="upcoming"> {emp.remainingDays} ngày tới</Tag>
                )}
                <Days>
                  {new Date(emp.birthday).getDate()} tháng{" "}
                  {new Date(emp.birthday).getMonth() + 1}
                </Days>
              </RightArea>
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyEmployee>
          <Cake size={100} style={{ color: "#e0e0e0" }} />
          <Name style={{ color: "#6b7280" }}>
            Không có nhân viên nào sinh nhật trong tháng này
          </Name>
        </EmptyEmployee>
      )}
    </Container>
  );
};

export default EmployeeBirthday;
