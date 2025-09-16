"use client";

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from './modalStyle';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer
        ref={modalRef}
        size={size}
        className={className}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <ModalContent>
          {(title || closable) && (
            <ModalHeader>
              {title && (
                <ModalTitle id="modal-title">
                  {title}
                </ModalTitle>
              )}
              {closable && (
                <ModalCloseButton
                  onClick={onClose}
                  aria-label="Đóng modal"
                >
                  <X size={20} />
                </ModalCloseButton>
              )}
            </ModalHeader>
          )}
          
          <ModalBody>
            {children}
          </ModalBody>
          
          {footer && (
            <ModalFooter>
              {footer}
            </ModalFooter>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
