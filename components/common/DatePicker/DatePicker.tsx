"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DatePickerContainer,
  DatePickerLabel,
  DatePickerInput,
  DatePickerIcon,
  DatePickerDropdown,
  CalendarHeader,
  CalendarNav,
  CalendarTitle,
  CalendarGrid,
  CalendarDay,
  CalendarDayHeader,
  ErrorMessage,
  HelperText
} from './datePickerStyle';

export interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  id?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'md',
  fullWidth = true,
  format = 'dd/mm/yyyy',
  minDate,
  maxDate,
  className,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? (typeof value === 'string' ? new Date(value) : value) : null
  );
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  
  const datePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const datePickerId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      setSelectedDate(date);
      setViewDate(date);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    setIsOpen(false);
    onChange?.(date);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Điều chỉnh để bắt đầu từ thứ 2
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    // Tạo 42 ngày (6 tuần)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === viewDate.getMonth();
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const days = getDaysInMonth(viewDate);

  return (
    <DatePickerContainer className={className} fullWidth={fullWidth}>
      {label && (
        <DatePickerLabel htmlFor={datePickerId} required={required}>
          {label}
          {required && <span className="required">*</span>}
        </DatePickerLabel>
      )}
      
      <div ref={datePickerRef} style={{ position: 'relative' }}>
        <DatePickerInput
          ref={inputRef}
          id={datePickerId}
          size={size}
          disabled={disabled}
          hasError={!!error}
          readOnly
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <DatePickerIcon>
          <Calendar size={16} />
        </DatePickerIcon>

        {isOpen && (
          <DatePickerDropdown>
            <CalendarHeader>
              <CalendarNav onClick={handlePrevMonth}>
                <ChevronLeft size={16} />
              </CalendarNav>
              <CalendarTitle>
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </CalendarTitle>
              <CalendarNav onClick={handleNextMonth}>
                <ChevronRight size={16} />
              </CalendarNav>
            </CalendarHeader>

            <CalendarGrid>
              {dayNames.map(day => (
                <CalendarDayHeader key={day}>{day}</CalendarDayHeader>
              ))}
              
              {days.map((date, index) => (
                <CalendarDay
                  key={index}
                  isToday={isToday(date)}
                  isSelected={isSelected(date)}
                  isCurrentMonth={isCurrentMonth(date)}
                  isDisabled={isDateDisabled(date)}
                  onClick={() => handleDateSelect(date)}
                >
                  {date.getDate()}
                </CalendarDay>
              ))}
            </CalendarGrid>
          </DatePickerDropdown>
        )}
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </DatePickerContainer>
  );
};

export default DatePicker;
