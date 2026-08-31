import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdTune } from 'react-icons/md';
import { useAuth } from '../../contexts';
import { AppTheme, GoogleSignInButton } from 'lcano-react-ui';
import { useAppTheme } from '../../utils';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

/* Celular deitado / telas baixas: compacta o cartão pra caber sem rolagem. */
const SHORT = '@media (max-height: 520px)';

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
    <StyledPage theme={theme}>
      <StyledBackdrop aria-hidden>
        <StyledGlow theme={theme} data-corner="top" />
        <StyledGlow theme={theme} data-corner="bottom" />
      </StyledBackdrop>

      <StyledCard theme={theme}>
        <StyledBrand>
          <StyledLogo theme={theme} aria-hidden>
            <MdTune />
          </StyledLogo>
          <StyledTitle theme={theme}>Central de Controle</StyledTitle>
          <StyledSubtitle theme={theme}>
            Gestão de finanças e usuários
          </StyledSubtitle>
        </StyledBrand>

        <StyledDivider theme={theme} />

        <StyledSignIn>
          <StyledPrompt theme={theme}>
            Entre com sua conta Google para continuar
          </StyledPrompt>

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
        </StyledSignIn>

        <StyledFooter theme={theme}>Acesso restrito</StyledFooter>
      </StyledCard>
    </StyledPage>
  );
};

const riseIn = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

const StyledPage = styled.div<{ theme: AppTheme }>`
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: clamp(16px, 4vw, 40px);
  background: radial-gradient(
      circle at 20% 15%,
      ${({ theme }) => theme.colors.tertiary} 0%,
      transparent 55%
    ),
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary} 0%,
      ${({ theme }) => theme.colors.secondary} 100%
    );
`;

const StyledBackdrop = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const StyledGlow = styled.span<{ theme: AppTheme }>`
  position: absolute;
  width: 42vmax;
  height: 42vmax;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;

  &[data-corner='top'] {
    top: -18vmax;
    left: -14vmax;
    background: ${({ theme }) => theme.colors.quaternary};
  }

  &[data-corner='bottom'] {
    right: -16vmax;
    bottom: -20vmax;
    background: ${({ theme }) => theme.colors.tertiary};
  }
`;

const StyledCard = styled.div<{ theme: AppTheme }>`
  position: relative;
  margin: auto;
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  padding: clamp(24px, 5vw, 44px);
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary}55;
  background: ${({ theme }) => theme.colors.secondary}f2;
  box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.55);
  animation: ${riseIn} 0.35s ease-out both;

  ${SHORT} {
    padding: 20px 28px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StyledLogo = styled.div<{ theme: AppTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(48px, 13vw, 60px);
  height: clamp(48px, 13vw, 60px);
  border-radius: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(26px, 7vw, 32px);
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.quaternary} 0%,
    ${({ theme }) => theme.colors.tertiary} 100%
  );
  box-shadow: 0 10px 26px -6px ${({ theme }) => theme.colors.quaternary}66;

  ${SHORT} {
    width: 44px;
    height: 44px;
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const StyledTitle = styled.h1<{ theme: AppTheme }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: clamp(22px, 5.5vw, 30px);
  letter-spacing: 0.5px;

  ${SHORT} {
    font-size: 22px;
  }
`;

const StyledSubtitle = styled.p<{ theme: AppTheme }>`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.white}b3;
  font-size: clamp(12px, 3.2vw, 14px);

  ${SHORT} {
    display: none;
  }
`;

const StyledDivider = styled.div<{ theme: AppTheme }>`
  height: 1px;
  margin: clamp(20px, 5vw, 28px) 0;
  background: ${({ theme }) => theme.colors.tertiary}44;

  ${SHORT} {
    margin: 14px 0;
  }
`;

const StyledSignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledPrompt = styled.p<{ theme: AppTheme }>`
  margin: 0 0 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white}cc;
  font-size: clamp(13px, 3.2vw, 14px);

  ${SHORT} {
    margin-bottom: 12px;
  }
`;

const StyledWarning = styled.p<{ theme: AppTheme }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.warning};
  text-align: center;
  font-size: 14px;
`;

const StyledFooter = styled.p<{ theme: AppTheme }>`
  margin: clamp(20px, 5vw, 28px) 0 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.white}80;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;

  ${SHORT} {
    display: none;
  }
`;
