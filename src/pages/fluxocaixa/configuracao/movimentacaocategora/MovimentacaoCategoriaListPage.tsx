import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import {
  ActionButton,
  Column,
  ConfirmModal,
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
  VariantColor,
} from "lcano-react-ui";
import {
  MovimentacaoCategoria,
  TipoMovimentoEnum,
  initialMovimentacaoCategoriaState,
  tipoMovimentoOptions,
} from "../../../../types";
import { MovimentacaoCategoriaService } from "../../../../service";
import { AuthContext } from "../../../../contexts";
import MovimentacaoCategoriaSectionForm from "./MovimentacaoCategoriaSectionForm";

const getTipoMovimentoVariant = (
  tipo?: TipoMovimentoEnum
): VariantColor => {
  switch (tipo) {
    case "DESPESA":
      return "warning";
    case "RENDA":
      return "success";
    default:
      return "info";
  }
};

const MovimentacaoCategoriaListPage: React.FC = () => {
  const { usuario } = useContext(AuthContext);
  const message = useMessage();
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  const [categorias, setCategorias] = useState<PagedResponse<MovimentacaoCategoria>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState<MovimentacaoCategoria | undefined>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategorias = useCallback(async (page = pageIndex, size = pageSize, rsql = "") => {
    if (!usuario?.token) return;

    setIsLoading(true);
    try {
      const result = await MovimentacaoCategoriaService.getCategorias(usuario.token, page, size, rsql);
      setCategorias(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar as categorias.", error);
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.token, pageIndex, pageSize, message]);

  useEffect(() => {
    if (usuario?.token) loadCategorias();
  }, [usuario?.token, pageIndex, loadCategorias]);

  const openModal = (categoria?: MovimentacaoCategoria) => {
    setCategoriaAtual(categoria ? { ...categoria } : { ...initialMovimentacaoCategoriaState });
    setModalOpen(true);
  };

  const handleDeleteCategoria = async (categoria: MovimentacaoCategoria) => {
    const confirmado = await confirm(
      "Exclusão de Categoria",
      "Tem certeza de que deseja excluir esta categoria? Esta ação não pode ser desfeita."
    );
    if (!confirmado || !usuario?.token) return;

    await MovimentacaoCategoriaService.deleteCategoria(usuario.token, categoria.id, message);
    loadCategorias();
  };

  const isCategoriaValida = (categoria: MovimentacaoCategoria): boolean => {
    if (!categoria.descricao?.trim()) {
      message.showError("Descrição é obrigatória.");
      return false;
    }
    if (!categoria.tipo) {
      message.showError("Tipo é obrigatório.");
      return false;
    }
    return true;
  };

  const handleSaveCategoria = async () => {
    if (!usuario?.token || !categoriaAtual) return;
    if (!isCategoriaValida(categoriaAtual)) return;

    await MovimentacaoCategoriaService.saveCategoria(usuario.token, categoriaAtual, message);
    loadCategorias();
    setModalOpen(false);
  };

  const handlePageChange = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  return (
    <Container>
      <ActionButton icon={<FaPlus />} hint="Adicionar categoria" onClick={() => openModal()} />

      {ConfirmModalComponent}

      {modalOpen && categoriaAtual && (
        <ConfirmModal
          variantPrimary="info"
          isOpen={modalOpen}
          title={categoriaAtual.id ? "Editar Categoria Despesa" : "Nova Categoria Despesa"}
          content={
            <MovimentacaoCategoriaSectionForm
              categoria={categoriaAtual}
              onUpdate={(categoriaAtualizada) =>
                setCategoriaAtual(prev => ({ ...prev, ...categoriaAtualizada }))
              }
            />
          }
          onClose={() => setModalOpen(false)}
          onConfirm={handleSaveCategoria}
        />
      )}

      <Loading isLoading={isLoading} />

      <SearchFilterRSQL
        maxWidth="1000px"
        title="Fluxo Caixa > Categorias"
        fields={[
          { name: "descricao", label: "Descrição", type: "STRING" },
          { name: "tipo", label: "Tipo", type: "SELECT", options: tipoMovimentoOptions },
        ]}
        onSearch={async (rsqlString) => loadCategorias(0, PAGE_SIZE_DEFAULT, rsqlString)}
      />

      <Panel maxWidth="1000px">
        <Table<MovimentacaoCategoria>
          values={categorias || []}
          messageEmpty="Nenhuma categoria encontrada."
          keyExtractor={item => item.id.toString()}
          onEdit={openModal}
          onDelete={handleDeleteCategoria}
          loadPage={handlePageChange}
          columns={[
            <Column<MovimentacaoCategoria> 
              key="tipo" 
              header="Tipo" 
              width="100px" 
              align="center"
              value={(item) => (
                <HighlightBox
                  variant={getTipoMovimentoVariant(item.tipo)}
                  width='75px'
                  height='25px'
                  bordered
                >
                  {item.tipo}
                </HighlightBox>
              )}
              />,
            <Column<MovimentacaoCategoria> key="descricao" header="Descrição" value={item => item.descricao} />,
          ]}
        />
      </Panel>
    </Container>
  );
};

export default MovimentacaoCategoriaListPage;
