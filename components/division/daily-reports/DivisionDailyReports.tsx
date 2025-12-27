"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Table, TableColumn, Button, Select, Pagination } from "@/components/common";
import { FileText, Check, X, CheckCheck, Search } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import reportService from "@/services/report.service";
import { DailyReport, DailyReportStatus, DailyReportListParams } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  SearchContainer,
  FilterRow,
  FilterItemSmall,
  FilterContainer,
  StatsRow,
  StatusBadge,
  TableCellText,
  TableCellTitle,
  TableCellHours,
  ActionsContainer,
  CheckboxInput,
  SelectedReportsBanner,
  SelectedCountText,
  SelectedActionsContainer,
  SelectedActionButton,
  PaginationWrapper,
  StatsText,
} from "./dailyReportsStyle";
import projectService from "@/services/project.service";
import { useDivisionMembers } from "@/hooks/useDivisionWorkforce";
import RejectDailyReportModal from "./modals/RejectDailyReportModal";
import { ITEMS_PER_PAGE } from "@/constants/constants";

const DivisionDailyReports: React.FC = () => {
  const isMobile = useMobile();
  const queryClient = useQueryClient();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<DailyReportStatus | undefined>(undefined);
  const [selectedReportIds, setSelectedReportIds] = useState<Set<number>>(new Set());
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const params: DailyReportListParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      user_id: userId,
      project_id: projectId,
      status: status,
      division_id: selectedDivisionId || undefined,
    }),
    [currentPage, userId, projectId, status, selectedDivisionId]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["daily-reports", "division", selectedDivisionId, params],
    queryFn: () => reportService.getReports(params),
    enabled: !!selectedDivisionId,
  });

  const reports = useMemo(() => data?.data || [], [data?.data]);
  const pagination = useMemo(() => data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  }, [data?.pagination]);

  // Fetch projects for filter
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "division", selectedDivisionId],
    queryFn: () => projectService.getProjectsAdmin(1, undefined, selectedDivisionId || undefined),
    enabled: !!selectedDivisionId,
  });

  const projects = useMemo(() => projectsData?.data || [], [projectsData?.data]);
  const projectOptions = useMemo(
    () => [
      { value: "", label: "Tất cả dự án" },
      ...projects.map((p) => ({
        value: String(p.id),
        label: p.name,
      })),
    ],
    [projects]
  );

  // Fetch users for filter
  const { data: membersData } = useDivisionMembers(
    selectedDivisionId,
    1,
    100,
    "",
    {}
  );

  const members = useMemo(() => membersData?.data || [], [membersData?.data]);
  const userOptions = useMemo(
    () => [
      { value: "", label: "Tất cả người tạo" },
      ...members.map((member) => ({
        value: String(member.user_id),
        label: `${member.code || ""} - ${member.name}`.trim(),
      })),
    ],
    [members]
  );

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: DailyReportStatus.PENDING, label: "Chờ duyệt" },
    { value: DailyReportStatus.APPROVED, label: "Đã duyệt" },
    { value: DailyReportStatus.REJECTED, label: "Đã từ chối" },
  ];

  const approveMutation = useMutation({
    mutationFn: (reportId: number) => reportService.approveReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Duyệt báo cáo thành công");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể duyệt báo cáo");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ reportId, reason }: { reportId: number; reason: string }) =>
      reportService.rejectReport(reportId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Từ chối báo cáo thành công");
      setIsRejectModalOpen(false);
      setSelectedReportIds(new Set());
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể từ chối báo cáo");
    },
  });

  const approveAllMutation = useMutation({
    mutationFn: (reportIds: number[]) => reportService.approveReportsByIds(reportIds, 'approve'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Duyệt tất cả báo cáo thành công");
      setSelectedReportIds(new Set());
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể duyệt báo cáo");
    },
  });

  const rejectAllMutation = useMutation({
    mutationFn: ({ reportIds, reason }: { reportIds: number[]; reason: string }) =>
      reportService.approveReportsByIds(reportIds, 'reject', reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Từ chối tất cả báo cáo thành công");
      setIsRejectModalOpen(false);
      setSelectedReportIds(new Set());
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể từ chối báo cáo");
    },
  });

  const handleApprove = useCallback((reportId: number) => {
    approveMutation.mutate(reportId);
  }, [approveMutation]);

  const handleReject = (reportId: number) => {
    setSelectedReportIds(new Set([reportId]));
    setIsRejectModalOpen(true);
  };

  const handleApproveAll = () => {
    if (selectedReportIds.size === 0) {
      showErrorToast("Vui lòng chọn ít nhất một báo cáo");
      return;
    }
    approveAllMutation.mutate(Array.from(selectedReportIds));
  };

  const handleRejectAll = () => {
    if (selectedReportIds.size === 0) {
      showErrorToast("Vui lòng chọn ít nhất một báo cáo");
      return;
    }
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (selectedReportIds.size === 1) {
      const reportId = Array.from(selectedReportIds)[0];
      rejectMutation.mutate({ reportId, reason });
    } else {
      rejectAllMutation.mutate({
        reportIds: Array.from(selectedReportIds),
        reason,
      });
    }
  };

  const toggleSelectReport = (reportId: number) => {
    setSelectedReportIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = useCallback(() => {
    const pendingReports = reports.filter((r) => r.status === DailyReportStatus.PENDING);
    const pendingReportIds = new Set(pendingReports.map((r) => r.id));
    
    // Check if all pending reports are selected
    const allPendingSelected = pendingReportIds.size > 0 && 
      Array.from(pendingReportIds).every((id) => selectedReportIds.has(id));
    
    if (allPendingSelected) {
      setSelectedReportIds(new Set());
    } else {
      setSelectedReportIds(pendingReportIds);
    }
  }, [reports, selectedReportIds]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: DailyReportStatus) => {
    const statusConfig = {
      PENDING: { color: "#FFA726", label: "Chờ duyệt" },
      APPROVED: { color: "#4CAF50", label: "Đã duyệt" },
      REJECTED: { color: "#EF5350", label: "Đã từ chối" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <StatusBadge $color={config.color}>
        {config.label}
      </StatusBadge>
    );
  };

  const columns: TableColumn<DailyReport>[] = useMemo(
    () => [
      {
        key: "select",
        label: (
          <CheckboxInput
            type="checkbox"
            checked={
              (() => {
                const pendingReports = reports.filter((r) => r.status === DailyReportStatus.PENDING);
                const pendingReportIds = new Set(pendingReports.map((r) => r.id));
                return pendingReportIds.size > 0 && 
                  Array.from(pendingReportIds).every((id) => selectedReportIds.has(id));
              })()
            }
            onChange={toggleSelectAll}
          />
        ),
        width: "50px",
        align: "center",
        render: (_, row) => {
          if (row.status !== DailyReportStatus.PENDING) {
            return null; 
          }
          return (
            <CheckboxInput
              type="checkbox"
              checked={selectedReportIds.has(row.id)}
              onChange={() => toggleSelectReport(row.id)}
              onClick={(e) => e.stopPropagation()}
            />
          );
        },
      },
      {
        key: "work_date",
        label: "Ngày",
        width: "120px",
        render: (_, row) => formatDate(row.work_date),
      },
      {
        key: "user",
        label: "Người tạo",
        width: "150px",
        render: (_, row) => (
          <TableCellText>
            {row.user.user_information.name}
          </TableCellText>
        ),
      },
      {
        key: "title",
        label: "Tiêu đề",
        width: "2fr",
        render: (_, row) => (
          <TableCellTitle>{row.title}</TableCellTitle>
        ),
      },
      {
        key: "project",
        label: "Dự án",
        width: "150px",
        render: (_, row) => (
          <TableCellText>
            {row.project.name}
          </TableCellText>
        ),
      },
      {
        key: "actual_time",
        label: "Số giờ",
        width: "100px",
        align: "center",
        render: (_, row) => (
          <TableCellHours>{row.actual_time}h</TableCellHours>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        width: "120px",
        align: "center",
        render: (_, row) => getStatusBadge(row.status),
      },
      {
        key: "actions",
        label: "Hành động",
        width: "200px",
        align: "center",
        render: (_, row) => (
          <ActionsContainer>
            {row.status === DailyReportStatus.PENDING && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Check size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(row.id);
                  }}
                  disabled={approveMutation.isPending}
                >
                  <span style={{ display: "none" }}>Duyệt</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(row.id);
                  }}
                  disabled={rejectMutation.isPending}
                >
                  <span style={{ display: "none" }}>Từ chối</span>
                </Button>
              </>
            )}
          </ActionsContainer>
        ),
      },
    ],
    [selectedReportIds, reports, approveMutation.isPending, rejectMutation.isPending, toggleSelectAll, handleApprove]
  );

  const emptyMessage = useMemo(() => {
    if (!selectedDivisionId) return "Vui lòng chọn phòng ban";
    if (debouncedSearch || userId || projectId || status) {
      return "Không tìm thấy báo cáo nào";
    }
    return "Chưa có báo cáo nào";
  }, [selectedDivisionId, debouncedSearch, userId, projectId, status]);

  return (
    <PersonalContainer>
      <DashboardGridAccount>
        <DashboardCol>
          <Card>
            <CardHeader>
              <IconWrapper>
                <FileText size={20} />
              </IconWrapper>
              <CardTitle>Quản lý báo cáo</CardTitle>
            </CardHeader>
            <FilterContainer>
              <SearchContainer $isMobile={isMobile}>
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                  fullWidth={true}
                />
              </SearchContainer>
              <FilterRow $isMobile={isMobile}>
                <FilterItemSmall $isMobile={isMobile}>
                  <Select
                    label="Lọc theo người tạo"
                    options={userOptions}
                    value={userId || ""}
                    onChange={(value) => {
                      setUserId(value === "" ? undefined : Number(value));
                      setCurrentPage(1);
                    }}
                    placeholder="Chọn người tạo"
                    fullWidth
                  />
                </FilterItemSmall>
                <FilterItemSmall $isMobile={isMobile}>
                  <Select
                    label="Lọc theo dự án"
                    options={projectOptions}
                    value={projectId || ""}
                    onChange={(value) => {
                      setProjectId(value === "" ? undefined : Number(value));
                      setCurrentPage(1);
                    }}
                    placeholder="Chọn dự án"
                    fullWidth
                  />
                </FilterItemSmall>
                <FilterItemSmall $isMobile={isMobile}>
                  <Select
                    label="Lọc theo trạng thái"
                    options={statusOptions}
                    value={status || ""}
                    onChange={(value) => {
                      setStatus(
                        value === "" ? undefined : (value as DailyReportStatus)
                      );
                      setCurrentPage(1);
                    }}
                    placeholder="Chọn trạng thái"
                    fullWidth
                  />
                </FilterItemSmall>
              </FilterRow>
              {selectedReportIds.size > 0 && (
                <FilterRow $isMobile={isMobile}>
                  <SelectedReportsBanner $isMobile={isMobile}>
                    <SelectedCountText $isMobile={isMobile}>
                      Đã chọn: {selectedReportIds.size} báo cáo
                    </SelectedCountText>
                    <SelectedActionsContainer $isMobile={isMobile}>
                      <SelectedActionButton $isMobile={isMobile}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<CheckCheck size={isMobile ? 14 : 16} />}
                          onClick={handleApproveAll}
                          disabled={approveAllMutation.isPending}
                          style={{ width: "100%" }}
                        >
                          Duyệt tất cả
                        </Button>
                      </SelectedActionButton>
                      <SelectedActionButton $isMobile={isMobile}>
                        <Button
                          variant="error"
                          size="sm"
                          icon={<X size={isMobile ? 14 : 16} />}
                          onClick={handleRejectAll}
                          disabled={rejectAllMutation.isPending}
                          style={{ width: "100%" }}
                        >
                          Từ chối tất cả
                        </Button>
                      </SelectedActionButton>
                    </SelectedActionsContainer>
                  </SelectedReportsBanner>
                </FilterRow>
              )}
              <StatsRow>
                <span>
                  Tổng số:{" "}
                  <StatsText>
                    {pagination.total || reports.length}
                  </StatsText>
                </span>
              </StatsRow>
            </FilterContainer>
          </Card>
        </DashboardCol>
        <DashboardCol $span={2}>
          <Card>
            <CardHeader>
              <IconWrapper>
                <FileText size={20} />
              </IconWrapper>
              <CardTitle>Danh sách báo cáo</CardTitle>
            </CardHeader>

            <Table
              columns={columns}
              data={reports}
              loading={isLoading}
              error={error as Error | null}
              emptyState={{
                icon: <FileText size={48} />,
                message: emptyMessage,
              }}
              rowKey="id"
            />

            {pagination.total_pages > 1 && (
              <PaginationWrapper>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                />
              </PaginationWrapper>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      <RejectDailyReportModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
        }}
        onConfirm={handleConfirmReject}
        count={selectedReportIds.size}
        isLoading={rejectMutation.isPending || rejectAllMutation.isPending}
      />
    </PersonalContainer>
  );
};

export default DivisionDailyReports;
