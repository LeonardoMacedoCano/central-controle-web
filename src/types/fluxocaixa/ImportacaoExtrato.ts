export type TipoExtratoEnum = 'CONTA_CORRENTE' | 'FATURA_CARTAO' | 'MOVIMENTACAO_B3';
export type StatusImportacaoEnum = 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO';

export type ImportacaoExtrato = {
  id: number;
  tipo: TipoExtratoEnum;
  status: StatusImportacaoEnum;
  mensagemErro: string | null;
  dataCriacao: string;
  dataInicio: string | null;
  dataConclusao: string | null;
  totalLinhas: number | null;
  linhasProcessadas: number | null;
  linhasIgnoradas: number | null;
  linhasErro: number | null;
};

export const tipoExtratoOptions = [
  { key: 'CONTA_CORRENTE', value: 'Conta Corrente' },
  { key: 'FATURA_CARTAO', value: 'Fatura Cartão' },
  { key: 'MOVIMENTACAO_B3', value: 'Movimentação B3' },
];

export const getDescricaoTipoExtrato = (tipo: TipoExtratoEnum): string =>
  tipoExtratoOptions.find(o => o.key === tipo)?.value ?? tipo;
