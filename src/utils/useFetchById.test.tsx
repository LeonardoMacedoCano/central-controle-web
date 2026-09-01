import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchById } from './useFetchById';

vi.mock('lcano-react-ui', () => ({
  // nova instancia a cada chamada: se o hook dependesse dela nas deps do effect,
  // entraria em loop de re-render / refetch.
  useMessage: () => ({ showError: vi.fn(), showErrorWithLog: vi.fn(), showSuccess: vi.fn() }),
}));

describe('useFetchById', () => {
  it('busca uma vez quando token e id estao presentes', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: '1', nome: 'x' });

    const { result } = renderHook(() => useFetchById('tok', '1', fetcher, 'erro'));

    await waitFor(() => expect(result.current.data).toEqual({ id: '1', nome: 'x' }));
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('tok', '1');
  });

  it('nao rebusca em re-render quando token/id nao mudam', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: '1' });

    const { result, rerender } = renderHook(() => useFetchById('tok', '1', fetcher, 'erro'));
    await waitFor(() => expect(result.current.data).toBeDefined());

    rerender();
    rerender();

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('nao busca enquanto nao ha token', () => {
    const fetcher = vi.fn();
    renderHook(() => useFetchById(undefined, '1', fetcher, 'erro'));
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rebusca quando o id muda', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 'x' });

    const { rerender } = renderHook(
      ({ id }) => useFetchById('tok', id, fetcher, 'erro'),
      { initialProps: { id: '1' } }
    );

    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    rerender({ id: '2' });
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    expect(fetcher).toHaveBeenLastCalledWith('tok', '2');
  });
});
