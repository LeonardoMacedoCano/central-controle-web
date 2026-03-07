import React from 'react';
import { FaBars, FaFileImport, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { LancamentoService } from '../../../service';
import {
  ActionButton,
  Column,
  Container,
  formatDateToBrString,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
  SearchFilterRSQL,
  Stack,
  Table,
  useConfirmModal,
  useMessage,
  VariantColor,
} from 'lcano-react-ui';
import { Lancamento } from '../../../types/fluxocaixa/Lancamento';
import { getDescricaoTipoMovimento, TipoMovimentoEnum, tipoMovimentoFilters } from '../../../types';
import { usePagedData } from '../../../utils';

const getTipoVariant = (tipo: TipoMovimentoEnum): VariantColor => {
  switch (tipo) {
    case 'DESPESA': return 'warning';
    case 'RENDA':   return 'success';
    case 'ATIVO':   return 'info';
  }
};

const LancamentoListPage: React.FC = () => {
  const { confirm, ConfirmModalComponent } = useConfirmModal();
  const { usuario } = useAuth();
  const message = useMessage();
  const navigate = useNavigate();

  const { data: lancamentos, isLoading, load, loadPage } = usePagedData(
    usuario?.token,
    LancamentoService.getLancamentos,
    'Erro ao carregar os lançamentos.'
  );

  const handleNavigation = (path: string) => navigate(path);

  const handleDelete = async (lancamento: Lancamento) => {
    const confirmado = await confirm(
      "Exclusão de Lançamento",
      "Tem certeza de que deseja excluir este lançamento? Esta ação não pode ser desfeita."
    );
    if (!confirmado || !usuario?.token) return;

    await LancamentoService.deleteLancamento(usuario.token, lancamento.id, message);
    load();
  };

  return (
    <Container>
      {ConfirmModalComponent}
      <Loading isLoading={isLoading} />

      <Stack direction="column" divider="top">
        <SearchFilterRSQL
          fields={[
            { label: 'Data', name: 'dataLancamento', type: 'DATE' },
            { label: 'Tipo', name: 'tipo', type: 'SELECT', options: tipoMovimentoFilters },
            { label: 'Descrição', name: 'descricao', type: 'STRING' }
          ]}
          onSearch={async (rsqlString) => load(0, PAGE_SIZE_DEFAULT, rsqlString)}
        />

        <Table<Lancamento>
          values={lancamentos || []}
          messageEmpty="Nenhum lançamento encontrado."
          keyExtractor={(item) => item.id.toString()}
          onView={(item) => handleNavigation(`/fluxocaixa/lancamento/resumo/${item.id}`)}
          onEdit={(item) => handleNavigation(`/fluxocaixa/lancamento/editar/${item.id}`)}
          onDelete={handleDelete}
          loadPage={loadPage}
          columns={[
            <Column<Lancamento>
              header="Tipo"
              width="100px"
              align="center"
              value={(item) => (
                <HighlightBox
                  variant={getTipoVariant(item.tipo!)}
                  width="75px"
                  height="25px"
                  style={{ textAlign: 'center' }}
                >
                  {getDescricaoTipoMovimento(item.tipo)}
                </HighlightBox>
              )}
            />,
            <Column<Lancamento>
              header="Data"
              align="center"
              width="100px"
              value={(item) => formatDateToBrString(item.dataLancamento)}
            />,
            <Column<Lancamento>
              header="Descrição"
              value={(item) => item.descricao}
            />
          ]}
        />
      </Stack>

      <ActionButton
        icon={<FaBars />}
        options={[
          {
            icon: <FaFileImport />,
            hint: 'Importar Extrato',
            action: () => handleNavigation('/fluxocaixa/extrato-fluxo-caixa')
          },
          {
            icon: <FaPlus />,
            hint: 'Lançamento Manual',
            action: () => handleNavigation('/fluxocaixa/lancamento/novo')
          }
        ]}
      />
    </Container>
  );
};

export default LancamentoListPage;
