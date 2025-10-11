"use client";
import React from "react";
import { Container, CommonRow, Tags, StatisticRow } from "./dashboardStyle";
import EmployeeBirthday from "./common/EmpBirthday";
import WorkStat from "./common/WorkStat";
import Statistic from "./statistic/Statistic";

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Tags> Thông tin chung </Tags>
      <CommonRow>
        <WorkStat />
        <EmployeeBirthday />
      </CommonRow>

      <Tags> Thống kê </Tags>
      <StatisticRow>
        <Statistic />
      </StatisticRow>
    </Container>
  );
};

export default Dashboard;
