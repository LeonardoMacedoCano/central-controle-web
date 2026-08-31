import styled from 'styled-components';
import { getVariantColor } from 'lcano-react-ui';

/* Alinhado com o RailTabsNav da lib: rail lateral no desktop (>= 700px),
   barra de abas embaixo no mobile, rail denso no celular deitado. */
const RAIL_WIDTH = 76;
const TAB_BAR_HEIGHT = 64;
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

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 15;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.tertiary};

  @media ${LANDSCAPE} {
    height: 44px;
  }
`;

export const PageContent = styled.main`
  flex: 1;
  padding: 20px;

  @media ${LANDSCAPE} {
    padding: 12px;
  }
`;

export const MessageIconWrapper = styled.div`
  position: relative;
  font-size: 20px;
  cursor: pointer;
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
  overflow: visible;
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
  box-shadow: 0 2px 5px ${({ theme }) => theme.colors.tertiary};
  border-radius: 5px;
  min-width: 150px;
  padding: 10px 0;
  z-index: 100;
`;

export const UserMenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;
