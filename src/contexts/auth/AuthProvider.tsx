import { useEffect, useRef, useState } from "react";
import { AuthService } from "../../service";
import { AuthContext } from "../auth/AuthContext";
import { Usuario } from "../../types";
import { useThemeControl } from "../theme/ThemeControlProvider";
import { useMessage } from "lcano-react-ui";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { loadUserTheme } = useThemeControl();
  const message = useMessage();

  const loadUserThemeRef = useRef(loadUserTheme);
  loadUserThemeRef.current = loadUserTheme;
  const messageRef = useRef(message);
  messageRef.current = message;

  useEffect(() => {
    // executa apenas no mount para validar token armazenado
    const validateToken = async () => {
      const storageData = localStorage.getItem('authToken');
      if (!storageData) return;

      const u = await AuthService.validateToken(storageData, messageRef.current);
      if (u) {
        setUsuario(u);
        if (u.idTema) loadUserThemeRef.current(u.idTema, u.token);
      } else {
        clearToken();
      }
    };
    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username: string, senha: string) => {
    const usuario = await AuthService.login(username, senha, message);
    
    if (usuario) {
      setUsuario(usuario);
      setToken(usuario.token);
      
      if (usuario.idTema) {
        loadUserTheme(usuario.idTema, usuario.token);
      }
      
      return true;
    }
    return false;
  }

  const signout = () => {
    setUsuario(null);
    clearToken();
  }

  const setToken = (token: string) => {
    localStorage.setItem('authToken', token);
  }

  const clearToken = () => {
    localStorage.removeItem('authToken');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
}