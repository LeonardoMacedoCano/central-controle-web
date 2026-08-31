import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Panel, RailTabsNav, type RailTabsNavItem } from 'lcano-react-ui';
import { AppRoot, PageContent } from './styles';
import { Header } from './Header';
import { primaryNav } from './navConfig';
import { RouterBreadcrumb } from '../routes/RouterBreadcrumb';
import { useAuth } from '../contexts';
import { NotificacaoService } from '../service';

const POLLING_INTERVAL_MS = 10000;

export const AppLayout: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const { usuario } = useAuth();
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

  const navItems: RailTabsNavItem[] = useMemo(
    () =>
      primaryNav.map((item): RailTabsNavItem => {
        const active = item.isActive(pathname);

        if (!item.submenu) {
          return {
            id: item.id,
            icon: item.icon,
            label: item.label,
            active,
            onClick: () => navigate(item.to),
          };
        }

        return {
          id: item.id,
          icon: item.icon,
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
      }),
    [pathname, navigate]
  );

  return (
    <AppRoot>
      <RailTabsNav items={navItems} ariaLabel="Navegação principal" />

      <Header unreadCount={unreadCount} />

      <PageContent>
        <Panel maxWidth="1000px" title={<RouterBreadcrumb />}>
          <Outlet />
        </Panel>
      </PageContent>
    </AppRoot>
  );
};

export default AppLayout;
