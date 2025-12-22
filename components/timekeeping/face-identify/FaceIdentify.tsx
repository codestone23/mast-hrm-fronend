"use client";

import React, { useEffect, useRef, useState } from "react";

import { Camera, Trash2 } from "lucide-react";

import {
    Container,
    VideoWrapper,
    CaptureButton,
    SnapshotPreview,
    IconButton,
    Spinner,
    OverlayText,
    Hint,
} from "./FaceIdentifyStyle";
import { CheckInData, CheckOutData } from "@/types/api";
import { useCheckIn } from "./useCheckIn";
import { useCheckOut } from "./useCheckOut";

const FaceIdentify: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { checkInMutation, isCheckInLoading, setIsCheckInLoading } = useCheckIn();
    const { checkOutMutation, isCheckOutLoading, setIsCheckOutLoading } = useCheckOut();

    // Check permissions and request if needed
    useEffect(() => {
        let mounted = true;

        const checkAndRequest = async () => {
            try {
                // Permissions API may not support 'camera' in all browsers
                const supportsPermissions = !!navigator.permissions;

                let camState: 'granted' | 'prompt' | 'denied' | 'unknown' = 'unknown';
                let geoState: 'granted' | 'prompt' | 'denied' | 'unknown' = 'unknown';

                if (supportsPermissions) {
                    try {
                        // camera might not be recognized by some browsers -> catch
                        const pCam = await navigator.permissions.query({ name: 'camera' });
                        camState = pCam.state;
                    } catch (e) {
                        camState = 'prompt';
                    }

                    try {
                        const pGeo = await navigator.permissions.query({ name: 'geolocation' });
                        geoState = pGeo.state;
                    } catch (e) {
                        geoState = 'prompt';
                    }
                } else {
                    camState = 'prompt';
                    geoState = 'prompt';
                }

                if (!mounted) return;

                // If both already granted, start camera
                if (camState === 'granted') {
                    await startCamera();
                }

                // If either is prompt, request them now
                if (camState !== 'granted' || geoState !== 'granted') {
                    // Request location
                    let gotGeo = geoState === 'granted';
                    try {
                        await getLocation();
                        gotGeo = true;
                    } catch (e) {
                        gotGeo = false;
                    }

                    // Request camera
                    let gotCam = camState === 'granted';
                    try {
                        await startCamera();
                        gotCam = !!streamRef.current;
                    } catch (e) {
                        gotCam = false;
                    }

                    if (!gotCam || !gotGeo) {
                        setError('Vui lòng cho phép truy cập Camera và Vị trí để tiếp tục.');
                    } else {
                        setError(null);
                    }
                }
            } catch (err) {
                console.error('Permission check error', err);
                setError('Không thể kiểm tra quyền truy cập. Vui lòng kiểm tra cài đặt trình duyệt.');
            }
        };

        checkAndRequest();

        return () => {
            mounted = false;
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
        } catch (err) {
            console.error(err);
            setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
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

    const getLocation = async (): Promise<{ gps_latitude: string; gps_longitude: string }> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    gps_latitude: position.coords.latitude.toString(),
                    gps_longitude: position.coords.longitude.toString(),
                });
            },
            (error) => {
                reject(error);
            }
            );
        });
    };

    const getIp = async (): Promise<string> => {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        return ipData.ip;
    };

    const getDeviceInfo = (): string => {
        return navigator.userAgent;
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
    
    const handleCheckIn = async () => {
        if (!imageSrc) return;
        try {
            const position = await getLocation();
            const ip = await getIp();
            const device_info = getDeviceInfo();

            const data: CheckInData = {
                location_type: "OFFICE",
                gps_latitude: position.gps_latitude,
                gps_longitude: position.gps_longitude,
                ip_address: ip,
                device_info: device_info,
                note: "Check-in via FaceIdentify component",
                remote: "OFFICE",
                image: dataURLtoFile(imageSrc || '', `snapshot_${Date.now()}.png`),
            };

            setIsCheckInLoading(true);
            checkInMutation.mutate(data);

        } catch (err) {
            console.error("Check-in error:", err);
            setIsCheckInLoading(false);
        }
    };


    const handleCheckOut = async () => {
        if (!imageSrc) return;
        try {
            const position = await getLocation();
            const ip = await getIp();
            const device_info = getDeviceInfo();

            const data: CheckOutData = {
                location_type: "OFFICE",
                gps_latitude: position.gps_latitude,
                gps_longitude: position.gps_longitude,
                ip_address: ip,
                device_info: device_info,
                note: "Check-out via FaceIdentify component",
                image: dataURLtoFile(imageSrc || '', `snapshot_${Date.now()}.png`),
            };

            setIsCheckOutLoading(true);
            checkOutMutation.mutate(data);
        } catch (err) {
            console.error("Check-out error:", err);
            setIsCheckOutLoading(false);
        }
    }

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
                    {(!(isCheckInLoading || isCheckOutLoading)) ? (
                        <>
                            <CaptureButton onClick={handleCheckIn} style={{ background: "#efab44ff" }} aria-label="Chụp lại">
                                <Trash2 size={14} />
                                Chấm công vào
                            </CaptureButton>
                            <CaptureButton onClick={handleCheckOut} style={{ background: "#efab44ff" }} aria-label="Chụp lại">
                                <Trash2 size={14} />
                                Chấm công ra
                            </CaptureButton>
                        </>
                    ) : (<>Đang xử lý...</>)}
                </div>
            )}
        </Container>
    );
};

export default FaceIdentify;

