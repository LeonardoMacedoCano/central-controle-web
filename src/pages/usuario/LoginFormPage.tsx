import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts';
import { AppTheme, Container, GoogleSignInButton } from 'lcano-react-ui';
import { useAppTheme } from '../../utils';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export const LoginFormPage: React.FC = () => {
  const auth = useAuth();
  const theme = useAppTheme();

  const handleCredential = useCallback(
    (credential: string) => {
      auth.loginWithGoogle(credential);
    },
    [auth]
  );

  return (
    <Container
      margin="0"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <StyledBody theme={theme}>
        <StyledTitle theme={theme}>Central de controle</StyledTitle>

        {GOOGLE_CLIENT_ID ? (
          <GoogleSignInButton
            clientId={GOOGLE_CLIENT_ID}
            locale="pt"
            onCredential={handleCredential}
          />
        ) : (
          <StyledWarning theme={theme}>
            Configuração de login ausente: defina VITE_GOOGLE_CLIENT_ID.
          </StyledWarning>
        )}
      </StyledBody>
    </Container>
  );
};

const StyledBody = styled.div<{ theme: AppTheme }>`
  width: 500px;
  height: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.tertiary} 50%,
    ${({ theme }) => theme.colors.secondary} 50%
  );
  border-radius: 5px;
  box-shadow: 0 0 5px 1px;
  max-width: calc(100% - 20px);
`;

const StyledTitle = styled.h1<{ theme: AppTheme }>`
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Roboto Slab', serif;
  font-size: 40px;
  margin-bottom: 100px;
`;

const StyledWarning = styled.p<{ theme: AppTheme }>`
  color: ${({ theme }) => theme.colors.warning};
  text-align: center;
  max-width: 320px;
`;
