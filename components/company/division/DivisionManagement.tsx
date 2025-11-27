"use client";

import React, { useState } from "react";
import { Plus, Building2, Users } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import {
    PersonalContainer,
    DashboardGrid,
    Card,
    WelcomeCard,
    WelcomeContent,
    StatsCard,
    StatsNumber,
    CardHeader,
    CardTitle,
    CardLink,
    IconWrapper,
    StatsHeader,
    DashboardCol,
    AssetsGradientBox,
    AssetsNumber,
    AssetsLabel,
    AssetsListContainer,
    AssetsListTitle,
    AssetsItem,
    CreateButton,
    EmptyState,
    EmptyIcon,
    EmptyText,
    DivisionFilterContainer,
} from "./divisionStyle";
import CreateDivisionModal from "./modals/CreateDivisionModal";
import EditDivisionModal from "./modals/EditDivisionModal";
import { useRouter } from "next/navigation";

import { Division as LegacyDivision } from "@/constants/types";
import DivisionFilters from "./DivisionFilters";
import DivisionList from "./DivisionList";
import Pagination from "@/components/common/Pagination/Pagination";
import {
    useCreateDivision,
    useDeleteDivision,
    useDivisionsList,
    useUpdateDivision,
    DivisionListResponse,
} from "@/hooks/useDivisions";
import {
    CreateDivisionRequest,
    UpdateDivisionRequest,
    DivisionListItem,
} from "@/types/api";
import { ConfirmDeleteModal, Loading } from "@/components/common";
import { useToast } from "@/contexts/ToastContext";
import ROUTERS from "@/config/router";
import { DivisionStatus } from "@/constants/enums";

const DivisionManagement: React.FC = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(
        undefined
    );
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] =
        useState<DivisionListItem | null>(null);

    const { data: listData, isFetching } = useDivisionsList({
        page,
        limit,
        search: searchTerm || undefined,
        type: typeFilter,
        status: statusFilter as DivisionStatus,
    });
    const response = listData as DivisionListResponse | undefined;
    const divisions = response?.data ?? [];
    const total = response?.pagination.total ?? 0;
    const totalPages = response?.pagination.total_pages ?? 1;

    const { success: showSuccessToast, error: showErrorToast } = useToast();

    const handleDeleteError = (error: string) => {
        showErrorToast(error || "Có lỗi xảy ra khi xóa phòng ban");
    };

    const createMutation = useCreateDivision();
    const deleteMutation = useDeleteDivision(handleDeleteError);
    const updateMutation = useUpdateDivision(selectedDivision?.id ?? 0);

    const filteredDivisions = divisions; // server-side filtered

    const handleCreateDivision = async (payload: CreateDivisionRequest) => {
        await createMutation.mutateAsync(payload);
        setIsCreateModalOpen(false);
    };

    const handleEditDivision = async (
        payload: UpdateDivisionRequest & { id?: string | number }
    ) => {
        await updateMutation.mutateAsync(payload);
        setIsEditModalOpen(false);
        setSelectedDivision(null);
    };

    const handleDeleteDivision = async () => {
        if (selectedDivision) {
            await deleteMutation.mutateAsync(selectedDivision.id);
            setIsDeleteModalOpen(false);
            setSelectedDivision(null);
        }
    };

    const handleEdit = (division: DivisionListItem) => {
        setSelectedDivision(division);
        setIsEditModalOpen(true);
    };

    const handleDelete = (division: DivisionListItem) => {
        setSelectedDivision(division);
        setIsDeleteModalOpen(true);
    };

    const renderHeader = () => {
        const activeDivisions = divisions.filter(
            (div) => div.status === "ACTIVE"
        ).length;
        const totalEmployees = divisions.reduce(
            (acc, div) => acc + (div.member_count ?? 0),
            0
        );

        return (
            <DashboardCol>
                <WelcomeCard>
                    <WelcomeContent>
                        <h3>Quản lý phòng ban hệ thống</h3>
                        <p>
                            Tổng số phòng ban: {divisions.length} | Đang hoạt
                            động: {activeDivisions} | Tổng nhân viên:{" "}
                            {totalEmployees}
                        </p>
                    </WelcomeContent>
                </WelcomeCard>

                <Card>
                    <CardHeader>
                        <IconWrapper>
                            <Building2 size={20} />
                        </IconWrapper>
                        <CardTitle>Tìm kiếm và quản lý</CardTitle>
                    </CardHeader>
                    <DivisionFilterContainer $isMobile={isMobile}>
                        <DivisionFilters
                            search={searchTerm}
                            onSearchChange={setSearchTerm}
                            type={typeFilter}
                            status={statusFilter}
                            onTypeChange={setTypeFilter}
                            onStatusChange={setStatusFilter}
                        />
                        <CreateButton
                            $isMobile={isMobile}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus size={isMobile ? 18 : 20} />
                            {isMobile ? "Tạo mới" : "Tạo phòng ban mới"}
                        </CreateButton>
                    </DivisionFilterContainer>
                </Card>

                <StatsCard>
                    <StatsHeader $marginBottom="0.5rem">
                        <IconWrapper>
                            <Building2 size={18} />
                        </IconWrapper>
                        <CardTitle>Tổng quan phòng ban</CardTitle>
                    </StatsHeader>
                    <StatsNumber className="large">{total}</StatsNumber>
                    <div
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            marginTop: "0.25rem",
                        }}
                    >
                        phòng ban
                    </div>
                </StatsCard>

                <Card>
                    <CardHeader>
                        <IconWrapper>
                            <Users size={20} />
                        </IconWrapper>
                        <CardTitle>Thống kê nhân viên</CardTitle>
                    </CardHeader>
                    <AssetsGradientBox>
                        <AssetsNumber>{totalEmployees}</AssetsNumber>
                        <AssetsLabel>Tổng nhân viên</AssetsLabel>
                    </AssetsGradientBox>
                    <AssetsListContainer>
                        <AssetsListTitle>
                            <strong>Phân bố nhân viên theo phòng ban</strong>
                        </AssetsListTitle>
                        {divisions.slice(0, 4).map((division) => (
                            <AssetsItem
                                $marginBottom="0.25rem"
                                key={division.id}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ fontSize: "0.8rem" }}>
                                        {division.name}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: "600",
                                            color:
                                                division.status === "ACTIVE"
                                                    ? "var(--success-600)"
                                                    : "var(--text-muted)",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            backgroundColor:
                                                division.status === "ACTIVE"
                                                    ? "var(--success-100)"
                                                    : "var(--background-secondary)",
                                        }}
                                    >
                                        {division.member_count ?? 0} nhân viên
                                    </span>
                                </div>
                            </AssetsItem>
                        ))}
                        {divisions.length > 4 && (
                            <AssetsItem
                                $marginBottom="0.25rem"
                                style={{
                                    fontStyle: "italic",
                                    color: "var(--text-muted)",
                                }}
                            >
                                ... và {divisions.length - 4} phòng ban khác
                            </AssetsItem>
                        )}
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
                    <Card>
                        <CardHeader>
                            <IconWrapper>
                                <Building2 size={20} />
                            </IconWrapper>
                            <CardTitle>Danh sách phòng ban</CardTitle>
                            <CardLink></CardLink>
                        </CardHeader>

                        {isFetching ? (
                            <Loading />
                        ) : filteredDivisions.length === 0 ? (
                            <EmptyState>
                                <EmptyIcon>
                                    <Building2 size={48} />
                                </EmptyIcon>
                                <EmptyText>
                                    {searchTerm
                                        ? "Không tìm thấy phòng ban nào phù hợp với từ khóa tìm kiếm"
                                        : "Chưa có phòng ban nào trong hệ thống"}
                                </EmptyText>
                                {!searchTerm && (
                                    <div style={{ marginTop: "16px" }}>
                                        <CreateButton
                                            onClick={() =>
                                                setIsCreateModalOpen(true)
                                            }
                                        >
                                            <Plus size={20} />
                                            Tạo phòng ban đầu tiên
                                        </CreateButton>
                                    </div>
                                )}
                            </EmptyState>
                        ) : (
                            <>
                                <DivisionList
                                    divisions={filteredDivisions}
                                    onOpen={(d) =>
                                        router.push(
                                            `${ROUTERS.COMPANY.DIVISIONS}/${d.id}` 
                                        )
                                    }
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        totalItems={total}
                                        itemsPerPage={limit}
                                        onPageChange={(p) => setPage(p)}
                                    />
                                </div>
                            </>
                        )}
                    </Card>
                </DashboardCol>
            </DashboardGrid>

            {/* Modals */}
            <CreateDivisionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={(payload: CreateDivisionRequest) =>
                    handleCreateDivision(payload)
                }
            />

            <EditDivisionModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedDivision(null);
                }}
                division={
                    selectedDivision
                        ? ({
                              id: String(selectedDivision.id),
                              name: selectedDivision.name,
                              description: selectedDivision.description || "",
                              status:
                                  selectedDivision.status === "ACTIVE"
                                      ? "ACTIVE"
                                      : "INACTIVE",
                              createdAt: selectedDivision.created_at,
                          } as LegacyDivision)
                        : null
                }
                onSave={(d: UpdateDivisionRequest) => handleEditDivision(d)}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDivision(null);
                }}
                onConfirm={handleDeleteDivision}
                title="Xóa phòng ban"
                message={`Bạn có chắc chắn muốn xóa phòng ban "${selectedDivision?.name}"? Hành động này không thể hoàn tác.`}
            />
        </PersonalContainer>
    );
};

export default DivisionManagement;
