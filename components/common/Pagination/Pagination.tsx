"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  PaginationNumbers,
  PaginationNumber,
} from './paginationStyle';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  showInfo?: boolean;
  disabled?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  showInfo = true,
  disabled = false,
  className,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    if (!showPageNumbers) return [];

    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const formatInfo = () => {
    if (!showInfo) return '';
    
    if (totalItems && itemsPerPage) {
      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      return `Hiển thị ${startItem}-${endItem} trong tổng số ${totalItems}`;
    }
    
    return `Trang ${currentPage} / ${totalPages}`;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <PaginationContainer className={className}>
      <PaginationButton
        onClick={handlePrevious}
        disabled={disabled || currentPage <= 1}
      >
        <ChevronLeft size={16} />
        Trước
      </PaginationButton>

      {showPageNumbers && visiblePages.length > 0 && (
        <PaginationNumbers>
          {visiblePages[0] > 1 && (
            <>
              <PaginationNumber
                $active={false}
                onClick={() => handlePageClick(1)}
                disabled={disabled}
              >
                1
              </PaginationNumber>
              {visiblePages[0] > 2 && <span>...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationNumber
              key={page}
              $active={page === currentPage}
              onClick={() => handlePageClick(page)}
              disabled={disabled}
            >
              {page}
            </PaginationNumber>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span>...</span>}
              <PaginationNumber
                $active={false}
                onClick={() => handlePageClick(totalPages)}
                disabled={disabled}
              >
                {totalPages}
              </PaginationNumber>
            </>
          )}
        </PaginationNumbers>
      )}

      <PaginationButton
        onClick={handleNext}
        disabled={disabled || currentPage >= totalPages}
      >
        Sau
        <ChevronRight size={16} />
      </PaginationButton>

      {showInfo && (
        <PaginationInfo>
          {formatInfo()}
        </PaginationInfo>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
