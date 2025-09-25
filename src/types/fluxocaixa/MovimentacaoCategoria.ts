import { TipoMovimentoEnum } from "./TipoMovimentacaoEnum";

export type MovimentacaoCategoria = {
  id: number;
  descricao: string;
  tipo?: TipoMovimentoEnum;
}

export const initialMovimentacaoCategoriaState: MovimentacaoCategoria = {
  id: 0,
  descricao: "",
};
