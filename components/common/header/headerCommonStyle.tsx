import styled from 'styled-components';

export const HeaderContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.$isMobile ? '0 0.75rem' : '0 1.5rem'};
  background-color: var(--header-background);
  height: ${props => props.$isMobile ? '56px' : '60px'};
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

export const Logo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: ${props => props.$isMobile ? '1rem' : '2rem'};
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

export const Navigation = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  ${props => props.$isMobile && `
    display: none;
  `}
`;

export const NavItem = styled.div<{ $active?: boolean; $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '0.75rem 1rem' : '1rem 1rem'};
  color: ${props => props.$active ? 'var(--secondary-500)' : 'var(--gray-200)'};
  background-color: ${props => props.$active ? 'var(--gray-600)' : 'transparent'};
  cursor: pointer;
  font-size: ${props => props.$isMobile ? '0.8rem' : '0.9rem'};
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 3px solid ${props => props.$active ? 'var(--secondary-500)' : 'transparent'};
  position: relative;
  white-space: nowrap;
  
  &:hover {
    color: var(--secondary-500);
    background-color: var(--gray-600);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const UserSection = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isMobile ? '0.5rem' : '1rem'};
  margin-left: auto;
`;

export const NotificationWrapper = styled.div`
  position: relative;
`;

export const IconButton = styled.button<{ $isMobile?: boolean }>`
  background: none;
  border: none;
  color: var(--gray-200);
  cursor: pointer;
  padding: ${props => props.$isMobile ? '0.4rem' : '0.5rem'};
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
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

export const UserAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${props => props.$isMobile ? '2rem' : '2.5rem'};
  height: ${props => props.$isMobile ? '2rem' : '2.5rem'};
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, var(--primary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid var(--gray-600);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  position: relative;
  
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

export const UserDropdown = styled.div<{ $isOpen: boolean; $isMobile?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border);
  min-width: ${props => props.$isMobile ? '180px' : '200px'};
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

export const DropdownHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--background-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
`;

export const DropdownUserName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

export const DropdownUserEmail = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const DropdownMenu = styled.ul`
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
`;

export const DropdownMenuItem = styled.li`
  padding: 0;
  margin: 0;
`;

export const DropdownMenuLink = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--background-secondary);
    color: var(--primary-600);
  }
  
  &:active {
    background: var(--background-secondary);
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: var(--border);
  margin: 0.5rem 0;
`;

export const MobileMenuButton = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  color: var(--gray-200);
  margin-right: 0.5rem;
  flex: 1;
  
  &:hover {
    color: var(--secondary-500);
    background-color: var(--gray-600);
  }
`;

export const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

export const MobileMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 56px);
  background: white;
  z-index: 9999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`;

export const MobileNavItem = styled.div<{ $active?: boolean }>`
  padding: 1rem 1.5rem;
  color: ${props => props.$active ? 'var(--primary-600)' : 'var(--text-primary)'};
  background-color: ${props => props.$active ? 'var(--primary-50)' : 'transparent'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s ease;
  border-left: 4px solid ${props => props.$active ? 'var(--primary-600)' : 'transparent'};
  border-bottom: 1px solid var(--border);
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-50)' : 'var(--background-secondary)'};
    color: var(--primary-600);
  }
  
  &:active {
    background-color: var(--background-secondary);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;
