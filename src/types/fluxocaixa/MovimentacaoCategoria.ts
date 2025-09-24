export type MovimentacaoCategoria = {
  id: number;
  descricao: string;
  tipo: string;
}

export const initialMovimentacaoCategoriaState: MovimentacaoCategoria = {
  id: 0,
  descricao: "",
  tipo: ""
};