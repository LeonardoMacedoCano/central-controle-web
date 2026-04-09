import React, { useState, useEffect } from 'react';
import { ParametroContext } from './ParametroContext';
import { ParametroService } from '../../service';
import { Parametro, initialParametroState } from '../../types';
import { useAuth } from '../auth/AuthContext';

export const ParametroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parametros, setParametros] = useState<Parametro>(initialParametroState);
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario?.token) {
      ParametroService.getParametros(usuario.token)
        .then(result => { if (result) setParametros(result); });
    } else {
      setParametros(initialParametroState);
    }
  }, [usuario?.token]);

  const reloadParametros = async () => {
    if (usuario?.token) {
      const result = await ParametroService.getParametros(usuario.token);
      if (result) setParametros(result);
    }
  };

  return (
    <ParametroContext.Provider value={{ parametros, reloadParametros }}>
      {children}
    </ParametroContext.Provider>
  );
};
