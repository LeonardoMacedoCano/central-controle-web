import { useMessage } from "../contexts";
import { UsuarioForm } from "../types";
import DefaultService from "./DefaultService";

interface UsuarioApi {
  updateUsuario: (token: string, data: UsuarioForm) => Promise<void | undefined>;
}

const UsuarioService = (): UsuarioApi => {
  const { request } = DefaultService();
  const message = useMessage();

  const updateUsuario = async (token: string, data: UsuarioForm): Promise<void | undefined> => {
    try {
      const formData = new FormData();
  
      formData.append("username", data.username);
      formData.append("currentPassword", data.currentPassword|| "");
      formData.append("newPassword", data.newPassword|| "");
      formData.append("idTema", data.idTema?.toString() || "");
  
      if (data.file) {
        formData.append("file", data.file);
      }
  
      await request<undefined>('put', 'usuario', token, message, formData, 'json');
    } catch (error) {
      return undefined;
    }
  };  

  return {
    updateUsuario
  };
};

export default UsuarioService;