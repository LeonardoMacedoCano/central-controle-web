import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { 
  AuthProvider,
  RequireAuth,
  ThemeControlProvider
} from './contexts';
import AppLayout from './menus/AppLayout';
import AppRoutes from './routes';
import { defaultThemeFavicon } from './utils';
import { ContextMessageProvider, ThemeFavicon } from 'lcano-react-ui';

const App: React.FC = () => {
  return (
    <ThemeControlProvider>
      <ContextMessageProvider>
        <AuthProvider>
          <BrowserRouter>
            <GlobalStyles />
            <RequireAuth>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </RequireAuth>
            <ThemeFavicon renderSvg={defaultThemeFavicon} />
          </BrowserRouter>
        </AuthProvider>
      </ContextMessageProvider>
    </ThemeControlProvider>
  );
}

export default App;