"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Users2Icon, ArrowRight, BriefcaseBusiness } from "lucide-react";
import { DatePicker, Loading } from "@/components/common";

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
  EmptyDataContainer,
  EmptyDataText,
} from "./workStatStyle";
import EmpLeaveModal from "../modals/EmpLeaveModal";
import EmpLateModal from "../modals/EmpLateModal";
import EmpWorkModal from "../modals/EmpWorkModal";
import { useWorkInfo } from "@/hooks/useDivisionDashboard";

const WorkStat: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<Date | undefined | null>(
    new Date()
  );

  const [isOpenEmpLeaveModal, setIsOpenEmpLeaveModal] = useState(false);
  const [isOpenEmpLateModal, setIsOpenEmpLateModal] = useState(false);
  const [isOpenEmpWorkModal, setIsOpenEmpWorkModal] = useState(false);

  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const date = selectedTime || new Date();
  const { data: workDataInfo, isLoading, error } = useWorkInfo(
    selectedDivisionId,
    date
  );

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
          <Loading />
        </LoadingContainer>
      ) : error || !selectedDivisionId ? (
        <EmptyDataContainer>
          <BriefcaseBusiness size={100} style={{ color: "#e0e0e0" }} />
          <EmptyDataText>
            {!selectedDivisionId
              ? "Vui lòng chọn phòng ban"
              : "Không thể tải dữ liệu"}
          </EmptyDataText>
        </EmptyDataContainer>
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
                    {workDataInfo?.leave_requests?.paid_leave_count}
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
                    {workDataInfo?.leave_requests?.unpaid_leave_count}
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

                {/* <StatGroup>
                  <StatNumber>{workDataInfo?.late_info?.minutes}</StatNumber>
                  <StatLabel>Phút</StatLabel>
                </StatGroup> */}
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
