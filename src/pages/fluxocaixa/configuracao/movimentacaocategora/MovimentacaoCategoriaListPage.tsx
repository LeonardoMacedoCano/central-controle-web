import { useContext, useEffect, useState } from "react";
import { MovimentacaoCategoria, PAGE_SIZE_DEFAULT } from "../../../../types";
import { MovimentacaoCategoriaService } from "../../../../service";
import { Column, Container, Loading, PagedResponse, Panel, Table, useConfirmModal, useMessage } from "lcano-react-ui";
import { AuthContext } from "../../../../contexts";
import { useNavigate } from "react-router-dom";

const MovimentacaoCategoriaListPage: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<PagedResponse<MovimentacaoCategoria>>();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { confirm, ConfirmModalComponent } = useConfirmModal();
  const { usuario } = useContext(AuthContext);
  const message = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    loadLancamentos();
  }, [usuario?.token, pageIndex]);

  const loadLancamentos = async () => {
    if (!usuario?.token) return;

    setIsLoading(true);
    try {
      const result = await MovimentacaoCategoriaService.getCategorias(usuario.token, pageIndex, pageSize);
      setLancamentos(result);
    } catch (error) {
      message.showErrorWithLog('Erro ao carregar os lançamentos.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => navigate(path);

  const handleDelete = async (id: number) => {
    const confirmed = await confirm(
      "Exclusão de Lançamento", 
      "Tem certeza de que deseja excluir este lançamento? Esta ação não pode ser desfeita."
    );

    if (confirmed) {
      try {
        //await lancamentoService.deleteLancamento(usuario?.token!, id);
        loadLancamentos();
      } catch (error) {
        message.showErrorWithLog('Erro ao excluir lançamento.', error);
      }
    } else {
      message.showInfo('Ação cancelada!');
    }
  };

  const loadPage = (pageIndex: number, pageSize: number) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  return (
    <Container>
      {ConfirmModalComponent}
      <Loading isLoading={isLoading} />
      <Panel maxWidth='1000px' title='Lançamentos'>
        <Table<MovimentacaoCategoria>
          values={lancamentos || []}
          messageEmpty="Nenhum lançamento encontrado."
          keyExtractor={(item) => item.id.toString()}
          onView={(item) => handleNavigation(`/lancamento/${item.id}`)}
          onEdit={(item) => handleNavigation(`/lancamento/editar/${item.id}`)}
          onDelete={(item) => handleDelete(item.id)}
          loadPage={loadPage}
          columns={[
            <Column<MovimentacaoCategoria>
              header="Tipo"
              width="100px"
              align="center"
              value={(item) => item.tipo}
            />,
            <Column<MovimentacaoCategoria> 
              header="Descrição" 
              value={(item) => item.descricao} 
            />
          ]}
        />
      </Panel>
    </Container>
  );
};

export default MovimentacaoCategoriaListPage;
