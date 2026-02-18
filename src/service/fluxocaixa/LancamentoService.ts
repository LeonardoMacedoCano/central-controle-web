import DefaultService from "../DefaultService";
import { PagedResponse } from "lcano-react-ui";
import { ContextMessageProps } from "lcano-react-ui/dist/types/contexts/message";
import { Lancamento } from "../../types/fluxocaixa/Lancamento";

const { request } = DefaultService;

export const getLancamentos = (
  token: string,
  page: number,
  size: number,
  filter: string = '',
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<Lancamento>>(
    'fluxocaixa',
    'get',
    `lancamento/search?page=${page}&size=${size}&filter=${encodeURIComponent(filter)}`,
    token,
    contextMessage
  );

export const saveLancamento = (token: string, lancamento: Lancamento, contextMessage?: ContextMessageProps) =>
  request<Lancamento>('fluxocaixa', 'post', 'lancamento', token, contextMessage, lancamento);

export const deleteLancamento = (token: string, id: number, contextMessage?: ContextMessageProps) =>
  request<Lancamento>('fluxocaixa', 'delete', `lancamento/${id}`, token, contextMessage);

export const getLancamento = (token: string, id: string | number, contextMessage?: ContextMessageProps) =>
  request<Lancamento>('fluxocaixa', 'get', `lancamento/${id}`, token, contextMessage); 
