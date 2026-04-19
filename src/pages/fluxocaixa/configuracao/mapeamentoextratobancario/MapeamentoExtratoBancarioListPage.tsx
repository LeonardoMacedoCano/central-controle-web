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
  getDescricaoTipoMapeamentoExtratoBancario,
  MapeamentoExtratoBancario,
  tipoMapeamentoExtratoBancarioOptions,
} from "../../../../types";
import { MapeamentoExtratoBancarioService } from "../../../../service";
import { useAuth } from "../../../../contexts";
import { useNavigate } from "react-router-dom";
import { usePagedData } from "../../../../utils";

const MapeamentoExtratoBancarioListPage: React.FC = () => {
  const { usuario } = useAuth();
  const message = useMessage();
  const { confirm, ConfirmModalComponent } = useConfirmModal();
  const navigate = useNavigate();

  const { data: mapeamentos, isLoading, load, loadPage } = usePagedData(
    usuario?.token,
    MapeamentoExtratoBancarioService.getMapeamentos,
    "Erro ao carregar os mapeamentos."
  );

  const handleDelete = async (mapeamento: MapeamentoExtratoBancario) => {
    const confirmado = await confirm(
      "Exclusão de Mapeamento",
      "Tem certeza de que deseja excluir este mapeamento? Esta ação não pode ser desfeita."
    );
    if (!confirmado || !usuario?.token) return;

    await MapeamentoExtratoBancarioService.deleteMapeamento(usuario.token, mapeamento.id, message);
    load();
  };

  return (
    <Container>
      <ActionButton
        icon={<FaPlus />}
        hint="Adicionar mapeamento"
        onClick={() => navigate('/fluxocaixa/config/mapeamento-extrato-bancario/novo')}
      />

      {ConfirmModalComponent}

      <Loading isLoading={isLoading} />

      <SearchFilterRSQL
        fields={[
          { name: "descricao", label: "Descrição", type: "STRING" },
          { name: "tipoRegra", label: "Tipo", type: "SELECT", options: tipoMapeamentoExtratoBancarioOptions },
          { name: "ativo", label: "Ativo", type: "BOOLEAN" }
        ]}
        onSearch={async (rsqlString) => load(0, PAGE_SIZE_DEFAULT, rsqlString)}
      />

      <Table<MapeamentoExtratoBancario>
        values={mapeamentos || []}
        messageEmpty="Nenhum mapeamento encontrado."
        keyExtractor={item => item.id.toString()}
        onView={(item) => navigate(`/fluxocaixa/config/mapeamento-extrato-bancario/resumo/${item.id}`)}
        onEdit={(item) => navigate(`/fluxocaixa/config/mapeamento-extrato-bancario/editar/${item.id}`)}
        onDelete={handleDelete}
        loadPage={loadPage}
        columns={[
          <Column<MapeamentoExtratoBancario>
            header="Ativo"
            width="60px"
            align="center"
            value={(item) => (
              <HighlightBox variant={item.ativo ? 'success' : 'warning'} width='75px' height='25px'>
                {item.ativo ? 'Sim' : 'Não'}
              </HighlightBox>
            )}
          />,
          <Column<MapeamentoExtratoBancario>
            key="tipo"
            header="Tipo"
            width="150px"
            align="center"
            value={(item) => getDescricaoTipoMapeamentoExtratoBancario(item.tipoRegra)}
          />,
          <Column<MapeamentoExtratoBancario>
            key="descricao"
            header="Descrição"
            value={item => item.descricao}
          />,
        ]}
      />
    </Container>
  );
};

export default MapeamentoExtratoBancarioListPage;
