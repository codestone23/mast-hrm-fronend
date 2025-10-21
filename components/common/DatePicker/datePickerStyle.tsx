import styled, { css } from "styled-components";

export const DatePickerContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;

  ${({ $fullWidth }) =>
    $fullWidth &&  
    css`
      width: 100%;
    `}
`;

export const DatePickerLabel = styled.label<{ required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);

  .required {
    color: var(--error-500);
    margin-left: 0.25rem;
  }
`;

export const DatePickerInput = styled.input<{
  $size?: string;
  $disabled?: boolean;
  $hasError?: boolean;
}>`
  width: 100%;
  background-color: transparent;
  border: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  padding-right: 2.75rem;

  ${({ $size }) => {
    switch ($size as string) {
      case "sm":
        return css`
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
        `;
      case "lg":
        return css`
          padding: 1rem 1rem;
          font-size: 1rem;
        `;
      default:
        return css`
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        `;
    }
  }}

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: var(--error-500);
    `}
  
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      background-color: var(--gray-100);
    `}
  
  &:hover:not(:disabled) {
    border-color: var(--gray-300);
  }

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const DatePickerIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
`;

export const DatePickerDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{
  align?: "left" | "right" | "center";
  $triggerRect?: DOMRect;
}>`
  position: fixed;
  top: ${({ $triggerRect }) => $triggerRect ? `${$triggerRect.bottom + 4}px` : 'auto'};
  left: ${({ $triggerRect, align }) => {
    if (!$triggerRect) return 'auto';
    if (align === "right") return `${$triggerRect.right - $triggerRect.width}px`;
    if (align === "center") return `${$triggerRect.left + ($triggerRect.width / 2)}px`;
    return `${$triggerRect.left}px`;
  }};
  width: ${({ $triggerRect }) => $triggerRect ? `${$triggerRect.width}px` : 'auto'};
  transform: ${({ align }) => align === "center" ? 'translateX(-50%)' : 'none'};
  z-index: 1002;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  margin-top: 0.25rem;
  padding: 1rem;
  min-width: 280px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CalendarNav = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--gray-100);
    color: var(--text-primary);
  }
`;

export const CalendarTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

export const CalendarDayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
`;

export const CalendarDay = styled.button<{
  $isToday?: boolean;
  $isSelected?: boolean;
  $isCurrentMonth?: boolean;
  $isDisabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  border: none;
  background: none;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);

  ${({ $isCurrentMonth }) =>
    !$isCurrentMonth &&
    css`
      color: var(--text-muted);
      opacity: 0.5;
    `}

  ${({ $isToday }) =>
    $isToday &&
    css`
      background-color: var(--primary-100);
      color: var(--primary-600);
      font-weight: 600;
    `}
  
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: var(--primary-500);
      color: white;
      font-weight: 600;
    `}
  
  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      opacity: 0.3;
      cursor: not-allowed;
    `}
  
  &:hover:not(:disabled) {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "var(--primary-600)" : "var(--gray-100)"};
  }
`;

export const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: var(--error-500);
  margin-top: 0.25rem;
`;

export const HelperText = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

export const MonthItem = styled.button<{
  $isCurrentMonth?: boolean;
  $isSelected?: boolean;
}>`
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.12s ease;

  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }

  ${({ $isCurrentMonth }) =>
    $isCurrentMonth &&
    css`
      background-color: var(--primary-100);
      color: var(--primary-600);
      font-weight: 600;
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: var(--primary-500);
      color: white;
    `}
`;
