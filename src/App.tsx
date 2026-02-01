import React from 'react';
import { RouterProvider } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { 
  AuthProvider,
  ThemeControlProvider
} from './contexts';
import { defaultThemeFavicon } from './utils';
import { ContextMessageProvider, ThemeFavicon } from 'lcano-react-ui';
import { router } from './routes';

const App: React.FC = () => {
  return (
    <ThemeControlProvider>
      <ContextMessageProvider>
        <AuthProvider>
          <GlobalStyles />
          <RouterProvider router={router} />
          <ThemeFavicon renderSvg={defaultThemeFavicon} />
        </AuthProvider>
      </ContextMessageProvider>
    </ThemeControlProvider>
  );
}

export default App;