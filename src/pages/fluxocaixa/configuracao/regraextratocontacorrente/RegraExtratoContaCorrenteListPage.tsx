import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import {
  ActionButton,
  Column,
  Container,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
  PagedResponse,
  Panel,
  SearchFilterRSQL,
  Table,
  useConfirmModal,
  useMessage,
} from "lcano-react-ui";
import {
  getDescricaoTipoRegraExtratoContaCorrente,
  RegraExtratoContaCorrente,
  tipoMovimentoOptions,
  tipoRegraExtratoContaCorrenteOptions,
} from "../../../../types";
import { RegraExtratoContaCorrenteService } from "../../../../service";
import { AuthContext } from "../../../../contexts";
import { useNavigate } from "react-router-dom";

const RegraExtratoContaCorrenteListPage: React.FC = () => {
  const { usuario } = useContext(AuthContext);
  const message = useMessage();
  const { confirm, ConfirmModalComponent } = useConfirmModal();
  const navigate = useNavigate();

  const [regras, setRegras] = useState<PagedResponse<RegraExtratoContaCorrente>>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [isLoading, setIsLoading] = useState(false);

  const loadRegras = useCallback(async (page = pageIndex, size = pageSize, rsql = "") => {
    if (!usuario?.token) return;

    setIsLoading(true);
    try {
      const result = await RegraExtratoContaCorrenteService.getRegras(usuario.token, page, size, rsql);
      setRegras(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar as regras.", error);
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.token, pageIndex, pageSize, message]);

  useEffect(() => {
    if (usuario?.token) loadRegras();
  }, [usuario?.token, pageIndex, loadRegras]);

  const handleDelete = async (regra: RegraExtratoContaCorrente) => {
    const confirmado = await confirm(
      "Exclusão de Regra",
      "Tem certeza de que deseja excluir esta regra? Esta ação não pode ser desfeita."
    );
    if (!confirmado || !usuario?.token) return;

    await RegraExtratoContaCorrenteService.deleteRegra(usuario.token, regra.id, message);
    loadRegras();
  };

  const handlePageChange = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  return (
    <Container>
      <ActionButton icon={<FaPlus />} hint="Adicionar regra" onClick={() => navigate(`/fluxocaixa/regra-extrato-conta-corrente/novo`)} />

      {ConfirmModalComponent}

      <Loading isLoading={isLoading} />

      <SearchFilterRSQL
        maxWidth="1000px"
        title="Fluxo Caixa > Regras Extrato Conta Corrente"
        fields={[
          { name: "descricao", label: "Descrição", type: "STRING" },
          { name: "tipoRegra", label: "Tipo", type: "SELECT", options: tipoRegraExtratoContaCorrenteOptions },
          { name: "ativo", label: "Ativo", type: "BOOLEAN"}
        ]}
        onSearch={async (rsqlString) => loadRegras(0, PAGE_SIZE_DEFAULT, rsqlString)}
      />

      <Panel maxWidth="1000px">
        <Table<RegraExtratoContaCorrente>
          values={regras || []}
          messageEmpty="Nenhuma regra encontrada."
          keyExtractor={item => item.id.toString()}
          onView={(item) => navigate(`/fluxocaixa/regra-extrato-conta-corrente/resumo/${item.id}`)}
          onEdit={(item) => navigate(`/fluxocaixa/regra-extrato-conta-corrente/editar/${item.id}`)}
          onDelete={handleDelete}
          loadPage={handlePageChange}
          columns={[
            <Column<RegraExtratoContaCorrente> 
              header="Ativo" 
              width="60px"
              align="center"
              value={(item) => (
                <HighlightBox
                  variant={item.ativo ? 'success' : 'warning'}
                  width='75px'
                  height='25px'
                >
                  {item.ativo ? 'Sim' : 'Não'}
                </HighlightBox>
              )}
            />,
            <Column<RegraExtratoContaCorrente> key="tipo" header="Tipo" width="150px" align="center" value={(item) => getDescricaoTipoRegraExtratoContaCorrente(item.tipoRegra)}  />,
            <Column<RegraExtratoContaCorrente> key="descricao" header="Descrição" value={item => item.descricao} />,
          ]}
        />
      </Panel>
    </Container>
  );
};

export default RegraExtratoContaCorrenteListPage;
