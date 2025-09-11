import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FaBars, FaDollarSign, FaHome, FaEnvelope } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { IMG_PERFIL_PADRAO } from '../utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setActiveSubmenu(null);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div ref={sidebarRef}>
        <Sidebar 
          isOpen={isMenuOpen} 
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          handleLinkClick={handleLinkClick}
        />
      </div>
      <MainContent isMenuOpen={isMenuOpen}>
        <Header 
          toggleMenu={toggleMenu} 
          unreadMessages={0}
        />
        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </div>
  );
};

interface HeaderProps {
  toggleMenu: () => void;
  unreadMessages: number;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, unreadMessages }) => {
  const [imagemPerfil, setImagemPerfil] = useState<string>(IMG_PERFIL_PADRAO);
  const blobUrlRef = useRef<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cleanupBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleLogout = () => {
    auth.signout();
    setIsUserMenuOpen(false);
  };
  
  const handleProfileClick = () => {
    navigate('/usuario');
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const fetchArquivo = async () => {
      if (!auth.usuario?.token) return;
      
      try {
        if (auth.usuario.icone) {
          setImagemPerfil(`data:image/png;base64,${auth.usuario.icone}`);
        } else {
          setImagemPerfil(IMG_PERFIL_PADRAO);
        }
      } catch (error) {
        setImagemPerfil(IMG_PERFIL_PADRAO);
      }
    };
  
    fetchArquivo();
    return () => {
      cleanupBlobUrl();
    };
  }, [auth.usuario?.icone]);

  const handleNotificationClick = () => {
    navigate('/notificacoes');
  };

  return (
    <AppHeader>
      <MenuIconContainer>
        <MenuIcon onClick={toggleMenu}>
          <FaBars />
        </MenuIcon>
      </MenuIconContainer>

      <TitleHeaderContainer>
        <TitleHeader>Central de Controle</TitleHeader>
      </TitleHeaderContainer>

      <UserMenuContainer>
        <MessageIconWrapper onClick={handleNotificationClick}>
          <FaEnvelope />
          {unreadMessages > 0 && <UnreadBadge>{unreadMessages}</UnreadBadge>}
        </MessageIconWrapper>
        <UserAvatar onClick={toggleUserMenu}>
          <img src={imagemPerfil} alt="Avatar" />
          {isUserMenuOpen && (
            <UserMenuDropdown ref={userMenuRef}>
              <UserMenuItem onClick={handleProfileClick}>Ver Perfil</UserMenuItem>
              <UserMenuItem onClick={handleLogout}>Sair</UserMenuItem>
            </UserMenuDropdown>
          )}
        </UserAvatar>
      </UserMenuContainer>
    </AppHeader>
  );
};

interface SidebarProps {
  isOpen: boolean;
  activeSubmenu: string | null;
  setActiveSubmenu: React.Dispatch<React.SetStateAction<string | null>>;
  handleLinkClick: () => void;
}

interface SubmenuItem {
  to: string;
  Text: string;
}

interface SidebarItem {
  to?: string;
  Icon: React.ComponentType;
  Text: string;
  onClick?: () => void;
  submenu?: SubmenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSubmenu, setActiveSubmenu, handleLinkClick }) => {
  const handleSubmenuToggle = (submenu: string) => {
    setActiveSubmenu(prev => (prev === submenu ? null : submenu));
  };

  const sidebarItems: SidebarItem[] = [
    {
      to: "/",
      Icon: FaHome,
      Text: "Home"
    },
    {
      Icon: FaDollarSign,
      Text: "Fluxo Caixa",
      submenu: [
        {
          to: "/resumo-fluxo-caixa",
          Text: "Resumo"
        },
        {
          to: "/lancamentos",
          Text: "Lançamentos"
        },
        {
          to: "/config-fluxo-caixa",
          Text: "Configuração"
        },
      ],
    },
  ];

  return (
    <AppSidebarContainer isActive={isOpen}>
      <AppSidebar>
        {sidebarItems.map((item, index) => (
          item.submenu ? (
            <SubmenuContainer key={index}>
              <MenuItem onClick={() => handleSubmenuToggle(item.Text)}>
                <item.Icon />
                {isOpen && <span>{item.Text}</span>}
              </MenuItem>
              {isOpen && activeSubmenu === item.Text && (
                <SubmenuContent>
                  {item.submenu.map((subItem, subIndex) => (
                    subItem.to ? (
                      <LinkSidebar key={`${index}-${subIndex}`} to={subItem.to} onClick={handleLinkClick}>
                        <SubMenuItem>{subItem.Text}</SubMenuItem>
                      </LinkSidebar>
                    ) : null
                  ))}
                </SubmenuContent>
              )}
            </SubmenuContainer>
          ) : item.to ? (
            <LinkSidebar key={index} to={item.to} onClick={item.onClick}>
              <MenuItem>
                <item.Icon />
                {isOpen && <span>{item.Text}</span>}
              </MenuItem>
            </LinkSidebar>
          ) : null
        ))}
      </AppSidebar>
    </AppSidebarContainer>
  );
};

export default AppLayout;

const MainContent = styled.div<{ isMenuOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s ease-in-out;
`;

const PageContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const AppSidebarContainer = styled.div<{ isActive: boolean }>`
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 60px;
  height: 100%;
  width: ${({ isActive }) => isActive ? '250px' : '0'};
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
`;

const AppHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  padding: 0 20px;
  flex-shrink: 0;
`;

const MenuIconContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const TitleHeaderContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const UserMenuContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
`;

const MenuIcon = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    font-size: 25px;
  }
`;

const MessageIconWrapper = styled.div`
  position: relative;
  font-size: 20px;
  cursor: pointer;
  top: 5px;
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AppSidebar = styled.div`
  height: 100vh;
  overflow-y: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.tertiary};
`;

const LinkSidebar = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  height: 60px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid ${({ theme }) => theme.colors.tertiary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  > svg {
    font-size: 20px;
    margin-right: 15px;
  }

  > span {
    white-space: nowrap;
  }
`;

const SubmenuContainer = styled.div`
  text-decoration: none;
  color: inherit;
`;

const SubmenuContent = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const SubMenuItem = styled(MenuItem)`
  height: 50px;
  padding-left: 15px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const TitleHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  border-radius: 5px;
  min-width: 150px;
  padding: 10px 0;
  z-index: 100;
`;

const UserMenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;