"use client";

import React, { useState } from "react";
import {
    FileText,
    Calendar,
    User,
    Filter,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Select, DatePicker, Pagination, Loading } from "@/components/common";
import {
    useAdminRequests,
    useApproveRequest,
    useRejectRequest,
} from "@/hooks/useRequests";
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
    RequestActions,
    ApproveButton,
    RejectButton,
    RequestNote,
    RequestDescription,
    RequestLeft,
    RequestRight,
} from "./modals/modalStyles";
import RejectModal from "./modals/RejectModal";
import { REQUEST_STATUS, REQUEST_TYPE } from "@/constants/enums";

interface AdminRequestsListProps {
    onRequestClick?: (request: Request) => void;
}

const AdminRequestsList: React.FC<AdminRequestsListProps> = ({
    onRequestClick,
}) => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        start_date: undefined,
        end_date: undefined,
    });

    const [rejectModal, setRejectModal] = useState<{
        isOpen: boolean;
        request: Request | null;
    }>({
        isOpen: false,
        request: null,
    });

    const { data, isLoading } = useAdminRequests(filters);
    const approveMutation = useApproveRequest();
    const rejectMutation = useRejectRequest();

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

    const handleApprove = (request: Request, e: React.MouseEvent) => {
        e.stopPropagation();
        approveMutation.mutate({
            type: request.type,
            id: request.id.toString(),
        });
    };

    const handleReject = (request: Request, e: React.MouseEvent) => {
        e.stopPropagation();
        setRejectModal({ isOpen: true, request });
    };

    const handleConfirmReject = (reason: string) => {
        if (rejectModal.request) {
            rejectMutation.mutate({
                type: rejectModal.request.type,
                id: rejectModal.request.id.toString(),
                payload: { rejected_reason: reason },
            });
        }
    };

    const getTypeLabel = (type: REQUEST_TYPE) => {
        switch (type.toUpperCase()) {
            case REQUEST_TYPE.REMOTE_WORK:
                return "Làm việc từ xa";
            case REQUEST_TYPE.DAY_OFF:
                return "Nghỉ phép";
            case REQUEST_TYPE.OVERTIME:
                return "Làm thêm giờ";
            case REQUEST_TYPE.LATE_EARLY:
                return "Đi muộn/Về sớm";
            case REQUEST_TYPE.FORGOT_CHECKIN:
                return "Quên chấm công";
        }
        return "";
    };

    const getStatusLabel = (status: REQUEST_STATUS) => {
        switch (status.toUpperCase()) {
            case REQUEST_STATUS.PENDING:
                return "Chờ duyệt";
            case REQUEST_STATUS.APPROVED:
                return "Đã duyệt";
            case REQUEST_STATUS.REJECTED:
                return "Từ chối";
        }
        return status;
    };

    const getStatusColor = (status: REQUEST_STATUS) => {
        switch (status.toUpperCase()) {
            case REQUEST_STATUS.PENDING:
                return "#FFA726";
            case REQUEST_STATUS.APPROVED:
                return "#66BB6A";
            case REQUEST_STATUS.REJECTED:
                return "#EF5350";
        }
        return "";
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
        <>
            <ListRequestContainer>
                <ListRequestHeader>
                    <div>
                        <ListRequestTitle>Danh sách đề xuất</ListRequestTitle>
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
                                    Không có đề xuất nào phù hợp với bộ lọc hiện
                                    tại.
                                </EmptyStateDescription>
                            </EmptyStateContainer>
                        ) : (
                            <>
                                <RequestList>
                                    {requests.map((request) => (
                                        <RequestItem
                                            key={request.id}
                                            $status={request.status as REQUEST_STATUS}
                                            onClick={() =>
                                                onRequestClick?.(request)
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <RequestHeader>
                                                <RequestLeft>
                                                    <RequestTitle>
                                                        Loại:{" "}
                                                        {getTypeLabel(
                                                            request.type as REQUEST_TYPE
                                                        )}
                                                    </RequestTitle>
                                                    <RequestNote>
                                                        Tiêu đề: {request.title}
                                                    </RequestNote>
                                                    <RequestDescription>
                                                        Lý do: {request.reason}
                                                    </RequestDescription>
                                                    <RequestMetaItem>
                                                        <User size={14} /> Người
                                                        gửi:
                                                        <span>
                                                            {
                                                                request.user
                                                                    .user_information
                                                                    .name
                                                            }
                                                        </span>
                                                    </RequestMetaItem>
                                                    <RequestMetaItem>
                                                        <Calendar size={14} />
                                                        <span>
                                                            {formatDate(
                                                                request.work_date
                                                            )}
                                                        </span>
                                                    </RequestMetaItem>
                                                    <RequestMetaItem>
                                                        <span>
                                                            THời gian tạo:{" "}
                                                            {formatDateTime(
                                                                request.created_at
                                                            )}
                                                        </span>
                                                    </RequestMetaItem>
                                                </RequestLeft>
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
                                                </RequestRight>
                                            </RequestHeader>

                                            {request.status ===
                                                REQUEST_STATUS.PENDING && (
                                                <RequestActions>
                                                    <ApproveButton
                                                        onClick={(e) =>
                                                            handleApprove(
                                                                request,
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            approveMutation.isPending
                                                        }
                                                    >
                                                        <CheckCircle
                                                            size={16}
                                                        />
                                                        Duyệt
                                                    </ApproveButton>
                                                    <RejectButton
                                                        onClick={(e) =>
                                                            handleReject(
                                                                request,
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            rejectMutation.isPending
                                                        }
                                                    >
                                                        <XCircle size={16} />
                                                        Từ chối
                                                    </RejectButton>
                                                </RequestActions>
                                            )}
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

            <RejectModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal({ isOpen: false, request: null })}
                onConfirm={handleConfirmReject}
                isLoading={rejectMutation.isPending}
                error={
                    rejectMutation.isError
                        ? "Có lỗi xảy ra khi từ chối đề xuất"
                        : undefined
                }
                title="Từ chối đề xuất"
                subtitle={`Bạn đang từ chối đề xuất "${
                    rejectModal.request?.title || ""
                }" của ${
                    rejectModal.request?.user?.user_information?.name || ""
                }`}
                placeholder="Nhập lý do từ chối đề xuất này..."
                confirmText="Xác nhận từ chối"
                cancelText="Hủy"
            />
        </>
    );
};

export default AdminRequestsList;
