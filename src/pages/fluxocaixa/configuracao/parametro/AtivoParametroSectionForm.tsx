import React from 'react';
import { Parametro } from '../../../../types';
import { FieldValue, Stack } from 'lcano-react-ui';

interface props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const AtivoParametroSectionForm: React.FC<props> = ({ parametros, onUpdate }) => {
  const handleMetaAporteMensal = (value: any) => {
    onUpdate({ ...parametros, metaAporteMensal: value });
  };

  const handleMetaAporteTotal = (value: any) => {
    onUpdate({ ...parametros, metaAporteTotal: value });
  };

  return (
    <Stack direction="column" divider="top">
      <Stack direction="row">
        <FieldValue 
          description="Meta Aporte Mensal"
          hint="Meta valor de aporte mensal."
          type="number"
          value={parametros.metaAporteMensal}
          editable={true}
          minValue={0}
          onUpdate={handleMetaAporteMensal}
        />
      </Stack>

      <Stack direction="row">
        <FieldValue 
          description="Meta Aporte Total"
          hint="Meta valor de aporte total."
          type="number"
          value={parametros.metaAporteTotal}
          editable={true}
          minValue={0}
          onUpdate={handleMetaAporteTotal}
        />
      </Stack>
    </Stack>
  );
};

export default AtivoParametroSectionForm;