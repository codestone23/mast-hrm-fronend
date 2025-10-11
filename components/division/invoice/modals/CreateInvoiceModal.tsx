"use client";
import React, { useState } from "react";
import { Modal, Input, Button, Select } from "@/components/common";
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  SuccessMessage,
} from "@/components/timekeeping/modals/modalStyles";
import { FooterActions } from "./createInvoiceModalStyle";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: InvoiceData) => void;
}

interface InvoiceData {
  id: string;
  code: string;
  project: string;
  contract?: string;
  customer?: string;
  amount?: string;
  currency?: string;
  billable?: number;
  status?: string;
  monthReceive?: string;
  createdAt?: string;
  note?: string;
}

const statusOptions = [
  { value: "Dự tính", label: "Dự tính" },
  { value: "Có thể gửi hóa đơn", label: "Có thể gửi hóa đơn" },
  { value: "Đã gửi hóa đơn", label: "Đã gửi hóa đơn" },
  { value: "Đã thu tiền", label: "Đã thu tiền" },
  { value: "Nợ", label: "Nợ" },
  { value: "Hủy", label: "Hủy" },
];

const currencyOptions = [
  { value: "VND", label: "VND" },
  { value: "USD", label: "USD" },
];

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<InvoiceData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.project) {
      setError("Vui lòng điền các trường bắt buộc");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const saved: InvoiceData = {
        id: `inv_${Date.now()}`,
        code: String(formData.code),
        project: String(formData.project),
        contract: String(formData.contract || ""),
        customer: String(formData.customer || ""),
        amount: String(formData.amount || ""),
        currency: String(formData.currency || "VND"),
        billable: Number(formData.billable || 0),
        status: String(formData.status || ""),
        monthReceive: String(formData.monthReceive || ""),
        createdAt: new Date().toLocaleDateString(),
        note: String(formData.note || ""),
      };

      setSuccess(true);
      if (onSave) onSave(saved);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setError("Không thể lưu, thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setError("");
    setSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const isSubmitDisabled = isLoading || !formData.code || !formData.project;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo request hóa đơn"
      size="lg"
      footer={
        <FooterActions>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="warning"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
          >
            Lưu
          </Button>
        </FooterActions>
      }
    >
      <ModalContent>
        {success ? (
          <SuccessMessage>Đã tạo hóa đơn thành công</SuccessMessage>
        ) : (
          <>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormSection>
              <FormGrid>
                <Input
                  label="Mã hóa đơn"
                  value={formData.code || ""}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="Mã hóa đơn"
                />
                <Select
                  label="Dự án *"
                  value={formData.project || ""}
                  onChange={(v) => handleInputChange("project", String(v))}
                  options={[{ value: "Sumitomo", label: "Sumitomo" }]}
                  placeholder="Dự án"
                  required
                />

                <Input
                  label="Khách hàng"
                  value={formData.customer || ""}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  placeholder="Khách hàng"
                />
                <Input
                  label="Billable"
                  value={String(formData.billable || "")}
                  onChange={(e) =>
                    handleInputChange("billable", Number(e.target.value))
                  }
                  placeholder="Billable"
                />

                <Input
                  label="Số tiền *"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Số tiền"
                />
                <Select
                  label="Đơn vị tiền tệ"
                  value={formData.currency || "VND"}
                  onChange={(v) => handleInputChange("currency", String(v))}
                  options={currencyOptions}
                />

                <Select
                  label="Trạng thái *"
                  value={formData.status || ""}
                  onChange={(v) => handleInputChange("status", String(v))}
                  options={statusOptions}
                />
                <Input
                  label="Tháng nhận tiền"
                  value={formData.monthReceive || ""}
                  onChange={(e) =>
                    handleInputChange("monthReceive", e.target.value)
                  }
                  placeholder="Tháng nhận tiền"
                />

                <Input
                  label="Số tiền đã thanh toán"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Số tiền đã thanh toán"
                />
                <Input
                  label="Số tiền còn phải thu"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Số tiền còn phải thu"
                />

                <Input
                  label="Note"
                  value={formData.note || ""}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Note"
                />
              </FormGrid>
            </FormSection>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateInvoiceModal;
