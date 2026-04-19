import { MovimentacaoCategoria } from "./MovimentacaoCategoria";
import { TipoMapeamentoExtratoBancarioEnum } from "./TipoMapeamentoExtratoBancarioEnum";

export type MapeamentoExtratoBancario = {
  id: number;
  tipoRegra: TipoMapeamentoExtratoBancarioEnum;
  descricao: string;
  descricaoMatch: string;
  descricaoDestino?: string;
  despesaCategoriaDestino?: MovimentacaoCategoria;
  rendaCategoriaDestino?: MovimentacaoCategoria;
  ativoCategoriaDestino?: MovimentacaoCategoria;
  prioridade: number;
  ativo: boolean;
}

export const initialMapeamentoExtratoBancarioState: MapeamentoExtratoBancario = {
  id: 0,
  tipoRegra: "CLASSIFICAR_DESPESA",
  descricao: "",
  descricaoMatch: "",
  prioridade: 0,
  ativo: true,
};
