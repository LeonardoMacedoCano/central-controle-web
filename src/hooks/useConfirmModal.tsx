import React, { useState, useCallback } from 'react';
import ConfirmModal from '../components/modal/ConfirmModal';

const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => () => {});
  const [title, setTitle] = useState<string>("Confirmação");
  const [content, setContent] = useState<React.ReactNode>(<p>Deseja realmente executar esta ação?</p>);

  const confirm = useCallback((newTitle: string, newContent: React.ReactNode): Promise<boolean> => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolve(() => resolve);
    });
  }, []);

  const handleCloseModal = (value: boolean) => {
    setIsOpen(false);
    resolve(value);
  };

  const ConfirmModalComponent = (
    <ConfirmModal
      isOpen={isOpen}
      title={title}
      content={content}
      onClose={() => handleCloseModal(false)}
      onConfirm={() => handleCloseModal(true)}
    />
  );

  return {
    confirm,
    ConfirmModalComponent
  };
};

export default useConfirmModal;
