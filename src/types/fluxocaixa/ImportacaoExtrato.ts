export type TipoExtratoEnum = 'CONTA_CORRENTE' | 'FATURA_CARTAO' | 'MOVIMENTACAO_B3';
export type StatusImportacaoEnum = 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO';

export type ImportacaoExtrato = {
  id: number;
  tipo: TipoExtratoEnum;
  status: StatusImportacaoEnum;
  mensagemErro: string | null;
  nomeArquivo?: string;
  dataCriacao: string;
  dataInicio: string | null;
  dataConclusao: string | null;
  totalLinhas: number | null;
  linhasProcessadas: number | null;
  linhasIgnoradas: number | null;
  linhasErro: number | null;
  dataInicioPeriodo?: string;
  dataFimPeriodo?: string;
};

export const tipoExtratoOptions = [
  { key: 'CONTA_CORRENTE', value: 'Conta Corrente' },
  { key: 'FATURA_CARTAO', value: 'Fatura Cartão' },
  { key: 'MOVIMENTACAO_B3', value: 'Movimentação B3' },
];

export const getDescricaoTipoExtrato = (tipo: TipoExtratoEnum): string =>
  tipoExtratoOptions.find(o => o.key === tipo)?.value ?? tipo;

export const statusExtratoFilters = [
  { key: 'PENDENTE',     value: 'Pendente' },
  { key: 'PROCESSANDO', value: 'Processando' },
  { key: 'CONCLUIDO',   value: 'Concluído' },
  { key: 'ERRO',        value: 'Erro' },
];

export const getDescricaoStatusExtrato = (status: StatusImportacaoEnum): string =>
  statusExtratoFilters.find(s => s.key === status)?.value ?? status;
