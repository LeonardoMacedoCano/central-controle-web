import React from 'react';
import styled from 'styled-components';
import { 
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import { getVariantColor, VariantColor } from '../../utils';
import { Button } from '../';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  variant?: VariantColor;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonSize?: string;
  modalWidth?: string;
  maxWidth?: string;
  modalHeight?: string;
}

const getIcon = (variant: ModalProps['variant']) => {
  let icon;

  switch (variant) {
    case 'success':
      icon = <FaCheckCircle />;
      break;
    case 'warning':
      icon = <FaExclamationTriangle />;
      break;
    default:
      icon = <FaExclamationCircle />;;
      break;
  }

  return { icon };
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  variant = 'warning',
  actions,
  showCloseButton = true,
  closeButtonSize = '20px',
  modalWidth = '500px',
  maxWidth,
  modalHeight = 'auto'
}) => {
  const { icon: computedIcon} = getIcon(variant);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer 
        onClick={(e) => e.stopPropagation()}
        width={modalWidth}
        maxWidth={maxWidth}
        height={modalHeight}
      >
        <ModalHeader variant={variant}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {computedIcon && <span>{computedIcon}</span>}
            <ModalTitle variant={variant}>{title}</ModalTitle>
          </div>
          {showCloseButton && (
            <Button 
              width={closeButtonSize} 
              height={closeButtonSize} 
              style={{
                backgroundColor: 'transparent',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={<FaTimes />}
              hint='Fechar'
              onClick={onClose}
            />
          )}
        </ModalHeader>
        <ModalContent>{content}</ModalContent>
        {actions && <ModalActions>{actions}</ModalActions>}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

interface ModalContainerProps {
  width: string;
  maxWidth?: string;
  height: string;
}

export const ModalOverlay = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div<ModalContainerProps>`
  width: ${({ width }) => width};
  max-width:  ${({ maxWidth }) => maxWidth};
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0 0 5px 5px ${({ theme }) => theme.colors.secondary};
`;

interface ModalHeaderProps {
  variant: VariantColor;
}
export const ModalHeader = styled.div<ModalHeaderProps>`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ variant, theme }) => getVariantColor(theme, variant)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px; 
  margin-bottom: 10px;
  padding: 10px;
`;

export const ModalTitle = styled.div<ModalHeaderProps>`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  padding: 5px 10px;
`;

export const ModalContent = styled.div`
  padding: 10px 20px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
`;
