"use client";

import React, { forwardRef } from 'react';
import { 
  InputContainer, 
  InputLabel, 
  ErrorMessage, 
  HelperText
} from '../Input/inputStyle';
import { StyledTextArea } from './textAreaStyle';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  fullWidth?: boolean;
  required?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  fullWidth = true,
  required = false,
  className,
  id,
  rows = 3,
  ...props
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <InputContainer className={className} $fullWidth={fullWidth}>
      {label && (
        <InputLabel htmlFor={inputId} required={required}>
          {label}
          {required && <span className="required">*</span>}
        </InputLabel>
      )}
      
      <StyledTextArea
        ref={ref}
        id={inputId}
        rows={rows}
        $size={size}
        $variant={variant}
        $hasError={!!error}
        {...props}
      />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
