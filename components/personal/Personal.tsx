/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Clock,
  User,
  FileText,
  Calendar,
  AlertCircle,
  TrendingUp,
  BarChart3,
	Newspaper,
	ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  DashboardCol,
  ButtonDetail,
  ProfileDetailRight,
  CardWrapper,
	NewsSidebar,
	NewsSidebarHeader,
	NewsSidebarTitle,
	NewsSidebarList,
	NewsSidebarItem,
	NewsSidebarItemTitle,
	NewsSidebarItemContent,
	NewsSidebarItemMeta,
	NewsSidebarViewMore,
	NewsSidebarEmpty,
	NewsSidebarLoading,
	ContainerDashboard,
} from "./personalStyle";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import { usePersonal } from "./usePersonal";
import { usePersonalAttendanceStats as usePersonalAttendanceStats } from "../../hooks/useAttendanceStats";
import newsService from "@/services/news.service";
import { NewsStatus } from "@/types/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Loading } from "@/components/common";

const Personal: React.FC = () => {
  const router = useRouter();
  const { user } = usePersonal();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: attendanceReport, isLoading: isLoadingReport } =
    usePersonalAttendanceStats({
      start_date: startOfMonth.toISOString().split("T")[0],
      end_date: endOfMonth.toISOString().split("T")[0],
		});

	// Fetch latest 3 approved news
	const { data: newsData, isLoading: isLoadingNews } = useQuery({
		queryKey: ["latestNews", NewsStatus.APPROVED],
		queryFn: () =>
			newsService.getNews(1, 3, undefined, NewsStatus.APPROVED),
    });

  const currentMonth = new Date().toLocaleDateString("vi-VN", {
    month: "2-digit",
    year: "numeric",
  });

  const formatTime = (dateTimeString: string | null | undefined): string => {
    if (!dateTimeString) return "00:00";

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "00:00";

      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return "00:00";
    }
  };

  const formatDate = (dateTimeString: string | null | undefined): string => {
    if (!dateTimeString) return new Date().toLocaleDateString("vi-VN");

    try {
      const date = new Date(dateTimeString);
			if (isNaN(date.getTime()))
				return new Date().toLocaleDateString("vi-VN");

      return date.toLocaleDateString("vi-VN");
    } catch {
      return new Date().toLocaleDateString("vi-VN");
    }
  };

  const formatWorkTime = (minutes: number | null | undefined): string => {
    if (!minutes || minutes === 0) return "0h 0m";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;

    return `${hours}h ${remainingMinutes}m`;
  };

	const formatNewsDate = (dateString: string) => {
		try {
			return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
		} catch {
			return dateString;
		}
	};

	const stripHtml = (html: string) => {
		if (typeof document === "undefined") {
			return html.replace(/<[^>]*>/g, "").trim();
		}
		const tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	};

  // Helper function để lấy dữ liệu thống kê từ API
  const getAttendanceStatsData = () => {
    if (isLoadingReport) {
      return {
        totalWorkDays: "...",
        overtimeHours: "...",
        lateMinutes: "...",
        violationTime: "...",
        paidLeaveHours: "...",
        unpaidLeaveHours: "...",
      };
    }

    if (attendanceReport) {
      return {
        totalWorkDays: attendanceReport.total_work_days || "0/0",
        overtimeHours: attendanceReport.overtime_hours || 0,
        lateMinutes: attendanceReport.late_minutes || 0,
        violationTime: attendanceReport.violation_time || "0/0",
        paidLeaveHours: attendanceReport.paid_leave_hours || 0,
        unpaidLeaveHours: attendanceReport.unpaid_leave_hours || 0,
      };
    }

    // Default values when no data
    return {
      totalWorkDays: "0/0",
      overtimeHours: 0,
      lateMinutes: 0,
      violationTime: "0/0",
      paidLeaveHours: 0,
      unpaidLeaveHours: 0,
    };
  };

  const statsData = getAttendanceStatsData();

  const handleClickDetail = () => {
    router.push(ROUTERS.PERSONAL.INFO);
  };

	const handleNewsClick = (newsId: number | string) => {
		router.push(`${ROUTERS.PERSONAL.NEWS}/${newsId}`);
	};

  const getJoinDate = () => {
    const totalDays = Math.floor(
      (new Date().getTime() - new Date(user?.join_date || "").getTime()) / 
        (1000 * 60 * 60 * 24)
    );
    if (user?.join_date) {
			return `Ngày gia nhập: ${user?.join_date?.split("T")[0]
      } (${totalDays} ngày)`;
    }
    return `Ngày gia nhập: ${new Date().toLocaleDateString(
      "vi-VN"
    )} (${totalDays} ngày)`;
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
            <div className="date">
							{formatDate(user?.today_attendance?.checkin)} -
							Công:{" "}
							{formatWorkTime(
								user?.today_attendance?.total_work_time
							)}{" "}
							- Muộn: {user?.today_attendance?.late_time || 0}{" "}
							phút
            </div>
            <div className="status">
              <span className="in">
								Vào:{" "}
								{formatTime(user?.today_attendance?.checkin)}
              </span>
              <span className="out">
								Ra:{" "}
								{formatTime(user?.today_attendance?.checkout)}
              </span>
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
          <StatsNumber className="large">
            {user?.remaining_leave_days || 0}
          </StatsNumber>
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
						<AssetsNumber>
							{user?.assigned_devices?.length || 0}
						</AssetsNumber>
						<AssetsLabel>Tổng số thiết bị</AssetsLabel>
					</AssetsGradientBox>
					<AssetsListContainer>
						<AssetsListTitle>
							<strong>Danh sách thiết bị</strong>
						</AssetsListTitle>
						{user?.assigned_devices
							?.slice(0, 3)
							.map((device: any) => (
								<AssetsItem
									$marginBottom="0.25rem"
									key={device.id}
								>
									{device.name}
								</AssetsItem>
							))}
						{user?.assigned_devices?.length &&
							user?.assigned_devices?.length > 3 && (
								<div
									style={{
										fontStyle: "italic",
										color: "var(--text-muted)",
									}}
								>
									...
								</div>
							)}
					</AssetsListContainer>
				</Card>
      </DashboardCol>
    );
  };

  return (
    <PersonalContainer>
			<ContainerDashboard>
      <DashboardGrid>
        {renderHeader()}
					<DashboardCol>
          <ProfileCard>
            <ProfileAvatar>
              <User size={32} color="white" />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileDetail>
                <h3>{user?.user_information?.name}</h3>
                <p>{user?.user_information?.email}</p>
									<div className="role">
										{user?.user_information?.expertise}
									</div>
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
            <DashboardCol>
              <Card>
                <WorkStatsContainer>
                  <WorkStatsHeader>
                    <IconWrapper>
                      <Calendar size={20} />
                    </IconWrapper>
										<CardTitle>
											Thống kê chấm công
										</CardTitle>
										<WorkStatsMonth>
											{currentMonth}
										</WorkStatsMonth>
                  </WorkStatsHeader>
                  <MetricsList>
                    <div className="metric-item success">
                      <div className="label">
                        <TrendingUp size={16} />
                        Tổng số công
                      </div>
											<div className="value">
												{statsData.totalWorkDays}
											</div>
                    </div>
                    <div className="metric-item">
                      <div className="label">
                        <AlertCircle size={16} />
                        Số giờ làm thêm
                      </div>
											<div className="value">
												{statsData.overtimeHours}
											</div>
                    </div>
                    <div
											className={`metric-item ${typeof statsData.lateMinutes ===
												"number" &&
                        statsData.lateMinutes > 0
                          ? "warning"
                          : ""
                      }`}
                    >
                      <div className="label">
                        <AlertCircle size={16} />
                        Số phút muộn
                      </div>
											<div className="value">
												{statsData.lateMinutes}
											</div>
                    </div>
                    <div className="metric-item">
											<div className="label">
												Thời gian vi phạm
											</div>
											<div className="value">
												{statsData.violationTime}
											</div>
                    </div>
                    <div className="metric-item">
											<div className="label">
												Nghỉ có phép (giờ)
											</div>
											<div className="value">
												{statsData.paidLeaveHours}
											</div>
                    </div>
                    <div className="metric-item">
											<div className="label">
												Nghỉ không phép (giờ)
											</div>
											<div className="value">
												{statsData.unpaidLeaveHours}
											</div>
                    </div>
                  </MetricsList>
                </WorkStatsContainer>
              </Card>
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
										<div className="label">
											Tổng yêu cầu
										</div>
                  </div>
                  <div className="stat-item">
                    <div className="number">2</div>
										<div className="label">
											Đang xử lý
										</div>
                  </div>
                  <div className="stat-item">
                    <div className="number">10</div>
										<div className="label">
											Đã xử lý
										</div>
                  </div>
                </StatsGrid>
                <StatsNewest>
									<StatsNewestLabel>
										Cập nhật mới nhất
									</StatsNewestLabel>
                </StatsNewest>
              </Card>
						</DashboardCol>
					</DashboardCol>

					<DashboardCol>
						<NewsSidebar>
							<NewsSidebarHeader>
								<NewsSidebarTitle>
									<Newspaper size={20} />
									Tin tức mới nhất
								</NewsSidebarTitle>
                <NewsSidebarViewMore
										onClick={() =>
											router.push(ROUTERS.PERSONAL.NEWS)
										}
									>
										Xem thêm
										<ArrowRight
											size={16}
                        style={{
												marginLeft: "0.5rem",
												display: "inline",
											}}
										/>
									</NewsSidebarViewMore>
							</NewsSidebarHeader>
							{isLoadingNews ? (
								<NewsSidebarLoading>
									<Loading />
								</NewsSidebarLoading>
							) : !newsData?.data || newsData.data.length === 0 ? (
								<NewsSidebarEmpty>
									<FileText
										size={32}
										style={{
											marginBottom: "0.5rem",
											opacity: 0.5,
										}}
									/>
									<p>Chưa có tin tức nào</p>
								</NewsSidebarEmpty>
							) : (
								<>
									<NewsSidebarList>
										{newsData.data.slice(0, 3).map((news) => (
											<NewsSidebarItem
												key={news.id}
												onClick={() => handleNewsClick(news.id)}
											>
												<NewsSidebarItemTitle>
													{news.title}
												</NewsSidebarItemTitle>
												<NewsSidebarItemContent>
													{stripHtml(news.content)}
												</NewsSidebarItemContent>
												<NewsSidebarItemMeta>
													<span>
														<Calendar
															size={12}
															style={{
																display: "inline",
																marginRight: "0.25rem",
															}}
														/>
														{formatNewsDate(
															news.created_at
														)}
													</span>
													<span>
														<User
															size={12}
															style={{
																display: "inline",
																marginRight: "0.25rem",
															}}
														/>
														{news.authorName ||
															news.author
																?.user_information
																?.name ||
															"Không xác định"}
													</span>
												</NewsSidebarItemMeta>
											</NewsSidebarItem>
										))}
									</NewsSidebarList>
								</>
							)}
						</NewsSidebar>
        </DashboardCol>
      </DashboardGrid>

			</ContainerDashboard>
    </PersonalContainer>
  );
};

export default Personal;
