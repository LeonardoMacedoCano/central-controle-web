import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { NotificacaoService } from '../../service';
import { NotificacaoDTO, TipoNotificacaoEnum } from '../../types';
import {
  Container,
  FieldValue,
  formatDateToBrString,
  Loading,
  Stack,
} from 'lcano-react-ui';
import { useFetchById } from '../../utils';

const getDescricaoTipoNotificacao = (tipo: TipoNotificacaoEnum): string => {
  switch (tipo) {
    case 'SUCESSO': return 'Sucesso';
    case 'ERRO':    return 'Erro';
    case 'INFO':    return 'Info';
  }
};

const NotificacaoViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();

  const { data: notificacao, isLoading } = useFetchById<NotificacaoDTO>(
    usuario?.token,
    id,
    NotificacaoService.getNotificacao,
    'Erro ao carregar a notificação.'
  );

  return (
    <Container>
      <Loading isLoading={isLoading} />

      {notificacao && (
        <Stack direction="column" divider="top">
          <Stack direction="row" divider="x">
            <FieldValue
              description="Data"
              type="STRING"
              value={formatDateToBrString(notificacao.dataCriacao)}
              editable={false}
            />
            <FieldValue
              description="Tipo"
              type="STRING"
              value={getDescricaoTipoNotificacao(notificacao.tipo)}
              editable={false}
            />
            <FieldValue
              description="Lida"
              type="STRING"
              value={notificacao.lida ? 'Sim' : 'Não'}
              editable={false}
            />
          </Stack>
          <FieldValue
            description="Título"
            type="STRING"
            value={notificacao.titulo}
            editable={false}
          />
          <FieldValue
            description="Mensagem"
            type="STRING"
            value={notificacao.mensagem}
            editable={false}
          />
        </Stack>
      )}
    </Container>
  );
};

export default NotificacaoViewPage;
