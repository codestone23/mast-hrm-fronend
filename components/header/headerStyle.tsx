import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 1.5rem;
  background-color: #6262c1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  min-height: 60px;
`;

export const Logo = styled.div`
  width: 100px;
  height: 46px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const UserName = styled.span`
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
`;

export const UserAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  background-color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;
