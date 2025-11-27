"use client";

import React, { useState } from "react";
import {
    FileText,
    Calendar,
    Filter,
    Edit,
    Trash2,
} from "lucide-react";
import { Select, DatePicker, Pagination, Loading, ConfirmDeleteModal } from "@/components/common";
import { useMyRequests } from "@/hooks/useRequests";
import { Request } from "@/services/requests.service";
import requestsService from "@/services/requests.service";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
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
    onEditRequest?: (request: Request) => void;
}

// Helper function to map REQUEST_TYPE to API endpoint type
const getRequestTypeEndpoint = (requestType: REQUEST_TYPE): string => {
    const typeMap: Record<REQUEST_TYPE, string> = {
        [REQUEST_TYPE.REMOTE_WORK]: "remote-work",
        [REQUEST_TYPE.DAY_OFF]: "day-off",
        [REQUEST_TYPE.OVERTIME]: "overtime",
        [REQUEST_TYPE.LATE_EARLY]: "late-early",
        [REQUEST_TYPE.FORGOT_CHECKIN]: "forgot-checkin",
    };
    return typeMap[requestType] || requestType.toLowerCase();
};

const MyRequestsList: React.FC<MyRequestsListProps> = ({ onRequestClick, onEditRequest }) => {
    const queryClient = useQueryClient();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: undefined,
        start_date: undefined,
        end_date: undefined,
    });
    const [deleteRequestId, setDeleteRequestId] = useState<{ type: string; id: number } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, isLoading } = useMyRequests(filters);

    const handleFilterChange = (key: string, value: string | number | undefined) => {
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
            status: undefined,
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

    const handleDeleteRequest = async () => {
        if (!deleteRequestId) return;

        setIsDeleting(true);
        try {
            await requestsService.deleteRequest(deleteRequestId.type, String(deleteRequestId.id));
            showSuccessToast("Xóa đề xuất thành công");
            queryClient.invalidateQueries({ queryKey: ["myRequests"] });
            setIsDeleteModalOpen(false);
            setDeleteRequestId(null);
        } catch (error) {
            showErrorToast("Có lỗi xảy ra khi xóa đề xuất");
            console.error("Error deleting request:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditRequest = (request: Request) => {
        // Mở modal cập nhật tương ứng với loại request
        onEditRequest?.(request);
    };

    const handleDeleteClick = (e: React.MouseEvent, request: Request) => {
        e.stopPropagation();
        const endpointType = getRequestTypeEndpoint(request.request_type as REQUEST_TYPE);
        setDeleteRequestId({ type: endpointType, id: request.id });
        setIsDeleteModalOpen(true);
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
                                handleFilterChange("status", !value ? undefined : value)
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
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                                    <RequestStatus
                                                        $color={getStatusColor(
                                                            request.status
                                                        )}
                                                    >
                                                        {getStatusLabel(
                                                            request.status
                                                        )}
                                                    </RequestStatus>
                                                    {request.status === REQUEST_STATUS.PENDING && (
                                                        <button
                                                            onClick={(e) => handleDeleteClick(e, request)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                padding: "6px",
                                                                border: "none",
                                                                background: "#ef4444",
                                                                color: "white",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = "#dc2626";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = "#ef4444";
                                                            }}
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                    {request.status === REQUEST_STATUS.REJECTED && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditRequest(request);
                                                            }}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                padding: "6px",
                                                                border: "none",
                                                                background: "#3b82f6",
                                                                color: "white",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = "#2563eb";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = "#3b82f6";
                                                            }}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                    )}
                                                </div>
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

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (!isDeleting) {
                        setIsDeleteModalOpen(false);
                        setDeleteRequestId(null);
                    }
                }}
                onConfirm={handleDeleteRequest}
                title="Xóa đề xuất"
                message="Bạn có chắc chắn muốn xóa đề xuất này? Hành động này không thể hoàn tác."
            />
        </ListRequestContainer>
    );
};

export default MyRequestsList;
