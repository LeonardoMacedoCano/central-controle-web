import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { 
  AuthProvider,
  ContextMessageProvider,
  RequireAuth,
  ThemeControlProvider
} from './contexts';
import AppLayout from './menus/AppLayout';
import AppRoutes from './routes';
import { DynamicFavicon } from './components';

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
            <DynamicFavicon />
          </BrowserRouter>
        </AuthProvider>
      </ContextMessageProvider>
    </ThemeControlProvider>
  );
}

export default App;