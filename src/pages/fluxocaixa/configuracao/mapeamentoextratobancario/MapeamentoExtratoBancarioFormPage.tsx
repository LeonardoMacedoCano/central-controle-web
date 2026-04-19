import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

import { useAuth } from "../../../../contexts";
import {
  getCodigoTipoMapeamentoExtratoBancario,
  getDescricaoTipoMapeamentoExtratoBancario,
  getTipoMapeamentoExtratoBancarioByCodigo,
  initialMapeamentoExtratoBancarioState,
  MapeamentoExtratoBancario,
  tipoMapeamentoExtratoBancarioOptions,
} from "../../../../types";
import {
  ActionButton,
  Container,
  FieldValue,
  Loading,
  SearchSelectField,
  Stack,
  useMessage,
} from "lcano-react-ui";
import { MapeamentoExtratoBancarioService } from "../../../../service";
import { TipoMapeamentoExtratoBancarioEnum } from "../../../../types/fluxocaixa/TipoMapeamentoExtratoBancarioEnum";
import { useCategoriaSelectAdapter } from "../../../../utils";
import { TipoMovimentoEnum } from "../../../../types";

const TIPOS_COM_CATEGORIA: TipoMapeamentoExtratoBancarioEnum[] = [
  "CLASSIFICAR_DESPESA",
  "CLASSIFICAR_RENDA",
  "CLASSIFICAR_ATIVO",
];

const getTipoMovimentoFromMapeamento = (tipoRegra: TipoMapeamentoExtratoBancarioEnum): TipoMovimentoEnum | undefined => {
  switch (tipoRegra) {
    case "CLASSIFICAR_DESPESA": return "DESPESA";
    case "CLASSIFICAR_RENDA":   return "RENDA";
    case "CLASSIFICAR_ATIVO":   return "ATIVO";
    default:                    return undefined;
  }
};

const MapeamentoExtratoBancarioFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const message = useMessage();

  const [mapeamento, setMapeamento] = useState<MapeamentoExtratoBancario>(initialMapeamentoExtratoBancarioState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!usuario?.token || !id) return;

    setIsLoading(true);
    MapeamentoExtratoBancarioService
      .getMapeamento(usuario.token, id)
      .then((result) => result && setMapeamento(result))
      .catch((error) => message.showErrorWithLog("Erro ao carregar o mapeamento.", error))
      .finally(() => setIsLoading(false));
  }, [usuario?.token, id, message]);

  const updateMapeamento = (fields: Partial<MapeamentoExtratoBancario>) =>
    setMapeamento((prev) => ({ ...prev, ...fields }));

  const updateField =
    <K extends keyof MapeamentoExtratoBancario>(field: K) =>
    (value: unknown) =>
      updateMapeamento({ [field]: value } as Pick<MapeamentoExtratoBancario, K>);

  const temCategoria = TIPOS_COM_CATEGORIA.includes(mapeamento.tipoRegra);
  const tipoMovimento = getTipoMovimentoFromMapeamento(mapeamento.tipoRegra);

  const getCategoriaValue = () => {
    switch (mapeamento.tipoRegra) {
      case "CLASSIFICAR_DESPESA": return mapeamento.despesaCategoriaDestino;
      case "CLASSIFICAR_RENDA":   return mapeamento.rendaCategoriaDestino;
      case "CLASSIFICAR_ATIVO":   return mapeamento.ativoCategoriaDestino;
      default:                    return undefined;
    }
  };

  const handleCategoriaUpdate = (v: ReturnType<typeof getCategoriaValue>) => {
    switch (mapeamento.tipoRegra) {
      case "CLASSIFICAR_DESPESA": updateMapeamento({ despesaCategoriaDestino: v }); break;
      case "CLASSIFICAR_RENDA":   updateMapeamento({ rendaCategoriaDestino: v });   break;
      case "CLASSIFICAR_ATIVO":   updateMapeamento({ ativoCategoriaDestino: v });   break;
    }
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    tipoMovimento,
    temCategoria ? usuario?.token : undefined,
    getCategoriaValue(),
    handleCategoriaUpdate
  );

  const saveMapeamento = async () => {
    if (!usuario?.token) return;

    try {
      const response = await MapeamentoExtratoBancarioService.saveMapeamento(usuario.token, mapeamento, message);
      if (response?.id) {
        navigate(`/fluxocaixa/config/mapeamento-extrato-bancario/resumo/${response.id}`);
      }
    } catch (error) {
      message.showErrorWithLog("Erro ao salvar mapeamento.", error);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <ActionButton icon={<FaCheck />} hint="Salvar" onClick={saveMapeamento} />

      <Stack direction="column" divider="y">
        <FieldValue
          description="Descrição"
          type="STRING"
          value={mapeamento.descricao}
          editable
          onUpdate={updateField("descricao")}
        />

        <Stack direction="row" divider="x">
          <FieldValue
            description="Tipo"
            type="SELECT"
            value={{
              key: getCodigoTipoMapeamentoExtratoBancario(mapeamento.tipoRegra),
              value: getDescricaoTipoMapeamentoExtratoBancario(mapeamento.tipoRegra),
            }}
            editable
            options={tipoMapeamentoExtratoBancarioOptions}
            onUpdate={(v) =>
              updateMapeamento({
                tipoRegra: getTipoMapeamentoExtratoBancarioByCodigo(String(v)),
                despesaCategoriaDestino: undefined,
                rendaCategoriaDestino: undefined,
                ativoCategoriaDestino: undefined,
              })
            }
          />
          <SearchSelectField
            label="Categoria"
            fetchOptions={fetchOptions}
            value={optionValue}
            onSelect={onSelect}
            disabled={!temCategoria}
          />
        </Stack>

        <Stack direction="row" divider="x">
          <FieldValue
            description="Descrição Match"
            type="STRING"
            value={mapeamento.descricaoMatch}
            editable
            onUpdate={updateField("descricaoMatch")}
          />
          <FieldValue
            description="Descrição Destino"
            type="STRING"
            value={mapeamento.descricaoDestino}
            editable
            onUpdate={updateField("descricaoDestino")}
          />
        </Stack>

        <Stack direction="row" divider="x">
          <FieldValue
            description="Prioridade"
            type="NUMBER"
            value={mapeamento.prioridade}
            editable
            minValue={0}
            maxValue={99}
            onUpdate={updateField("prioridade")}
          />
          <FieldValue
            description="Ativo"
            type="BOOLEAN"
            value={mapeamento.ativo}
            editable
            onUpdate={updateField("ativo")}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default MapeamentoExtratoBancarioFormPage;
