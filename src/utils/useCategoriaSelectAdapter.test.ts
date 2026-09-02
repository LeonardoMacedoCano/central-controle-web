import { describe, it, expect, vi } from 'vitest';

const { getCategorias } = vi.hoisted(() => ({ getCategorias: vi.fn() }));

vi.mock('../service', () => ({
  MovimentacaoCategoriaService: { getCategorias },
}));
vi.mock('lcano-react-ui', () => ({
  buildSearchSelectAdapter: (cfg: unknown) => cfg,
}));

import { useCategoriaSelectAdapter } from './useCategoriaSelectAdapter';
import type { TipoMovimentoEnum } from '../types';

type Adapter = {
  searchOptions: (q: string, p: number, s: number) => Promise<Array<{ id: number; descricao: string }>>;
  mapToOption: (c: { id: number; descricao: string }) => { key: string; value: string };
  mapFromOption: (o: { key: string; value: string }) => { id: number; descricao: string };
};

const useAdapter = (token?: string, tipo: TipoMovimentoEnum | undefined = 'DESPESA') =>
  useCategoriaSelectAdapter(tipo, token, undefined, vi.fn()) as unknown as Adapter;

describe('useCategoriaSelectAdapter', () => {
  it('remove aspas simples e barras da query antes de montar o RSQL', async () => {
    getCategorias.mockResolvedValue({ content: [{ id: 1, descricao: 'Mercado' }] });

    const adapter = useAdapter('tok');
    await adapter.searchOptions("merc' ado \\x", 0, 10);

    expect(getCategorias).toHaveBeenCalledWith(
      'tok',
      0,
      10,
      "tipo==DESPESA;descricao=ilike='merc ado x'"
    );
  });

  it('retorna lista vazia sem chamar o servico quando nao ha token', async () => {
    const adapter = useAdapter(undefined);
    const res = await adapter.searchOptions('x', 0, 10);
    expect(res).toEqual([]);
    expect(getCategorias).not.toHaveBeenCalled();
  });

  it('mapeia categoria <-> option', () => {
    const adapter = useAdapter('tok');
    expect(adapter.mapToOption({ id: 7, descricao: 'Lazer' })).toEqual({ key: '7', value: 'Lazer' });
    expect(adapter.mapFromOption({ key: '7', value: 'Lazer' })).toMatchObject({ id: 7, descricao: 'Lazer' });
  });
});
