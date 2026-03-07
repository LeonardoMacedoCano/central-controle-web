import React from "react";
import { FaPlus } from "react-icons/fa";
import {
  ActionButton,
  Column,
  Container,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
  SearchFilterRSQL,
  Table,
  useConfirmModal,
  useMessage,
} from "lcano-react-ui";
import {
  getDescricaoTipoRegraExtratoContaCorrente,
  RegraExtratoContaCorrente,
  tipoRegraExtratoContaCorrenteOptions,
} from "../../../../types";
import { RegraExtratoContaCorrenteService } from "../../../../service";
import { useAuth } from "../../../../contexts";
import { useNavigate } from "react-router-dom";
import { usePagedData } from "../../../../utils";

const RegraExtratoContaCorrenteListPage: React.FC = () => {
  const { usuario } = useAuth();
  const message = useMessage();
  const { confirm, ConfirmModalComponent } = useConfirmModal();
  const navigate = useNavigate();

  const { data: regras, isLoading, load, loadPage } = usePagedData(
    usuario?.token,
    RegraExtratoContaCorrenteService.getRegras,
    "Erro ao carregar as regras."
  );

  const handleDelete = async (regra: RegraExtratoContaCorrente) => {
    const confirmado = await confirm(
      "Exclusão de Regra",
      "Tem certeza de que deseja excluir esta regra? Esta ação não pode ser desfeita."
    );
    if (!confirmado || !usuario?.token) return;

    await RegraExtratoContaCorrenteService.deleteRegra(usuario.token, regra.id, message);
    load();
  };

  return (
    <Container>
      <ActionButton
        icon={<FaPlus />}
        hint="Adicionar regra"
        onClick={() => navigate('/fluxocaixa/config/regra-extrato-conta-corrente/novo')}
      />

      {ConfirmModalComponent}

      <Loading isLoading={isLoading} />

      <SearchFilterRSQL
        fields={[
          { name: "descricao", label: "Descrição", type: "STRING" },
          { name: "tipoRegra", label: "Tipo", type: "SELECT", options: tipoRegraExtratoContaCorrenteOptions },
          { name: "ativo", label: "Ativo", type: "BOOLEAN" }
        ]}
        onSearch={async (rsqlString) => load(0, PAGE_SIZE_DEFAULT, rsqlString)}
      />

      <Table<RegraExtratoContaCorrente>
        values={regras || []}
        messageEmpty="Nenhuma regra encontrada."
        keyExtractor={item => item.id.toString()}
        onView={(item) => navigate(`/fluxocaixa/config/regra-extrato-conta-corrente/resumo/${item.id}`)}
        onEdit={(item) => navigate(`/fluxocaixa/config/regra-extrato-conta-corrente/editar/${item.id}`)}
        onDelete={handleDelete}
        loadPage={loadPage}
        columns={[
          <Column<RegraExtratoContaCorrente>
            header="Ativo"
            width="60px"
            align="center"
            value={(item) => (
              <HighlightBox variant={item.ativo ? 'success' : 'warning'} width='75px' height='25px'>
                {item.ativo ? 'Sim' : 'Não'}
              </HighlightBox>
            )}
          />,
          <Column<RegraExtratoContaCorrente>
            key="tipo"
            header="Tipo"
            width="150px"
            align="center"
            value={(item) => getDescricaoTipoRegraExtratoContaCorrente(item.tipoRegra)}
          />,
          <Column<RegraExtratoContaCorrente>
            key="descricao"
            header="Descrição"
            value={item => item.descricao}
          />,
        ]}
      />
    </Container>
  );
};

export default RegraExtratoContaCorrenteListPage;
