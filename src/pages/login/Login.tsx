import styled, { ThemeContext } from 'styled-components';
import { useContext, useState } from 'react';
import { MdAccountCircle, MdLock } from 'react-icons/md';
import { AuthContext } from '../../contexts';
import { 
  Button,
  FieldValue,
  FlexBox,
  Container
} from '../../components';

export const Login = () => {
  const auth = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const updateUsername = (value: any) => {
    setUsername(value);
  }

  const updatePassword = (value: any) => {
    setPassword(value);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (username) {
      await auth.login(username, password);
    }
  }

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
      <StyledBody>
        <StyledTitle>
          Central de controle
        </StyledTitle>
        <FlexBox style={getInputStyle(theme)}>
          <FlexBox.Item>
            <FieldValue
              type='string'
              value={username}
              icon={<MdAccountCircle style={getIconStyle(theme)} />}
              editable={true}
              onUpdate={updateUsername}
              inline={true}
              padding="0"
              placeholder="Enter your username"
            />
          </FlexBox.Item>
        </FlexBox>
        <FlexBox style={getInputStyle(theme)}>
          <FlexBox.Item>
            <FieldValue
              type='string'
              value={password}
              icon={<MdLock style={getIconStyle(theme)} />}
              editable={true}
              onUpdate={updatePassword}
              inline={true}
              padding="0"
              placeholder="Enter your password"
              onKeyDown={handleKeyDown}
            />
          </FlexBox.Item>
        </FlexBox>
        <Button 
          variant="login" 
          description="Login"
          onClick={handleLogin}
        />
      </StyledBody>
    </Container>           
  )
}

const StyledBody = styled.div`
  width: 500px;
  height: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.tertiary} 50%, 
    ${props => props.theme.colors.secondary} 50%
  );
  border-radius: 5px;
  box-shadow: 0 0 5px 1px;
  max-width: calc(100% - 20px);
`;

const StyledTitle = styled.h1`
  color: ${props => props.theme.colors.white};
  font-family: 'Roboto Slab';
  font-size: 40px;
  margin-bottom: 100px;
`;

const getIconStyle = (theme: any) => ({
  fontSize: '15px',
  height: '100%',
  width: '50px',
  padding: '10px',
  borderRight: `2px solid ${theme.colors.quaternary}`,
});

const getInputStyle = (theme: any) => ({
  width: '98%',
  height: '50px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '5px',
  border: `2px solid ${theme.colors.quaternary}`,
  backgroundColor: `${theme.colors.secondary}`, 
});
