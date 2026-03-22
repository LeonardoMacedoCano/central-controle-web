import { DespesaFormaPagamentoEnum } from "./DespesaFormaPagamentoEnum";
import { MovimentacaoCategoria } from "./MovimentacaoCategoria";

export type Despesa = {
  id?: number;
  categoria?: MovimentacaoCategoria;
  dataVencimento: Date;
  valor: number;
  formaPagamento?: DespesaFormaPagamentoEnum;
}

export const initialDespesaState: Despesa = {
  dataVencimento: new Date(),
  valor: 0
};