import React from "react";
import { useParams } from "react-router-dom";
import { getDescricaoTipoMapeamentoExtratoBancario, MapeamentoExtratoBancario } from "../../../../types";
import { MapeamentoExtratoBancarioService } from "../../../../service";
import { useAuth } from "../../../../contexts";
import { Container, FieldValue, Loading, Stack } from "lcano-react-ui";
import { useFetchById } from "../../../../utils";

const MapeamentoExtratoBancarioViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();

  const { data: mapeamento, isLoading } = useFetchById<MapeamentoExtratoBancario>(
    usuario?.token,
    id,
    MapeamentoExtratoBancarioService.getMapeamento,
    "Erro ao carregar o mapeamento."
  );

  const getDescricaoCategoria = () => {
    if (!mapeamento) return "";
    switch (mapeamento.tipoRegra) {
      case "CLASSIFICAR_DESPESA": return mapeamento.despesaCategoriaDestino?.descricao ?? "";
      case "CLASSIFICAR_RENDA":   return mapeamento.rendaCategoriaDestino?.descricao ?? "";
      case "CLASSIFICAR_ATIVO":   return mapeamento.ativoCategoriaDestino?.descricao ?? "";
      default:                    return "";
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      {mapeamento && (
        <Stack direction="column" divider="y">
          <FieldValue
            description="Descrição"
            type="STRING"
            value={mapeamento.descricao}
            editable={false}
          />

          <Stack direction="row" divider="x">
            <FieldValue
              description="Tipo"
              type="STRING"
              value={getDescricaoTipoMapeamentoExtratoBancario(mapeamento.tipoRegra)}
              editable={false}
            />
            <FieldValue
              description="Categoria"
              type="STRING"
              value={getDescricaoCategoria()}
              editable={false}
            />
          </Stack>

          <Stack direction="row" divider="x">
            <FieldValue
              description="Descrição Match"
              type="STRING"
              value={mapeamento.descricaoMatch}
              editable={false}
            />
            <FieldValue
              description="Descrição Destino"
              type="STRING"
              value={mapeamento.descricaoDestino}
              editable={false}
            />
          </Stack>

          <Stack direction="row" divider="x">
            <FieldValue
              description="Prioridade"
              type="STRING"
              value={mapeamento.prioridade}
              editable={false}
            />
            <FieldValue
              description="Ativo"
              type="STRING"
              value={mapeamento.ativo ? "Sim" : "Não"}
              editable={false}
            />
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default MapeamentoExtratoBancarioViewPage;
