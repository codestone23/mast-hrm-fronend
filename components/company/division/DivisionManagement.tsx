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
    HeaderTitle,
    HeaderDescription,
    StatsLabel,
    DistributionTitle,
    DistributionItemWrapper,
    DistributionName,
    DistributionBadge,
    MoreDivisionsText,
    EmptyStateButtonWrapper,
    PaginationWrapper,
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

enum ModalType {
    NONE = "NONE",
    CREATE = "CREATE",
    EDIT = "EDIT",
    DELETE = "DELETE",
}

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
    
    const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE);
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

    const { error: showErrorToast } = useToast();

    const handleDeleteError = (error: string) => {
        showErrorToast(error || "Có lỗi xảy ra khi xóa phòng ban");
    };

    const deleteMutation = useDeleteDivision(handleDeleteError);
    const updateMutation = useUpdateDivision(selectedDivision?.id ?? 0);

    const filteredDivisions = divisions; // server-side filtered

    const handleEditDivision = async (
        payload: UpdateDivisionRequest & { id?: string | number }
    ) => {
        await updateMutation.mutateAsync(payload);
        handleCloseModal();
    };

    const handleDeleteDivision = async () => {
        if (selectedDivision) {
            await deleteMutation.mutateAsync(selectedDivision.id);
            handleCloseModal();
        }
    };

    const handleEdit = (division: DivisionListItem) => {
        setSelectedDivision(division);
        setOpenModal(ModalType.EDIT);
    };

    const handleDelete = (division: DivisionListItem) => {
        setSelectedDivision(division);
        setOpenModal(ModalType.DELETE);
    };

    const handleCloseModal = () => {
        setOpenModal(ModalType.NONE);
        setSelectedDivision(null);
    };

    const renderHeader = () => {
        const activeDivisions = divisions.filter(
            (div) => div.status === DivisionStatus.ACTIVE
        ).length;
        const totalEmployees = divisions.reduce(
            (acc, div) => acc + (div.member_count ?? 0),
            0
        );

        return (
            <DashboardCol>
                <WelcomeCard>
                    <WelcomeContent>
                        <HeaderTitle $isMobile={isMobile}>Quản lý phòng ban hệ thống</HeaderTitle>
                        <HeaderDescription $isMobile={isMobile}>
                            {isMobile ? (
                                <>
                                    Tổng: {divisions.length} | Hoạt động: {activeDivisions}<br />
                                    Nhân viên: {totalEmployees}
                                </>
                            ) : (
                                <>
                            Tổng số phòng ban: {divisions.length} | Đang hoạt
                            động: {activeDivisions} | Tổng nhân viên:{" "}
                            {totalEmployees}
                                </>
                            )}
                        </HeaderDescription>
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
                            onClick={() => setOpenModal(ModalType.CREATE)}
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
                    <StatsLabel>
                        phòng ban
                    </StatsLabel>
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
                            <DistributionTitle $isMobile={isMobile}>Phân bố nhân viên theo phòng ban</DistributionTitle>
                        </AssetsListTitle>
                        {divisions.slice(0, 4).map((division) => (
                            <AssetsItem
                                $marginBottom="0.25rem"
                                key={division.id}
                            >
                                <DistributionItemWrapper $isMobile={isMobile}>
                                    <DistributionName $isMobile={isMobile}>
                                        {division.name}
                                    </DistributionName>
                                    <DistributionBadge
                                        $isActive={division.status === DivisionStatus.ACTIVE}
                                        $isMobile={isMobile}
                                    >
                                        {division.member_count ?? 0} nhân viên
                                    </DistributionBadge>
                                </DistributionItemWrapper>
                            </AssetsItem>
                        ))}
                        {divisions.length > 4 && (
                            <MoreDivisionsText
                                $isMobile={isMobile}
                            >
                                ... và {divisions.length - 4} phòng ban khác
                            </MoreDivisionsText>
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
                                    <EmptyStateButtonWrapper>
                                        <CreateButton
                                            onClick={() =>
                                                setOpenModal(ModalType.CREATE)
                                            }
                                        >
                                            <Plus size={20} />
                                            Tạo phòng ban đầu tiên
                                        </CreateButton>
                                    </EmptyStateButtonWrapper>
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
                                <PaginationWrapper>
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        totalItems={total}
                                        itemsPerPage={limit}
                                        onPageChange={(p) => setPage(p)}
                                    />
                                </PaginationWrapper>
                            </>
                        )}
                    </Card>
                </DashboardCol>
            </DashboardGrid>

            {/* Modals */}
            <CreateDivisionModal
                isOpen={openModal === ModalType.CREATE}
                onClose={handleCloseModal}
            />

            <EditDivisionModal
                isOpen={openModal === ModalType.EDIT}
                onClose={handleCloseModal}
                division={
                    selectedDivision
                        ? ({
                              id: String(selectedDivision.id),
                              name: selectedDivision.name,
                              description: selectedDivision.description || "",
                              status:
                                  selectedDivision.status === DivisionStatus.ACTIVE
                                      ? DivisionStatus.ACTIVE 
                                      : DivisionStatus.INACTIVE,
                              createdAt: selectedDivision.created_at,
                          } as LegacyDivision)
                        : null
                }
                onSave={(d: UpdateDivisionRequest) => handleEditDivision(d)}
            />

            <ConfirmDeleteModal
                isOpen={openModal === ModalType.DELETE}
                onClose={handleCloseModal}
                onConfirm={handleDeleteDivision}
                title="Xóa phòng ban"
                message={`Bạn có chắc chắn muốn xóa phòng ban "${selectedDivision?.name}"? Hành động này không thể hoàn tác.`}
                isLoading={deleteMutation.isPending}
            />
        </PersonalContainer>
    );
};

export default DivisionManagement;
