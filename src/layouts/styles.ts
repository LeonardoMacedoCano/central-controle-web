import styled from 'styled-components';

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
