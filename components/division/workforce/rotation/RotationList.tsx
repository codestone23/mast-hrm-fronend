"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Pagination, Table, TableColumn, DatePicker } from "@/components/common";
import { RefreshCw } from "lucide-react";
import {
  PersonalContainer,
  DashboardGridAccount,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  DashboardCol,
  FilterContainer,
  FilterRow,
  FilterItemSmall,
  StatsRow,
  DivisionTransfer,
  DivisionName,
} from "./rotationStyle";
import divisionsService from "@/services/divisions.service";
import { RotationMember, RotationType } from "@/types/api";
import { useMobile } from "@/hooks/useMobile";
import RotationDetailModal from "./modals/RotationDetailModal";
import { ITEMS_PER_PAGE } from "@/constants/constants";

const fmtDate = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
};

const RotationList: React.FC = () => {
  const isMobile = useMobile();
  const selectedDivisionId = useSelector(
    (state: RootState) => state.division.selectedDivisionId
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedRotation, setSelectedRotation] = useState<RotationMember | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rotation-members", selectedDivisionId, currentPage, dateFrom, dateTo],
    queryFn: () =>
      divisionsService.getRotationMembers({
        division_id: selectedDivisionId!,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: RotationType.PERMANENT,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }),
    enabled: !!selectedDivisionId,
  });

  const tableData = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    current_page: 1,
    total_pages: 1,
    limit: ITEMS_PER_PAGE,
  };

  const handleRowClick = (rotation: RotationMember) => {
    setSelectedRotation(rotation);
    setIsDetailModalOpen(true);
  };

  const columns: TableColumn<RotationMember>[] = useMemo(
    () => [
      {
        key: "user",
        label: "Nhân viên",
        width: "200px",
        render: (_, row) => (
          <div>
            <div style={{ fontWeight: 500, color: "#111827" }}>
              {row.user?.user_information?.name || "N/A"}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {row.user?.email || ""}
            </div>
          </div>
        ),
      },
      {
        key: "transfer",
        label: "Luân chuyển từ",
        render: (_, row) => (
          <DivisionTransfer>
            <DivisionName>{row.from_division?.name || "N/A"}</DivisionName>
          </DivisionTransfer>
        ),
      },
      {
        key: "date_rotation",
        label: "Ngày luân chuyển",
        width: "140px",
        render: (value) => fmtDate(value as string),
      },
    ],
    []
  );

  const emptyMessage = useMemo(() => {
    if (!selectedDivisionId) return "Vui lòng chọn phòng ban";
    if (dateFrom || dateTo) return "Không tìm thấy bản ghi luân chuyển nào";
    return "Chưa có bản ghi luân chuyển nào";
  }, [selectedDivisionId, dateFrom, dateTo]);

  return (
    <>
      <DashboardGridAccount>
        <DashboardCol>
          <Card>
            <CardHeader>
              <IconWrapper>
                <RefreshCw size={20} />
              </IconWrapper>
              <CardTitle>Quản lý luân chuyển nhân sự</CardTitle>
            </CardHeader>
            <FilterContainer>
              <FilterRow $isMobile={isMobile}>
                <FilterItemSmall $isMobile={isMobile}>
                  <DatePicker
                    label="Từ ngày"
                    value={dateFrom}
                    onChange={(value) => {
                      setDateFrom(value?.toISOString() || "");
                      setCurrentPage(1);
                    }}
                    placeholder="Chọn ngày bắt đầu"
                  />
                </FilterItemSmall>
                <FilterItemSmall $isMobile={isMobile}>
                  <DatePicker
                    label="Đến ngày"
                    value={dateTo}
                    onChange={(value) => {
                      setDateTo(value?.toISOString() || "");
                      setCurrentPage(1);
                    }}
                    placeholder="Chọn ngày kết thúc"
                  />
                </FilterItemSmall>
              </FilterRow>
              <StatsRow>
                <span>
                  Tổng số:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {pagination.total || tableData.length}
                  </strong>
                </span>
              </StatsRow>
            </FilterContainer>
          </Card>
        </DashboardCol>
        <DashboardCol $span={2}>
          <Card>
            <CardHeader>
              <IconWrapper>
                <RefreshCw size={20} />
              </IconWrapper>
              <CardTitle>Danh sách luân chuyển</CardTitle>
            </CardHeader>

            <Table
              columns={columns}
              data={tableData}
              loading={isLoading}
              error={
                error ||
                (!selectedDivisionId
                  ? new Error("Vui lòng chọn phòng ban")
                  : null)
              }
              emptyState={{
                icon: <RefreshCw size={48} />,
                message: emptyMessage,
              }}
              onRowClick={handleRowClick}
              rowKey="id"
            />

            {pagination.total_pages > 1 && (
              <div style={{ marginTop: "16px" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  showInfo={true}
                />
              </div>
            )}
          </Card>
        </DashboardCol>
      </DashboardGridAccount>

      <RotationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRotation(null);
        }}
        rotationId={selectedRotation?.id || null}
      />
    </>
  );
};

export default RotationList;

