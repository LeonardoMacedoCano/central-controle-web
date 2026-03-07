import React, { useState, useRef, useEffect } from 'react';
import { AppContainer, MainContent, PageContent } from './styles';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { RouterBreadcrumb } from '../routes/RouterBreadcrumb';
import { Panel } from 'lcano-react-ui';

export const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

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
          <Header toggleMenu={toggleMenu} unreadMessages={0} />
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
