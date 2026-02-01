import { useParams } from "react-router-dom";
import { getDescricaoTipoRegraExtratoContaCorrente, RegraExtratoContaCorrente } from "../../../../types";
import { useContext, useEffect, useState } from "react";
import { RegraExtratoContaCorrenteService } from "../../../../service";
import { AuthContext } from "../../../../contexts";
import { Container, FieldValue, Loading, Stack, useMessage } from "lcano-react-ui";

const RegraExtratoContaCorrentePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [regra, setRegra] = useState<RegraExtratoContaCorrente>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = useContext(AuthContext);
  const message = useMessage();

  useEffect(() => {
    if (!auth.usuario?.token) return;
    loadRegra(id!);
  }, [auth.usuario?.token, id]);

  const loadRegra = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await RegraExtratoContaCorrenteService.getRegra(auth.usuario?.token!, id);
      if (result) setRegra(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar a regra.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDescricaoCategoria = () => {
    switch (regra!.tipoRegra) {
      case "CLASSIFICAR_DESPESA":
        return regra?.despesaCategoriaDestino?.descricao ?? "";
      case "CLASSIFICAR_RENDA":
        return regra?.rendaCategoriaDestino?.descricao ?? "";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      {regra && (
        <Stack direction="column" divider="y">
          <FieldValue
            description="Descrição"
            type="STRING"
            value={regra.descricao}
            editable={false}
          />

          <Stack direction="row" divider="x">
            <FieldValue
              description="Tipo"
              type="STRING"
              value={getDescricaoTipoRegraExtratoContaCorrente(regra.tipoRegra)}
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
              value={regra.descricaoMatch}
              editable={false}
            />
            <FieldValue
              description="Descrição Destino"
              type="STRING"
              value={regra.descricaoDestino}
              editable={false}
            />
          </Stack>

          <Stack direction="row" divider="x">
            <FieldValue
              description="Prioridade"
              type="STRING"
              value={regra.prioridade}
              editable={false}
            />
            <FieldValue
              description="Ativo"
              type="STRING"
              value={regra.ativo ? "Sim" : "Não"}
              editable={false}
            />
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default RegraExtratoContaCorrentePage;
