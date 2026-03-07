import React from 'react';
import { Parametro } from '../../../../types';
import { SearchSelectField, Stack } from 'lcano-react-ui';
import { useAuth } from '../../../../contexts';
import { useCategoriaSelectAdapter } from '../../../../utils';

interface Props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const RendaParametroSectionForm: React.FC<Props> = ({ parametros, onUpdate }) => {
  const { usuario } = useAuth();

  const categoriaAdapter = useCategoriaSelectAdapter(
    'RENDA',
    usuario?.token,
    parametros.rendaCategoriaPadrao,
    (newValue) => onUpdate({ ...parametros, rendaCategoriaPadrao: newValue })
  );

  const categoriaPassivaAdapter = useCategoriaSelectAdapter(
    'RENDA',
    usuario?.token,
    parametros.rendaPassivaCategoria,
    (newValue) => onUpdate({ ...parametros, rendaPassivaCategoria: newValue })
  );

  return (
    <Stack direction="column" divider="top">
      <SearchSelectField
        label="Categoria Padrão"
        fetchOptions={categoriaAdapter.fetchOptions}
        value={categoriaAdapter.optionValue}
        onSelect={categoriaAdapter.onSelect}
      />
      <SearchSelectField
        label="Categoria Renda Passiva"
        fetchOptions={categoriaPassivaAdapter.fetchOptions}
        value={categoriaPassivaAdapter.optionValue}
        onSelect={categoriaPassivaAdapter.onSelect}
      />
    </Stack>
  );
};

export default RendaParametroSectionForm;
