export type TipoNotificacaoEnum = 'SUCESSO' | 'ERRO' | 'INFO';

export type NotificacaoDTO = {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacaoEnum;
  lida: boolean;
  dataCriacao: Date;
};
