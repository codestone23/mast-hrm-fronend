"use client";

import React from "react";
import {
  TableContainer,
  TableHeader,
  TableRow,
  TableCell,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./tableStyle";
import Loading from "../Loading/Loading";

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: Error | null;
  emptyState?: {
    icon?: React.ReactNode;
    message?: string;
  };
  onRowClick?: (row: T, index: number) => void;
  gridTemplateColumns?: string;
  loadingComponent?: React.ReactNode;
  rowKey?: string | ((row: T, index: number) => string | number);
  className?: string;
}

function Table<T = unknown>({
  columns,
  data,
  loading = false,
  error = null,
  emptyState,
  onRowClick,
  gridTemplateColumns,
  loadingComponent,
  rowKey,
  className,
}: TableProps<T>) {
  // Generate grid template columns from columns if not provided
  const getGridTemplateColumns = () => {
    if (gridTemplateColumns) return gridTemplateColumns;
    return columns.map((col) => col.width || "1fr").join(" ");
  };

  // Get row key
  const getRowKey = (row: T, index: number): string | number => {
    if (rowKey) {
      if (typeof rowKey === "function") {
        return rowKey(row, index);
      }
      const rowRecord = row as Record<string, unknown>;
      const keyValue = rowRecord[rowKey];
      if (typeof keyValue === "string" || typeof keyValue === "number") {
        return keyValue;
      }
    }
    return index;
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, row: T, index: number): React.ReactNode => {
    const rowRecord = row as Record<string, unknown>;
    const value = rowRecord[column.key];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    if (value === null || value === undefined) {
      return "-";
    }
    
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    
    return String(value);
  };

  // Loading state
  if (loading) {
    return (
      <TableContainer className={className}>
        <EmptyState>
          {loadingComponent || <Loading />}
        </EmptyState>
      </TableContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <TableContainer className={className}>
        <EmptyState>
          <EmptyIcon>
            {emptyState?.icon || "⚠️"}
          </EmptyIcon>
          <EmptyText>
            {error.message || "Không thể tải dữ liệu"}
          </EmptyText>
        </EmptyState>
      </TableContainer>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <TableContainer className={className}>
        <EmptyState>
          {emptyState?.icon && <EmptyIcon>{emptyState.icon}</EmptyIcon>}
          <EmptyText>
            {emptyState?.message || "Không có dữ liệu"}
          </EmptyText>
        </EmptyState>
      </TableContainer>
    );
  }

  // Render table with data
  return (
    <TableContainer className={className}>
      <TableHeader $gridTemplateColumns={getGridTemplateColumns()}>
        {columns.map((column) => (
          <TableCell key={column.key} $align={column.align || "left"}>
            {column.label}
          </TableCell>
        ))}
      </TableHeader>
      {data.map((row, index) => (
        <TableRow
          key={getRowKey(row, index)}
          $gridTemplateColumns={getGridTemplateColumns()}
          $clickable={!!onRowClick}
          onClick={() => onRowClick?.(row, index)}
        >
          {columns.map((column) => (
            <TableCell key={column.key} $align={column.align || "left"}>
              {renderCell(column, row, index)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableContainer>
  );
}

export default Table;

