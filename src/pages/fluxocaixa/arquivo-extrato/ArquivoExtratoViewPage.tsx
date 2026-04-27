import React, { useMemo } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { ArquivoExtratoService } from '../../../service';
import { ImportacaoExtrato } from '../../../types/fluxocaixa/ImportacaoExtrato';
import { Lancamento } from '../../../types/fluxocaixa/Lancamento';
import { getDescricaoStatusExtrato, getDescricaoTipoExtrato, getDescricaoTipoMovimento, TipoMovimentoEnum, tipoMovimentoFilters } from '../../../types';
import {
  ActionButton,
  Column,
  Container,
  FieldValue,
  formatDateTimeToBrString,
  formatDateToBrString,
  formatIsoDateToBrDate,
  HighlightBox,
  Loading,
  PAGE_SIZE_DEFAULT,
  Panel,
  SearchFilterRSQL,
  Stack,
  Table,
  VariantColor,
} from 'lcano-react-ui';
import { useFetchById, usePagedData } from '../../../utils';

const getTipoVariant = (tipo: TipoMovimentoEnum): VariantColor => {
  switch (tipo) {
    case 'DESPESA': return 'warning';
    case 'RENDA':   return 'success';
    case 'ATIVO':   return 'info';
  }
};

const ArquivoExtratoViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const { data: arquivo, isLoading: isLoadingArquivo } = useFetchById<ImportacaoExtrato>(
    usuario?.token,
    id,
    ArquivoExtratoService.getById,
    'Erro ao carregar arquivo importado.'
  );

  const fetchLancamentos = useMemo(
    () => (token: string, page: number, size: number, filter?: string) =>
      ArquivoExtratoService.getLancamentos(token, id!, page, size, filter),
    [id]
  );

  const { data: lancamentos, isLoading: isLoadingLancamentos, load, loadPage } = usePagedData(
    usuario?.token,
    fetchLancamentos,
    'Erro ao carregar lançamentos.'
  );

  const handleDownload = async () => {
    if (!usuario?.token || !arquivo?.id) return;
    const blob = await ArquivoExtratoService.downloadArquivo(usuario.token, arquivo.id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = arquivo.nomeArquivo ?? 'arquivo';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Loading isLoading={isLoadingArquivo || isLoadingLancamentos} />

      {arquivo && (
        <>
          <ActionButton
            icon={<FaDownload />}
            onClick={handleDownload}
            hint='Baixar arquivo'
          />

          <Stack direction="column" divider="top" >
    
            <Stack direction="column" divider="top">
              <Stack direction="row" divider="x">
                <FieldValue
                  description="Tipo"
                  type="STRING"
                  value={getDescricaoTipoExtrato(arquivo.tipo)}
                  editable={false}
                />
                <FieldValue
                  description="Status"
                  type="STRING"
                  value={getDescricaoStatusExtrato(arquivo.status)}
                  editable={false}
                />
              </Stack>
              <Stack direction="row" divider="x">
                <FieldValue
                  description="Arquivo"
                  type="STRING"
                  value={arquivo.nomeArquivo ?? ''}
                  editable={false}
                />
                <FieldValue
                  description="Período"
                  type="STRING"
                  value={`${formatIsoDateToBrDate(arquivo.dataInicioPeriodo ?? '')} – ${formatIsoDateToBrDate(arquivo.dataFimPeriodo ?? '')}`}
                  editable={false}
                />
              </Stack>
              <Stack direction="row" divider="x">
                <FieldValue
                  description="Data de importação"
                  type="STRING"
                  value={formatDateTimeToBrString(arquivo.dataCriacao)}
                  editable={false}
                />
                <FieldValue
                  description="Linhas processadas"
                  type="NUMBER"
                  value={arquivo.linhasProcessadas ?? 0}
                  editable={false}
                />
                <FieldValue
                  description="Total de linhas"
                  type="NUMBER"
                  value={arquivo.totalLinhas ?? 0}
                  editable={false}
                />
              </Stack>
            </Stack>

            <Panel
              title='Lançamentos'
              padding='20px 0 0 0'
            >
              <Stack direction="column" divider="top">
                <SearchFilterRSQL
                  fields={[
                    { label: 'Data',      name: 'dataLancamento', type: 'DATE' },
                    { label: 'Tipo',      name: 'tipo',           type: 'SELECT', options: tipoMovimentoFilters },
                    { label: 'Descrição', name: 'descricao',      type: 'STRING' },
                  ]}
                  onSearch={async (rsql) => load(0, PAGE_SIZE_DEFAULT, rsql)}
                />
                <Table<Lancamento>
                  values={lancamentos || []}
                  messageEmpty="Nenhum lançamento encontrado."
                  keyExtractor={(item) => item.id.toString()}
                  onView={(item) => navigate(`/fluxocaixa/lancamento/resumo/${item.id}`)}
                  onEdit={(item) => navigate(`/fluxocaixa/lancamento/editar/${item.id}`)}
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
                    />,
                  ]}
                />
              </Stack>
            </Panel>
          </Stack>
          </>
      )}
    </Container>
  );
};

export default ArquivoExtratoViewPage;
