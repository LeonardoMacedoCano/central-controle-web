import React from 'react';
import { MovimentacaoCategoria, Parametro } from '../../../../types';
import { FieldValue, Stack } from 'lcano-react-ui';

interface props {
  parametros: Parametro;
  categorias: MovimentacaoCategoria[];
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const DespesaParametroSectionForm: React.FC<props> = ({ parametros, categorias, onUpdate }) => {
  const handleMetaLimiteDespesaMensal = (value: any) => {
    onUpdate({ ...parametros, metaLimiteDespesaMensal: value });
  };

  const handleUpdateCategoriaPadrao = (value: any) => {
    const selectedCategoria = categorias.find(c => String(c.id) === String(value)); 
    onUpdate({ ...parametros, despesaCategoriaPadrao: selectedCategoria });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row">
        <FieldValue
          description="Valor Teto Meta Mensal"
          hint="Meta máxima para o total de despesas em um mês."
          type="number"
          value={parametros.metaLimiteDespesaMensal}
          editable
          minValue={0}
          onUpdate={handleMetaLimiteDespesaMensal}
        />
      </Stack>

      <Stack direction="row">
        <FieldValue 
          description="Categoria Padrão"
          type="select"
          value={{
            key: String(parametros.despesaCategoriaPadrao?.id),
            value: parametros.despesaCategoriaPadrao?.descricao
          }}
          editable={true}
          options={categorias.map(categoria => ({
            key: String(categoria.id),
            value: categoria.descricao
          }))}
          onUpdate={handleUpdateCategoriaPadrao}
        />
      </Stack>
    </Stack>
  );
};

export default DespesaParametroSectionForm;