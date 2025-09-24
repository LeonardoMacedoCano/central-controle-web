import React, { useState, useRef, useEffect } from 'react';
import { MainContent, PageContent } from './styles';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div ref={sidebarRef}>
        <Sidebar
          isOpen={isMenuOpen}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          handleLinkClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
        />
      </div>
      <MainContent isMenuOpen={isMenuOpen}>
        <Header toggleMenu={toggleMenu} unreadMessages={0} menuButtonRef={menuButtonRef} />
        <PageContent>{children}</PageContent>
      </MainContent>
    </div>
  );
};

export default AppLayout;
