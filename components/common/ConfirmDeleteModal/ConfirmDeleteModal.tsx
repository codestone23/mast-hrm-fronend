"use client";

import React from "react";
import { Modal, Button } from "@/components/common";
import {
    ConfirmContainer,
    Message,
    ActionsRow,
    Spacer,
} from "./confirmDeleteModalStyle";

export interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Xác nhận xóa"}
            size="sm"
            closable
        >
            <ConfirmContainer>
                <Message>
                    {message || "Bạn có muốn xóa thông tin này không?"}
                </Message>

                <ActionsRow>
                    <Spacer />
                    <Button variant="ghost" size="md" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        variant="warning"
                        size="md"
                        onClick={onConfirm}
                        loading={isLoading}
                    >
                        Xác nhận
                    </Button>
                </ActionsRow>
            </ConfirmContainer>
        </Modal>
    );
};

export default ConfirmDeleteModal;
