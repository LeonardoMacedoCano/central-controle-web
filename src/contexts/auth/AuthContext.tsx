import { createContext } from 'react';
import { Usuario } from '../../types';

type AuthContextType = {
  usuario: Usuario | null;
  login: (username: string, senha: string) => Promise<boolean>;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);