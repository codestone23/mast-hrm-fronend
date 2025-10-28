"use client";
import React, { useEffect, useState } from "react";
import { Users2Icon, ArrowRight, BriefcaseBusiness } from "lucide-react";
import { DatePicker } from "@/components/common";

import {
  Container,
  Header,
  Title,
  Grid,
  LeftCard,
  RightCard,
  BottomCard,
  CardHeader,
  CardBody,
  StatBlock,
  StatGroup,
  StatNumber,
  StatLabel,
  ArrowBtn,
  LoadingContainer,
  LoadingText,
  EmptyDataContainer,
  EmptyDataText,
} from "./workStatStyle";
import EmpLeaveModal from "../modals/EmpLeaveModal";
import EmpLateModal from "../modals/EmpLateModal";
import EmpWorkModal from "../modals/EmpWorkModal";
import divisionDashboardService from "@/services/division_dashboard.service";
import { WorkInfoData } from "@/types/api";

interface WorkStatData {
  present: number;
  total: number;
  absent: number;
  unauthorizedLeave: number;
  authorizedLeave: number;
  late: number;
  lateMinutes: number;
}

const SAMPLE_DATA: WorkStatData = {
  present: 20,
  total: 27,
  absent: 2,
  unauthorizedLeave: 1,
  authorizedLeave: 3,
  late: 5,
  lateMinutes: 45,
};

const WorkStat: React.FC = () => {
  const [workData, setWorkData] = useState<WorkStatData>(SAMPLE_DATA);

  const [selectedTime, setSelectedTime] = useState<Date | undefined | null>(
    new Date()
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [workDataInfo, setWorkDataInfo] = useState<WorkInfoData | null>(null);

  const [isOpenEmpLeaveModal, setIsOpenEmpLeaveModal] = useState(false);
  const [isOpenEmpLateModal, setIsOpenEmpLateModal] = useState(false);
  const [isOpenEmpWorkModal, setIsOpenEmpWorkModal] = useState(false);

  const DIVISION_ID = 1; // Replace with actual division ID as needed

  useEffect(() => {
    try {
      const date = selectedTime || new Date();
      setIsLoading(true);
      divisionDashboardService.getWorkInfo(DIVISION_ID, date).then((data) => {
        setWorkDataInfo(data);
      });
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTime]);

  return (
    <Container>
      <Header>
        <Title>
          <Users2Icon size={26} />
          Thông tin làm việc
        </Title>

        <DatePicker
          value={selectedTime}
          onChange={(date) => setSelectedTime(date)}
          placeholder="Chọn thời gian"
          format="MM-yyyy"
          fullWidth={false}
          align="center"
        />
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <LoadingText>Đang tải dữ liệu...</LoadingText>
        </LoadingContainer>
      ) : workDataInfo ? (
        <Grid>
          <LeftCard
            onClick={() => setIsOpenEmpWorkModal(true)}
            style={{ cursor: "pointer" }}
          >
            <CardHeader>Số lượng đi làm</CardHeader>
            <CardBody>
              <StatBlock>
                <StatNumber>
                  {workDataInfo?.working_info?.working_count} /{" "}
                  {workDataInfo?.working_info?.total_members}
                </StatNumber>
              </StatBlock>
              <ArrowBtn>
                <ArrowRight />
              </ArrowBtn>
            </CardBody>
          </LeftCard>

          <RightCard
            onClick={() => setIsOpenEmpLeaveModal(true)}
            style={{ cursor: "pointer" }}
          >
            <CardHeader>Nhân viên nghỉ phép</CardHeader>
            <CardBody>
              <StatBlock>
                <StatGroup
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <StatNumber $green={true}>
                    {workDataInfo?.leave_requests?.approved_count}
                  </StatNumber>
                  <StatLabel>Có phép</StatLabel>
                </StatGroup>
                <StatGroup
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <StatNumber $green={true}>
                    {workDataInfo?.leave_requests?.pending_count}
                  </StatNumber>
                  <StatLabel>Không phép</StatLabel>
                </StatGroup>
              </StatBlock>
              <ArrowBtn>
                <ArrowRight />
              </ArrowBtn>
            </CardBody>
          </RightCard>

          <BottomCard
            onClick={() => setIsOpenEmpLateModal(true)}
            style={{ cursor: "pointer" }}
          >
            <CardHeader>Thông tin đi muộn</CardHeader>
            <CardBody>
              <StatBlock>
                <StatGroup>
                  <StatNumber>{workDataInfo?.late_info?.late_count}</StatNumber>
                  <StatLabel>Người</StatLabel>
                </StatGroup>

                <StatGroup>
                  <StatNumber>{workDataInfo?.late_info?.minutes}</StatNumber>
                  <StatLabel>Phút</StatLabel>
                </StatGroup>
              </StatBlock>
              <ArrowBtn>
                <ArrowRight />
              </ArrowBtn>
            </CardBody>
          </BottomCard>
        </Grid>
      ) : (
        <EmptyDataContainer>
          <BriefcaseBusiness size={100} style={{ color: "#e0e0e0" }} />
          <EmptyDataText>Không có dữ liệu</EmptyDataText>
        </EmptyDataContainer>
      )}

      <EmpLeaveModal
        isOpen={isOpenEmpLeaveModal}
        onClose={() => setIsOpenEmpLeaveModal(false)}
        date={
          selectedTime ? selectedTime.toLocaleDateString("en-GB") : undefined
        }
        entries={workDataInfo?.leave_requests?.employees}
      />

      <EmpLateModal
        isOpen={isOpenEmpLateModal}
        onClose={() => setIsOpenEmpLateModal(false)}
        date={
          selectedTime ? selectedTime.toLocaleDateString("en-GB") : undefined
        }
      />

      <EmpWorkModal
        isOpen={isOpenEmpWorkModal}
        onClose={() => setIsOpenEmpWorkModal(false)}
        date={
          selectedTime ? selectedTime.toLocaleDateString("en-GB") : undefined
        }
      />
    </Container>
  );
};

export default WorkStat;
