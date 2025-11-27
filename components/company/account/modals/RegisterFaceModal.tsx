"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { useRegisterFace } from "@/components/timekeeping/register-face/useRegisterFace";
import { RegisterFaceData } from "@/types/api";
import { Modal } from "@/components/common";
import styled, { keyframes } from "styled-components";

const VideoWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
`;

const SnapshotPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
`;

const CaptureButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.18);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const IconButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  border: none;
  padding: 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.08);
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
`;

const OverlayText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  text-align: center;
  margin: 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 6px;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(255, 255, 255, 0.9);
  animation: ${spin} 1s linear infinite;
  position: absolute;
`;

const Hint = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 12px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

interface RegisterFaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName?: string;
  onSuccess?: () => void;
}

const RegisterFaceModal: React.FC<RegisterFaceModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  onSuccess,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { registerFaceMutation, isLoading, setIsLoading } = useRegisterFace();

  // Check permissions and request if needed
  useEffect(() => {
    if (!isOpen) {
      // Cleanup when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      setImageSrc(null);
      setError(null);
      return;
    }

    let mounted = true;

    const checkAndRequest = async () => {
      if (!mounted) return;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Trình duyệt của bạn không hỗ trợ truy cập camera.");
        return;
      }

      const supportsPermissions = !!navigator.permissions.query;

      try {
        if (supportsPermissions) {
          try {
            const pCam = await navigator.permissions.query({ name: "camera" });
            if (!mounted) return;

            if (pCam.state === "granted") {
              await startCamera();
              return;
            }

            if (pCam.state === "denied") {
              setError(
                "Quyền truy cập camera đã bị từ chối. Vui lòng bật quyền trong cài đặt trình duyệt và tải lại trang."
              );
              return;
            }
          } catch {
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
  }, [isOpen]);

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
      console.error("Error while stopping camera", err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
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
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play().catch(() => {});
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
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
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
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
      const data: RegisterFaceData & { user_id: number } = {
        image: dataURLtoFile(imageSrc || "", `snapshot_${Date.now()}.png`),
        user_id: userId,
      };
      await registerFaceMutation.mutateAsync(data);
      await new Promise((r) => setTimeout(r, 500));
      setImageSrc(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Không thể đăng ký khuôn mặt.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Đăng ký khuôn mặt ${userName ? `cho ${userName}` : ""}`}
      size="lg"
      closable
      closeOnOverlayClick={!isLoading}
    >
          <VideoWrapper>
            {imageSrc ? (
              <SnapshotPreview src={imageSrc} alt="Captured snapshot" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            {isCapturing && <Spinner aria-hidden="true" />}

            {imageSrc && (
              <IconButton
                aria-label="Chụp lại"
                onClick={handleRetake}
                title="Chụp lại"
              >
                <Trash2 size={16} />
              </IconButton>
            )}

            {error && <OverlayText>{error}</OverlayText>}
          </VideoWrapper>

          {error && !imageSrc && (
            <ButtonContainer>
              <CaptureButton
                onClick={async () => {
                  setError(null);
                  try {
                    await startCamera();
                  } catch {
                    /* ignore */
                  }
                }}
              >
                Thử lại quyền
              </CaptureButton>
            </ButtonContainer>
          )}

          {!imageSrc ? (
            <>
              <ButtonContainer>
                <CaptureButton
                  onClick={handleCapture}
                  disabled={isCapturing}
                  aria-label="Chụp ảnh"
                >
                  <Camera size={16} />
                  {isCapturing ? "Đang chụp..." : "Chụp ảnh"}
                </CaptureButton>
              </ButtonContainer>
              <Hint>Đảm bảo khuôn mặt nằm giữa khung hình</Hint>
            </>
          ) : (
            <ButtonContainer>
              {!isLoading ? (
                <CaptureButton
                  onClick={handleRegisterFace}
                  style={{ background: "#efab44ff" }}
                  aria-label="Đăng ký khuôn mặt"
                >
                  <Upload size={16} />
                  Đăng ký khuôn mặt
                </CaptureButton>
              ) : (
                <CaptureButton disabled>Đang xử lý...</CaptureButton>
              )}
            </ButtonContainer>
          )}
    </Modal>
  );
};

export default RegisterFaceModal;
