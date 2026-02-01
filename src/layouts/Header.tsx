import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaBars, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { IMG_PERFIL_PADRAO } from '../utils';
import { AppHeader, MenuIconContainer, TitleHeaderContainer, UserMenuContainer, MenuIcon, MessageIconWrapper, UnreadBadge, UserAvatar, UserMenuDropdown, UserMenuItem, TitleHeader } from './styles';

interface HeaderProps {
  toggleMenu: () => void;
  unreadMessages: number;
  menuButtonRef: React.RefObject<HTMLDivElement>;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, unreadMessages }) => {
  const [imagemPerfil, setImagemPerfil] = useState<string>(IMG_PERFIL_PADRAO);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const handleLogout = () => auth.signout();
  const handleProfileClick = () => navigate('/usuario');
  const handleNotificationClick = () => navigate('/notificacoes');

  useEffect(() => {
    if (auth.usuario?.icone) {
      setImagemPerfil(`data:image/png;base64,${auth.usuario.icone}`);
    } else {
      setImagemPerfil(IMG_PERFIL_PADRAO);
    }
  }, [auth.usuario?.icone]);
  
  return (
    <AppHeader>
      <MenuIconContainer>
        <MenuIcon onClick={toggleMenu}><FaBars /></MenuIcon>
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
