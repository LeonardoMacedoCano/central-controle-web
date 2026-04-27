import DefaultService from "../DefaultService";
import { ContextMessageProps, PagedResponse } from "lcano-react-ui";
import { ImportacaoExtrato } from "../../types/fluxocaixa/ImportacaoExtrato";
import { Lancamento } from "../../types/fluxocaixa/Lancamento";

const { request } = DefaultService;

export const getArquivos = (
  token: string,
  page: number,
  size: number,
  filter: string = '',
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<ImportacaoExtrato>>(
    'fluxocaixa',
    'get',
    `extrato-fluxo-caixa/search?page=${page}&size=${size}&filter=${encodeURIComponent(filter)}`,
    token,
    contextMessage
  );

export const getById = (token: string, id: string, contextMessage?: ContextMessageProps) =>
  request<ImportacaoExtrato>('fluxocaixa', 'get', `extrato-fluxo-caixa/${id}`, token, contextMessage);

export const getLancamentos = (
  token: string,
  id: string,
  page: number,
  size: number,
  filter: string = '',
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<Lancamento>>(
    'fluxocaixa',
    'get',
    `extrato-fluxo-caixa/${id}/lancamentos/search?page=${page}&size=${size}&filter=${encodeURIComponent(filter)}`,
    token,
    contextMessage
  );

export const downloadArquivo = (token: string, id: number, contextMessage?: ContextMessageProps) =>
  request<Blob>('fluxocaixa', 'get', `extrato-fluxo-caixa/${id}/arquivo`, token, contextMessage, undefined, 'blob');
