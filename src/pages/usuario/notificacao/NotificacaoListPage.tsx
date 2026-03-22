import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import {
  ActionButton,
  Button,
  Column,
  Container,
  FieldValue,
  formatDateTimeToBrString,
  Loading,
  Stack,
  Table,
  useMessage,
} from 'lcano-react-ui';
import { useAuth } from '../../../contexts';
import { NotificacaoService } from '../../../service';
import { NotificacaoDTO } from '../../../types';
import { usePagedData } from '../../../utils';

const filtroOptions = [
  { key: 'false', value: 'Todas' },
  { key: 'true',  value: 'Não lidas' },
];

const cellBold = (item: NotificacaoDTO, text: string) => (
  <span style={{ fontWeight: item.lida ? 400 : 800 }}>{text}</span>
);

const NotificacaoListPage: React.FC = () => {
  const { usuario } = useAuth();
  const message = useMessage();
  const navigate = useNavigate();
  const [apenasNaoLidas, setApenasNaoLidas] = useState(false);

  const fetcher = useCallback(
    (token: string, page: number, size: number) =>
      NotificacaoService.getNotificacoes(token, page, size, apenasNaoLidas),
    [apenasNaoLidas]
  );

  const { data, isLoading, load, loadPage } = usePagedData<NotificacaoDTO>(
    usuario?.token,
    fetcher,
    'Erro ao carregar as notificações.'
  );

  const notificacoes = data?.content ?? [];

  const handleFiltroChange = (value: unknown) => {
    setApenasNaoLidas(String(value) === 'true');
  };

  const handleMarkAsRead = async (id: number, isUnread: boolean) => {
    if (!usuario?.token) return;
    await NotificacaoService.marcarComoLida(usuario.token, id, isUnread, message);
    load();
  };

  const handleMarkAllAsRead = async () => {
    if (!usuario?.token) return;
    await NotificacaoService.marcarTodasComoLidas(usuario.token, message);
    load();
  };

  const temNaoLidas = notificacoes.some(n => !n.lida);

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Stack direction="column" divider="top">
        <FieldValue
          description="Filtro"
          type="SELECT"
          value={apenasNaoLidas ? filtroOptions[1] : filtroOptions[0]}
          editable
          options={filtroOptions}
          onUpdate={handleFiltroChange}
        />

        <Table<NotificacaoDTO>
          values={notificacoes}
          messageEmpty="Nenhuma notificação encontrada."
          keyExtractor={(item) => item.id.toString()}
          onView={(item) => navigate(`/notificacoes/resumo/${item.id}`)}
          customActions={(item) => (
            <Button
              variant="info"
              icon={item.lida ? <FaEnvelope /> : <FaEnvelopeOpen />}
              onClick={() => handleMarkAsRead(item.id, !item.lida)}
              hint={item.lida ? 'Marcar como não lida' : 'Marcar como lida'}
              style={{ borderRadius: '50%', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '25px', width: '25px' }}
            />
          )}
          loadPage={loadPage}
          columns={[
            <Column<NotificacaoDTO>
              header="Data"
              width="150px"
              align="center"
              value={(item) => cellBold(item, formatDateTimeToBrString(item.dataCriacao))}
            />,
            <Column<NotificacaoDTO>
              header="Título"
              width="180px"
              value={(item) => cellBold(item, item.titulo)}
            />,
            <Column<NotificacaoDTO>
              header="Mensagem"
              value={(item) => cellBold(item, item.mensagem)}
            />
          ]}
        />
      </Stack>

      <ActionButton
        icon={<FaCheck />}
        hint="Marcar todas como lidas"
        onClick={handleMarkAllAsRead}
        disabled={!temNaoLidas}
      />
    </Container>
  );
};

export default NotificacaoListPage;
