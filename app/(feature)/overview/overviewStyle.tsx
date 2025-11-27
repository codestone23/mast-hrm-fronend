import styled from "styled-components";

export const PageContainer = styled.div<{ $isMobile?: boolean }>`
  background-color: #f9fafb;
`;

export const ContentWrapper = styled.main<{ $isMobile?: boolean }>`
  overflow: hidden;
  margin-top: ${props => props.$isMobile ? '56px' : '60px'}; 
`;

export const ContentHeader = styled.div<{ $isMobile?: boolean }>`
  overflow: hidden;
`;