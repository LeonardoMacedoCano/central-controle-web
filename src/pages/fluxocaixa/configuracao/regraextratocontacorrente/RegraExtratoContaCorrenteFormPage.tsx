import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

import { AuthContext } from "../../../../contexts";
import {
  getCodigoTipoRegraExtratoContaCorrente,
  getDescricaoTipoRegraExtratoContaCorrente,
  getTipoRegraExtratoContaCorrenteByCodigo,
  initialRegraExtratoContaCorrenteState,
  MovimentacaoCategoria,
  RegraExtratoContaCorrente,
  tipoRegraExtratoContaCorrenteOptions,
} from "../../../../types";

import {
  ActionButton,
  buildSearchSelectAdapter,
  Container,
  FieldValue,
  Loading,
  SearchSelectField,
  Stack,
  useMessage,
} from "lcano-react-ui";

import {
  MovimentacaoCategoriaService,
  RegraExtratoContaCorrenteService,
} from "../../../../service";
import { TipoRegraExtratoContaCorrenteEnum } from "../../../../types/fluxocaixa/TipoRegraExtratoContaCorrenteEnum";

const TIPOS_COM_CATEGORIA = [
  "CLASSIFICAR_DESPESA",
  "CLASSIFICAR_RENDA",
  "CLASSIFICAR_ATIVO",
] as const;

type TipoComCategoria = typeof TIPOS_COM_CATEGORIA[number];

function isTipoComCategoria(
  tipo: TipoRegraExtratoContaCorrenteEnum
): tipo is TipoComCategoria {
  return TIPOS_COM_CATEGORIA.includes(tipo as TipoComCategoria);
}

type CategoriaConfig = {
  tipo: "DESPESA" | "RENDA" | "ATIVO";
  value?: MovimentacaoCategoria;
  onUpdate: (v?: MovimentacaoCategoria) => void;
};

const RegraExtratoContaCorrenteFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const message = useMessage();

  const [regra, setRegra] = useState<RegraExtratoContaCorrente>(
    initialRegraExtratoContaCorrenteState
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!usuario?.token || !id) return;

    setIsLoading(true);

    RegraExtratoContaCorrenteService
      .getRegra(usuario.token, id)
      .then((result) => result && setRegra(result))
      .catch((error) =>
        message.showErrorWithLog("Erro ao carregar a regra.", error)
      )
      .finally(() => setIsLoading(false));
  }, [usuario?.token, id, message]);

  const updateRegra = (fields: Partial<RegraExtratoContaCorrente>) =>
    setRegra((prev) => ({ ...prev, ...fields }));

  const updateField =
    <K extends keyof RegraExtratoContaCorrente>(field: K) =>
    (value: unknown) =>
      updateRegra({ [field]: value } as Pick<RegraExtratoContaCorrente, K>);

  function getCategoriaConfig(): CategoriaConfig | null {
    if (!isTipoComCategoria(regra.tipoRegra)) {
      return null;
    }

    switch (regra.tipoRegra) {
      case "CLASSIFICAR_DESPESA":
        return {
          tipo: "DESPESA",
          value: regra.despesaCategoriaDestino,
          onUpdate: (v) =>
            updateRegra({ despesaCategoriaDestino: v }),
        };

      case "CLASSIFICAR_RENDA":
        return {
          tipo: "RENDA",
          value: regra.rendaCategoriaDestino,
          onUpdate: (v) =>
            updateRegra({ rendaCategoriaDestino: v }),
        };

      case "CLASSIFICAR_ATIVO":
        return {
          tipo: "ATIVO",
          value: regra.ativoCategoriaDestino,
          onUpdate: (v) =>
            updateRegra({ ativoCategoriaDestino: v }),
        };

      default:
        return null;
    }
  }

  const categoriaConfig = getCategoriaConfig();

  const categoriaValue: MovimentacaoCategoria | undefined =
    categoriaConfig?.value
      ? {
          id: categoriaConfig.value.id,
          descricao: categoriaConfig.value.descricao,
          tipo: categoriaConfig.tipo,
        }
      : undefined;

  const categoriaEnabled = !!categoriaConfig;

  const { fetchOptions, onSelect, optionValue } =
    buildSearchSelectAdapter<MovimentacaoCategoria>({
      searchOptions: async (query, page, pageSize) => {
        if (!categoriaConfig) return [];

        const response =
          await MovimentacaoCategoriaService.getCategorias(
            usuario!.token,
            page,
            pageSize,
            `tipo==${categoriaConfig.tipo};descricao=ilike='${query}'`
          );

        return response?.content || [];
      },
      mapToOption: (c) => ({ key: String(c.id), value: c.descricao }),
      mapFromOption: (opt) => ({
        id: Number(opt.key),
        descricao: opt.value,
        tipo: categoriaConfig?.tipo,
      }),
      value: categoriaValue,
      onUpdate: (value) => {
        categoriaConfig?.onUpdate(value);
      },
    });

  const saveRegra = async () => {
    if (!usuario?.token) return;

    try {
      const response =
        await RegraExtratoContaCorrenteService.saveRegra(
          usuario.token,
          regra,
          message
        );
      if (response?.id) {
        navigate(`/fluxocaixa/regra-extrato-conta-corrente/resumo/${response.id}`);
      }
    } catch (error) {
      message.showErrorWithLog("Erro ao salvar regra.", error);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <ActionButton
        icon={<FaCheck />}
        hint="Salvar"
        onClick={saveRegra}
      />

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
              value: getDescricaoTipoRegraExtratoContaCorrente(
                regra.tipoRegra
              ),
            }}
            editable
            options={tipoRegraExtratoContaCorrenteOptions}
            onUpdate={(v) =>
              updateRegra({
                tipoRegra:
                  getTipoRegraExtratoContaCorrenteByCodigo(String(v)),
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
            disabled={!categoriaEnabled}
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
