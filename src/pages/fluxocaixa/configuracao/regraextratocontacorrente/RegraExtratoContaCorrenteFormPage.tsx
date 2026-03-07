import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

import { useAuth } from "../../../../contexts";
import {
  getCodigoTipoRegraExtratoContaCorrente,
  getDescricaoTipoRegraExtratoContaCorrente,
  getTipoRegraExtratoContaCorrenteByCodigo,
  initialRegraExtratoContaCorrenteState,
  RegraExtratoContaCorrente,
  tipoRegraExtratoContaCorrenteOptions,
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
import { RegraExtratoContaCorrenteService } from "../../../../service";
import { TipoRegraExtratoContaCorrenteEnum } from "../../../../types/fluxocaixa/TipoRegraExtratoContaCorrenteEnum";
import { useCategoriaSelectAdapter } from "../../../../utils";
import { TipoMovimentoEnum } from "../../../../types";

const TIPOS_COM_CATEGORIA: TipoRegraExtratoContaCorrenteEnum[] = [
  "CLASSIFICAR_DESPESA",
  "CLASSIFICAR_RENDA",
  "CLASSIFICAR_ATIVO",
];

const getTipoMovimentoFromRegra = (tipoRegra: TipoRegraExtratoContaCorrenteEnum): TipoMovimentoEnum | undefined => {
  switch (tipoRegra) {
    case "CLASSIFICAR_DESPESA": return "DESPESA";
    case "CLASSIFICAR_RENDA":   return "RENDA";
    case "CLASSIFICAR_ATIVO":   return "ATIVO";
    default:                    return undefined;
  }
};

const RegraExtratoContaCorrenteFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const message = useMessage();

  const [regra, setRegra] = useState<RegraExtratoContaCorrente>(initialRegraExtratoContaCorrenteState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!usuario?.token || !id) return;

    setIsLoading(true);
    RegraExtratoContaCorrenteService
      .getRegra(usuario.token, id)
      .then((result) => result && setRegra(result))
      .catch((error) => message.showErrorWithLog("Erro ao carregar a regra.", error))
      .finally(() => setIsLoading(false));
  }, [usuario?.token, id, message]);

  const updateRegra = (fields: Partial<RegraExtratoContaCorrente>) =>
    setRegra((prev) => ({ ...prev, ...fields }));

  const updateField =
    <K extends keyof RegraExtratoContaCorrente>(field: K) =>
    (value: unknown) =>
      updateRegra({ [field]: value } as Pick<RegraExtratoContaCorrente, K>);

  const temCategoria = TIPOS_COM_CATEGORIA.includes(regra.tipoRegra);
  const tipoMovimento = getTipoMovimentoFromRegra(regra.tipoRegra);

  const getCategoriaValue = () => {
    switch (regra.tipoRegra) {
      case "CLASSIFICAR_DESPESA": return regra.despesaCategoriaDestino;
      case "CLASSIFICAR_RENDA":   return regra.rendaCategoriaDestino;
      case "CLASSIFICAR_ATIVO":   return regra.ativoCategoriaDestino;
      default:                    return undefined;
    }
  };

  const handleCategoriaUpdate = (v: ReturnType<typeof getCategoriaValue>) => {
    switch (regra.tipoRegra) {
      case "CLASSIFICAR_DESPESA": updateRegra({ despesaCategoriaDestino: v }); break;
      case "CLASSIFICAR_RENDA":   updateRegra({ rendaCategoriaDestino: v });   break;
      case "CLASSIFICAR_ATIVO":   updateRegra({ ativoCategoriaDestino: v });   break;
    }
  };

  const { fetchOptions, onSelect, optionValue } = useCategoriaSelectAdapter(
    tipoMovimento,
    temCategoria ? usuario?.token : undefined,
    getCategoriaValue(),
    handleCategoriaUpdate
  );

  const saveRegra = async () => {
    if (!usuario?.token) return;

    try {
      const response = await RegraExtratoContaCorrenteService.saveRegra(usuario.token, regra, message);
      if (response?.id) {
        navigate(`/fluxocaixa/config/regra-extrato-conta-corrente/resumo/${response.id}`);
      }
    } catch (error) {
      message.showErrorWithLog("Erro ao salvar regra.", error);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <ActionButton icon={<FaCheck />} hint="Salvar" onClick={saveRegra} />

      <Stack direction="column" divider="y">
        <FieldValue
          description="Descrição"
          type="STRING"
          value={regra.descricao}
          editable
          onUpdate={updateField("descricao")}
        />

        <Stack direction="row" divider="x">
          <FieldValue
            description="Tipo"
            type="SELECT"
            value={{
              key: getCodigoTipoRegraExtratoContaCorrente(regra.tipoRegra),
              value: getDescricaoTipoRegraExtratoContaCorrente(regra.tipoRegra),
            }}
            editable
            options={tipoRegraExtratoContaCorrenteOptions}
            onUpdate={(v) =>
              updateRegra({
                tipoRegra: getTipoRegraExtratoContaCorrenteByCodigo(String(v)),
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
            value={regra.descricaoMatch}
            editable
            onUpdate={updateField("descricaoMatch")}
          />
          <FieldValue
            description="Descrição Destino"
            type="STRING"
            value={regra.descricaoDestino}
            editable
            onUpdate={updateField("descricaoDestino")}
          />
        </Stack>

        <Stack direction="row" divider="x">
          <FieldValue
            description="Prioridade"
            type="NUMBER"
            value={regra.prioridade}
            editable
            minValue={0}
            maxValue={99}
            onUpdate={updateField("prioridade")}
          />
          <FieldValue
            description="Ativo"
            type="BOOLEAN"
            value={regra.ativo}
            editable
            onUpdate={updateField("ativo")}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default RegraExtratoContaCorrenteFormPage;
