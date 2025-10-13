"use client";
import React, { useEffect, useState } from "react";
import { Users2Icon } from "lucide-react";
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
} from "./workStatStyle";
import EmpLeaveModal from "../modals/EmpLeaveModal";
import EmpLateModal from "../modals/EmpLateModal";

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
    "present": 20,
    "total": 27,
    "absent": 2,
    "unauthorizedLeave": 1,
    "authorizedLeave": 3,
    "late": 5,
    "lateMinutes": 45
}

const WorkStat: React.FC = () => {
    const [workData, setWorkData] = useState<WorkStatData>(SAMPLE_DATA);

    const [selectedTime, setSelectedTime] = useState<Date | undefined | null>(new Date());
    const [isOpenEmpLeaveModal, setIsOpenEmpLeaveModal] = useState(false);
    const [isOpenEmpLateModal, setIsOpenEmpLateModal] = useState(false);

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

            <Grid>
                <LeftCard>
                    <CardHeader>Số lượng đi làm</CardHeader>
                    <CardBody>
                        <StatBlock>
                            <StatNumber>{workData.present} / {workData.total}</StatNumber>
                        </StatBlock>
                    </CardBody>

                </LeftCard>

                <RightCard onClick={() => setIsOpenEmpLeaveModal(true)} style={{ cursor: "pointer" }}>
                    <CardHeader>Nhân viên nghỉ phép</CardHeader>
                    <CardBody>
                        <StatBlock>
                            <StatGroup style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <StatNumber $green={true}>{workData.authorizedLeave}</StatNumber>
                                <StatLabel>Có phép</StatLabel>
                            </StatGroup>
                            <StatGroup style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                                <StatNumber $green={true}>{workData.unauthorizedLeave}</StatNumber>
                                <StatLabel>Không phép</StatLabel>
                            </StatGroup>
                        </StatBlock>
                        <ArrowBtn>→</ArrowBtn>
                    </CardBody>
                </RightCard>

                <BottomCard onClick={() => setIsOpenEmpLateModal(true)} style={{ cursor: "pointer" }}>
                    <CardHeader>Thông tin đi muộn</CardHeader>
                    <CardBody>
                        <StatBlock>
                            <StatGroup>
                                <StatNumber>{workData.late}</StatNumber>
                                <StatLabel>Người</StatLabel>
                            </StatGroup>

                            <StatGroup>
                                <StatNumber>{workData.lateMinutes}</StatNumber>
                                <StatLabel>Phút</StatLabel>
                            </StatGroup>
                        </StatBlock>
                        <ArrowBtn>→</ArrowBtn>
                    </CardBody>
                </BottomCard>
            </Grid>

            <EmpLeaveModal
                isOpen={isOpenEmpLeaveModal}
                onClose={() => setIsOpenEmpLeaveModal(false)}
                date={selectedTime ? selectedTime.toLocaleDateString('en-GB') : undefined}
            />

            <EmpLateModal
                isOpen={isOpenEmpLateModal}
                onClose={() => setIsOpenEmpLateModal(false)}
                date={selectedTime ? selectedTime.toLocaleDateString('en-GB') : undefined}
            />
        </Container>
    );
}

export default WorkStat;