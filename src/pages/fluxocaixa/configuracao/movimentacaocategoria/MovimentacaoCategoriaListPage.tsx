import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  ActionButton,
  Column,
  ConfirmModal,
  Container,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
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
import { useAuth } from "../../../../contexts";
import { usePagedData } from "../../../../utils";
import MovimentacaoCategoriaSectionForm from "./MovimentacaoCategoriaSectionForm";

const getTipoMovimentoVariant = (tipo?: TipoMovimentoEnum): VariantColor => {
  switch (tipo) {
    case "DESPESA": return "warning";
    case "RENDA":   return "success";
    default:        return "info";
  }
};

const MovimentacaoCategoriaListPage: React.FC = () => {
  const { usuario } = useAuth();
  const message = useMessage();
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState<MovimentacaoCategoria | undefined>();

  const { data: categorias, isLoading, load, loadPage } = usePagedData(
    usuario?.token,
    MovimentacaoCategoriaService.getCategorias,
    "Erro ao carregar as categorias."
  );

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
    load();
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
    load();
    setModalOpen(false);
  };

  return (
    <Container>
      <ActionButton icon={<FaPlus />} hint="Adicionar categoria" onClick={() => openModal()} />

      {ConfirmModalComponent}

      {modalOpen && categoriaAtual && (
        <ConfirmModal
          variantPrimary="info"
          isOpen={modalOpen}
          title={categoriaAtual.id ? "Editar Categoria" : "Nova Categoria"}
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
        fields={[
          { name: "descricao", label: "Descrição", type: "STRING" },
          { name: "tipo", label: "Tipo", type: "SELECT", options: tipoMovimentoOptions },
        ]}
        onSearch={async (rsqlString) => load(0, PAGE_SIZE_DEFAULT, rsqlString)}
      />

      <Table<MovimentacaoCategoria>
        values={categorias || []}
        messageEmpty="Nenhuma categoria encontrada."
        keyExtractor={item => item.id.toString()}
        onEdit={openModal}
        onDelete={handleDeleteCategoria}
        loadPage={loadPage}
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
    </Container>
  );
};

export default MovimentacaoCategoriaListPage;
