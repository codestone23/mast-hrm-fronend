"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  LeftCol,
  RightCol,
  Card,
  Avatar,
  Name,
  SmallText,
  TabContainer,
} from "./employeeDetailStyle";
import { Button } from "@/components/common";
import BasicInfo from "./Tabs/BasicInfo";
import ContractInfo from "./Tabs/ContractInfo";
import TimeSheets from "./Tabs/TimeSheets";

const Tabs = ["Thông Tin Cơ bản", "Thông tin hợp đồng", "Bảng chấm công"];

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

const EmployeeDetail: React.FC<{ id?: string }> = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState(Tabs[0]);

  const [data, setData] = useState<typeof SAMPLE_DATA>(SAMPLE_DATA);

  return (
    <Container>
      <LeftCol>
        <Card style={{ textAlign: "center" }}>
          <Avatar src={data.avatar} alt={data.name} />
          <Name>{data.name}</Name>
          <SmallText style={{ marginTop: 6 }}>
            {data.position} • {data.team}
          </SmallText>

          {/* Contact & meta info */}
          <div style={{ textAlign: "left", marginTop: 16, padding: "0 12px" }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Email</div>
              <div style={{ fontSize: 14, color: "#0f172a", marginTop: 4 }}>
                {data.email}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Mã nhân viên</div>
              <div style={{ fontSize: 14, color: "#0f172a", marginTop: 4 }}>
                {data.code}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                Người quản lý
              </div>
              <div style={{ fontSize: 14, color: "#0f172a", marginTop: 4 }}>
                <a
                  href="#"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  Phi Việt Anh
                </a>
              </div>
            </div>

            <div style={{ marginBottom: 4 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                Loại chấm công
              </div>
              <div style={{ fontSize: 14, color: "#0f172a", marginTop: 4 }}>
                Loại thường
              </div>
            </div>
          </div>

          {/* Small stat tiles (blue / gray) */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
              padding: "0 12px",
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#e6f0fb",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1e3a8a" }}>
                {data.daysOff}
              </div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
                Số giờ phép còn lại
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "#eef2f7",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#475569" }}>
                {data.projects}
              </div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
                Số giờ đã nghỉ
              </div>
            </div>
          </div>

          {/* OT big tile */}
          <div style={{ padding: "12px", paddingTop: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ffd7a8",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                +
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: "#92400e" }}
                >
                  {data.score}
                </div>
                <div style={{ fontSize: 12, color: "#92400e", marginTop: 2 }}>
                  Số giờ OT
                </div>
              </div>
            </div>
          </div>

          {/* Penalty / late box */}
          <div style={{ padding: "12px", paddingTop: 8 }}>
            <div
              style={{ background: "#ffecef", borderRadius: 8, padding: 12 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 1fr auto",
                  marginBottom: 10,
                }}
              >
                <div style={{ textAlign: "center" }}>😞</div>
                <div style={{ textAlign: "left", color: "#0f172a" }}>
                  Số lần đi muộn
                </div>
                <div style={{ fontWeight: 700, color: "#7f1d1d" }}>4</div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 1fr auto",
                  marginBottom: 10,
                }}
              >
                <div style={{ textAlign: "center" }}>⏱️</div>
                <div style={{ textAlign: "left", color: "#0f172a" }}>
                  Số phút đi muộn
                </div>
                <div style={{ fontWeight: 700, color: "#7f1d1d" }}>168</div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 1fr auto",
                  marginBottom: 10,
                }}
              >
                <div style={{ textAlign: "center" }}>💸</div>
                <div style={{ textAlign: "left", color: "#0f172a" }}>
                  Số tiền phạt
                </div>
                <div style={{ fontWeight: 700, color: "#7f1d1d" }}>
                  1.000.000
                </div>
              </div>
            </div>
          </div>
        </Card>
      </LeftCol>

      <RightCol>
        <TabContainer>
          {Tabs.map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "primary" : "ghost"}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </TabContainer>

        {selectedTab === "Thông Tin Cơ bản" && <BasicInfo />}
        {selectedTab === "Thông tin hợp đồng" && <ContractInfo />}
        {selectedTab === "Bảng chấm công" && <TimeSheets />}
      </RightCol>
    </Container>
  );
};

export default EmployeeDetail;
