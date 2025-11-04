import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.9) transparent;

  /* Webkit-based browsers (Chrome, Edge, Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 999px;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #60a5fa, #06b6d4);
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    min-height: 24px;
  }

  &::-webkit-scrollbar-thumb:hover {
    filter: brightness(0.95);
  }
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
  }
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 0, 0.05);
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

export const Email = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

export const RightArea = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Tag = styled.div<{ variant?: "today" | "upcoming" }>`
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: ${props => (props.variant === "today" ? "#92400e" : "#065f46")};
  background: ${props => (props.variant === "today" ? "#fff4e6" : "#ecfdf5")};
`;

export const Days = styled.div`
  color: #0f172a;
  font-size: 13px;
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font-size: 16px;
  color: #64748b;
`;

export const EmptyDataContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  gap: 12px;
  padding: 20px 0;
`;

export const EmptyDataText = styled.div`
  font-size: 16px;
  color: #64748b;
`;
