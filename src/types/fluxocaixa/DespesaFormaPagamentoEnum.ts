export type DespesaFormaPagamentoEnum = 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

interface DespesaFormaPagamentoInfo {
  tipo: DespesaFormaPagamentoEnum;
  descricao: string;
  codigo: string;
}

const DespesaFormasPagamentos: Record<DespesaFormaPagamentoEnum, DespesaFormaPagamentoInfo> = {
  DINHEIRO: { tipo: 'DINHEIRO', descricao: 'Dinheiro', codigo: '1' },
  PIX: { tipo: 'PIX', descricao: 'PIX', codigo: '2' },
  CARTAO_CREDITO: { tipo: 'CARTAO_CREDITO', descricao: 'Cartão de Crédito', codigo: '3' },
  CARTAO_DEBITO: { tipo: 'CARTAO_DEBITO', descricao: 'Cartão de Débito', codigo: '4' },
};

export const getDescricaoDespesaFormaPagamento = (tipo?: DespesaFormaPagamentoEnum): string => {
  return tipo ? DespesaFormasPagamentos[tipo].descricao : '';
};

export const getCodigoDespesaFormaPagamento = (tipo?: DespesaFormaPagamentoEnum): string => {
  return tipo ? DespesaFormasPagamentos[tipo].codigo : '';
};

export const getDespesaFormaPagamentoByCodigo = (codigo: string): DespesaFormaPagamentoEnum | undefined => {
  const foundTipo = Object.values(DespesaFormasPagamentos).find(info => info.codigo === codigo);
  return foundTipo ? foundTipo.tipo : undefined;
};

export const despesaFormaPagamentoOptions = Object.values(DespesaFormasPagamentos).map(info => ({
  key: info.codigo,
  value: info.descricao,
}));