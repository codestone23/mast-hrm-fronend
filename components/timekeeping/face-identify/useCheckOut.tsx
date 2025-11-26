import { useToast } from "@/hooks/useToast";
import TimekeepingService from "@/services/timekeeping.service";
import { ApiResponse, LoginResponse, CheckOutData } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import profileService from "@/services/profile.service";

export const useCheckOut = () => {
    const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);
    const { error, success } = useToast();

    const checkOutMutation = useMutation({
        mutationFn: async (data: CheckOutData): Promise<unknown> => {
            let uploadedUrl: string | undefined;
            if ((data as unknown as CheckOutData).image) {
                const verifyForm = new FormData();
                verifyForm.append(
                    "image",
                    (data as unknown as CheckOutData).image as unknown as Blob,
                );

                const faceUrl =
                    process.env.NEXT_PUBLIC_FACE_IDENTIFICATION_URL ||
                    process.env.FACE_IDENTIFICATION_URL;

                if (!faceUrl) {
                    throw new Error(
                        "FACE_IDENTIFICATION_URL không được cấu hình",
                    );
                }

                const verifyRes = await fetch(`${faceUrl}/identify`, {
                    method: "POST",
                    body: verifyForm,
                });

                if (!verifyRes.ok) {
                    const errText = await verifyRes.text();
                    throw new Error(
                        `Xác thực khuôn mặt thất bại: ${verifyRes.status} - ${errText}`,
                    );
                }

                await verifyRes.json();

                const presign = await profileService.getPresignedUrl({
                    file_type: (
                        (data as unknown as CheckOutData).image as File
                    ).type,
                    folder: "timekeeping-checkout",
                });

                const uploadForm = new FormData();
                uploadForm.append(
                    "file",
                    (data as unknown as CheckOutData).image as unknown as Blob,
                );
                uploadForm.append("public_id", presign.public_id);
                uploadForm.append("signature", presign.signature);
                uploadForm.append("timestamp", presign.timestamp.toString());
                uploadForm.append("api_key", presign.api_key);
                uploadForm.append("folder", presign.folder);
                if (presign.transformation) {
                    uploadForm.append("transformation", presign.transformation);
                }

                const uploadRes = await fetch(presign.upload_url, {
                    method: "POST",
                    body: uploadForm,
                });
                if (!uploadRes.ok) {
                    const errText = await uploadRes.text();
                    throw new Error(
                        `Upload ảnh thất bại: ${uploadRes.status} - ${errText}`,
                    );
                }
                const uploadJson = await uploadRes.json();
                uploadedUrl = uploadJson.secure_url as string;
                if (!uploadedUrl)
                    throw new Error(
                        "Không xác định được URL ảnh sau upload",
                    );
            }

            const payload = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key !== "image")
                    payload.append(key, value as unknown as string);
            });
            if (uploadedUrl) payload.set("photo_url", uploadedUrl);

            return await TimekeepingService.checkOut(payload);
        },
        onSuccess: (data: unknown) => {
            success('Check out thành công');
            setIsCheckOutLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Check out thất bại');
            setIsCheckOutLoading(false);
        },
    });

    return {
        isCheckOutLoading,
        setIsCheckOutLoading,
        checkOutMutation,
    }
}