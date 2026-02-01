import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const MainContent = styled.div<{ $isMenuOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s ease-in-out;
`;

export const PageContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const AppHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  padding: 0 20px;
  flex-shrink: 0;
`;

export const MenuIconContainer = styled.div`flex: 1; display: flex; justify-content: flex-start;`;
export const TitleHeaderContainer = styled.div`flex: 2; display: flex; justify-content: center;`;
export const UserMenuContainer = styled.div`flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 15px;`;
export const MenuIcon = styled.div`height: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer; svg{ font-size: 25px; }`;
export const MessageIconWrapper = styled.div`position: relative; font-size: 20px; cursor: pointer; top: 5px;`;
export const UnreadBadge = styled.div`position: absolute; top: -5px; right: -5px; background-color: ${({ theme }) => theme.colors.success}; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; display: flex; align-items: center; justify-content: center;`;
export const UserAvatar = styled.div`width: 36px; height: 36px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid ${({ theme }) => theme.colors.tertiary}; img{ width: 100%; height: 100%; object-fit: cover; }`;
export const UserMenuDropdown = styled.div`position: absolute; top: 40px; right: 0; background-color: ${({ theme }) => theme.colors.secondary}; box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary}; border-radius: 5px; min-width: 150px; padding: 10px 0; z-index: 100;`;
export const UserMenuItem = styled.div`padding: 10px 20px; cursor: pointer; &:hover{ background-color: ${({ theme }) => theme.colors.tertiary}; }`;
export const TitleHeader = styled.div`font-size: 18px; font-weight: bold; color: ${({ theme }) => theme.colors.white};`;

export const AppSidebarContainer = styled.div<{ $isActive: boolean }>`
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 60px;
  height: 100%;
  width: ${({ $isActive }) => ($isActive ? '250px' : '0')};
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
`;

export const AppSidebar = styled.div`height: 100vh; overflow-y: auto; border-top: 1px solid ${({ theme }) => theme.colors.tertiary};`;
export const LinkSidebar = styled(RouterLink)`text-decoration: none; color: inherit;`;
export const MenuItem = styled.div`display: flex; align-items: center; padding: 15px; height: 60px; cursor: pointer; transition: background-color 0.3s; border-bottom: 1px solid ${({ theme }) => theme.colors.tertiary}; &:hover{ background-color: ${({ theme }) => theme.colors.tertiary}; } > svg{ font-size: 20px; margin-right: 15px; } > span{ white-space: nowrap; }`;
export const SubmenuContainer = styled.div`text-decoration: none; color: inherit;`;
export const SubmenuContent = styled.div`background-color: ${({ theme }) => theme.colors.secondary};`;
export const SubMenuItem = styled(MenuItem)`height: 50px; padding-left: 15px; background-color: ${({ theme }) => theme.colors.primary};`;
