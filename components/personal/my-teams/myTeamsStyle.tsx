import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background-color: var(--background-secondary);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const TeamCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

export const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const TeamName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
    word-break: break-word;
  }
`;

export const TeamDivision = styled.span`
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
`;

export const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;

  @media (max-width: 768px) {
    gap: 8px;
    margin: 12px 0;
  }
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const ProjectsList = styled.div`
  margin-top: 16px;
`;

export const ProjectsTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const ProjectTag = styled.span`
  display: inline-block;
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 8px;
    margin-right: 6px;
    margin-bottom: 6px;
  }
`;

export const SingleTeamContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

export const SingleTeamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
`;

export const SingleTeamInfo = styled.div``;

export const SingleTeamName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 20px;
    word-break: break-word;
  }
`;

export const SingleTeamDivision = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 4px;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: ${({ $active }) => ($active ? "#4f46e5" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#4338ca" : "#f3f4f6")};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    
    svg {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }
`;

export const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 768px) {
    padding: 12px;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MemberAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-weight: 600;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const MemberDetails = styled.div``;

export const MemberName = styled.div`
  font-weight: 500;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 14px;
    word-break: break-word;
  }
`;

export const MemberRole = styled.div`
  font-size: 12px;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 11px;
    word-break: break-word;
  }
`;

export const MemberPosition = styled.span`
  font-size: 12px;
  color: #4f46e5;
  background: #e0e7ff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 2px 6px;
    margin-left: 4px;
    display: block;
    margin-top: 4px;
    margin-left: 0;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    flex-shrink: 0;
  }
`;

export const IconButton = styled.button<{ $variant?: "danger" | "primary" }>`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $variant }) =>
    $variant === "danger" ? "#fee2e2" : $variant === "primary" ? "#e0e7ff" : "#f3f4f6"};
  color: ${({ $variant }) =>
    $variant === "danger" ? "#dc2626" : $variant === "primary" ? "#4f46e5" : "#6b7280"};

  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#fecaca" : $variant === "primary" ? "#c7d2fe" : "#e5e7eb"};
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const TeamsTitle = styled.h2`
  margin-bottom: 24px;
  color: #111827;
  font-size: 24px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 1rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

export const EmptyIcon = styled.div`
  margin-bottom: 16px;
  color: #9ca3af;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

