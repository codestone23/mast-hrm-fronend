import styled from "styled-components";

export const CompanyContainer = styled.div`
  background-color: var(--background-secondary);
  min-height: 100vh;
  padding: 1rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: fit-content;
`;

export const Tab = styled.div<{ $active: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${(props) =>
    props.$active
      ? `
    background: #2196F3;
    color: white;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  `
      : `
    color: #666;
    
    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  `}
`;

export const CompanyInfoSection = styled.div`
  width: 100%;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const CompanyLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #e9ecef;
`;

export const CompanyDetails = styled.div`
  flex: 1;
`;

export const CompanyName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
`;

export const CompanyAddress = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 14px;
`;

export const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  width: 100%;
`;

export const EmployeeSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

export const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.div`
  position: relative;
  max-width: 400px;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    background: #f8f9fa;
    
    &:focus {
      border-color: #2196F3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      background: white;
    }
    
    &::placeholder {
      color: #999;
    }
  }
`;

export const StatsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const StatCard = styled.div`
  background: #2196F3;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
`;

export const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
`;

export const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f7ff;
    border-color: #2196F3;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
  }
`;

export const EmployeeAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;
`;

export const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EmployeeName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

export const EmployeeEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const EmployeePosition = styled.div`
  font-size: 11px;
  color: #999;
`;

export const DivisionFilter = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  height: fit-content;
`;

export const DivisionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DivisionItem = styled.div<{ $active: boolean }>`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.$active
      ? `
    background: #FF9800;
    color: white;
  `
      : `
    background: #f8f9fa;
    color: #333;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

export const FilterOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DivisionName = styled.span`
  font-weight: 500;
`;

export const DivisionCount = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

export const DivisionSection = styled.div`
  margin-bottom: 2rem;
`;

export const DivisionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
`;

export const DivisionEmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SidebarCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SidebarCardTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.$active
      ? `
    background: #2196F3;
    color: white;
  `
      : `
    background: transparent;
    color: #333;
    
    &:hover {
      background: #f8f9fa;
    }
  `}
`;

export const FilterIcon = styled.div<{ $active?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid currentColor;
  margin-right: 12px;
  position: relative;
  
  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `}
`;

export const FilterLabel = styled.span`
  flex: 1;
  font-weight: 500;
`;

export const FilterCount = styled.span<{ $active?: boolean }>`
  background: #e9ecef;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${(props) =>
    props.$active &&
    `
    background: rgba(255, 255, 255, 0.2);
    color: white;
  `}
`;

export const EmptyStateMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;

export const AvatarImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const ShowMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const ShowMoreButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
  
  &:hover {
    background-color: #1976D2;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(33, 150, 243, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
  }
`;

export const FilterItemContent = styled.div`
  display: flex;
  align-items: center;
`;