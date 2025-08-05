"use client";

import React from "react";
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
import {
  PersonalContainer,
  DashboardGrid,
  Card,
  WelcomeCard,
  WelcomeContent,
  ProfileCard,
  ProfileAvatar,
  ProfileInfo,
  ProgressBar,
  StatsCard,
  StatsNumber,
  StatsGrid,
  AttendanceCard,
  AttendanceStatus,
  MetricsList,
  ResourcesCard,
  EffortSection,
  NoDataMessage,
  CardHeader,
  CardTitle,
  CardLink,
  IconWrapper,
  ProfileDetail,
  ProgressText,
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
  EffortNote,
  ResourcesInfo,
  ResourcesDetailLink,
  ReportHeader,
  ReportTitleWrapper,
  ReportButton,
  FollowingHeader,
  FollowingTitle,
} from "./personalStyle";

const Personal: React.FC = () => {
  const currentMonth = new Date().toLocaleDateString("vi-VN", {
    month: "2-digit",
    year: "numeric",
  });

  return (
    <PersonalContainer>
      <DashboardGrid>
        <WelcomeCard>
          <WelcomeContent>
            <h3>Cảm ơn sự đồng hành của bạn với MAST - HRM</h3>
            <p>Ngày vào công ty: 03/06/2024 (429 ngày)</p>
          </WelcomeContent>
        </WelcomeCard>

        <ProfileCard>
          <ProfileAvatar>
            <User size={32} color="white" />
          </ProfileAvatar>
          <ProfileInfo>
            <h3>Nguyễn Văn C</h3>
            <p>cuong.nguyenvan@mast.vn</p>
            <div className="role">Developer - Mast</div>
            <ProfileDetail marginTop="0.5rem">
              Người quản lý: <strong>Nguyễn Văn DD</strong>
            </ProfileDetail>
            <ProfileDetail marginTop="0.75rem" fontSize="0.8rem" opacity={0.9}>
              Hoàn thiện hồ sơ
            </ProfileDetail>
            <ProgressBar>
              <div className="fill" style={{ width: "100%" }}></div>
            </ProgressBar>
            <ProgressText marginTop="0.25rem" textAlign="right">
              100%
            </ProgressText>
          </ProfileInfo>
        </ProfileCard>

        <StatsCard>
          <StatsHeader>
            <IconWrapper>
              <FileText size={20} />
            </IconWrapper>
            <CardTitle>My request</CardTitle>
            <CardLink>Xem chi tiết</CardLink>
          </StatsHeader>
          <StatsGrid>
            <div className="stat-item">
              <div className="number">203</div>
              <div className="label">Tổng request</div>
            </div>
            <div className="stat-item">
              <div className="number">0</div>
              <div className="label">Đang xử lý</div>
            </div>
            <div className="stat-item">
              <div className="number">203</div>
              <div className="label">Đã xử lý</div>
            </div>
          </StatsGrid>
          <StatsNewest>
            <StatsNewestLabel>Mới nhất</StatsNewestLabel>
          </StatsNewest>
        </StatsCard>

        <AttendanceCard>
          <div className="title">
            <Clock size={20} color="#3b82f6" />
            Chấm công ngày hôm nay
          </div>
          <AttendanceStatus>
            <div className="date">05/08 - Công: 8 - Muộn: 0</div>
            <div className="status">
              <span className="in">In: N/A</span>
              <span className="out">Out: N/A</span>
            </div>
          </AttendanceStatus>
        </AttendanceCard>

        <Card>
          <WorkStatsContainer>
            <WorkStatsHeader>
              <IconWrapper>
                <Calendar size={20} />
              </IconWrapper>
              <CardTitle>Chấm công</CardTitle>
              <WorkStatsMonth>{currentMonth}</WorkStatsMonth>
            </WorkStatsHeader>
            <MetricsList>
              <div className="metric-item success">
                <div className="label">
                  <TrendingUp size={16} />
                  Tổng số công
                </div>
                <div className="value">24/168</div>
              </div>
              <div className="metric-item">
                <div className="label">
                  <AlertCircle size={16} />
                  Số giờ OT
                </div>
                <div className="value">0</div>
              </div>
              <div className="metric-item warning">
                <div className="label">
                  <AlertCircle size={16} />
                  Số phút muộn
                </div>
                <div className="value">0</div>
              </div>
              <div className="metric-item">
                <div className="label">Quý phút đi muộn, về sớm</div>
                <div className="value">0/120</div>
              </div>
              <div className="metric-item">
                <div className="label">
                  <CheckCircle size={16} />
                  Tiền phạt
                </div>
                <div className="value">0</div>
              </div>
              <div className="metric-item">
                <div className="label">Nghỉ có lương (h)</div>
                <div className="value">8</div>
              </div>
              <div className="metric-item">
                <div className="label">Nghỉ không lương (h)</div>
                <div className="value">0</div>
              </div>
            </MetricsList>
          </WorkStatsContainer>
        </Card>

        <StatsCard>
          <StatsHeader>
            <IconWrapper>
              <Calendar size={20} />
            </IconWrapper>
            <CardTitle>Số giờ phép còn lại</CardTitle>
          </StatsHeader>
          <StatsNumber style={{ color: "var(--primary-600)" }}>14</StatsNumber>
        </StatsCard>

        <Card>
          <CardHeader>
            <IconWrapper>
              <BarChart3 size={20} />
            </IconWrapper>
            <CardTitle>Tài sản số hữu</CardTitle>
          </CardHeader>
          <AssetsGradientBox>
            <AssetsNumber>5</AssetsNumber>
            <AssetsLabel>Tổng số tài sản</AssetsLabel>
          </AssetsGradientBox>
          <AssetsListContainer>
            <AssetsListTitle>
              <strong>Tên tài sản</strong>
            </AssetsListTitle>
            <AssetsItem marginBottom="0.25rem">Bàn Phím</AssetsItem>
            <AssetsItem marginBottom="0.25rem">Màn hình AOC 24B1XH</AssetsItem>
            <AssetsItem>PC I5-10400/16GB/256</AssetsItem>
          </AssetsListContainer>
        </Card>

        <ResourcesCard>
          <ResourcesHeader>
            <ResourcesTitle>My resources</ResourcesTitle>
            <ResourcesLink>Xem chi tiết</ResourcesLink>
          </ResourcesHeader>
          <EffortSection>
            <EffortDateLabel>Effort ngày 05/08/2025</EffortDateLabel>
            <EffortDisplay>
              <EffortNumber>01</EffortNumber>
              <EffortLabel>Dự án</EffortLabel>
              <EffortPercentage>100%</EffortPercentage>
              <EffortText>Effort</EffortText>
            </EffortDisplay>
          </EffortSection>
          <EffortSection>
            <EffortDateLabel>Effort tháng 08/2025</EffortDateLabel>
            <EffortDisplay>
              <EffortNumber>01</EffortNumber>
              <EffortLabel>Dự án</EffortLabel>
              <EffortPercentage color="var(--warning-500)">50%</EffortPercentage>
              <EffortText>Effort</EffortText>
            </EffortDisplay>
            <EffortNote>Xử lý gấp</EffortNote>
          </EffortSection>
          <ResourcesInfo marginBottom="0.5rem">
            Outsource - NBM: <strong>100%</strong>
          </ResourcesInfo>
          <ResourcesDetailLink>Xem chi tiết</ResourcesDetailLink>
          <NoDataMessage>Không có dữ liệu</NoDataMessage>
        </ResourcesCard>

        <Card>
          <ReportHeader>
            <ReportTitleWrapper>
              <IconWrapper>
                <BarChart3 size={20} />
              </IconWrapper>
              <CardTitle>Báo cáo hôm nay</CardTitle>
            </ReportTitleWrapper>
            <ReportButton>+ Report</ReportButton>
          </ReportHeader>
          <NoDataMessage>Không có dữ liệu</NoDataMessage>
        </Card>

        <Card>
          <FollowingHeader>
            <FollowingTitle>Đang theo dõi</FollowingTitle>
          </FollowingHeader>
          <NoDataMessage>Không có dữ liệu</NoDataMessage>
        </Card>
      </DashboardGrid>
    </PersonalContainer>
  );
};

export default Personal;
