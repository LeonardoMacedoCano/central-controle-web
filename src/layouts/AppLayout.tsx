import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Panel, RailTabsNav, type RailTabsNavItem } from 'lcano-react-ui';
import { AppRoot, PageContent } from './styles';
import { Header } from './Header';
import { SectionNav } from './SectionNav';
import { PRIMARY_NAV_LABEL, fluxoCaixaSection, primaryNav } from './navConfig';
import { RouterBreadcrumb } from '../routes/RouterBreadcrumb';
import { useAuth } from '../contexts';
import { NotificacaoService } from '../service';

const POLLING_INTERVAL_MS = 10000;
const SECTION_ID = 'fluxocaixa';

export const AppLayout: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [sectionOpen, setSectionOpen] = useState(false);

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

  const inFluxoCaixa =
    pathname === '/fluxocaixa' || pathname.startsWith('/fluxocaixa/');

  useEffect(() => {
    if (!inFluxoCaixa) setSectionOpen(false);
  }, [inFluxoCaixa]);

  const closeSection = useCallback(() => setSectionOpen(false), []);

  const navItems: RailTabsNavItem[] = useMemo(
    () =>
      primaryNav.map((item) => ({
        id: item.id,
        icon: item.icon,
        label: item.label,
        active: item.isActive(pathname),
        onClick: () => {
          if (item.id !== SECTION_ID) {
            navigate(item.to);
            setSectionOpen(false);
            return;
          }
          // item com submenu: se já está na seção, só abre/fecha o submenu
          // sem trocar de tela; se está fora, entra na seção e abre.
          if (inFluxoCaixa) {
            setSectionOpen((open) => !open);
          } else {
            navigate(item.to);
            setSectionOpen(true);
          }
        },
      })),
    [pathname, navigate, inFluxoCaixa]
  );

  return (
    <AppRoot>
      <RailTabsNav items={navItems} ariaLabel={PRIMARY_NAV_LABEL} />

      <Header unreadCount={unreadCount} />

      {inFluxoCaixa && sectionOpen && (
        <SectionNav
          title="Fluxo Caixa"
          items={fluxoCaixaSection}
          onClose={closeSection}
        />
      )}

      <PageContent>
        <Panel maxWidth="1000px" title={<RouterBreadcrumb />}>
          <Outlet />
        </Panel>
      </PageContent>
    </AppRoot>
  );
};

export default AppLayout;
