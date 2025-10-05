"use client";

import React, { useEffect, useRef, useState } from "react";

import { Camera, Trash2, Upload } from "lucide-react";

import {
    Container,
    VideoWrapper,
    CaptureButton,
    SnapshotPreview,
    IconButton,
    Spinner,
    OverlayText,
    Hint,
} from "./RegisterFaceStyle";
import { useRegisterFace } from "./useRegisterFace";
import { RegisterFaceData } from "@/types/api";

const FaceIdentify: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { registerFaceMutation, isLoading, setIsLoading } = useRegisterFace();

    // Check permissions and request if needed
    useEffect(() => {
        let mounted = true;

        const checkAndRequest = async () => {
            if (!mounted) return;

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Trình duyệt của bạn không hỗ trợ truy cập camera.');
                return;
            }

            const supportsPermissions = !!navigator.permissions.query;

            try {
                if (supportsPermissions) {
                    try {
                        // Some browsers don't recognize 'camera' name and will throw
                        const pCam = await navigator.permissions.query({ name: 'camera' });
                        if (!mounted) return;

                        if (pCam.state === 'granted') {
                            await startCamera();
                            return;
                        }

                        if (pCam.state === 'denied') {
                            setError('Quyền truy cập camera đã bị từ chối. Vui lòng bật quyền trong cài đặt trình duyệt và tải lại trang.');
                            return;
                        }

                        // if 'prompt' or unknown, attempt to request via getUserMedia
                    } catch (e) {
                        // fallthrough to getUserMedia attempt
                    }
                }

                await startCamera();
            } catch (err) {
                setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
                console.error(err);
            }
        };

        checkAndRequest();

        return () => {
            mounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }
        } catch (err) {
            console.error('Error while stopping camera', err);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => {});
            }
            // Clear any previous permission error when camera starts
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
            throw err;
        }
    };

    const handleCapture = async () => {
        setIsCapturing(true);
        setError(null);
        try {
            const video = videoRef.current;
            if (!video) throw new Error("Video element not available");

            const width = video.videoWidth || video.clientWidth || 640;
            const height = video.videoHeight || video.clientHeight || 480;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Cannot get canvas context");

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            // small delay to show spinner feel
            await new Promise((r) => setTimeout(r, 220));
            setImageSrc(dataUrl);

            stopCamera();
        } catch (err) {
            setError("Không thể chụp ảnh từ camera.");
            console.error(err);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleRetake = async () => {
        setImageSrc(null);
        setError(null);

        try {
            // If we already have a live stream, reattach it to the video element
            if (streamRef.current && videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play().catch(() => {});
                return;
            }

            // Otherwise restart the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => {});
            }
        } catch (err) {
            setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
            console.error(err);
        }
    };

    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleRegisterFace = async () => {
        if (!imageSrc) return;
        setIsLoading(true);
        setError(null);
        try {
            const data: RegisterFaceData = {
                image: dataURLtoFile(imageSrc || '', `snapshot_${Date.now()}.png`),
            };
            await registerFaceMutation.mutateAsync(data);
            // small delay to show loading feel
            await new Promise((r) => setTimeout(r, 500));
            setImageSrc(null);
        } catch (err) {
            setError("Không thể đăng ký khuôn mặt.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Container>
            <VideoWrapper>
                {imageSrc ? (
                    <SnapshotPreview src={imageSrc} alt="Captured snapshot" />
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}

                {isCapturing && <Spinner aria-hidden="true" />}

                {imageSrc && (
                    <IconButton aria-label="Retake" onClick={handleRetake} title="Chụp lại">
                        <Trash2 size={14} />
                    </IconButton>
                )}

                {error && <OverlayText>{error}</OverlayText>}
            </VideoWrapper>

            {/* Show a retry button when permissions are denied or an error exists */}
            {error && !imageSrc && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <CaptureButton onClick={async () => { setError(null); try { await startCamera(); } catch (e) { /* ignore */ } }}>
                        Thử lại quyền
                    </CaptureButton>
                </div>
            )}

            {!imageSrc ? (
                <>
                    <CaptureButton onClick={handleCapture} disabled={isCapturing} aria-label="Chụp ảnh">
                        <Camera size={14} />
                        {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
                    </CaptureButton>
                    <Hint>Đảm bảo khuôn mặt nằm giữa khung hình</Hint>
                </>
            ) : (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    { !isLoading ? (
                        <CaptureButton onClick={handleRegisterFace} style={{ background: "#efab44ff" }} aria-label="Đăng ký khuôn mặt">
                            <Upload size={14} />
                            Đăng ký khuôn mặt
                        </CaptureButton>
                    ) : (<>
                        Đang xử lý...
                    </>)}
                </div>
            )}
        </Container>
    );
};

export default FaceIdentify;

