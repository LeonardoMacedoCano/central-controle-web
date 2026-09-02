import { describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { usePagedData } from './usePagedData';

vi.mock('lcano-react-ui', () => ({
  useMessage: () => ({ showError: vi.fn(), showErrorWithLog: vi.fn(), showSuccess: vi.fn() }),
  PAGE_SIZE_DEFAULT: 10,
}));

describe('usePagedData', () => {
  it('faz a carga inicial com pagina 0 e tamanho padrao', async () => {
    const fetcher = vi.fn().mockResolvedValue({ content: [], totalElements: 0 });

    renderHook(() => usePagedData('tok', fetcher, 'erro'));

    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    expect(fetcher).toHaveBeenCalledWith('tok', 0, 10, '');
  });

  it('nao carrega sem token', () => {
    const fetcher = vi.fn();
    renderHook(() => usePagedData(undefined, fetcher, 'erro'));
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('load() aplica o rsql informado', async () => {
    const fetcher = vi.fn().mockResolvedValue({ content: [] });
    const { result } = renderHook(() => usePagedData('tok', fetcher, 'erro'));
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.load(0, 10, 'tipo==DESPESA');
    });

    expect(fetcher).toHaveBeenLastCalledWith('tok', 0, 10, 'tipo==DESPESA');
  });

  it('loadPage() dispara nova carga com pagina e tamanho novos preservando o rsql ativo', async () => {
    const fetcher = vi.fn().mockResolvedValue({ content: [] });
    const { result } = renderHook(() => usePagedData('tok', fetcher, 'erro'));
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.load(0, 10, 'tipo==RENDA');
    });
    act(() => result.current.loadPage(2, 25));

    await waitFor(() => expect(fetcher).toHaveBeenLastCalledWith('tok', 2, 25, 'tipo==RENDA'));
  });
});
