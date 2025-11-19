"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Users, Building2, Plus, Trash2 } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    IconWrapper,
    CreateButton,
} from "@/components/company/division/divisionStyle";
import Input from "@/components/common/Input/Input";
// Select is not used directly here (Pagination used instead)
import Pagination from "@/components/common/Pagination/Pagination";
import AddMemberModal from "@/components/company/division/modals/AddMemberModal";
import { ConfirmDeleteModal, Loading } from "@/components/common";
import {
    useAddMemberToDivision,
    useDivisionDetail,
    useDivisionMembersPaged,
    useRemoveMemberFromDivision,
} from "@/hooks/useDivisions";
import {
    PageContainer,
    SectionHeaderRow,
    Field,
    SectionBody,
    MembersGrid,
    MemberItem,
    MemberInfo,
    Avatar,
    MemberTexts,
    MemberName,
    MemberEmail,
    DangerButton,
    LoadMoreContainer,
} from "@/components/company/division/detailStyle";
import { DivisionStatus } from "@/constants/enums";

const DivisionDetailPage: React.FC = () => {
    const params = useParams<{ id: string }>();
    const divisionId = Number(params.id);

    const { data: division } = useDivisionDetail(divisionId);
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const membersQuery = useDivisionMembersPaged(
        divisionId,
        page,
        limit,
        search
    );
    const members = membersQuery.data?.data ?? [];
    const meta = membersQuery.data?.pagination;

    const addMutation = useAddMemberToDivision();
    const removeMutation = useRemoveMemberFromDivision();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingRemove, setPendingRemove] = useState<{ userId: number; name?: string } | null>(null);

    const handleAddFromModal = async (userId: number) => {
        await addMutation.mutateAsync({ userId, divisionId });
        setIsAddModalOpen(false);
        membersQuery.refetch();
    };

    const handleAskRemove = (userId: number, name?: string) => {
        setPendingRemove({ userId, name });
        setConfirmOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!pendingRemove) return;
        await removeMutation.mutateAsync({ userId: pendingRemove.userId, divisionId });
        setConfirmOpen(false);
        setPendingRemove(null);
        membersQuery.refetch();
    };

    const getStatusText = (status: DivisionStatus) => {
        switch (status) {
            case DivisionStatus.ACTIVE:
                return "Hoạt động";
            case DivisionStatus.INACTIVE:
                return "Không hoạt động";
            default:
                return status;
        }
    }

    const header = useMemo(
        () => (
            <Card>
                <CardHeader>
                    <IconWrapper>
                        <Building2 size={20} />
                    </IconWrapper>
                    <CardTitle>
                        {division?.name ?? "Chi tiết phòng ban"}
                    </CardTitle>
                </CardHeader>
                <div style={{ padding: 16, color: "var(--text-secondary)" }}>
                    <div>Trạng thái: {getStatusText(division?.status ?? DivisionStatus.ACTIVE)}</div>
                    <div>Mô tả: {division?.description || "-"}</div>
                </div>
            </Card>
        ),
        [division]
    );

    return (
        <PageContainer>
            {header}

            
            <Card style={{ marginTop: 16 }}>
                <CardHeader>
                    <IconWrapper>
                        <Users size={20} />
                    </IconWrapper>
                    <CardTitle>Thành viên</CardTitle>
                </CardHeader>

                <SectionHeaderRow>
                    <Field $minWidth={280}>
                        <Input
                            placeholder="Tìm theo tên người dùng"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        /> 
                    </Field>
                    <div>
                        <CreateButton onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={18} /> Thêm thành viên
                        </CreateButton>
                    </div>
                </SectionHeaderRow>

                <SectionBody>
                    {membersQuery.isFetching && members.length === 0 ? (
                        <Loading />
                    ) : (
                        <MembersGrid>
                            {members.map((m) => (
                                <MemberItem key={m.id}>
                                    <MemberInfo>
                                        <Avatar
                                            src={
                                                m.user.user_information
                                                    ?.avatar && m.user.user_information.avatar.includes('https') ? m.user.user_information.avatar : `/images/background-login.png`
                                            }
                                            alt="avatar"
                                        />
                                        <MemberTexts>
                                            <MemberName>
                                                {m.user.user_information?.name}
                                            </MemberName>
                                            <MemberEmail>
                                                {m.user.email}
                                            </MemberEmail>
                                        </MemberTexts>
                                    </MemberInfo>
                                    <DangerButton
                                        onClick={() => handleAskRemove(m.userId, m.user.user_information?.name)}
                                    >
                                        <Trash2 size={16} /> Xóa
                                    </DangerButton>
                                </MemberItem>
                            ))}
                            {members.length === 0 && (
                                <div>Không có thành viên.</div>
                            )}
                            {meta && meta.total_pages > 1 && (
                                <LoadMoreContainer>
                                    <Pagination
                                        currentPage={page}
                                        totalPages={meta.total_pages}
                                        totalItems={meta.total}
                                        itemsPerPage={limit}
                                        onPageChange={(p)=>setPage(p)}
                                    />
                                </LoadMoreContainer>
                            )}
                        </MembersGrid>
                    )}
                </SectionBody>
            </Card>
            <AddMemberModal
                isOpen={isAddModalOpen}
                divisionId={divisionId}
                onClose={()=>setIsAddModalOpen(false)}
                onAdd={handleAddFromModal}
            />
            <ConfirmDeleteModal
                isOpen={confirmOpen}
                onClose={()=>{ setConfirmOpen(false); setPendingRemove(null); }}
                onConfirm={handleConfirmRemove}
                title="Xóa thành viên"
                message={`Bạn có chắc chắn muốn xóa ${pendingRemove?.name || 'người dùng'} khỏi phòng ban?`}
            />
        </PageContainer>
    );
};

export default DivisionDetailPage;
