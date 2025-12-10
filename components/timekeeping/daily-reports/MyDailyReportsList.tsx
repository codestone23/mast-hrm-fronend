"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableColumn, Button, ConfirmDeleteModal, Pagination } from "@/components/common";
import { FileText, Edit, Trash2 } from "lucide-react";
import reportService from "@/services/report.service";
import { DailyReport, DailyReportStatus } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import CreateDailyReportModal from "./modals/CreateDailyReportModal";

const ITEMS_PER_PAGE = 10;

const MyDailyReportsList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["daily-reports", "my", "list", currentPage],
    queryFn: () =>
      reportService.getMyReports({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
  });

  const reports = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  const deleteMutation = useMutation({
    mutationFn: (reportId: number) => reportService.deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
      showSuccessToast("Xóa báo cáo thành công");
      setIsDeleteModalOpen(false);
      setSelectedReport(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err?.response?.data?.message || "Không thể xóa báo cáo");
    },
  });

  const handleEdit = (report: DailyReport) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const handleDelete = (report: DailyReport) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedReport) {
      deleteMutation.mutate(selectedReport.id);
    }
  };

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
      <span
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
          backgroundColor: `${config.color}20`,
          color: config.color,
        }}
      >
        {config.label}
      </span>
    );
  };

  const columns: TableColumn<DailyReport>[] = useMemo(
    () => [
      {
        key: "work_date",
        label: "Ngày",
        width: "120px",
        render: (_, row) => formatDate(row.work_date),
      },
      {
        key: "title",
        label: "Tiêu đề",
        width: "2fr",
        render: (_, row) => (
          <div style={{ fontWeight: 500, color: "#111827" }}>{row.title}</div>
        ),
      },
      {
        key: "project",
        label: "Dự án",
        width: "150px",
        render: (_, row) => (
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {row.project.name}
          </span>
        ),
      },
      {
        key: "actual_time",
        label: "Số giờ",
        width: "100px",
        align: "center",
        render: (_, row) => (
          <span style={{ fontWeight: 500 }}>{row.actual_time}h</span>
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
        width: "150px",
        align: "center",
        render: (_, row) => (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {row.status === DailyReportStatus.PENDING && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <span style={{ display: "none" }}>Sửa</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <span style={{ display: "none" }}>Xóa</span>
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [deleteMutation.isPending]
  );

  return (
    <>
      <Table
        columns={columns}
        data={reports}
        loading={isLoading}
        error={error as Error | null}
        emptyState={{
          icon: <FileText size={48} />,
          message: "Chưa có báo cáo nào",
        }}
        rowKey="id"
      />

      {pagination.total_pages > 1 && (
        <div style={{ marginTop: "16px" }}>
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            showInfo={true}
          />
        </div>
      )}

      {selectedReport && (
        <>
          <CreateDailyReportModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedReport(null);
            }}
            reportId={selectedReport.id}
            report={{
              project_id: selectedReport.project_id,
              work_date: selectedReport.work_date,
              actual_time: selectedReport.actual_time,
              title: selectedReport.title,
              description: selectedReport.description,
            }}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedReport(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Xóa báo cáo"
            message={`Bạn có chắc chắn muốn xóa báo cáo "${selectedReport.title}"?`}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </>
  );
};

export default MyDailyReportsList;
