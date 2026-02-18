import { getCurrentDate } from "lcano-react-ui";
import { MovimentacaoCategoria } from "./MovimentacaoCategoria";

export type Renda = {
  id?: number;
  categoria?: MovimentacaoCategoria;
  valor: number;
  dataRecebimento: Date;
}

export const initialRendaState: Renda = {
  valor: 0,
  dataRecebimento: getCurrentDate(),
};