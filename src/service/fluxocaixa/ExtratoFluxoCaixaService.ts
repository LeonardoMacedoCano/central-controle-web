import DefaultService from "../DefaultService";
import { ContextMessageProps } from "lcano-react-ui";
import { ImportacaoExtrato } from "../../types/fluxocaixa/ImportacaoExtrato";

const { request } = DefaultService;

const buildFormData = (file: File, extra?: Record<string, string>): FormData => {
  const fd = new FormData();
  fd.append('file', file);
  if (extra) Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

export const importarContaCorrente = (token: string, file: File, contextMessage?: ContextMessageProps) =>
  request<ImportacaoExtrato>('fluxocaixa', 'post', 'extrato-fluxo-caixa/import-extrato-conta-corrente', token, contextMessage, buildFormData(file));

export const importarFaturaCartao = (token: string, file: File, dataVencimento?: string, contextMessage?: ContextMessageProps) =>
  request<ImportacaoExtrato>('fluxocaixa', 'post', 'extrato-fluxo-caixa/import-extrato-fatura-cartao', token, contextMessage, buildFormData(file, dataVencimento ? { dataVencimento } : undefined));

export const importarMovimentacaoB3 = (token: string, file: File, contextMessage?: ContextMessageProps) =>
  request<ImportacaoExtrato>('fluxocaixa', 'post', 'extrato-fluxo-caixa/import-extrato-movimentacao-b3', token, contextMessage, buildFormData(file));

export const getStatus = (token: string, id: number, contextMessage?: ContextMessageProps) =>
  request<ImportacaoExtrato>('fluxocaixa', 'get', `extrato-fluxo-caixa/${id}/status`, token, contextMessage);
