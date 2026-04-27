import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { ArquivoExtratoService } from '../../../service';
import {
  Column,
  Container,
  formatDateTimeToBrString,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
  SearchFilterRSQL,
  Stack,
  Table,
  VariantColor,
} from 'lcano-react-ui';
import { ImportacaoExtrato, StatusImportacaoEnum } from '../../../types/fluxocaixa/ImportacaoExtrato';
import {
  getDescricaoStatusExtrato,
  getDescricaoTipoExtrato,
  statusExtratoFilters,
  tipoExtratoOptions,
} from '../../../types';
import { usePagedData } from '../../../utils';

const getStatusVariant = (status: StatusImportacaoEnum): VariantColor => {
  switch (status) {
    case 'PENDENTE':     return 'secondary';
    case 'PROCESSANDO': return 'info';
    case 'CONCLUIDO':   return 'success';
    case 'ERRO':        return 'warning';
  }
};

const ArquivoExtratoListPage: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const { data: arquivos, isLoading, load, loadPage } = usePagedData(
    usuario?.token,
    ArquivoExtratoService.getArquivos,
    'Erro ao carregar arquivos importados.'
  );

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Stack direction="column" divider="top">
        <SearchFilterRSQL
          fields={[
            { label: 'Número', name: 'id', type: 'NUMBER' },
            { label: 'Tipo', name: 'tipo', type: 'SELECT', options: tipoExtratoOptions },
            { label: 'Status', name: 'status', type: 'SELECT', options: statusExtratoFilters },
            { label: 'Arquivo', name: 'nomeArquivo', type: 'STRING' },
          ]}
          onSearch={async (rsql) => load(0, PAGE_SIZE_DEFAULT, rsql)}
        />

        <Table<ImportacaoExtrato>
          values={arquivos || []}
          messageEmpty="Nenhum arquivo importado encontrado."
          keyExtractor={(item) => item.id.toString()}
          onView={(item) => navigate(`/fluxocaixa/lancamento/arquivo-extrato/${item.id}`)}
          loadPage={loadPage}
          columns={[
            <Column<ImportacaoExtrato>
              header="Número"
              width="50px"
              value={(item) => item.id}
            />,
            <Column<ImportacaoExtrato>
              header="Status"
              align="center"
              value={(item) => (
                <HighlightBox
                  variant={getStatusVariant(item.status)}
                  width="100px"
                  height="25px"
                  style={{ textAlign: 'center' }}
                >
                  {getDescricaoStatusExtrato(item.status)}
                </HighlightBox>
              )}
            />,
            <Column<ImportacaoExtrato>
              header="Tipo"
              value={(item) => getDescricaoTipoExtrato(item.tipo)}
            />,
            <Column<ImportacaoExtrato>
              header="Data Importado"
              value={(item) => formatDateTimeToBrString(item.dataCriacao)}
            />,
            <Column<ImportacaoExtrato>
              header="Arquivo"
              value={(item) => item.nomeArquivo ?? ''}
            />,
          ]}
        />
      </Stack>
    </Container>
  );
};

export default ArquivoExtratoListPage;
