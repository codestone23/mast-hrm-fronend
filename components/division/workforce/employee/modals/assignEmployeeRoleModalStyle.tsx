import styled from "styled-components";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UserInfoLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const UserInfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
`;

export const InfoBox = styled.div<{ $variant?: "info" | "error" }>`
  font-size: 14px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.$variant === "error" ? "#fef2f2" : "#f3f4f6"};
  color: ${props => props.$variant === "error" ? "#ef4444" : "#6b7280"};
`;

export const RolesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e0e7ff;
  color: #6366f1;
`;

export const RolesLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

