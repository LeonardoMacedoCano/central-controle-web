export const TiposMovimentos = {
  DESPESA: { tipo: 'DESPESA', descricao: 'Despesa'},
  RENDA: { tipo: 'RENDA', descricao: 'Renda'},
  ATIVO: { tipo: 'ATIVO', descricao: 'Ativo' },
} as const;

export type TipoMovimentoEnum = keyof typeof TiposMovimentos;

export interface TipoMovimentoInfo {
  tipo: TipoMovimentoEnum;
  descricao: string;
}

export const getDescricaoTipoMovimento = (tipo?: TipoMovimentoEnum): string => {
  return tipo ? TiposMovimentos[tipo].descricao : '';
};

export const getCodigoTipoMovimento = (tipo?: TipoMovimentoEnum): string => {
  return tipo ? TiposMovimentos[tipo].tipo : '';
};

export const getTipoMovimentoByCodigo = (codigo: string): TipoMovimentoEnum | undefined => {
  return (Object.entries(TiposMovimentos) as [TipoMovimentoEnum, TipoMovimentoInfo][])
    .find(([, info]) => info.tipo === codigo)?.[0];
};

export const tipoMovimentoOptions = (Object.keys(TiposMovimentos) as TipoMovimentoEnum[]).map((tipo) => ({
  key: TiposMovimentos[tipo].tipo,
  value: TiposMovimentos[tipo].descricao,
}));

export const tipoMovimentoFilters = (Object.keys(TiposMovimentos) as TipoMovimentoEnum[]).map((tipo) => ({
  key: tipo,
  value: TiposMovimentos[tipo].descricao,
}));
