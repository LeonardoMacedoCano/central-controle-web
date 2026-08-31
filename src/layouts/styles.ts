import styled from 'styled-components';
import { getVariantColor } from 'lcano-react-ui';

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

export const PageContent = styled.main`
  flex: 1;
  padding: 20px;

  @media ${LANDSCAPE} {
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

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
