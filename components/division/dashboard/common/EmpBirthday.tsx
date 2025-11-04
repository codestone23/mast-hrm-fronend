"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Cake } from "lucide-react";
import { DatePicker, Loading } from "@/components/common";

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

import { useBirthdayEmployees } from "@/hooks/useDivisionDashboard";

const EmployeeBirthday: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const month = selectedTime
    ? selectedTime.getMonth() + 1
    : new Date().getMonth() + 1;

  const { data: employeeData, isLoading, error } = useBirthdayEmployees(
    selectedDivisionId,
    month
  );

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

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : error || !selectedDivisionId ? (
        <EmptyDataContainer>
          <Cake size={100} style={{ color: "#e0e0e0" }} />
          <EmptyDataText style={{ color: "#6b7280" }}>
            {!selectedDivisionId
              ? "Vui lòng chọn phòng ban"
              : "Không thể tải dữ liệu"}
          </EmptyDataText>
        </EmptyDataContainer>
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
