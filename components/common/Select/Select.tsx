"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import {
  SelectContainer,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectDropdown,
  SelectSearchContainer,
  SelectOptionsContainer,
  SelectOption,
  ErrorMessage,
  HelperText
} from './selectStyle';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  searchable?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  className?: string;
  id?: string;
  // Infinite scroll props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadingText?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Chọn một tùy chọn',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'md',
  fullWidth = true,
  searchable = false,
  onSearchChange,
  className,
  id,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  loadingText = 'Đang tải thêm...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (selectRef.current && 
          !selectRef.current.contains(target) && 
          dropdownRef.current &&
          !dropdownRef.current.contains(target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Update triggerRect when dropdown is open and on scroll/resize
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updateTriggerRect = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setTriggerRect(rect);
      }
    };

    // Update immediately
    updateTriggerRect();

    // Update on scroll
    window.addEventListener('scroll', updateTriggerRect, true);
    // Update on resize
    window.addEventListener('resize', updateTriggerRect);

    return () => {
      window.removeEventListener('scroll', updateTriggerRect, true);
      window.removeEventListener('resize', updateTriggerRect);
    };
  }, [isOpen]);

  // Infinite scroll logic
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !isOpen || !hasNextPage || isFetchingNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const selectedOption = options.find(option => option.value === selectedValue);
  
  // If onSearchChange is provided, don't filter client-side (server-side search)
  // Otherwise, filter client-side
  const filteredOptions = searchable && !onSearchChange
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setTriggerRect(rect);
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedValue(option.value);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(option.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <SelectContainer className={!!className ? className : ''} $fullWidth={fullWidth}>
      {label && (
        <SelectLabel $required={required}>
          {label}
          {required && <span className="required" style={{ color: 'var(--error-500)' }}> *</span>}
        </SelectLabel>
      )}
      
      <div ref={selectRef} style={{ position: 'relative' }}>
        <SelectTrigger
          ref={triggerRef}
          $size={size}
          $disabled={disabled}
          $hasError={!!error}
          $isOpen={isOpen}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <SelectValue $hasValue={!!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectValue>
          <SelectIcon $isOpen={isOpen}>
            <ChevronDown size={16} />
          </SelectIcon>
        </SelectTrigger>

        {isOpen && createPortal(
          <SelectDropdown ref={dropdownRef} $triggerRect={triggerRect || undefined} role="listbox">
            {searchable && (
              <SelectSearchContainer>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => {
                    const newSearchTerm = e.target.value;
                    setSearchTerm(newSearchTerm);
                    onSearchChange?.(newSearchTerm);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </SelectSearchContainer>
            )}
            
            <SelectOptionsContainer>
              {filteredOptions.length === 0 ? (
                <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Không có tùy chọn nào
                </div>
              ) : (
                <>
                  {filteredOptions.map((option, index) => (
                    <SelectOption
                      key={`${option.value}-${option.label}-${index}`}
                      $disabled={option.disabled}
                      $selected={option.value === selectedValue}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={option.value === selectedValue}
                    >
                      <span>{option.label}</span>
                      {option.value === selectedValue && (
                        <Check size={16} />
                      )}
                    </SelectOption>
                  ))}
                  
                  {/* Sentinel element for infinite scroll */}
                  {hasNextPage && (
                    <div 
                      ref={sentinelRef}
                      style={{ 
                        height: '1px', 
                        marginTop: '8px',
                        visibility: 'hidden'
                      }}
                    />
                  )}
                  
                  {/* Loading indicator for infinite scroll */}
                  {isFetchingNextPage && (
                    <div style={{ 
                      padding: '0.75rem', 
                      textAlign: 'center', 
                      color: 'var(--text-muted)', 
                      fontSize: '0.875rem',
                      borderTop: '1px solid var(--border)',
                      marginTop: '4px'
                    }}>
                      {loadingText}
                    </div>
                  )}
                </>
              )}
            </SelectOptionsContainer>
          </SelectDropdown>,
          document.body
        )}
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </SelectContainer>
  );
};

export default Select;
