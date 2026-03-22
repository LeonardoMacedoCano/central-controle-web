import DefaultService from '../DefaultService';
import { ContextMessageProps, PagedResponse, PAGE_SIZE_DEFAULT } from 'lcano-react-ui';
import { NotificacaoDTO } from '../../types/usuario/Notificacao';

const { request } = DefaultService;

export const getNotificacoes = (
  token: string,
  page: number = 0,
  size: number = PAGE_SIZE_DEFAULT,
  apenasNaoLidas: boolean = false,
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<NotificacaoDTO>>(
    'usuario',
    'get',
    `notificacao?page=${page}&size=${size}&apenasNaoLidas=${apenasNaoLidas}&sort=dataCriacao,desc`,
    token,
    contextMessage
  );

export const getNaoLidasCount = (token: string) =>
  request<{ total: number }>('usuario', 'get', 'notificacao/nao-lidas/count', token);

export const getNotificacao = (token: string, id: string, contextMessage?: ContextMessageProps) =>
  request<NotificacaoDTO>('usuario', 'get', `notificacao/${id}`, token, contextMessage);

export const marcarComoLida = (token: string, id: number, naoLida: boolean, contextMessage?: ContextMessageProps) =>
  request<void>('usuario', 'patch', `notificacao/${id}/lida/${naoLida}`, token, contextMessage);

export const marcarTodasComoLidas = (token: string, contextMessage?: ContextMessageProps) =>
  request<void>('usuario', 'patch', `notificacao/todas/lida`, token, contextMessage);
