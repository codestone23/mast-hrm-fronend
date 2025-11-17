"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  FormTextArea,
  FormRow,
  CancelButton,
  SaveButton,
} from "@/components/hr/asset/modals/modalStyle";
import { AssetCategory, AssetStatus } from "@/constants/enums";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import assetsService from "@/services/assets.service";
import { useToast } from "@/hooks/useToast";
import { Select, DatePicker } from "@/components/common";
import { Asset } from "@/constants/types";
import { formatDateForAPI } from "@/utils/dateUtils";
import { useAuthContext } from "@/contexts/AuthContext";

interface CreateAssetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RequestFormData {
  request_type: "REQUEST" | "RETURN" | "MAINTENANCE";
  category: string;
  description: string;
  justification: string;
  expected_date: string;
  asset_id?: string;
  notes?: string;
}

const CreateAssetRequestModal: React.FC<CreateAssetRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [assetSearchTerm, setAssetSearchTerm] = useState("");
  const [debouncedAssetSearch, setDebouncedAssetSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<RequestFormData>({
    defaultValues: {
      request_type: "REQUEST",
      category: "",
      description: "",
      justification: "",
      expected_date: "",
      asset_id: "",
      notes: "",
    },
  });

  const requestTypeValue = watch("request_type");
  const categoryValue = watch("category");
  const assetIdValue = watch("asset_id");
  const expectedDateValue = watch("expected_date");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAssetSearch(assetSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [assetSearchTerm]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAssetSearchTerm("");
      setDebouncedAssetSearch("");
    }
  }, [isOpen]);

  // Fetch available assets with infinite query
  const {
    data: availableAssetsData,
    isLoading: isLoadingAssets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['available-assets', debouncedAssetSearch],
    queryFn: ({ pageParam = 1 }) =>
      assetsService.getListAssets({
        status: AssetStatus.AVAILABLE,
        page: pageParam,
        limit: 20,
        search: debouncedAssetSearch || undefined,
      }),
    enabled: isOpen, // Only fetch when modal is open
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const availableAssets = useMemo(
    () => availableAssetsData?.pages.flatMap((page) => page.data || []) || [],
    [availableAssetsData]
  );

  const assetOptions = useMemo(
    () => [
      { value: "", label: "Không chọn (yêu cầu mới)" },
      ...availableAssets.map((asset: Asset) => ({
        value: String(asset.id),
        label: `${asset.asset_code || asset.code || "Không có"} - ${asset.name}`, 
      })),
    ],
    [availableAssets]
  );

  const createRequestMutation = useMutation({
    mutationFn: (data: RequestFormData) =>
      assetsService.createRequest({
        request_type: data.request_type,
        category: data.category,
        description: data.description,
        justification: data.justification,
        expected_date: data.expected_date,
        asset_id: data.asset_id ? Number(data.asset_id) : null,
        notes: data.notes,
        user_id: user?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-asset-requests'] });
      showSuccessToast("Tạo yêu cầu tài sản thành công!", "Thành công");
      reset();
      onClose();
    },
    onError: () => {
      const errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
      showErrorToast(errorMessage, "Lỗi");
    },
  });

  const requestTypeOptions = [
    { value: "REQUEST", label: "Yêu cầu cấp phát" },
    { value: "RETURN", label: "Yêu cầu trả lại" },
    { value: "MAINTENANCE", label: "Yêu cầu bảo trì" },
  ];

  const categoryOptions = Object.values(AssetCategory).map((cat) => ({
    value: cat,
    label: cat,
  }));

  const onSubmit = async (data: RequestFormData) => {
    setError("");
    await createRequestMutation.mutateAsync(data);
  };

  const handleClose = () => {
    reset();
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer size="lg" onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tạo yêu cầu tài sản</ModalTitle>
            <ModalCloseButton onClick={handleClose}>
              <X size={20} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            {error && (
              <div
                style={{
                  padding: "12px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormRow>
                <FormGroup>
                  <FormLabel>
                    Loại yêu cầu <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <Select
                    options={requestTypeOptions}
                    value={requestTypeValue}
                    onChange={(value) => {
                      setValue("request_type", value as "REQUEST" | "RETURN" | "MAINTENANCE", { shouldValidate: true });
                    }}
                    placeholder="Chọn loại yêu cầu"
                    fullWidth
                  />
                  {errors.request_type && (
                    <span style={{ color: "#ef4444", fontSize: "12px" }}>
                      {errors.request_type.message}
                    </span>
                  )}
                  <input
                    type="hidden"
                    {...register("request_type", { required: "Vui lòng chọn loại yêu cầu" })}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    Danh mục <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <Select
                    options={categoryOptions}
                    value={categoryValue}
                    onChange={(value) => {
                      setValue("category", String(value), { shouldValidate: true });
                    }}
                    placeholder="Chọn danh mục"
                    fullWidth
                  />
                  {errors.category && (
                    <span style={{ color: "#ef4444", fontSize: "12px" }}>
                      {errors.category.message}
                    </span>
                  )}
                  <input
                    type="hidden"
                    {...register("category", { required: "Vui lòng chọn danh mục" })}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>
                  Lý do <span style={{ color: "#ef4444" }}>*</span>
                </FormLabel>
                <FormTextArea
                  {...register("justification", {
                    required: "Vui lòng nhập lý do",
                  })}
                  placeholder="Nhập lý do yêu cầu..."
                  $hasError={!!errors.justification}
                  disabled={isSubmitting || createRequestMutation.isPending}
                />
                {errors.justification && (
                  <span style={{ color: "#ef4444", fontSize: "12px" }}>
                    {errors.justification.message}
                  </span>
                )}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <FormLabel>
                    Ngày mong muốn <span style={{ color: "#ef4444" }}>*</span>
                  </FormLabel>
                  <DatePicker
                    value={expectedDateValue ? new Date(expectedDateValue) : null}
                    onChange={(date) => {
                      const dateStr = date ? formatDateForAPI(date) : "";
                      setValue("expected_date", dateStr, { shouldValidate: true });
                    }}
                    placeholder="Chọn ngày mong muốn"
                    required
                    disabled={isSubmitting || createRequestMutation.isPending}
                    error={errors.expected_date?.message}
                  />
                  <input
                    type="hidden"
                    {...register("expected_date", {
                      required: "Vui lòng chọn ngày mong muốn",
                    })}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Chọn tài sản (nếu có)</FormLabel>
                  <Select
                    options={assetOptions}
                    value={assetIdValue || ""}
                    onChange={(value) => {
                      setValue("asset_id", String(value || ""), { shouldValidate: true });
                    }}
                    placeholder="Chọn tài sản (tùy chọn)"
                    fullWidth
                    searchable={true}
                    onSearchChange={setAssetSearchTerm}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    loadingText="Đang tải thêm tài sản..."
                    disabled={isSubmitting || createRequestMutation.isPending || isLoadingAssets}
                  />
                  {isLoadingAssets && (
                    <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Đang tải danh sách tài sản...
                    </span>
                  )}
                  <input
                    type="hidden"
                    {...register("asset_id")}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <FormLabel>Ghi chú</FormLabel>
                <FormTextArea
                  {...register("notes")}
                  placeholder="Nhập ghi chú (tùy chọn)..."
                  disabled={isSubmitting || createRequestMutation.isPending}
                />
              </FormGroup>
            </form>
          </ModalBody>

          <ModalFooter>
            <CancelButton
              onClick={handleClose}
              disabled={isSubmitting || createRequestMutation.isPending}
            >
              Hủy
            </CancelButton>
            <SaveButton
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || createRequestMutation.isPending}
            >
              {isSubmitting || createRequestMutation.isPending ? "Đang tạo..." : "Tạo yêu cầu"}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateAssetRequestModal;

