import styled from 'styled-components';

export const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  padding: ${props => props.$isMobile ? '1rem' : '2rem'};
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #1a1a2e 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  min-height: calc(100vh - ${props => props.$isMobile ? '56px' : '60px'});
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%);
    background-size: 100% 100%;
    pointer-events: none;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export const WelcomeSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  margin-bottom: ${props => props.$isMobile ? '1.5rem' : '3rem'};
  color: white;
  position: relative;
  z-index: 2;
`;

export const WelcomeGreeting = styled.h1.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '1.5rem' : '2.5rem'};
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
`;

export const WelcomeDate = styled.p.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '0.9rem' : '1.1rem'};
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: ${props => props.$isMobile ? '1rem' : '2rem'};
`;

export const WelcomeDivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  margin-bottom: 2rem;
`;

export const SystemSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.$isMobile ? '1rem' : '2rem'};
  position: relative;
  z-index: 2;
`;

export const SystemBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  width: 4px;
  height: ${props => props.$isMobile ? '32px' : '40px'};
  background: linear-gradient(180deg, #ff6b35, #f7931e);
  border-radius: 2px;
  margin-right: ${props => props.$isMobile ? '0.75rem' : '1rem'};
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
`;

export const SystemTitle = styled.h2.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '1.25rem' : '1.8rem'};
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const ModulesGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${props => {
    if (props.$isMobile) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  }};
  gap: ${props => props.$isMobile ? '0.75rem' : '1.5rem'};
  position: relative;
  z-index: 2;
  
  @media (max-width: 1200px) {
    grid-template-columns: ${props => props.$isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};
  }
  
  @media (max-width: 900px) {
    grid-template-columns: ${props => props.$isMobile ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)'};
  }
`;

export const ModuleCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.$isMobile ? '12px' : '20px'};
  padding: ${props => props.$isMobile ? '0.75rem 0.5rem' : '1.5rem 1rem'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isMobile ? '0 4px 16px rgba(0, 0, 0, 0.08)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: ${props => props.$isMobile ? 'translateY(-3px)' : 'translateY(-6px)'};
    box-shadow: ${props => props.$isMobile ? '0 8px 24px rgba(0, 0, 0, 0.15)' : '0 16px 48px rgba(0, 0, 0, 0.2)'};
    background: rgba(255, 255, 255, 1);
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean; $backgroundColor?: string }>`
  width: ${props => props.$isMobile ? '2.5rem' : '4rem'};
  height: ${props => props.$isMobile ? '2.5rem' : '4rem'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.$isMobile ? '0.5rem' : '1rem'};
  color: white;
  background-color: ${props => props.$backgroundColor || '#2563eb'};
  box-shadow: ${props => props.$isMobile ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 4px 16px rgba(0, 0, 0, 0.15)'};
  transition: all 0.3s ease;
  
  ${ModuleCard}:hover & {
    transform: scale(${props => props.$isMobile ? '1.05' : '1.1'});
    box-shadow: ${props => props.$isMobile ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 6px 24px rgba(0, 0, 0, 0.25)'};
  }
`;

export const ModuleName = styled.h3.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '0.85rem' : '1.1rem'};
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: ${props => props.$isMobile ? '0.25rem' : '0.5rem'};
  transition: color 0.3s ease;
  
  ${ModuleCard}:hover & {
    color: #ff6b35;
  }
`;

export const ModuleDescription = styled.p.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '0.7rem' : '0.85rem'};
  color: #666;
  line-height: ${props => props.$isMobile ? '1.3' : '1.4'};
  max-width: ${props => props.$isMobile ? '100%' : '180px'};
`;
