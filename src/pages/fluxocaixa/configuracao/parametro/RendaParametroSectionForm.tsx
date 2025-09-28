import React, { useCallback, useContext } from 'react';
import { SearchSelectField, Stack } from 'lcano-react-ui';
import { MovimentacaoCategoria, Parametro } from '../../../../types';
import { MovimentacaoCategoriaService } from '../../../../service';
import { AuthContext } from '../../../../contexts';

interface Props {
  parametros: Parametro;
  onUpdate: (parametrosAtualizado: Parametro) => void;
}

const RendaParametroSectionForm: React.FC<Props> = ({ parametros, onUpdate }) => {
  const { usuario } = useContext(AuthContext);

  const getOptionFromCategoria = (categoria?: MovimentacaoCategoria) =>
    categoria ? { key: String(categoria.id), value: categoria.descricao } : undefined;

  const mapCategoriaToOption = (categoria: MovimentacaoCategoria) => ({
    key: String(categoria.id),
    value: categoria.descricao,
  });

  const fetchCategorias = useCallback(
    async (query: string, page: number) => {
      const pageSize = 10;
      const response = await MovimentacaoCategoriaService.getCategorias(
        usuario!.token,
        page,
        pageSize,
        `tipo==RENDA;descricao=ilike='${query}'`
      );

      return response?.content?.map(mapCategoriaToOption) || [];
    },
    [usuario]
  );

  const createCategoriaHandler = (campo: keyof Parametro) =>
    (categoriaOption?: { key: string; value: string }) => {
      const novaCategoria = categoriaOption
        ? { id: Number(categoriaOption.key), descricao: categoriaOption.value, tipo: 'DESPESA' }
        : undefined;

      onUpdate({ ...parametros, [campo]: novaCategoria });
    };

  return (
    <Stack direction="column" divider="top">
      <SearchSelectField
        label="Categoria Padrão"
        fetchOptions={fetchCategorias}
        value={getOptionFromCategoria(parametros.rendaCategoriaPadrao)}
        onSelect={createCategoriaHandler('rendaCategoriaPadrao')}
      />

      <SearchSelectField
        label="Categoria Renda Passiva"
        fetchOptions={fetchCategorias}
        value={getOptionFromCategoria(parametros.rendaPassivaCategoria)}
        onSelect={createCategoriaHandler('rendaPassivaCategoria')}
      />
    </Stack>
  );
};

export default RendaParametroSectionForm;