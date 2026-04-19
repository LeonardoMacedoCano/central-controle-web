export type TipoMapeamentoExtratoBancarioEnum = | 'IGNORAR_DESPESA' | 'CLASSIFICAR_DESPESA' | 'IGNORAR_RENDA' | 'CLASSIFICAR_RENDA' | 'CLASSIFICAR_ATIVO';

interface TipoMapeamentoExtratoBancarioInfo {
  tipo: TipoMapeamentoExtratoBancarioEnum;
  descricao: string;
  codigo: string;
}

const TipoMapeamentoExtratoBancario: Record<TipoMapeamentoExtratoBancarioEnum, TipoMapeamentoExtratoBancarioInfo> = {
  IGNORAR_DESPESA: { tipo: 'IGNORAR_DESPESA', descricao: 'Ignorar Despesa', codigo: 'IGNORAR_DESPESA' },
  CLASSIFICAR_DESPESA: { tipo: 'CLASSIFICAR_DESPESA', descricao: 'Classificar Despesa', codigo: 'CLASSIFICAR_DESPESA' },
  IGNORAR_RENDA: { tipo: 'IGNORAR_RENDA', descricao: 'Ignorar Renda', codigo: 'IGNORAR_RENDA' },
  CLASSIFICAR_RENDA: { tipo: 'CLASSIFICAR_RENDA', descricao: 'Classificar Renda', codigo: 'CLASSIFICAR_RENDA' },
  CLASSIFICAR_ATIVO: { tipo: 'CLASSIFICAR_ATIVO', descricao: 'Classificar Ativo', codigo: 'CLASSIFICAR_ATIVO' },
};

export const getDescricaoTipoMapeamentoExtratoBancario = (tipo?: TipoMapeamentoExtratoBancarioEnum): string => {
  return tipo ? TipoMapeamentoExtratoBancario[tipo].descricao : '';
};

export const getCodigoTipoMapeamentoExtratoBancario = (tipo?: TipoMapeamentoExtratoBancarioEnum): string => {
  return tipo ? TipoMapeamentoExtratoBancario[tipo].codigo : '';
};

export const getTipoMapeamentoExtratoBancarioByCodigo = (codigo: string): TipoMapeamentoExtratoBancarioEnum | undefined => {
  const foundTipo = Object.values(TipoMapeamentoExtratoBancario).find(info => info.codigo === codigo);
  return foundTipo ? foundTipo.tipo : undefined;
};

export const tipoMapeamentoExtratoBancarioOptions = Object.values(TipoMapeamentoExtratoBancario).map(info => ({
  key: info.tipo,
  value: info.descricao,
}));
