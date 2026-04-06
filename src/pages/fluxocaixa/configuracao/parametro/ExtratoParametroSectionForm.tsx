import React from 'react';
import { Parametro} from '../../../../types';
import { FieldValue, SearchSelectField, Stack } from 'lcano-react-ui';
import { useCategoriaSelectAdapter } from '@/utils';
import { useAuth } from '@/contexts';

interface props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const ExtratoParametroSectionForm: React.FC<props> = ({ parametros, onUpdate }) => {
  const { usuario } = useAuth();

  const handleDiaPadraoVencimentoCartao = (value: number) => {
    onUpdate({ ...parametros, diaPadraoVencimentoCartao: value });
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    'ATIVO',
    usuario?.token,
    parametros.categoriaPadraoMovimentacaoB3,
    (newValue) => onUpdate({ ...parametros, categoriaPadraoMovimentacaoB3: newValue })
  );

  return (
    <Stack direction="column" divider="top">
      <FieldValue
        description="Dia Vencimento Fatura"
        hint="Dia padrão do vencimento da fatura do cartão."
        type="NUMBER"
        value={parametros.diaPadraoVencimentoCartao}
        editable={true}
        minValue={1}
        maxValue={28}
        onUpdate={handleDiaPadraoVencimentoCartao}
      />
      <SearchSelectField
        label="Categoria Padrão Movimentação B3"
        fetchOptions={fetchOptions}
        value={optionValue}
        onSelect={onSelect}
      />
    </Stack>
  );
};

export default ExtratoParametroSectionForm;