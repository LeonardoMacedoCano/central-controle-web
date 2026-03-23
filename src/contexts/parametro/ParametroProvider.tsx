import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ParametroContext } from './ParametroContext';
import { ParametroService } from '../../service';
import { Parametro, initialParametroState } from '../../types';
import { useAuth } from '../auth/AuthContext';

export const ParametroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parametros, setParametros] = useState<Parametro>(initialParametroState);
  const { usuario } = useAuth();

  const loadParametros = useCallback(async (token: string) => {
    const result = await ParametroService.getParametros(token);
    if (result) setParametros(result);
  }, []);

  const loadParametrosRef = useRef(loadParametros);
  loadParametrosRef.current = loadParametros;

  useEffect(() => {
    if (usuario?.token) {
      loadParametrosRef.current(usuario.token);
    } else {
      setParametros(initialParametroState);
    }
  }, [usuario?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  const reloadParametros = useCallback(async () => {
    if (usuario?.token) {
      await loadParametros(usuario.token);
    }
  }, [usuario?.token, loadParametros]);

  return (
    <ParametroContext.Provider value={{ parametros, reloadParametros }}>
      {children}
    </ParametroContext.Provider>
  );
};
