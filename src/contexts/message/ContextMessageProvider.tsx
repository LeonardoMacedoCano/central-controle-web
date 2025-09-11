import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { NotificationBox } from '../../components';

export interface ContextMessageProps {
  showError: (message: string) => void;
  showErrorWithLog: (message: string, error: any) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const ContextMessage = createContext<ContextMessageProps | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

const ContextMessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<{ type: 'error' | 'success' | 'info'; message: string | null }>({
    type: 'error',
    message: null,
  });

  useEffect(() => {
    const clearTimer = messages.message ? setTimeout(() => setMessages({ ...messages, message: null }), 5000) : undefined;

    return () => {
      clearTimer && clearTimeout(clearTimer);
    };
  }, [messages]);

  const showMessage = (type: 'error' | 'success' | 'info', message: string) => {
    setMessages({ type, message });
  };

  const showError = (message: string) => {
    showMessage('error', message);
  };

  const showSuccess = (message: string) => {
    showMessage('success', message);
  };

  const showInfo = (message: string) => {
    showMessage('info', message);
  };

  const showErrorWithLog = (messageText: string, error: any) => {
    const formattedMessage = `${messageText} Consulte o log para mais detalhes!`;
    console.error(`${messageText}`, error);
    showMessage('error', formattedMessage);
  };

  return (
    <ContextMessage.Provider value={{ showError, showErrorWithLog, showSuccess, showInfo }}>
      {messages.message && <NotificationBox type={messages.type} message={messages.message} onClose={() => setMessages({ ...messages, message: null })} />}
      {children}
    </ContextMessage.Provider>
  );
};

export const useMessage = (): ContextMessageProps => {
  const context = useContext(ContextMessage);

  if (!context) {
    throw new Error('useMessage must be used within a ContextMessageProvider');
  }

  return context;
};

export default ContextMessageProvider;
