import styled from 'styled-components';

export const GridContainer = styled.div`
  padding: 2.5rem 2rem;
  margin: 0 auto;
  background-color: var(--primary-400);
  min-height: calc(100vh - 80px);
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #2563eb;
    border-radius: 2px;
  }
`;

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ModuleCard = styled.div`
  background-color: #e5e4e4;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: #2563eb;
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  background-color: #2563eb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: white;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
  
  ${ModuleCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  }
`;

export const ModuleName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
  
  ${ModuleCard}:hover & {
    color: #2563eb;
  }
`;

export const ModuleDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  max-width: 200px;
`;
