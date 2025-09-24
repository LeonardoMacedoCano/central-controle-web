import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home/Home';
import UsuarioFormPage from '../pages/usuario/UsuarioFormPage';
import FluxoCaixaRoutes from './FluxoCaixaRoutes';

const defaultRoutes = [
  { path: "/", element: <Home /> },
  { path: "/usuario", element: <UsuarioFormPage /> },
];

const combinedRoutes = [
  ...defaultRoutes,
  ...FluxoCaixaRoutes,
];

const AppRoutes: React.FC = () => (
  <Routes>
    {combinedRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AppRoutes;
