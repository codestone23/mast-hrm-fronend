"use client";

import React, { useState } from "react";
import {
    FileText,
    Calendar,
    Filter,
} from "lucide-react";
import { Select, DatePicker, Pagination, Loading } from "@/components/common";
import { useMyRequests } from "@/hooks/useRequests";
import { Request } from "@/services/requests.service";
import {
    RequestList,
    RequestItem,
    RequestHeader,
    RequestTitle,
    RequestStatus,
    RequestMeta,
    RequestMetaItem,
    ListRequestContainer,
    ListRequestHeader,
    ListRequestTitle,
    ListRequestSubtitle,
    ListRequestHighlight,
    FilterContainer,
    FilterLabel,
    FilterGroup,
    FilterItem,
    FilterActions,
    ResetFilterButton,
    EmptyStateContainer,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateDescription,
    RequestNote,
    RequestDescription,
    RequestRight,
} from "./modals/modalStyles";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/constants/enums";

interface MyRequestsListProps {
    onRequestClick?: (request: Request) => void;
}

const MyRequestsList: React.FC<MyRequestsListProps> = ({ onRequestClick }) => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        start_date: undefined,
        end_date: undefined,
    });

    const { data, isLoading } = useMyRequests(filters);

    const handleFilterChange = (key: string, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page when filter changes
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleResetFilters = () => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            status: "",
            start_date: undefined,
            end_date: undefined,
        }));
    };

    const getTypeLabel = (type: REQUEST_TYPE) => {
        const typeLabels: { [key in REQUEST_TYPE]: string } = {
            [REQUEST_TYPE.REMOTE_WORK]: "Làm việc từ xa",
            [REQUEST_TYPE.DAY_OFF]: "Nghỉ phép",
            [REQUEST_TYPE.OVERTIME]: "Làm thêm giờ",
            [REQUEST_TYPE.LATE_EARLY]: "Đi muộn/Về sớm",
            [REQUEST_TYPE.FORGOT_CHECKIN]: "Quên chấm công",
        };
        return typeLabels[type as REQUEST_TYPE] || type;
    };

    const getStatusLabel = (status: REQUEST_STATUS) => {
        const statusLabels: Record<REQUEST_STATUS, string> = {
            [REQUEST_STATUS.PENDING]: "Chờ duyệt",
            [REQUEST_STATUS.APPROVED]: "Đã duyệt",
            [REQUEST_STATUS.REJECTED]: "Bị từ chối",
        };
        return statusLabels[status] || status;
    };

    const getStatusColor = (status: REQUEST_STATUS) => {
        const statusColors: { [key in REQUEST_STATUS]: string } = {
            [REQUEST_STATUS.PENDING]: "#FFA726",
            [REQUEST_STATUS.APPROVED]: "#66BB6A",
            [REQUEST_STATUS.REJECTED]: "#EF5350",
        };
        return statusColors[status as REQUEST_STATUS] || "#666";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN");
    };

    const requests = data?.data || [];
    const pagination = data?.pagination;

    return (
        <ListRequestContainer>
            <ListRequestHeader>
                <div>
                    <ListRequestTitle>
                        Danh sách đề xuất của tôi
                    </ListRequestTitle>
                    <ListRequestSubtitle>
                        Tổng cộng{" "}
                        <ListRequestHighlight>
                            {pagination?.total || 0}
                        </ListRequestHighlight>{" "}
                        đề xuất
                    </ListRequestSubtitle>
                </div>
            </ListRequestHeader>

            <FilterContainer>
                <FilterGroup>
                    <FilterItem>
                        <Filter size={16} />
                        <FilterLabel>Trạng thái</FilterLabel>
                        <Select
                            fullWidth={false}
                            value={filters.status}
                            onChange={(value) =>
                                handleFilterChange("status", value)
                            }
                            options={[
                                { value: "", label: "Tất cả" },
                                {
                                    value: REQUEST_STATUS.PENDING,
                                    label: "Chờ duyệt",
                                },
                                {
                                    value: REQUEST_STATUS.APPROVED,
                                    label: "Đã duyệt",
                                },
                                {
                                    value: REQUEST_STATUS.REJECTED,
                                    label: "Từ chối",
                                },
                            ]}
                        />
                    </FilterItem>

                    <FilterItem>
                        <FilterLabel>Từ ngày</FilterLabel>
                        <DatePicker
                            value={filters.start_date || undefined}
                            onChange={(d) =>
                                handleFilterChange(
                                    "start_date",
                                    d ? d.toISOString().split("T")[0] : ""
                                )
                            }
                        />
                    </FilterItem>

                    <FilterItem>
                        <FilterLabel>Đến ngày</FilterLabel>
                        <DatePicker
                            value={filters.end_date || undefined}
                            onChange={(d) =>
                                handleFilterChange(
                                    "end_date",
                                    d ? d.toISOString().split("T")[0] : ""
                                )
                            }
                        />
                    </FilterItem>
                </FilterGroup>

                <FilterActions>
                    <ResetFilterButton onClick={handleResetFilters}>
                        Xóa bộ lọc
                    </ResetFilterButton>
                </FilterActions>
            </FilterContainer>

            {isLoading ? (
                <ListRequestContainer>
                    <Loading />
                </ListRequestContainer>
            ) : (
                <>
                    {requests.length === 0 ? (
                        <EmptyStateContainer>
                            <EmptyStateIcon>
                                <FileText size={48} />
                            </EmptyStateIcon>
                            <EmptyStateTitle>
                                Chưa có đề xuất nào
                            </EmptyStateTitle>
                            <EmptyStateDescription>
                                Bạn chưa tạo đề xuất nào hoặc không có đề xuất
                                nào phù hợp với bộ lọc hiện tại.
                            </EmptyStateDescription>
                        </EmptyStateContainer>
                    ) : (
                        <>
                            <RequestList>
                                {requests.map((request) => (
                                    <RequestItem
                                        $status={request.status}
                                        key={request.id}
                                        onClick={() =>
                                            onRequestClick?.(request)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        <RequestHeader>
                                            <div>
                                                <RequestTitle>
                                                    Loại:{" "}
                                                    {getTypeLabel(
                                                        request.request_type as REQUEST_TYPE
                                                    )}
                                                </RequestTitle>
                                                <RequestNote>
                                                    Tiêu đề: {request.title}
                                                </RequestNote>
                                                <RequestDescription>
                                                    Lý do: {request.reason}
                                                </RequestDescription>
                                            </div>
                                            <RequestRight>
                                                <RequestStatus
                                                    $color={getStatusColor(
                                                        request.status
                                                    )}
                                                >
                                                    {getStatusLabel(
                                                        request.status
                                                    )}
                                                </RequestStatus>
                                                <RequestMeta>
                                                    <RequestMetaItem>
                                                        <Calendar size={14} />
                                                        <span>
                                                            {formatDate(
                                                                request.work_date
                                                            )}
                                                        </span>
                                                    </RequestMetaItem>
                                                    <RequestMetaItem>
                                                        <span>•</span>
                                                        <span>
                                                            Ngày gửi:{" "}
                                                            {formatDateTime(
                                                                request.created_at
                                                            )}
                                                        </span>
                                                    </RequestMetaItem>
                                                </RequestMeta>
                                            </RequestRight>
                                        </RequestHeader>
                                    </RequestItem>
                                ))}
                            </RequestList>

                            {pagination && pagination.total_pages > 1 && (
                                <Pagination
                                    currentPage={filters.page}
                                    totalPages={pagination.total_pages}
                                    totalItems={pagination.total}
                                    itemsPerPage={filters.limit}
                                    onPageChange={handlePageChange}
                                    showPageNumbers={true}
                                    maxVisiblePages={5}
                                    showInfo={true}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </ListRequestContainer>
    );
};

export default MyRequestsList;
