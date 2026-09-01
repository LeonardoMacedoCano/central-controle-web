import { describe, it, expect, vi, beforeEach } from 'vitest';

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('../DefaultService', () => ({ default: { request } }));

import { loginWithGoogle, validateToken } from './AuthService';

describe('AuthService', () => {
  beforeEach(() => {
    request.mockReset();
    request.mockResolvedValue({ username: 'x', token: 'jwt' });
  });

  it('validateToken faz POST em auth/validateToken com o token como Bearer e sem corpo', async () => {
    await validateToken('meu-jwt');

    expect(request).toHaveBeenCalledWith('usuario', 'post', 'auth/validateToken', 'meu-jwt', undefined);
    // sem token na URL
    expect(request.mock.calls[0][2]).toBe('auth/validateToken');
  });

  it('loginWithGoogle faz POST com o credential no corpo', async () => {
    await loginWithGoogle('cred-google');

    expect(request).toHaveBeenCalledWith(
      'usuario',
      'post',
      'auth/google',
      undefined,
      undefined,
      { credential: 'cred-google' }
    );
  });
});
