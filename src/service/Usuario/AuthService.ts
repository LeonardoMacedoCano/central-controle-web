import DefaultService from '../DefaultService';
import { Usuario } from '../../types';
import { ContextMessageProps } from 'lcano-react-ui';

const { request } = DefaultService;

export const loginWithGoogle = (credential: string, contextMessage?: ContextMessageProps) =>
  request<Usuario>('usuario', 'post', 'auth/google', undefined, contextMessage, { credential });

export const validateToken = (token: string, contextMessage?: ContextMessageProps) =>
  request<Usuario>('usuario', 'get', `auth/validateToken?token=${token}`, undefined, contextMessage);
