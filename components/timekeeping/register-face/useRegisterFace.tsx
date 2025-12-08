import { useToast } from "@/hooks/useToast";
import TimekeepingService from "@/services/timekeeping.service";
import uploadService from "@/services/upload.service";
import { ApiResponse, LoginResponse, RegisterFaceData } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import profileService from "@/services/profile.service";

export const useRegisterFace = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { error, success } = useToast();

    const registerFaceMutation = useMutation({
        mutationFn: async (
            data: RegisterFaceData & { user_id: number },
        ): Promise<unknown> => {
            const faceUrl =
                process.env.NEXT_PUBLIC_FACE_IDENTIFICATION_URL;

            if (!faceUrl) {
                throw new Error("FACE_IDENTIFICATION_URL không được cấu hình");
            }

            const faceForm = new FormData();
            faceForm.append("user_id", String(data.user_id));
            faceForm.append("image", data.image as Blob);

            const faceRes = await fetch(`${faceUrl}/add_user`, {
                method: "POST",
                body: faceForm,
            });

            if (!faceRes.ok) {
                const errText = await faceRes.text();
                throw new Error(
                    `Đăng ký khuôn mặt với Face service thất bại: ${faceRes.status} - ${errText}`,
                );
            }

            await faceRes.json();

            const presign = await profileService.getPresignedUrl({
                file_type: (data.image as File).type,
                folder: "faces",
            });

            const uploadForm = new FormData();
            uploadForm.append("file", data.image as Blob);
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
            const uploadedUrl = uploadJson.secure_url as string;

            if (!uploadedUrl) {
                throw new Error("Không xác định được URL ảnh sau upload");
            }

            const response = await TimekeepingService.registerFace({
                user_id: data.user_id,
                photo_url: uploadedUrl,
            });

            return response;
        },
        onSuccess: (data: unknown) => {
            success('Đăng ký khuôn mặt thành công');
            setIsLoading(false);
        },
        onError: (e: unknown) => {
            const err = e as AxiosError<ApiResponse<LoginResponse>>;
            error(err.response?.data.message || 'Đăng ký khuôn mặt thất bại');
            setIsLoading(false);
        },
    });

    return {
        isLoading,
        setIsLoading,
        registerFaceMutation,
    }
}