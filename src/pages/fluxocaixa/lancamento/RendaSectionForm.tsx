import React, { useContext } from 'react';
import {
  Renda,
  MovimentacaoCategoria
} from '../../../types';

import {
  buildSearchSelectAdapter,
  FieldValue,
  formatDateToYMDString,
  SearchSelectField,
  Stack
} from 'lcano-react-ui';

import { MovimentacaoCategoriaService } from '../../../service';
import { AuthContext } from '../../../contexts';

interface RendaSectionFormProps {
  renda: Renda;
  onUpdate: (updatedRenda: Renda) => void;
}

const RendaSectionForm: React.FC<RendaSectionFormProps> = ({
  renda,
  onUpdate
}) => {
  const { usuario } = useContext(AuthContext);

  const updateRenda = (updatedFields: Partial<Renda>) => {
    onUpdate({
      ...renda,
      ...updatedFields
    });
  };

  const handleUpdateDataRecebimento = (value: Date) => {
    if (value instanceof Date) {
      updateRenda({ dataRecebimento: value });
    }
  };

  const handleUpdateValor = (value: any) => {
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      updateRenda({ valor: numericValue });
    }
  };

  const { fetchOptions, onSelect, optionValue } =
    buildSearchSelectAdapter<MovimentacaoCategoria>({
      searchOptions: async (query, page, pageSize) => {
        if (!usuario?.token) return [];

        const response =
          await MovimentacaoCategoriaService.getCategorias(
            usuario.token,
            page,
            pageSize,
            `tipo==RENDA;descricao=ilike='${query}'`
          );

        return response?.content || [];
      },
      mapToOption: (c) => ({
        key: String(c.id),
        value: c.descricao
      }),
      mapFromOption: (opt) => ({
        id: Number(opt.key),
        descricao: opt.value,
        tipo: 'RENDA'
      }),
      value: renda.categoria,
      onUpdate: (newValue) =>
        updateRenda({ categoria: newValue })
    });

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Recebimento"
          type="DATE"
          value={formatDateToYMDString(
            renda?.dataRecebimento
          )}
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
