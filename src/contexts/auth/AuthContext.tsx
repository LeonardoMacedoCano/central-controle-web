import { createContext, useContext } from 'react';
import { Usuario } from '../../types';

type AuthContextType = {
  usuario: Usuario | null;
  login: (username: string, senha: string) => Promise<boolean>;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};