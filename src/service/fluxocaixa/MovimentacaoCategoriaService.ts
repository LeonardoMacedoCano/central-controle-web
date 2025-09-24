import DefaultService from "../DefaultService";
import { MovimentacaoCategoria } from "../../types";
import { PagedResponse } from "lcano-react-ui";
import { ContextMessageProps } from "lcano-react-ui/dist/types/contexts/message";

const { request } = DefaultService;

export const getCategorias = (token: string, page: number, size: number, contextMessage?: ContextMessageProps) =>
  request<PagedResponse<MovimentacaoCategoria>>('fluxocaixa', 'get', `movimentacao-categoria/search?page=${page}&size=${size}`, token, contextMessage);
