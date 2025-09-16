"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  SelectContainer,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectDropdown,
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
  className?: string;
  id?: string;
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
  className,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(option => option.value === selectedValue);
  
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    if (!disabled) {
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
    <SelectContainer className={className} fullWidth={fullWidth}>
      {label && (
        <SelectLabel htmlFor={selectId} required={required}>
          {label}
          {required && <span className="required">*</span>}
        </SelectLabel>
      )}
      
      <div ref={selectRef} style={{ position: 'relative' }}>
        <SelectTrigger
          id={selectId}
          size={size}
          disabled={disabled}
          hasError={!!error}
          isOpen={isOpen}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <SelectValue hasValue={!!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectValue>
          <SelectIcon isOpen={isOpen}>
            <ChevronDown size={16} />
          </SelectIcon>
        </SelectTrigger>

        {isOpen && (
          <SelectDropdown role="listbox">
            {searchable && (
              <div style={{ padding: '0.5rem' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Không có tùy chọn nào
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectOption
                  key={option.value}
                  disabled={option.disabled}
                  selected={option.value === selectedValue}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === selectedValue}
                >
                  <span>{option.label}</span>
                  {option.value === selectedValue && (
                    <Check size={16} />
                  )}
                </SelectOption>
              ))
            )}
          </SelectDropdown>
        )}
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </SelectContainer>
  );
};

export default Select;
