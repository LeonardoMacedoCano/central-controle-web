import React, { useContext, useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { MdAccountCircle, MdLock } from 'react-icons/md';
import { AuthContext } from '../../contexts';
import { AppTheme, Button, Container, FieldValue, Stack } from 'lcano-react-ui';
import { useAppTheme } from '../../utils';

export const LoginFormPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const theme = useAppTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username) {
      await auth.login(username, password);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleLogin();
  };

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

        <Stack direction="column" style={inputStyle(theme)}>
          <FieldValue
            type="STRING"
            value={username}
            icon={<MdAccountCircle style={iconStyle(theme)} />}
            onUpdate={setUsername}
            inline
            padding="0"
            placeholder="Enter your username"
            onKeyDown={handleKeyDown}
          />
        </Stack>

        <Stack direction="column" style={inputStyle(theme)}>
          <FieldValue
            type="STRING"
            value={password}
            icon={<MdLock style={iconStyle(theme)} />}
            onUpdate={setPassword}
            inline
            padding="0"
            placeholder="Enter your password"
            onKeyDown={handleKeyDown}
          />
        </Stack>

        <Button
          variant="quaternary"
          description="Login"
          onClick={handleLogin}
          style={{
            width: '100%',
            height: '50px',
            fontWeight: 700,
            fontSize: '18px',
            borderRadius: '5px',
          }}
        />
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

const iconStyle = (theme: AppTheme) => ({
  fontSize: '15px',
  height: '100%',
  width: '50px',
  padding: '10px',
  borderRight: `2px solid ${theme.colors.quaternary}`,
});

const inputStyle = (theme: AppTheme) => ({
  width: '100%',
  height: '50px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '5px',
  border: `2px solid ${theme.colors.quaternary}`,
  backgroundColor: theme.colors.secondary,
});
