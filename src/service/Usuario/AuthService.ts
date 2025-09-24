import DefaultService from '../DefaultService';
import { Usuario } from '../../types';
import { ContextMessageProps } from 'lcano-react-ui';

const { request } = DefaultService;

export const login = (username: string, senha: string, contextMessage?: ContextMessageProps) =>
  request<Usuario>('usuario', 'post', 'auth/login', undefined, contextMessage, { username, senha });

export const validateToken = (token: string, contextMessage?: ContextMessageProps) =>
  request<Usuario>('usuario', 'get', `auth/validateToken?token=${token}`, undefined, contextMessage);
