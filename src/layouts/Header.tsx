import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { IMG_PERFIL_PADRAO } from '../utils';
import {
  TopBar,
  MessageIconWrapper,
  UnreadBadge,
  UserAvatar,
  UserMenuDropdown,
  UserMenuItem,
} from './styles';

interface HeaderProps {
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({ unreadCount }) => {
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

  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);
  const handleLogout = () => auth.signout();
  const handleProfileClick = () => navigate('/usuario');
  const handleNotificationClick = () => navigate('/notificacoes');

  return (
    <TopBar>
      <MessageIconWrapper onClick={handleNotificationClick}>
        <FaBell />
        <UnreadBadge $hasUnread={unreadCount > 0}>
          {unreadCount > 0 ? unreadCount : ''}
        </UnreadBadge>
      </MessageIconWrapper>

      <UserAvatar ref={userMenuRef} onClick={toggleUserMenu}>
        <img src={imagemPerfil} alt="Avatar" />
        {isUserMenuOpen && (
          <UserMenuDropdown>
            <UserMenuItem onClick={handleProfileClick}>Ver Perfil</UserMenuItem>
            <UserMenuItem onClick={handleLogout}>Sair</UserMenuItem>
          </UserMenuDropdown>
        )}
      </UserAvatar>
    </TopBar>
  );
};
