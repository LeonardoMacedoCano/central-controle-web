import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const { useAuthMock } = vi.hoisted(() => ({ useAuthMock: vi.fn() }));

vi.mock('../index', () => ({ useAuth: useAuthMock }));
vi.mock('../../pages/usuario/LoginFormPage', () => ({
  LoginFormPage: () => <div>TELA_LOGIN</div>,
}));

import { RequireAuth } from './RequireAuth';

describe('RequireAuth', () => {
  it('nao renderiza nada enquanto valida o token (isLoading)', () => {
    useAuthMock.mockReturnValue({ isLoading: true, usuario: null });

    const { container } = render(
      <RequireAuth><div>CONTEUDO</div></RequireAuth>
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('TELA_LOGIN')).toBeNull();
  });

  it('renderiza a tela de login quando nao ha usuario apos validar', () => {
    useAuthMock.mockReturnValue({ isLoading: false, usuario: null });

    render(<RequireAuth><div>CONTEUDO</div></RequireAuth>);

    expect(screen.getByText('TELA_LOGIN')).toBeInTheDocument();
    expect(screen.queryByText('CONTEUDO')).toBeNull();
  });

  it('renderiza o conteudo protegido quando ha usuario', () => {
    useAuthMock.mockReturnValue({ isLoading: false, usuario: { username: 'x' } });

    render(<RequireAuth><div>CONTEUDO</div></RequireAuth>);

    expect(screen.getByText('CONTEUDO')).toBeInTheDocument();
  });
});
