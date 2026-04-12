import DefaultService from "../DefaultService";
import { ContextMessageProps } from "lcano-react-ui";
import { Dashboard } from "../../types/fluxocaixa/Dashboard";

const { request } = DefaultService;

export const getDashboard = (
  token: string,
  ano: number,
  mes?: number | null,
  contextMessage?: ContextMessageProps
) => {
  const params = new URLSearchParams({ ano: String(ano) });
  if (mes != null) params.append('mes', String(mes));
  return request<Dashboard>('fluxocaixa', 'get', `dashboard?${params.toString()}`, token, contextMessage);
};
