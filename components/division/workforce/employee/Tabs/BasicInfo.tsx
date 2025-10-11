"use client";
import React from "react";
import {
  Container,
  Card,
  Title,
  Grid,
  Row,
  Label,
  Value,
  SectionTitle,
  ChipRow,
  Chip,
} from "./basicInfoStyle";

const SAMPLE_DATA = {
  id: "1",
  code: "NV0001",
  name: "Trần Quang Duy",
  email: "duy.tq@example.com",
  phone: "0901234567",
  birthday: "1990-03-12",
  joinDate: "2021-05-10",
  position: "Senior Developer",
  level: "Senior",
  team: "Why's Team",
  location: "Hà Nội",
  avatar: "https://i.pravatar.cc/160?img=12",
  daysOff: 4,
  projects: 15,
  score: 430,
  skills: ["React", "TypeScript", "Node.js"],
  certificates: [
    { title: "Chứng chỉ A", date: "2023-01-10" },
    { title: "Chứng chỉ B", date: "2022-05-20" },
  ],
};

const fmtDate = (d?: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

const EmployeeDetail: React.FC<{ id?: string }> = ({ id }) => {
  const [data, setData] = React.useState<typeof SAMPLE_DATA>(SAMPLE_DATA);

  return (
    <Container>
      <Card>
        <Title>Thông tin cá nhân</Title>
        <Grid>
          <Row>
            <Label>Số điện thoại</Label>
            <Value>{data.phone}</Value>
          </Row>
          <Row>
            <Label>Ngày sinh</Label>
            <Value>{fmtDate(data.birthday)}</Value>
          </Row>
          <Row>
            <Label>Ngày vào làm</Label>
            <Value>{fmtDate(data.joinDate)}</Value>
          </Row>
          <Row>
            <Label>Vị trí</Label>
            <Value>{data.position}</Value>
          </Row>
          <Row>
            <Label>Level</Label>
            <Value>{data.level}</Value>
          </Row>
          <Row>
            <Label>Địa điểm</Label>
            <Value>{data.location}</Value>
          </Row>
        </Grid>
      </Card>

      <Card>
        <SectionTitle>Quá trình đào tạo</SectionTitle>
        <Grid>
          <Row>
            <Label>Khóa học nội bộ</Label>
            <Value>React nâng cao • 2024</Value>
          </Row>
          <Row>
            <Label>Khóa học bên ngoài</Label>
            <Value>Thiết kế hệ thống • 2023</Value>
          </Row>
        </Grid>
      </Card>

      <Card>
        <SectionTitle>Chứng chỉ</SectionTitle>
        <Grid>
          {data.certificates.map((c, i) => (
            <Row key={i}>
              <Label>{c.title}</Label>
              <Value>{fmtDate(c.date)}</Value>
            </Row>
          ))}
        </Grid>
      </Card>

      <Card>
        <SectionTitle>Kỹ năng</SectionTitle>
        <ChipRow>
          {data.skills.map((s, i) => (
            <Chip key={i}>{s}</Chip>
          ))}
        </ChipRow>
      </Card>
    </Container>
  );
};

export default EmployeeDetail;
