import React from 'react';
import { Despesa, despesaFormaPagamentoOptions, getCodigoDespesaFormaPagamento, getDescricaoDespesaFormaPagamento, getDespesaFormaPagamentoByCodigo } from '../../../types';
import { FieldValue, formatDateToYMDString, SearchSelectField, Stack } from 'lcano-react-ui';
import { useAuth } from '../../../contexts';
import { useCategoriaSelectAdapter } from '../../../utils';

interface DespesaSectionFormProps {
  despesa: Despesa;
  onUpdate: (updatedDespesa: Despesa) => void;
}

const DespesaSectionForm: React.FC<DespesaSectionFormProps> = ({ despesa, onUpdate }) => {
  const { usuario } = useAuth();

  const updateDespesa = (updatedFields: Partial<Despesa>) => {
    onUpdate({ ...despesa, ...updatedFields });
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    'DESPESA',
    usuario?.token,
    despesa.categoria,
    (newValue) => updateDespesa({ categoria: newValue })
  );

  const handleUpdateDataVencimento = (value: Date) => {
    if (value instanceof Date) updateDespesa({ dataVencimento: value });
  };

  const handleUpdateValor = (value: unknown) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) updateDespesa({ valor: numericValue });
  };

  const handleUpdateFormaPagamento = (value: unknown) => {
    updateDespesa({ formaPagamento: getDespesaFormaPagamentoByCodigo(String(value)) });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Vencimento"
          type="DATE"
          value={formatDateToYMDString(despesa?.dataVencimento)}
          onUpdate={handleUpdateDataVencimento}
        />
        <FieldValue
          description="Forma Pagamento"
          type="SELECT"
          value={{
            key: getCodigoDespesaFormaPagamento(despesa?.formaPagamento),
            value: getDescricaoDespesaFormaPagamento(despesa?.formaPagamento)
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
