import React from 'react';
import { 
  Button,
  Modal
} from '../';
import { VariantColor } from '../../utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  modalWidth?: string;
  variant?: VariantColor;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  content, 
  onClose, 
  onConfirm,
  modalWidth = '400px',
  variant = 'warning'
}) => {
  const confirmButton = (
    <Button 
      variant={variant}
      width="100px"
      height="30px"
      style={{
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      description="ACEITAR"
      onClick={() => { onConfirm(); onClose(); }}
    />
  );

  const cancelButton = (
    <Button 
      width="100px"
      height="30px"
      style={{
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      description="CANCELAR"
      onClick={onClose}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      variant={variant}
      title={title}
      content={content}
      modalWidth={modalWidth}
      maxWidth='85%'
      onClose={onClose}
      showCloseButton={false}
      actions={
        <>
          {cancelButton}
          {confirmButton}
        </>
      }
    />
  );
};

export default ConfirmModal;
