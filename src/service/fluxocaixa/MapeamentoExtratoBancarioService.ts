import DefaultService from "../DefaultService";
import { MapeamentoExtratoBancario } from "../../types";
import { PagedResponse } from "lcano-react-ui";
import { ContextMessageProps } from "lcano-react-ui";

const { request } = DefaultService;

export const getMapeamentos = (
  token: string,
  page: number,
  size: number,
  filter: string = '',
  contextMessage?: ContextMessageProps
) =>
  request<PagedResponse<MapeamentoExtratoBancario>>(
    'fluxocaixa',
    'get',
    `mapeamento-extrato-bancario/search?page=${page}&size=${size}&filter=${encodeURIComponent(filter)}`,
    token,
    contextMessage
  );

export const getMapeamento = (token: string, id: string | number, contextMessage?: ContextMessageProps) =>
  request<MapeamentoExtratoBancario>('fluxocaixa', 'get', `mapeamento-extrato-bancario/${id}`, token, contextMessage);

export const saveMapeamento = (token: string, mapeamento: MapeamentoExtratoBancario, contextMessage?: ContextMessageProps) =>
  request<MapeamentoExtratoBancario>('fluxocaixa', 'post', 'mapeamento-extrato-bancario', token, contextMessage, mapeamento);

export const deleteMapeamento = (token: string, id: number, contextMessage?: ContextMessageProps) =>
  request<MapeamentoExtratoBancario>('fluxocaixa', 'delete', `mapeamento-extrato-bancario/${id}`, token, contextMessage);
