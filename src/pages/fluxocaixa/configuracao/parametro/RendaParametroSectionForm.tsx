import React from 'react';
import { FieldValue, Stack } from 'lcano-react-ui';
import { MovimentacaoCategoria, Parametro } from '../../../../types';

interface props {
  parametros: Parametro;
  categorias: MovimentacaoCategoria[];
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const RendaParametroSectionForm: React.FC<props> = ({ parametros, categorias, onUpdate }) => {

  const handleUpdateCategoriaGanhosAtivo = (value: any) => {
    const selectedCategoria = categorias.find(c => String(c.id) === String(value)); 
    onUpdate({ ...parametros, rendaPassivaCategoria: selectedCategoria });
  };

  const handleUpdateCategoriaPadrao = (value: any) => {
    const selectedCategoria = categorias.find(c => String(c.id) === String(value)); 
    onUpdate({ ...parametros, rendaCategoriaPadrao: selectedCategoria });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row">
        <FieldValue
          description="Categoria Padrão"
          hint="Categoria de renda padrão."
          type="select"
          value={{ key: String(parametros.rendaCategoriaPadrao?.id), value: parametros.rendaCategoriaPadrao?.descricao }}
          editable
          options={categorias.map(categoria => ({ key: String(categoria.id), value: categoria.descricao }))}
          onUpdate={handleUpdateCategoriaPadrao}
        />
      </Stack>

      <Stack direction="row">
        <FieldValue 
          description="Categoria Renda Passiva"
          hint="Categoria de renda passiva."
          type="select"
          value={{ key: String(parametros.rendaPassivaCategoria?.id), value: parametros.rendaPassivaCategoria?.descricao }}
          editable
          options={categorias.map(categoria => ({ key: String(categoria.id), value: categoria.descricao }))}
          onUpdate={handleUpdateCategoriaGanhosAtivo}
        />
      </Stack>
    </Stack>
  );
};

export default RendaParametroSectionForm;