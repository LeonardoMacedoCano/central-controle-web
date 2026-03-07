import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { LancamentoService } from '../../../service';
import { Lancamento } from '../../../types/fluxocaixa/Lancamento';
import {
  Ativo,
  Despesa,
  Renda,
  getDescricaoDespesaFormaPagamento,
  getDescricaoTipoMovimento,
  getDescricaoTipoOperacaoExtratoMovimentacaoB3,
} from '../../../types';
import {
  Container,
  FieldValue,
  formatDateToYMDString,
  formatIsoDateToBrDate,
  Loading,
  Stack,
} from 'lcano-react-ui';
import { useFetchById } from '../../../utils';

const LancamentoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();

  const { data: lancamento, isLoading } = useFetchById<Lancamento>(
    usuario?.token,
    id,
    LancamentoService.getLancamento,
    'Erro ao carregar o lançamento.'
  );

  const renderItemSection = () => {
    if (!lancamento?.tipo || !lancamento.itemDTO) return null;

    switch (lancamento.tipo) {
      case 'DESPESA': {
        const despesa = lancamento.itemDTO as Despesa;
        return (
          <Stack direction="column" divider="top">
            <Stack direction="row" divider="x">
              <FieldValue
                description="Data Vencimento"
                type="STRING"
                value={formatIsoDateToBrDate(formatDateToYMDString(despesa.dataVencimento))}
                editable={false}
              />
              <FieldValue
                description="Forma Pagamento"
                type="STRING"
                value={getDescricaoDespesaFormaPagamento(despesa.formaPagamento)}
                editable={false}
              />
            </Stack>
            <Stack direction="row" divider="x">
              <FieldValue
                description="Categoria"
                type="STRING"
                value={despesa.categoria?.descricao ?? ''}
                editable={false}
              />
              <FieldValue
                description="Valor"
                type="NUMBER"
                value={despesa.valor}
                editable={false}
              />
            </Stack>
          </Stack>
        );
      }

      case 'RENDA': {
        const renda = lancamento.itemDTO as Renda;
        return (
          <Stack direction="column" divider="top">
            <Stack direction="row" divider="x">
              <FieldValue
                description="Data Recebimento"
                type="STRING"
                value={formatIsoDateToBrDate(formatDateToYMDString(renda.dataRecebimento))}
                editable={false}
              />
              <FieldValue
                description="Categoria"
                type="STRING"
                value={renda.categoria?.descricao ?? ''}
                editable={false}
              />
            </Stack>
            <Stack direction="row" divider="x">
              <FieldValue
                description="Valor"
                type="NUMBER"
                value={renda.valor}
                editable={false}
              />
            </Stack>
          </Stack>
        );
      }

      case 'ATIVO': {
        const ativo = lancamento.itemDTO as Ativo;
        return (
          <Stack direction="column" divider="top">
            <Stack direction="row" divider="x">
              <FieldValue
                description="Data Movimentação"
                type="STRING"
                value={formatIsoDateToBrDate(formatDateToYMDString(ativo.dataMovimento))}
                editable={false}
              />
              <FieldValue
                description="Operação"
                type="STRING"
                value={getDescricaoTipoOperacaoExtratoMovimentacaoB3(ativo.operacao)}
                editable={false}
              />
            </Stack>
            <Stack direction="row" divider="x">
              <FieldValue
                description="Categoria"
                type="STRING"
                value={ativo.categoria?.descricao ?? ''}
                editable={false}
              />
              <FieldValue
                description="Valor"
                type="NUMBER"
                value={ativo.valor}
                editable={false}
              />
            </Stack>
          </Stack>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      {lancamento && (
        <Stack direction="column" divider="top">
          <FieldValue
            description="Descrição"
            type="STRING"
            value={lancamento.descricao}
            editable={false}
          />
          <Stack direction="row" divider="x">
            <FieldValue
              description="Data Lançamento"
              type="STRING"
              value={formatIsoDateToBrDate(formatDateToYMDString(lancamento.dataLancamento))}
              editable={false}
            />
            <FieldValue
              description="Tipo"
              type="STRING"
              value={getDescricaoTipoMovimento(lancamento.tipo)}
              editable={false}
            />
          </Stack>

          {renderItemSection()}
        </Stack>
      )}
    </Container>
  );
};

export default LancamentoPage;
