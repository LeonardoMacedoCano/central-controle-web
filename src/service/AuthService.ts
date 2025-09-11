import DefaultService from './DefaultService';
import { Usuario } from '../types';
import { useMessage } from '../contexts';

interface AuthApi {
  validateToken: (token: string) => Promise<Usuario | undefined>;
  login: (username: string, senha: string) => Promise<Usuario | undefined>;
}

const AuthService = (): AuthApi => {
  const { request } = DefaultService();
  const message = useMessage();

  const validateToken = async (token: string): Promise<Usuario| undefined> => {
    try {
      return await request<Usuario>('get', `auth/validateToken?token=${token}`);
    } catch (error) {
      return undefined;
    }
  };

  const login = async (username: string, senha: string): Promise<Usuario | undefined> => {
    try {
      return await request<Usuario>('post', 'auth/login', undefined, message, { username, senha });
    } catch (error) {
      return undefined;
    }
  };

  return {
    validateToken,
    login,
  };
};

export default AuthService;
