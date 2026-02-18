import { getCurrentDate } from "lcano-react-ui";
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
  dataVencimento: getCurrentDate(),
  valor: 0
};