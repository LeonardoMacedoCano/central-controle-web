import React, { useState, useRef, useEffect } from 'react';
import { AppContainer, MainContent, PageContent } from './styles';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { RouterBreadcrumb } from '../routes/RouterBreadcrumb';
import { Panel } from 'lcano-react-ui';
import { useAuth } from '../contexts';
import { NotificacaoService } from '../service';

const POLLING_INTERVAL_MS = 10000;

export const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const { usuario } = useAuth();

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

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    if (!isMenuOpen) setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(menuButtonRef.current && menuButtonRef.current.contains(event.target as Node))
      ) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AppContainer>
      <div ref={sidebarRef}>
        <Sidebar
          isOpen={isMenuOpen}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          handleLinkClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
        />
      </div>
      <MainContent $isMenuOpen={isMenuOpen}>
        <div ref={menuButtonRef}>
          <Header
            toggleMenu={toggleMenu}
            unreadCount={unreadCount}
          />
        </div>
        <PageContent>
          <Panel maxWidth="1000px" title={<RouterBreadcrumb />}>
            <Outlet />
          </Panel>
        </PageContent>
      </MainContent>
    </AppContainer>
  );
};

export default AppLayout;
