import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background-color: var(--header-background);
  height: 60px;
  box-shadow: var(--shadow-lg);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 2rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    transition: filter 0.2s ease;
    
    &:hover {
      filter: brightness(1.1);
    }
  }
  
  .icon {
    color: var(--secondary-500);
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .text {
    color: var(--secondary-500);
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
`;

export const NavItem = styled.div<{ active?: boolean }>`
  padding: 1rem 1.5rem;
  color: ${props => props.active ? 'var(--secondary-500)' : 'var(--gray-200)'};
  background-color: ${props => props.active ? 'var(--gray-600)' : 'transparent'};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 3px solid ${props => props.active ? 'var(--secondary-500)' : 'transparent'};
  position: relative;
  
  &:hover {
    color: var(--secondary-500);
    background-color: var(--gray-600);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-200);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--secondary-500);
    background-color: var(--gray-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, var(--primary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid var(--gray-600);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    border-color: var(--secondary-500);
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
