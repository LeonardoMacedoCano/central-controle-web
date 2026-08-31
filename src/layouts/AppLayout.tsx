import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Panel, RailTabsNav, type RailTabsNavItem } from 'lcano-react-ui';
import { AppRoot, PageContent } from './styles';
import { primaryNav } from './navConfig';
import { AvatarIcon, NotificationIcon } from './menuIcons';
import { RouterBreadcrumb } from '../routes/RouterBreadcrumb';
import { useAuth } from '../contexts';
import { NotificacaoService } from '../service';
import { IMG_PERFIL_PADRAO } from '../utils';

const POLLING_INTERVAL_MS = 10000;

export const AppLayout: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const { usuario, signout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario?.token) return;
    const token = usuario.token;
    const fetchCount = async () => {
      const result = await NotificacaoService.getNaoLidasCount(token);
      if (result) setUnreadCount(result.total);
    };
    fetchCount();
    const interval = setInterval(fetchCount, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [usuario?.token]);

  const avatarSrc = usuario?.icone
    ? `data:image/png;base64,${usuario.icone}`
    : IMG_PERFIL_PADRAO;

  const navItems: RailTabsNavItem[] = useMemo(() => {
    const routed = primaryNav.map((item): RailTabsNavItem => {
      const active = item.isActive(pathname);
      const icon =
        item.id === 'notificacoes' ? (
          <NotificationIcon lit={unreadCount > 0} />
        ) : (
          item.icon
        );

      if (!item.submenu) {
        return {
          id: item.id,
          icon,
          label: item.label,
          active,
          onClick: () => navigate(item.to),
        };
      }

      return {
        id: item.id,
        icon,
        label: item.label,
        active,
        onClick: () => {
          if (!active) navigate(item.to);
        },
        submenu: item.submenu.map((sub) => ({
          id: sub.id,
          label: sub.label,
          active: sub.isActive(pathname),
          onClick: () => navigate(sub.to),
        })),
      };
    });

    const userItem: RailTabsNavItem = {
      id: 'usuario',
      icon: <AvatarIcon src={avatarSrc} />,
      label: 'Usuário',
      active: pathname === '/usuario',
      submenu: [
        {
          id: 'perfil',
          label: 'Ver Perfil',
          active: pathname === '/usuario',
          onClick: () => navigate('/usuario'),
        },
        {
          id: 'sair',
          label: 'Sair',
          onClick: signout,
        },
      ],
    };

    return [...routed, userItem];
  }, [pathname, navigate, unreadCount, avatarSrc, signout]);

  return (
    <AppRoot>
      <RailTabsNav items={navItems} ariaLabel="Navegação principal" />

      <PageContent>
        <Panel maxWidth="1000px" title={<RouterBreadcrumb />}>
          <Outlet />
        </Panel>
      </PageContent>
    </AppRoot>
  );
};

export default AppLayout;
