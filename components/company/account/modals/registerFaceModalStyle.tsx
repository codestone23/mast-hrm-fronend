import styled, { keyframes } from "styled-components";

export const VideoWrapper = styled.div`
  width: 25rem;
  margin: 0 auto;
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

export const SnapshotPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
`;

export const CaptureButton = styled.button`
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

export const IconButton = styled.button`
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

export const OverlayText = styled.p`
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

export const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(255, 255, 255, 0.9);
  animation: ${spin} 1s linear infinite;
  position: absolute;
`;

export const Hint = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 12px;
  text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

