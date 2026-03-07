import React from 'react';
import { Ativo, getCodigoTipoOperacaoExtratoMovimentacaoB3, getDescricaoTipoOperacaoExtratoMovimentacaoB3, getTipoOperacaoExtratoMovimentacaoB3ByCodigo, tipoOperacaoExtratoMovimentacaoB3Options } from '../../../types';
import { FieldValue, formatDateToYMDString, SearchSelectField, Stack } from 'lcano-react-ui';
import { useAuth } from '../../../contexts';
import { useCategoriaSelectAdapter } from '../../../utils';

interface AtivoSectionFormProps {
  ativo: Ativo;
  onUpdate: (updatedAtivo: Ativo) => void;
}

const AtivoSectionForm: React.FC<AtivoSectionFormProps> = ({ ativo, onUpdate }) => {
  const { usuario } = useAuth();

  const updateAtivo = (updatedFields: Partial<Ativo>) => {
    onUpdate({ ...ativo, ...updatedFields });
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    'ATIVO',
    usuario?.token,
    ativo.categoria,
    (newValue) => updateAtivo({ categoria: newValue })
  );

  const handleUpdateDataMovimento = (value: Date) => {
    if (value instanceof Date) updateAtivo({ dataMovimento: value });
  };

  const handleUpdateValor = (value: unknown) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) updateAtivo({ valor: numericValue });
  };

  const handleUpdateOperacao = (value: unknown) => {
    updateAtivo({ operacao: getTipoOperacaoExtratoMovimentacaoB3ByCodigo(String(value)) });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row" divider="x">
        <FieldValue
          description="Data Movimentação"
          type="DATE"
          value={formatDateToYMDString(ativo?.dataMovimento)}
          onUpdate={handleUpdateDataMovimento}
        />
        <FieldValue
          description="Operação"
          type="SELECT"
          value={{
            key: getCodigoTipoOperacaoExtratoMovimentacaoB3(ativo?.operacao),
            value: getDescricaoTipoOperacaoExtratoMovimentacaoB3(ativo?.operacao)
          }}
          editable
          options={tipoOperacaoExtratoMovimentacaoB3Options}
          onUpdate={handleUpdateOperacao}
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
          value={ativo.valor}
          editable
          minValue={0}
          onUpdate={handleUpdateValor}
        />
      </Stack>
    </Stack>
  );
};

export default AtivoSectionForm;
