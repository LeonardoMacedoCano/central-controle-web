import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { RequestApi } from './DefaultService';

const requestMock = vi.fn();

const contextMessage = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showErrorWithLog: vi.fn(),
} as never;

const showSuccess = () => (contextMessage as never as { showSuccess: ReturnType<typeof vi.fn> }).showSuccess;
const showError = () => (contextMessage as never as { showError: ReturnType<typeof vi.fn> }).showError;

describe('RequestApi', () => {
  beforeEach(() => {
    requestMock.mockReset();
    showSuccess().mockReset();
    showError().mockReset();
    window.localStorage.clear();
    vi.spyOn(axios, 'create').mockReturnValue({ request: requestMock } as never);
    vi.spyOn(axios, 'isAxiosError').mockImplementation(
      (e: unknown): e is never => !!(e && (e as { isAxiosError?: boolean }).isAxiosError)
    );
  });

  it('retorna o corpo da resposta em caso de sucesso', async () => {
    requestMock.mockResolvedValue({ data: { id: 1, nome: 'x' } });

    const res = await RequestApi('fluxocaixa', 'get', 'lancamento/1', 'tok');

    expect(res).toEqual({ id: 1, nome: 'x' });
  });

  it('nao envia corpo em requisicoes GET', async () => {
    requestMock.mockResolvedValue({ data: {} });

    await RequestApi('fluxocaixa', 'get', 'x', 'tok', undefined, { naoDeveIr: true });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'get', url: 'x' })
    );
    expect(requestMock.mock.calls[0][0]).not.toHaveProperty('data');
  });

  it('envia corpo em requisicoes POST', async () => {
    requestMock.mockResolvedValue({ data: {} });

    await RequestApi('fluxocaixa', 'post', 'lancamento', 'tok', undefined, { valor: 10 });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'post', data: { valor: 10 } })
    );
  });

  it('dispara toast de sucesso quando ha campo success e contextMessage', async () => {
    requestMock.mockResolvedValue({ data: { success: 'Salvo!' } });

    await RequestApi('fluxocaixa', 'post', 'x', 'tok', contextMessage, {});

    expect(showSuccess()).toHaveBeenCalledWith('Salvo!');
  });

  it('em erro, mostra a mensagem do campo error e retorna undefined', async () => {
    requestMock.mockRejectedValue({
      isAxiosError: true,
      response: { status: 422, data: { error: 'Parametro invalido' } },
    });

    const res = await RequestApi('fluxocaixa', 'post', 'x', 'tok', contextMessage, {});

    expect(res).toBeUndefined();
    expect(showError()).toHaveBeenCalledWith('Parametro invalido');
  });

  describe('sessao expirada (401)', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { pathname: '/lancamentos', assign: vi.fn(), reload: vi.fn() },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
    });

    it('com token, limpa o authToken e redireciona para /', async () => {
      window.localStorage.setItem('authToken', 'tok');
      requestMock.mockRejectedValue({ isAxiosError: true, response: { status: 401, data: {} } });

      const res = await RequestApi('fluxocaixa', 'get', 'x', 'tok', contextMessage);

      expect(res).toBeUndefined();
      expect(window.localStorage.getItem('authToken')).toBeNull();
      expect((window.location as unknown as { assign: ReturnType<typeof vi.fn> }).assign)
        .toHaveBeenCalledWith('/');
    });

    it('sem token, nao redireciona (mostra erro comum)', async () => {
      requestMock.mockRejectedValue({ isAxiosError: true, response: { status: 401, data: {} } });

      await RequestApi('usuario', 'get', 'auth/validateToken', undefined, contextMessage);

      expect((window.location as unknown as { assign: ReturnType<typeof vi.fn> }).assign)
        .not.toHaveBeenCalled();
    });
  });
});
