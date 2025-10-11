import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SuccessIcon,
  Title,
  Message,
  Button
} from './successModalStyle';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Đóng',
  onButtonClick
}) => {
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <SuccessIcon>
            <CheckCircle size={48} />
          </SuccessIcon>
        </ModalHeader>
        
        <ModalBody>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;
