import styled from "styled-components";

export const HeaderContainer = styled.header.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.$isMobile ? '0.25rem 0.75rem' : '0.25rem 1.5rem'};
  background-color: var(--header-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  min-height: ${props => props.$isMobile ? '56px' : '60px'};
`;

export const Logo = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  width: ${props => props.$isMobile ? '80px' : '100px'};
  height: ${props => props.$isMobile ? '36px' : '46px'};
`;

export const HeaderRight = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${props => props.$isMobile ? '0.25rem' : '0.5rem'};
`;

export const LogoutButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: ${props => props.$isMobile ? '0.25rem' : '0.25rem 0.5rem'};
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
`;

export const UserInfo = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isMobile ? '0.5rem' : '0.75rem'};
  cursor: pointer;
  padding: ${props => props.$isMobile ? '0.25rem' : '0.25rem 0.5rem'};
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background-color: #16385d;
    border-color: #18395c;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const UserName = styled.span.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '0.8rem' : '0.9rem'};
  color: #fff;
  font-weight: 500;
`;

export const UserAvatar = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  width: ${props => props.$isMobile ? '2rem' : '2.25rem'};
  height: ${props => props.$isMobile ? '2rem' : '2.25rem'};
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
