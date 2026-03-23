import { createContext, useContext } from 'react';
import { Parametro, initialParametroState } from '../../types';

type ParametroContextType = {
  parametros: Parametro;
  reloadParametros: () => Promise<void>;
};

export const ParametroContext = createContext<ParametroContextType>({
  parametros: initialParametroState,
  reloadParametros: async () => {},
});

export const useParametro = (): ParametroContextType => useContext(ParametroContext);
