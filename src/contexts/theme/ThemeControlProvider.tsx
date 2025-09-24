import React, { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { TemaService } from '../../service';
import { AppTheme, DEFAULT_THEME_SYSTEM, Tema } from 'lcano-react-ui';

type ThemeContextType = {
  currentTheme: AppTheme;
  updateTheme: (themeId: number, token?: string) => Promise<void>;
  loadUserTheme: (userId: number, token: string) => Promise<void>;
  isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextType>(null!);

export const ThemeControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarTemaPadrao = async () => {
      setIsLoading(true);
      try {
        const temaPadrao = await TemaService.getTemaPadrao();
        if (temaPadrao) {
          convertAndSetTheme(temaPadrao);
        }
      } catch (error) {
        console.error("Erro ao carregar tema padrão:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarTemaPadrao();
  }, []);

  const convertAndSetTheme = (temaUsuario: Tema) => {
    setTheme({
      title: temaUsuario.title,
      colors: {
        primary: temaUsuario.primaryColor,
        secondary: temaUsuario.secondaryColor,
        tertiary: temaUsuario.tertiaryColor,
        quaternary: temaUsuario.quaternaryColor,
        white: temaUsuario.whiteColor,
        black: temaUsuario.blackColor,
        gray: temaUsuario.grayColor,
        success: temaUsuario.successColor,
        info: temaUsuario.infoColor,
        warning: temaUsuario.warningColor,
      },
    });
  };

  const updateTheme = async (themeId: number, token?: string) => {
    setIsLoading(true);
    try {
      let temaUsuario: Tema | undefined;
      
      if (token) {
        temaUsuario = await TemaService.getTema(token, themeId);
      } else {
        temaUsuario = await TemaService.getTemaPadrao();
      }
      
      if (temaUsuario) {
        convertAndSetTheme(temaUsuario);
      }
    } catch (error) {
      console.error("Erro ao atualizar tema:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserTheme = async (themeId: number, token: string) => {
    setIsLoading(true);
    try {
      const temaUsuario = await TemaService.getTema(token, themeId);
      if (temaUsuario) {
        convertAndSetTheme(temaUsuario);
      }
    } catch (error) {
      console.error("Erro ao carregar tema do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTheme = theme || DEFAULT_THEME_SYSTEM;

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme, loadUserTheme, isLoading }}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}