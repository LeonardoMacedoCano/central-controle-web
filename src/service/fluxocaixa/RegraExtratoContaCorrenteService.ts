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