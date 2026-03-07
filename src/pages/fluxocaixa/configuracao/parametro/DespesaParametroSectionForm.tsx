import React from 'react';
import { Parametro } from '../../../../types';
import { FieldValue, SearchSelectField, Stack } from 'lcano-react-ui';
import { useAuth } from '../../../../contexts';
import { useCategoriaSelectAdapter } from '../../../../utils';

interface Props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const DespesaParametroSectionForm: React.FC<Props> = ({ parametros, onUpdate }) => {
  const { usuario } = useAuth();

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    'DESPESA',
    usuario?.token,
    parametros.despesaCategoriaPadrao,
    (newValue) => onUpdate({ ...parametros, despesaCategoriaPadrao: newValue })
  );

  return (
    <Stack direction="column" divider="top">
      <FieldValue
        description="Valor Teto Meta Mensal"
        hint="Meta máxima para o total de despesas em um mês."
        type="NUMBER"
        value={parametros.metaLimiteDespesaMensal}
        editable
        minValue={0}
        onUpdate={(value: number) => onUpdate({ ...parametros, metaLimiteDespesaMensal: value })}
      />
      <SearchSelectField
        label="Categoria Padrão"
        fetchOptions={fetchOptions}
        value={optionValue}
        onSelect={onSelect}
      />
    </Stack>
  );
};

export default DespesaParametroSectionForm;
