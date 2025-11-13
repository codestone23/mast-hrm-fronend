"use client";

import React from 'react';
import { StyledButton } from './buttonStyle';
import Loading from "../Loading/Loading";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'disabled' | 'className'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  $fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  $fullWidth = false,
  type = 'button',
  onClick,
  className,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      $fullWidth={$fullWidth}
      type={type}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="icon-left">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="icon-right">{icon}</span>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
