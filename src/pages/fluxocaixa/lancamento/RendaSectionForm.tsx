import React from 'react';
import { Renda } from '../../../types';
import { FieldValue, formatDateToYMDString, SearchSelectField, Stack } from 'lcano-react-ui';
import { useAuth } from '../../../contexts';
import { useCategoriaSelectAdapter } from '../../../utils';

interface RendaSectionFormProps {
  renda: Renda;
  onUpdate: (updatedRenda: Renda) => void;
}

const RendaSectionForm: React.FC<RendaSectionFormProps> = ({ renda, onUpdate }) => {
  const { usuario } = useAuth();

  const updateRenda = (updatedFields: Partial<Renda>) => {
    onUpdate({ ...renda, ...updatedFields });
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    'RENDA',
    usuario?.token,
    renda.categoria,
    (newValue) => updateRenda({ categoria: newValue })
  );

  const handleUpdateDataRecebimento = (value: Date) => {
    if (value instanceof Date) updateRenda({ dataRecebimento: value });
  };

  const handleUpdateValor = (value: unknown) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) updateRenda({ valor: numericValue });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Recebimento"
          type="DATE"
          value={formatDateToYMDString(renda?.dataRecebimento)}
          onUpdate={handleUpdateDataRecebimento}
        />
        <SearchSelectField
          label="Categoria"
          fetchOptions={fetchOptions}
          value={optionValue}
          onSelect={onSelect}
        />
      </Stack>

      <Stack direction="row" divider="x">
        <FieldValue
          description="Valor"
          type="NUMBER"
          value={renda.valor}
          editable
          minValue={0}
          onUpdate={handleUpdateValor}
        />
      </Stack>
    </Stack>
  );
};

export default RendaSectionForm;
