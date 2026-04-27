import { Ativo } from "./Ativo";
import { Despesa } from "./Despesa";
import { Renda } from "./Renda";
import { TipoExtratoEnum } from "./ImportacaoExtrato";
import { TipoMovimentoEnum } from "./TipoMovimentacaoEnum";

type LancamentoItemDTO = Despesa | Renda | Ativo;

export type Lancamento = {
  id: number;
  dataLancamento: Date;
  descricao: string;
  descricaoOrigem?: string;
  tipo?: TipoMovimentoEnum;
  itemDTO?: LancamentoItemDTO;
  idArquivoExtrato?: number;
  nomeArquivoImportacao?: string;
  tipoImportacao?: TipoExtratoEnum;
  dataInicioPeriodo?: string;
  dataFimPeriodo?: string;
};