"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 20px;

  @media (max-width: 768px) {
    gap: 4px;
    padding: 16px 8px;
    flex-wrap: wrap;
  }
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => props.$active ? '#2196F3' : 'white'};
  color: ${props => props.$active ? 'white' : props.$disabled ? '#d1d5db' : '#6b7280'};
  font-size: 14px;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#1976d2' : '#f9fafb'};
    border-color: ${props => props.$active ? '#1976d2' : '#d1d5db'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    font-size: 12px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Dots = styled.span`
  padding: 0 8px;
  color: #9ca3af;
  font-size: 14px;
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        $disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </PageButton>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return <Dots key={`dots-${index}`}>...</Dots>;
        }

        const pageNumber = page as number;
        return (
          <PageButton
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            $active={currentPage === pageNumber}
          >
            {pageNumber}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        $disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;

