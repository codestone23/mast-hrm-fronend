"use client";

import React, { useMemo, useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { useDivisionCandidates } from "@/hooks/useDivisions";

interface AddMemberModalProps {
    isOpen: boolean;
    divisionId: number;
    onClose: () => void;
    onAdd: (userId: number) => Promise<void> | void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
    isOpen,
    divisionId,
    onClose,
    onAdd,
}) => {
    const [search, setSearch] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const candidatesQuery = useDivisionCandidates(divisionId, search);
    const options = useMemo(
        () =>
            (candidatesQuery.data?.pages.flatMap((p) => p.data) ?? []).map(
                (c) => ({
                    value: c.id,
                    label: `${c?.name} - ${c?.email}`,
                })
            ),
        [candidatesQuery.data]
    );

    const footer = (
        <>
            <button
                type="button"
                onClick={onClose}
                style={{
                    padding: "10px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "white",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                }}
            >
                Hủy
            </button>
            <button
                disabled={!selectedUserId}
                onClick={async () => {
                    if (selectedUserId) {
                        await onAdd(selectedUserId);
                        setSelectedUserId(null);
                    }
                }}
                style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: "var(--primary-500)",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Thêm
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Thêm người dùng vào phòng ban"
            footer={footer}
            size="md"
        >
            <div style={{ display: "grid", gap: 12 }}>
                <Input
                    placeholder="Tìm theo tên hoặc email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                    options={options}
                    value={selectedUserId ?? ""}
                    onChange={(v) => setSelectedUserId(Number(v))}
                    hasNextPage={!!candidatesQuery.hasNextPage}
                    isFetchingNextPage={!!candidatesQuery.isFetchingNextPage}
                    fetchNextPage={() => candidatesQuery.fetchNextPage()}
                />
            </div>
        </Modal>
    );
};

export default AddMemberModal;
