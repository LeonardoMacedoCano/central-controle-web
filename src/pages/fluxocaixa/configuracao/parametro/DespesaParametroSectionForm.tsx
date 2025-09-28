import React, { useContext, useCallback } from 'react';
import { MovimentacaoCategoria, Parametro } from '../../../../types';
import { FieldValue, SearchSelectField, Stack } from 'lcano-react-ui';
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

  const fetchCategorias = useCallback(
    async (query: string, page: number) => {
      const pageSize = 10;
      const response = await MovimentacaoCategoriaService.getCategorias(
        usuario!.token,
        page,
        pageSize,
        `tipo==DESPESA;descricao=ilike='${query}'`
      );

      if (!response?.content) return [];

      return response.content.map((categoria) => ({
        key: String(categoria.id),
        value: categoria.descricao,
      }));
    },
    [usuario]
  );

  const handleCategoriaSelect = useCallback(
    (categoriaOption?: { key: string; value: string }) => {
      onUpdate({
        ...parametros,
        despesaCategoriaPadrao: categoriaOption
          ? { id: Number(categoriaOption.key), descricao: categoriaOption.value, tipo: 'DESPESA' }
          : undefined,
      });
    },
    [parametros, onUpdate]
  );

    const getOptionFromCategoria = (categoria?: MovimentacaoCategoria) =>
      categoria ? { key: String(categoria.id), value: categoria.descricao } : undefined;

  return (
    <Stack direction="column" divider="top">
      <FieldValue
        description="Valor Teto Meta Mensal"
        hint="Meta máxima para o total de despesas em um mês."
        type="number"
        value={parametros.metaLimiteDespesaMensal}
        editable
        minValue={0}
        onUpdate={handleMetaLimiteDespesaMensal}
      />
      <SearchSelectField
        label="Categoria Padrão"
        fetchOptions={fetchCategorias}
        value={getOptionFromCategoria(parametros.despesaCategoriaPadrao)}
        onSelect={handleCategoriaSelect}
      />
    </Stack>
  );
};

export default DespesaParametroSectionForm;