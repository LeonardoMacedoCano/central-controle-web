import { ContextMessageProps } from "lcano-react-ui";
import { Parametro } from "../../types";
import DefaultService from "../DefaultService";

const { request } = DefaultService;

export const getParametros = (token: string) =>
  request<Parametro>('fluxocaixa', 'get', 'parametro', token);

export const saveParametros = (token: string, parametro: Parametro, contextMessage?: ContextMessageProps) =>
  request<Parametro>('fluxocaixa', 'post', 'parametro', token, contextMessage, parametro);