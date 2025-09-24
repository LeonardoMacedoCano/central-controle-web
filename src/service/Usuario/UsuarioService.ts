import DefaultService from '../DefaultService';
import { UsuarioForm } from '../../types';
import { ContextMessageProps } from 'lcano-react-ui';

const { request } = DefaultService;

export const updateUsuario = (
  token: string,
  data: UsuarioForm,
  contextMessage?: ContextMessageProps
) => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("currentPassword", data.currentPassword || "");
  formData.append("newPassword", data.newPassword || "");
  formData.append("idTema", data.idTema?.toString() || "");

  if (data.file) {
    formData.append("file", data.file);
  }

  return request<undefined>('usuario', 'put', 'usuario', token, contextMessage, formData);
};
