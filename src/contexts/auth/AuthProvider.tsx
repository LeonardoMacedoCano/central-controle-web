import { useEffect, useState, useContext } from "react";
import { AuthService } from "../../service";
import { AuthContext } from "../auth/AuthContext";
import { Usuario } from "../../types";
import { ThemeContext } from "../theme/ThemeControlProvider";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const authService = AuthService();
  const { loadUserTheme } = useContext(ThemeContext);

  useEffect(() => {
    const validateToken = async () => {
      const storageData = localStorage.getItem('authToken');
      if (storageData && !usuario) {
        const usuario = await authService.validateToken(storageData);
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
    const usuario = await authService.login(username, senha);
    
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