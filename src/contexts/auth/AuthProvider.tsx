import { useEffect, useState, useContext } from "react";
import { AuthService } from "../../service";
import { AuthContext } from "../auth/AuthContext";
import { Usuario } from "../../types";
import { ThemeContext } from "../theme/ThemeControlProvider";
import { useMessage } from "../message/ContextMessageProvider";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { loadUserTheme } = useContext(ThemeContext);
  const message = useMessage(); 

  useEffect(() => {
    const validateToken = async () => {
      const storageData = localStorage.getItem('authToken');
      if (storageData && !usuario) {
        const usuario = await AuthService.validateToken(storageData, message);
        if (usuario) {
          setUsuario(usuario);
          
          if (usuario.idTema) {
            loadUserTheme(usuario.idTema, usuario.token);
          }
        } else {
          clearToken(); 
        }
      } 
    }
    validateToken();
  }, []);

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