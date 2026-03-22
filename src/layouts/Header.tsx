import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { IMG_PERFIL_PADRAO } from '../utils';
import {
  AppHeader,
  MenuIconContainer,
  TitleHeaderContainer,
  UserMenuContainer,
  MenuIcon,
  MessageIconWrapper,
  UnreadBadge,
  UserAvatar,
  UserMenuDropdown,
  UserMenuItem,
  TitleHeader,
} from './styles';

interface HeaderProps {
  toggleMenu: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, unreadCount }) => {
  const [imagemPerfil, setImagemPerfil] = useState<string>(IMG_PERFIL_PADRAO);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (auth.usuario?.icone) {
      setImagemPerfil(`data:image/png;base64,${auth.usuario.icone}`);
    } else {
      setImagemPerfil(IMG_PERFIL_PADRAO);
    }
  }, [auth.usuario?.icone]);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const handleLogout = () => auth.signout();
  const handleProfileClick = () => navigate('/usuario');
  const handleNotificationClick = () => navigate('/notificacoes');

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
          <FaBell />
          <UnreadBadge $hasUnread={unreadCount > 0}>
            {unreadCount > 0 ? unreadCount : ''}
          </UnreadBadge>
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
