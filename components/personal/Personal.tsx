/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import DailyReports from '../timekeeping/DailyReports';
import CreateReportModal from '../timekeeping/modals/CreateReportModal';
import {
  PersonalContainer,
  DashboardGrid,
  Card,
  WelcomeCard,
  WelcomeContent,
  ProfileCard,
  ProfileAvatar,
  ProfileInfo,
  StatsCard,
  StatsNumber,
  StatsGrid,
  AttendanceCard,
  AttendanceStatus,
  MetricsList,
  ResourcesCard,
  EffortSection,
  CardHeader,
  CardTitle,
  CardLink,
  IconWrapper,
  ProfileDetail,
  StatsHeader,
  StatsNewest,
  StatsNewestLabel,
  WorkStatsContainer,
  WorkStatsHeader,
  WorkStatsMonth,
  AssetsGradientBox,
  AssetsNumber,
  AssetsLabel,
  AssetsListContainer,
  AssetsListTitle,
  AssetsItem,
  ResourcesHeader,
  ResourcesTitle,
  ResourcesLink,
  EffortDateLabel,
  EffortDisplay,
  EffortNumber,
  EffortLabel,
  EffortPercentage,
  EffortText,
  ResourcesInfo,
  ResourcesDetailLink,
  DashboardCol,
  ButtonDetail,
  ProfileDetailRight,
  CardWrapper,
} from "./personalStyle";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import { usePersonal } from "./usePersonal";

const Personal: React.FC = () => {
  const router = useRouter();
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const { user } = usePersonal();
  const currentMonth = new Date().toLocaleDateString("vi-VN", {
    month: "2-digit",
    year: "numeric",
  });

  const handleClickDetail = () => {
    router.push(ROUTERS.PERSONAL.INFO);
  };

  const handleClickProjects = () => {
    router.push(ROUTERS.PERSONAL.PROJECTS);
  };

  const handleCreateReport = (reportData: any) => {
    console.log(reportData);
    // setReports((prev: any) => [reportData, ...prev]);
  };

  const getJoinDate = () => {
    const totalDays = Math.floor((new Date().getTime() - new Date(user?.join_date || "").getTime()) / (1000 * 60 * 60 * 24));
    if (user?.join_date) {
      return `Ngày gia nhập: ${user.join_date} (${totalDays} ngày)`;
    }
    return `Ngày gia nhập: ${new Date().toLocaleDateString("vi-VN")} (${totalDays} ngày)`;
  };

  const renderHeader = () => {
    return (
      <DashboardCol>
        <WelcomeCard>
          <WelcomeContent>
            <h3>Chào mừng bạn đến với hệ thống quản lý nhân sự</h3>
            <p>{getJoinDate()}</p>
          </WelcomeContent>
        </WelcomeCard>
        <AttendanceCard>
          <div className="title">
            <Clock size={20} color="#3b82f6" />
            Chấm công ngày hôm nay
          </div>
          <AttendanceStatus>
            <div className="date">{user?.today_attendance?.checkin || "00:00"} - Công: {user?.today_attendance?.total_work_time || 0} - Muộn:  0</div>
            <div className="status">
              <span className="in">Vào: {user?.today_attendance?.checkin || "00:00"}</span>
              <span className="out">Ra: {user?.today_attendance?.checkout || "00:00"}</span>
            </div>
          </AttendanceStatus>
        </AttendanceCard>

        <StatsCard>
          <StatsHeader $marginBottom="0.5rem">
            <IconWrapper>
              <Calendar size={18} />
            </IconWrapper>
            <CardTitle>Số giờ phép còn lại</CardTitle>
          </StatsHeader>
          <StatsNumber className="large">{user?.remaining_leave_days || 0}</StatsNumber>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            giờ
          </div>
        </StatsCard>
        <Card>
          <CardHeader>
            <IconWrapper>
              <BarChart3 size={20} />
            </IconWrapper>
            <CardTitle>Thiết bị được cấp</CardTitle>
          </CardHeader>
          <AssetsGradientBox>
            <AssetsNumber>{user?.assigned_devices?.length || 0}</AssetsNumber>
            <AssetsLabel>Tổng số thiết bị</AssetsLabel>
          </AssetsGradientBox>
          <AssetsListContainer>
            <AssetsListTitle>
              <strong>Danh sách thiết bị</strong>
            </AssetsListTitle>
            {user?.assigned_devices?.map((device: any) => (
              <AssetsItem $marginBottom="0.25rem" key={device.id}>
                {device.name}
              </AssetsItem>
            ))}
          </AssetsListContainer>
        </Card>
      </DashboardCol>
    );
  };

  return (
    <PersonalContainer>
      <DashboardGrid>
        {renderHeader()}
        <DashboardCol $span={2}>
          <ProfileCard>
            <ProfileAvatar>
              <User size={32} color="white" />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileDetail>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <div className="role">Frontend Developer</div>
              </ProfileDetail>
              <ProfileDetailRight>
                <div>
                  Người quản lý: <strong>Không có</strong>
                </div>
                <ButtonDetail onClick={handleClickDetail}>
                  Xem chi tiết
                </ButtonDetail>
              </ProfileDetailRight>
            </ProfileInfo>
          </ProfileCard>
          <CardWrapper>
            <DashboardCol>
              <Card>
                <WorkStatsContainer>
                  <WorkStatsHeader>
                    <IconWrapper>
                      <Calendar size={20} />
                    </IconWrapper>
                    <CardTitle>Thống kê chấm công</CardTitle>
                    <WorkStatsMonth>{currentMonth}</WorkStatsMonth>
                  </WorkStatsHeader>
                  <MetricsList>
                    <div className="metric-item success">
                      <div className="label">
                        <TrendingUp size={16} />
                        Tổng số công
                      </div>
                      <div className="value">88/168</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">
                        <AlertCircle size={16} />
                        Số giờ làm thêm
                      </div>
                      <div className="value">12</div>
                    </div>
                    <div className="metric-item warning">
                      <div className="label">
                        <AlertCircle size={16} />
                        Số phút muộn
                      </div>
                      <div className="value">0</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">Thời gian vi phạm</div>
                      <div className="value">0/120</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">
                        <CheckCircle size={16} />
                        Khoản phạt
                      </div>
                      <div className="value">0</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">Nghỉ có phép (giờ)</div>
                      <div className="value">16</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">Nghỉ không phép (giờ)</div>
                      <div className="value">0</div>
                    </div>
                  </MetricsList>
                </WorkStatsContainer>
              </Card>
              <Card>
                <DailyReports 
                  reports={reports}
                  onCreateReport={() => setIsCreateReportModalOpen(true)}
                />
              </Card>
            </DashboardCol>
            <DashboardCol>
              <Card>
                <StatsHeader>
                  <IconWrapper>
                    <FileText size={20} />
                  </IconWrapper>
                  <CardTitle>Yêu cầu của tôi</CardTitle>
                  <CardLink>Xem chi tiết</CardLink>
                </StatsHeader>
                <StatsGrid>
                  <div className="stat-item">
                    <div className="number">12</div>
                    <div className="label">Tổng yêu cầu</div>
                  </div>
                  <div className="stat-item">
                    <div className="number">2</div>
                    <div className="label">Đang xử lý</div>
                  </div>
                  <div className="stat-item">
                    <div className="number">10</div>
                    <div className="label">Đã xử lý</div>
                  </div>
                </StatsGrid>
                <StatsNewest>
                  <StatsNewestLabel>Cập nhật mới nhất</StatsNewestLabel>
                </StatsNewest>
              </Card>
              <ResourcesCard>
                <ResourcesHeader>
                  <ResourcesTitle>Dự án hiện tại</ResourcesTitle>
                  <ResourcesLink onClick={handleClickProjects}>Xem chi tiết</ResourcesLink>
                </ResourcesHeader>
                <EffortSection>
                  <EffortDateLabel>Tiến độ ngày 18/08/2025</EffortDateLabel>
                  <EffortDisplay>
                    <EffortNumber>02</EffortNumber>
                    <EffortLabel>Dự án</EffortLabel>
                    <EffortPercentage>75%</EffortPercentage>
                    <EffortText>Hoàn thành</EffortText>
                  </EffortDisplay>
                </EffortSection>
                <EffortSection>
                  <EffortDateLabel>Tiến độ tháng 08/2025</EffortDateLabel>
                  <EffortDisplay>
                    <EffortNumber>03</EffortNumber>
                    <EffortLabel>Dự án</EffortLabel>
                    <EffortPercentage color="var(--warning-500)">
                      60%
                    </EffortPercentage>
                    <EffortText>Hoàn thành</EffortText>
                  </EffortDisplay>
                </EffortSection>
                <ResourcesInfo $marginBottom="0.5rem">
                  Web Application: <strong>85%</strong>
                </ResourcesInfo>
                <ResourcesDetailLink>Xem chi tiết</ResourcesDetailLink>
              </ResourcesCard>
            </DashboardCol>
          </CardWrapper>
          <DashboardCol $span={1}></DashboardCol>
        </DashboardCol>
      </DashboardGrid>

      <CreateReportModal
        isOpen={isCreateReportModalOpen}
        onClose={() => setIsCreateReportModalOpen(false)}
        onSave={handleCreateReport}
      />
    </PersonalContainer>
  );
};

export default Personal;
