"use client";
import React, {useEffect, useState} from "react";
import { Card, Title } from "./basicInfoStyle";
import {
  Container,
  Grid4,
  Label,
  Value,
  Timeline,
  TimelineRow,
  DateCol,
  EventCard,
  EventTitle,
  Small,
} from "./contractInfoStyle";

const SAMPLE_DATA = {
  type: "Hợp đồng xác định thời hạn",
  code: "NV000454.2/HD-HDXDT",
  start: "07/09/2022",
  end: "06/09/2023",
  createdAt: "14/09/2022",
  createdBy: "Trần Thị Sim",
  updatedAt: "27/10/2023",
  updatedBy: "Trần Thị Sim",
  history: [
    {
      range: "05/01/2021 ~ 05/12/2021",
      type: "Hợp đồng xác định thời hạn",
      createdBy: "Trần Thị Sim",
      createdAt: "23/08/2021",
    },
    {
      range: "05/01/2020 ~ 05/12/2020",
      type: "Hợp đồng học việc",
      createdBy: "Trần Thị Sim",
      createdAt: "23/08/2020",
    },
  ],
};

const ContractInfo: React.FC<{ id?: string }> = ({ id }) => {
  const [data, setData] = useState<typeof SAMPLE_DATA>(SAMPLE_DATA);

  return (
    <Container>
      <Card>
        <Title>Hợp đồng hiện tại</Title>
        <Grid4>
          <Label>Loại hợp đồng</Label>
          <Value>{data.type}</Value>

          <Label>Ngày tạo hợp đồng</Label>
          <Value>{data.createdAt}</Value>

          <Label>Mã hợp đồng</Label>
          <Value>{data.code}</Value>

          <Label>Người tạo hợp đồng</Label>
          <Value>{data.createdBy}</Value>

          <Label>Ngày bắt đầu hợp đồng</Label>
          <Value>{data.start}</Value>

          <Label>Ngày kết thúc hợp đồng</Label>
          <Value>{data.end}</Value>

          <Label>Người chỉnh sửa</Label>
          <Value>{data.updatedBy}</Value>

          <Label>Ngày chỉnh sửa</Label>
          <Value>{data.updatedAt}</Value>
        </Grid4>
      </Card>

      <Card>
        <Title>Lịch sử hợp đồng</Title>
        <Timeline>
          {data.history.map((h, i) => (
            <TimelineRow key={i}>
              <DateCol>{h.range}</DateCol>
              <EventCard>
                <EventTitle>{h.type}</EventTitle>
                <Small>Người tạo hợp đồng: {h.createdBy}</Small>
                <Small>Ngày tạo hợp đồng: {h.createdAt}</Small>
              </EventCard>
            </TimelineRow>
          ))}
        </Timeline>
      </Card>
    </Container>
  );
};

export default ContractInfo;
