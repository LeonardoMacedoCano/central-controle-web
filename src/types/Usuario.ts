export type Usuario = {
  username: string;
  token: string;
  idTema?: number;
  icone?: string;
}

export type UsuarioForm = {
  username: string;
  currentPassword?: string;
  newPassword?: string;
  idTema?: number;
  file?: File;
}