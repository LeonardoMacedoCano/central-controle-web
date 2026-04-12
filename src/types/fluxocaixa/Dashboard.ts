export type CategoriaTotais = {
  categoria: string;
  total: number;
};

export type Dashboard = {
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
  totalInvestidoAtivos: number;
  despesasPorCategoria: CategoriaTotais[];
  receitasPorCategoria: CategoriaTotais[];
  ativosPorCategoria: CategoriaTotais[];
};
