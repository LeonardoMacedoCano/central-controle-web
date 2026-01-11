import React, { useContext, useCallback } from 'react';
import { MovimentacaoCategoria, Parametro } from '../../../../types';
import { buildSearchSelectAdapter, FieldValue, SearchSelectField, Stack } from 'lcano-react-ui';
import { MovimentacaoCategoriaService } from '../../../../service';
import { AuthContext } from '../../../../contexts';

interface Props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const DespesaParametroSectionForm: React.FC<Props> = ({ parametros, onUpdate }) => {
  const { usuario } = useContext(AuthContext);

  const handleMetaLimiteDespesaMensal = useCallback(
    (value: number) => {
      onUpdate({ ...parametros, metaLimiteDespesaMensal: value });
    },
    [parametros, onUpdate]
  );

  const { fetchOptions, onSelect, optionValue } = buildSearchSelectAdapter<MovimentacaoCategoria>({
    searchOptions: async (query, page, pageSize) => {
      const response = await MovimentacaoCategoriaService.getCategorias(
        usuario!.token,
        page,
        pageSize,
        `tipo==DESPESA;descricao=ilike='${query}'`
      );
      return response?.content || [];
    },
    mapToOption: (c) => ({ key: String(c.id), value: c.descricao }),
    mapFromOption: (opt) => ({
      id: Number(opt.key),
      descricao: opt.value,
      tipo: 'DESPESA',
    }),
    value: parametros.despesaCategoriaPadrao,
    onUpdate: (newValue) => onUpdate({ ...parametros, despesaCategoriaPadrao: newValue }),
  });

  return (
    <Stack direction="column" divider="top">
      <FieldValue
        description="Valor Teto Meta Mensal"
        hint="Meta máxima para o total de despesas em um mês."
        type="NUMBER"
        value={parametros.metaLimiteDespesaMensal}
        editable
        minValue={0}
        onUpdate={handleMetaLimiteDespesaMensal}
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