export const TiposMovimentos = {
  DESPESA: { tipo: 'DESPESA', descricao: 'Despesa', codigo: '1' },
  RENDA: { tipo: 'RENDA', descricao: 'Renda', codigo: '2' },
  ATIVO: { tipo: 'ATIVO', descricao: 'Ativo', codigo: '3' },
} as const;

export type TipoMovimentoEnum = keyof typeof TiposMovimentos;

export interface TipoMovimentoInfo {
  tipo: TipoMovimentoEnum;
  descricao: string;
  codigo: string;
}

export const getDescricaoTipoMovimento = (tipo?: TipoMovimentoEnum): string => {
  return tipo ? TiposMovimentos[tipo].descricao : '';
};

export const getCodigoTipoMovimento = (tipo?: TipoMovimentoEnum): string | undefined => {
  return tipo ? TiposMovimentos[tipo].codigo : undefined;
};

export const getTipoMovimentoByCodigo = (codigo: string): TipoMovimentoEnum | undefined => {
  return (Object.entries(TiposMovimentos) as [TipoMovimentoEnum, TipoMovimentoInfo][])
    .find(([, info]) => info.codigo === codigo)?.[0];
};

export const tipoMovimentoOptions = (Object.keys(TiposMovimentos) as TipoMovimentoEnum[]).map((tipo) => ({
  key: TiposMovimentos[tipo].codigo,
  value: TiposMovimentos[tipo].descricao,
}));

export const tipoMovimentoFilters = (Object.keys(TiposMovimentos) as TipoMovimentoEnum[]).map((tipo) => ({
  key: tipo,
  value: TiposMovimentos[tipo].descricao,
}));
