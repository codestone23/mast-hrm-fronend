import styled from "styled-components";

// Import shared styles
export {
  ProjectsContainer,
  ProjectsHeader,
  ProjectsTitle,
  ProjectsSubtitle,
  ProjectsGrid,
  ProjectCard,
  ProjectInfo,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  ProjectMetaItem,
  ProjectActions,
  ProjectActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "@/components/personal/projects/projectStyle";

// Search container
export const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

// Button with responsive styles
export const CreateButton = styled.div<{ $isMobile?: boolean }>`
  width: ${props => props.$isMobile ? "100%" : "auto"};
  margin-top: ${props => props.$isMobile ? "12px" : "0"};
`;

// Pagination wrapper
export const PaginationWrapper = styled.div`
  margin-top: 2rem;
`;

