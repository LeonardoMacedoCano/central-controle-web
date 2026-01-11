export type TipoRegraExtratoContaCorrenteEnum = | 'IGNORAR_DESPESA' | 'CLASSIFICAR_DESPESA' | 'IGNORAR_RENDA' | 'CLASSIFICAR_RENDA' | 'CLASSIFICAR_ATIVO';

interface TipoRegraExtratoContaCorrenteInfo {
  tipo: TipoRegraExtratoContaCorrenteEnum;
  descricao: string;
  codigo: string;
}

const TipoRegraExtratoContaCorrente: Record<TipoRegraExtratoContaCorrenteEnum, TipoRegraExtratoContaCorrenteInfo> = {
  IGNORAR_DESPESA: { tipo: 'IGNORAR_DESPESA', descricao: 'Ignorar Despesa', codigo: '1' },
  CLASSIFICAR_DESPESA: { tipo: 'CLASSIFICAR_DESPESA', descricao: 'Classificar Despesa', codigo: '2' },
  IGNORAR_RENDA: { tipo: 'IGNORAR_RENDA', descricao: 'Ignorar Renda', codigo: '3' },
  CLASSIFICAR_RENDA: { tipo: 'CLASSIFICAR_RENDA', descricao: 'Classificar Renda', codigo: '4' },
  CLASSIFICAR_ATIVO: { tipo: 'CLASSIFICAR_ATIVO', descricao: 'Classificar Ativo', codigo: '5' },
};

export const getDescricaoTipoRegraExtratoContaCorrente = (tipo?: TipoRegraExtratoContaCorrenteEnum): string => {
  return tipo ? TipoRegraExtratoContaCorrente[tipo].descricao : '';
};

export const getCodigoTipoRegraExtratoContaCorrente = (tipo?: TipoRegraExtratoContaCorrenteEnum): string | undefined => {
  return tipo ? TipoRegraExtratoContaCorrente[tipo].codigo : undefined;
};

export const getTipoRegraExtratoContaCorrenteByCodigo = (codigo: string): TipoRegraExtratoContaCorrenteEnum | undefined => {
  const foundTipo = Object.values(TipoRegraExtratoContaCorrente).find(info => info.codigo === codigo);
  return foundTipo ? foundTipo.tipo : undefined;
};

export const tipoRegraExtratoContaCorrenteOptions = Object.values(TipoRegraExtratoContaCorrente).map(info => ({
  key: info.codigo,
  value: info.descricao,
}));
