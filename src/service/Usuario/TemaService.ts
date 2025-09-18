import DefaultService from "../DefaultService";
import { ContextMessageProps } from "../../contexts/message/ContextMessageProvider";
import { Tema } from "lcano-react-ui";

const { request } = DefaultService;

export const getTema = (token: string, id: string | number, contextMessage?: ContextMessageProps) =>
  request<Tema>('usuario', 'get', `tema/${id}`, token, contextMessage);

export const getTemas = (token: string, contextMessage?: ContextMessageProps) =>
  request<Tema[]>('usuario', 'get', 'tema', token, contextMessage);

export const getTemaPadrao = (contextMessage?: ContextMessageProps) =>
  request<Tema>('usuario', 'get', 'tema/default', undefined, contextMessage);
