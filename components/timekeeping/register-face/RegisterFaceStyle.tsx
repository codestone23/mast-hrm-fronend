import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  width: 25rem; /* ~w-72 */
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(23, 42, 69, 0.08);
  padding: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const VideoWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.18);
  margin-top: 10px;
  font-weight: 600;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
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
  padding: 6px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2,6,23,0.08);
`;

export const OverlayText = styled.p`
  color: #ef4444;
  font-size: 0.78rem;
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  text-align: center;
  margin: 0;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.12);
  border-top-color: rgba(255,255,255,0.9);
  animation: ${spin} 1s linear infinite;
  position: absolute;
`;

export const Hint = styled.div`
  font-size: 0.82rem;
  color: #374151;
  margin-top: 8px;
  text-align: center;
`;