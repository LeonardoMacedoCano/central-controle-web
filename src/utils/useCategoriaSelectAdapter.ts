import { buildSearchSelectAdapter } from 'lcano-react-ui';
import { MovimentacaoCategoriaService } from '../service';
import { MovimentacaoCategoria, TipoMovimentoEnum } from '../types';

export function useCategoriaSelectAdapter(
  tipo: TipoMovimentoEnum | undefined,
  token: string | undefined,
  value: MovimentacaoCategoria | undefined,
  onUpdate: (v: MovimentacaoCategoria | undefined) => void
) {
  return buildSearchSelectAdapter<MovimentacaoCategoria>({
    searchOptions: async (query, page, pageSize) => {
      if (!token || !tipo) return [];
      const response = await MovimentacaoCategoriaService.getCategorias(
        token,
        page,
        pageSize,
        `tipo==${tipo};descricao=ilike='${query}'`
      );
      return response?.content || [];
    },
    mapToOption: (c) => ({ key: String(c.id), value: c.descricao }),
    mapFromOption: (opt) => ({
      id: Number(opt.key),
      descricao: opt.value,
      tipo: tipo as TipoMovimentoEnum,
    }),
    value,
    onUpdate,
  });
}
