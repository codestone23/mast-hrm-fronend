"use client";

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { 
  InputContainer, 
  InputLabel, 
  InputWrapper, 
  StyledInput, 
  InputIcon, 
  ErrorMessage, 
  HelperText,
  TogglePasswordButton
} from './inputStyle';
import { StyledTextArea } from '../TextArea/textAreaStyle';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  fullWidth?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  fullWidth = true,
  required = false,
  type = 'text',
  multiline = false,
  rows = 3,
  className,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`; 
  const isPassword = type === 'password' && !multiline;
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If multiline, render as textarea
  if (multiline) {
    return (
      <InputContainer className={className} $fullWidth={fullWidth}>
        {label && (
          <InputLabel htmlFor={inputId} required={required}>
            {label}
            {required && <span className="required">*</span>}
          </InputLabel>
        )}
        
        <StyledTextArea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={inputId}
          rows={rows}
          $size={size}
          $variant={variant}
          $hasError={!!error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }

  return (
    <InputContainer className={className} $fullWidth={fullWidth}>
      {label && (
        <InputLabel htmlFor={inputId} required={required}>
          {label}
          {required && <span className="required">*</span>}
        </InputLabel>
      )}
      
      <InputWrapper 
        $size={size}
        $variant={variant}
        $hasError={!!error}
        $isFocused={isFocused}
        $hasLeftIcon={!!icon && iconPosition === 'left'}
        $hasRightIcon={!!icon && iconPosition === 'right' || isPassword}
      >
        {icon && iconPosition === 'left' && (
          <InputIcon $position="left">
            {icon}
          </InputIcon>
        )}
        
        <StyledInput
          ref={ref as React.Ref<HTMLInputElement>}
          id={inputId}
          type={inputType}
          $size={size}
          $variant={variant}
          $hasError={!!error}
          $hasLeftIcon={!!icon && iconPosition === 'left'}
          $hasRightIcon={!!icon && iconPosition === 'right' || isPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        
        {icon && iconPosition === 'right' && !isPassword && (
          <InputIcon $position="right">
            {icon}
          </InputIcon>
        )}
        
        {isPassword && (
          <TogglePasswordButton
            type="button"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </TogglePasswordButton>
        )}
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
