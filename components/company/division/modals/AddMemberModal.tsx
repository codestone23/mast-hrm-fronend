"use client";

import React, { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button } from "@/components/common";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { useDivisionCandidates } from "@/hooks/useDivisions";
import { FormContainer } from "./modalStyle";

interface AddMemberModalProps {
    isOpen: boolean;
    divisionId: number;
    onClose: () => void;
    onAdd: (userId: number) => Promise<void> | void;
}

interface AddMemberFormData {
    search: string;
    userId?: number;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
    isOpen,
    divisionId,
    onClose,
    onAdd,
}) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<AddMemberFormData>({
        defaultValues: {
            search: "",
            userId: undefined,
        },
        mode: "onChange",
    });

    const search = watch("search");

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

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: AddMemberFormData) => {
        if (data.userId) {
            await onAdd(data.userId);
        }
    };

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Hủy
            </Button>
            <Button
                type="button"
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={!watch("userId")}
            >
                Thêm
            </Button>
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
            <FormContainer>
                <Input
                    placeholder="Tìm theo tên hoặc email"
                    {...register("search")}
                    fullWidth
                />
                <Controller
                    name="userId"
                    control={control}
                    rules={{
                        required: "Vui lòng chọn người dùng",
                    }}
                    render={({ field }) => (
                        <Select
                            options={options}
                            value={field.value ?? ""}
                            onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                            hasNextPage={!!candidatesQuery.hasNextPage}
                            isFetchingNextPage={!!candidatesQuery.isFetchingNextPage}
                            fetchNextPage={() => candidatesQuery.fetchNextPage()}
                            error={errors.userId?.message}
                            fullWidth
                        />
                    )}
                />
            </FormContainer>
        </Modal>
    );
};

export default AddMemberModal;
