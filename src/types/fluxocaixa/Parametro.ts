import { MovimentacaoCategoria } from "./MovimentacaoCategoria";

export type Parametro = {
  id?: number;
  despesaCategoriaPadrao?: MovimentacaoCategoria;
  metaLimiteDespesaMensal?: number;
  rendaCategoriaPadrao?: MovimentacaoCategoria;
  rendaPassivaCategoria?: MovimentacaoCategoria;
  metaAporteMensal?: number;
  metaAporteTotal?: number;
  diaPadraoVencimentoCartao: number;
}

export const initialParametroState: Parametro = {
  diaPadraoVencimentoCartao: 10,
};