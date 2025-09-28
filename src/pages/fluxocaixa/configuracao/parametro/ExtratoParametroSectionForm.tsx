import React, {  } from 'react';
import { Parametro} from '../../../../types';
import { FieldValue, Stack } from 'lcano-react-ui';

interface props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const ExtratoParametroSectionForm: React.FC<props> = ({ parametros, onUpdate }) => {
  const handleDiaPadraoVencimentoCartao = (value: any) => {
    onUpdate({ ...parametros, diaPadraoVencimentoCartao: value });
  };

  return (
    <Stack direction="column">
      <FieldValue
        description="Dia Vencimento Fatura"
        hint="Dia padrão do vencimento da fatura do cartão."
        type="number"
        value={parametros.diaPadraoVencimentoCartao}
        editable={true}
        minValue={1}
        maxValue={28}
        onUpdate={handleDiaPadraoVencimentoCartao}
      />
    </Stack>
  );
};

export default ExtratoParametroSectionForm;