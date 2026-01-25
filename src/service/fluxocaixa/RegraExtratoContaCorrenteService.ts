import DefaultService from "../DefaultService";
import { RegraExtratoContaCorrente } from "../../types";
import { PagedResponse } from "lcano-react-ui";
import { ContextMessageProps } from "lcano-react-ui/dist/types/contexts/message";

const { request } = DefaultService;

export const getRegras = (
  token: string,
  page: number,
  size: number,
  filter: string = '',
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<RegraExtratoContaCorrente>>(
    'fluxocaixa',
    'get',
    `regra-extrato-conta-corrente/search?page=${page}&size=${size}&filter=${encodeURIComponent(filter)}`,
    token,
    contextMessage
  );

export const getRegra = (token: string, id: string | number, contextMessage?: ContextMessageProps) =>
  request<RegraExtratoContaCorrente>('fluxocaixa', 'get', `regra-extrato-conta-corrente/${id}`, token, contextMessage); 

export const saveRegra = (token: string, regra: RegraExtratoContaCorrente, contextMessage?: ContextMessageProps) =>
  request<RegraExtratoContaCorrente>('fluxocaixa', 'post', 'regra-extrato-conta-corrente', token, contextMessage, regra);

export const deleteRegra = (token: string, id: number, contextMessage?: ContextMessageProps) =>
  request<RegraExtratoContaCorrente>('fluxocaixa', 'delete', `regra-extrato-conta-corrente/${id}`, token, contextMessage);
