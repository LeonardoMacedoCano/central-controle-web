import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import {
  ActionButton,
  Column,
  ConfirmModal,
  Container,
  Loading,
  PagedResponse,
  Panel,
  Table,
  useConfirmModal,
  useMessage,
} from "lcano-react-ui";

import {
  MovimentacaoCategoria,
  initialMovimentacaoCategoriaState,
  PAGE_SIZE_DEFAULT,
} from "../../../../types";

import { MovimentacaoCategoriaService } from "../../../../service";
import { AuthContext } from "../../../../contexts";
import MovimentacaoCategoriaSectionForm from "./MovimentacaoCategoriaSectionForm";

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

  useEffect(() => {
    if (usuario?.token) {
      loadCategorias();
    }
  }, [usuario?.token, pageIndex]);

  const loadCategorias = async () => {
    if (!usuario?.token) return;

    setIsLoading(true);
    try {
      const result = await MovimentacaoCategoriaService.getCategorias(
        usuario.token,
        pageIndex,
        pageSize,
      );
      setCategorias(result);
    } catch (error) {
      message.showErrorWithLog("Erro ao carregar as categorias.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategoria = () => {
    setCategoriaAtual({ ...initialMovimentacaoCategoriaState });
    setModalOpen(true);
  };

  const handleEditCategoria = (categoria: MovimentacaoCategoria) => {
    setCategoriaAtual(categoria);
    setModalOpen(true);
  };

  const handleDeleteCategoria = async (categoria: MovimentacaoCategoria) => {
    const confirmado = await confirm(
      "Exclusão de Categoria",
      "Tem certeza de que deseja excluir esta categoria? Esta ação não pode ser desfeita."
    );

    if (confirmado && usuario?.token) {
      await MovimentacaoCategoriaService.deleteCategoria(usuario.token, categoria.id, message);
      loadCategorias();
    }
  };
  
  const isCategoriaValida = (categoria: MovimentacaoCategoria): boolean => {
    if (!categoria.descricao?.trim()) {
      message.showError('Descrição é obrigatória.');
      return false;
    }
    if (!categoria.tipo) {
      message.showError('Tipo é obrigatório.');
      return false;
    }
    return true;
  };

  const handleSaveCategoria = async () => {
    if (!usuario?.token || !categoriaAtual) return;
    if (!isCategoriaValida(categoriaAtual)) return;

    await MovimentacaoCategoriaService.saveCategoria(
      usuario.token,
      categoriaAtual,
      message
    );

    loadCategorias();
    setModalOpen(false);
  };

  const handlePageChange = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  const renderModal = () =>
    modalOpen && categoriaAtual && (
      <ConfirmModal
        variantPrimary="info"
        isOpen={modalOpen}
        title={categoriaAtual.id ? "Editar Categoria Despesa" : "Nova Categoria Despesa"}
        content={
          <MovimentacaoCategoriaSectionForm
            categoria={categoriaAtual}
            onUpdate={(categoriaAtualizada) =>
              setCategoriaAtual((prev) => ({ ...prev, ...categoriaAtualizada }))
            }
          />
        }
        onClose={() => setModalOpen(false)}
        onConfirm={handleSaveCategoria}
      />
    );

  return (
    <Container>
      <ActionButton icon={<FaPlus />} hint="Adicionar categoria" onClick={handleAddCategoria} />

      {ConfirmModalComponent}
      {renderModal()}
      <Loading isLoading={isLoading} />

      <Panel maxWidth="1000px" title="Fluxo Caixa > Categorias">
        <Table<MovimentacaoCategoria>
          values={categorias || []}
          messageEmpty="Nenhuma categoria encontrada."
          keyExtractor={(item) => item.id.toString()}
          onEdit={handleEditCategoria}
          onDelete={handleDeleteCategoria}
          loadPage={handlePageChange}
          columns={[
            <Column<MovimentacaoCategoria>
              key="tipo"
              header="Tipo"
              width="100px"
              align="center"
              value={(item) => item.tipo}
            />,
            <Column<MovimentacaoCategoria>
              key="descricao"
              header="Descrição"
              value={(item) => item.descricao}
            />,
          ]}
        />
      </Panel>
    </Container>
  );
};

export default MovimentacaoCategoriaListPage;
