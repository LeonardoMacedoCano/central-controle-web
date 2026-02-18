import React, { useContext } from 'react';
import {
  Despesa,
  despesaFormaPagamentoOptions,
  getCodigoDespesaFormaPagamento,
  getDescricaoDespesaFormaPagamento,
  getDespesaFormaPagamentoByCodigo,
  MovimentacaoCategoria,
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

interface DespesaSectionFormProps {
  despesa: Despesa;
  onUpdate: (updatedDespesa: Despesa) => void;
}

const DespesaSectionForm: React.FC<DespesaSectionFormProps> = ({
  despesa,
  onUpdate
}) => {
  const { usuario } = useContext(AuthContext);

  const updateDespesa = (updatedFields: Partial<Despesa>) => {
    onUpdate({
      ...despesa,
      ...updatedFields
    });
  };

  const handleUpdateDataVencimento = (value: Date) => {
    if (value instanceof Date) {
      updateDespesa({ dataVencimento: value });
    }
  };

  const handleUpdateValor = (value: any) => {
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      updateDespesa({ valor: numericValue });
    }
  };

  const handleUpdateFormaPagamento = (value: any) => {
    const selected =
      getDespesaFormaPagamentoByCodigo(value);

    updateDespesa({ formaPagamento: selected });
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
            `tipo==DESPESA;descricao=ilike='${query}'`
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
        tipo: 'DESPESA'
      }),
      value: despesa.categoria,
      onUpdate: (newValue) =>
        updateDespesa({ categoria: newValue })
    });

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Vencimento"
          type="DATE"
          value={formatDateToYMDString(
            despesa?.dataVencimento
          )}
          onUpdate={handleUpdateDataVencimento}
        />

        <FieldValue
          description="Forma Pagamento"
          type="SELECT"
          value={{
            key: getCodigoDespesaFormaPagamento(
              despesa?.formaPagamento
            ),
            value: getDescricaoDespesaFormaPagamento(
              despesa?.formaPagamento
            )
          }}
          editable
          options={despesaFormaPagamentoOptions}
          onUpdate={handleUpdateFormaPagamento}
        />
      </Stack>

      <Stack direction="row" divider="x">
        <SearchSelectField
          label="Categoria"
          fetchOptions={fetchOptions}
          value={optionValue}
          onSelect={onSelect}
        />

        <FieldValue
          description="Valor"
          type="NUMBER"
          value={despesa.valor}
          editable
          minValue={0}
          onUpdate={handleUpdateValor}
        />
      </Stack>
    </Stack>
  );
};

export default DespesaSectionForm;
