import { MovimentacaoCategoria } from "./MovimentacaoCategoria";
import { TipoOperacaoExtratoMovimentacaoB3Enum } from "./TipoOperacaoExtratoMovimentacaoB3";

export type Ativo = {
  id?: number;
  categoria?: MovimentacaoCategoria;
  operacao?: TipoOperacaoExtratoMovimentacaoB3Enum;
  valor: number;
  dataMovimento: Date;
}

export const initialAtivoState: Ativo = {
  dataMovimento: new Date(),
  valor: 0
};