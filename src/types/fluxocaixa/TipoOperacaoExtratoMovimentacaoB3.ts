export type TipoOperacaoExtratoMovimentacaoB3Enum = | 'DEBITO' | 'CREDITO';

interface TipoOperacaoExtratoMovimentacaoB3Info {
  tipo: TipoOperacaoExtratoMovimentacaoB3Enum;
  descricao: string;
  codigo: string;
}

const TipoOperacaoExtratoMovimentacaoB3: Record<TipoOperacaoExtratoMovimentacaoB3Enum, TipoOperacaoExtratoMovimentacaoB3Info> = {
  DEBITO: { tipo: 'DEBITO', descricao: 'Venda', codigo: 'DEBITO' },
  CREDITO: { tipo: 'CREDITO', descricao: 'Compra', codigo: 'CREDITO' },
};

export const getDescricaoTipoOperacaoExtratoMovimentacaoB3 = (tipo?: TipoOperacaoExtratoMovimentacaoB3Enum): string => {
  return tipo ? TipoOperacaoExtratoMovimentacaoB3[tipo].descricao : '';
};

export const getCodigoTipoOperacaoExtratoMovimentacaoB3 = (tipo?: TipoOperacaoExtratoMovimentacaoB3Enum): string => {
  return tipo ? TipoOperacaoExtratoMovimentacaoB3[tipo].codigo : '';
};

export const getTipoOperacaoExtratoMovimentacaoB3ByCodigo = (codigo: string): TipoOperacaoExtratoMovimentacaoB3Enum | undefined => {
  const foundTipo = Object.values(TipoOperacaoExtratoMovimentacaoB3).find(info => info.codigo === codigo);
  return foundTipo ? foundTipo.tipo : undefined;
};

export const tipoOperacaoExtratoMovimentacaoB3Options = Object.values(TipoOperacaoExtratoMovimentacaoB3).map(info => ({
  key: info.tipo,
  value: info.descricao,
}));
