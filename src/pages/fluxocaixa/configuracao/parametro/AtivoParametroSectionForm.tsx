import React from 'react';
import { Parametro } from '../../../../types';
import { FieldValue, Stack } from 'lcano-react-ui';

interface props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const AtivoParametroSectionForm: React.FC<props> = ({ parametros, onUpdate }) => {
  const handleMetaAporteMensal = (value: number) => {
    onUpdate({ ...parametros, metaAporteMensal: value });
  };

  const handleMetaAporteTotal = (value: number) => {
    onUpdate({ ...parametros, metaAporteTotal: value });
  };

  return (
    <Stack direction="column" divider="top">
      <FieldValue 
        description="Meta Aporte Mensal"
        hint="Meta valor de aporte mensal."
        type="NUMBER"
        value={parametros.metaAporteMensal}
        editable={true}
        minValue={0}
        onUpdate={handleMetaAporteMensal}
      />
      <FieldValue 
        description="Meta Aporte Total"
        hint="Meta valor de aporte total."
        type="NUMBER"
        value={parametros.metaAporteTotal}
        editable={true}
        minValue={0}
        onUpdate={handleMetaAporteTotal}
      />
    </Stack>
  );
};

export default AtivoParametroSectionForm;