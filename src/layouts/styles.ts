import styled from 'styled-components';
import { getVariantColor } from 'lcano-react-ui';

/* Alinhado com o RailTabsNav da lib: rail lateral no desktop (>= 700px),
   barra de abas embaixo no mobile, rail denso no celular deitado. */
const RAIL_WIDTH = 76;
const TAB_BAR_HEIGHT = 64;
const SECTION_MENU_WIDTH = 208;
const DESKTOP = '(min-width: 700px)';
const MOBILE = '(max-width: 699px)';
const LANDSCAPE = '(max-height: 500px)';

export const AppRoot = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  @media ${DESKTOP} {
    padding-left: ${RAIL_WIDTH}px;
  }

  @media ${MOBILE} {
    padding-bottom: ${TAB_BAR_HEIGHT}px;
  }
`;

export const PageContent = styled.main`
  flex: 1;
  padding: 20px;

  @media ${LANDSCAPE} {
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

/* Sino + avatar: cluster flutuante no canto, sem barra. */
export const TopControls = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 25;
  display: flex;
  align-items: center;
  gap: 16px;

  @media ${LANDSCAPE} {
    top: 8px;
    right: 8px;
  }
`;

export const MessageIconWrapper = styled.div`
  position: relative;
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
`;

export const UnreadBadge = styled.div<{ $hasUnread: boolean }>`
  position: absolute;
  top: -5px;
  right: -2px;
  background-color: ${({ theme, $hasUnread }) =>
    $hasUnread ? theme.colors.quaternary : getVariantColor(theme, 'primary')};
  color: ${({ theme, $hasUnread }) =>
    $hasUnread ? theme.colors.black : theme.colors.white};
  border-radius: 50%;
  font-size: 10px;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserAvatar = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.tertiary};

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const UserMenuDropdown = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 6px;
  min-width: 150px;
  padding: 6px 0;
  z-index: 100;
`;

export const UserMenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

/* Submenu de seção: caixinha que renderiza SEMPRE por cima (overlay), nunca
   ocupa espaço nem empurra a página. Fica alinhada onde está o menu:
   ao lado do rail no desktop, acima das abas no celular em pé. */
export const SectionMenuBox = styled.nav`
  position: fixed;
  z-index: 19;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);

  @media ${MOBILE} {
    left: 12px;
    bottom: ${TAB_BAR_HEIGHT + 12}px;
    min-width: 180px;
    max-width: calc(100% - 24px);
  }

  @media ${DESKTOP} {
    top: 12px;
    left: ${RAIL_WIDTH + 12}px;
    width: ${SECTION_MENU_WIDTH}px;
  }
`;

export const SectionMenuTitle = styled.span`
  padding: 6px 12px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const SectionMenuItem = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.quaternary : 'transparent'};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.quaternary : theme.colors.tertiary};
  }
`;
