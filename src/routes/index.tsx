import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/home/Home';
import UsuarioFormPage from '../pages/usuario/UsuarioFormPage';

const defaultRoutes = [
  { path: "/", element: <Home /> },
  { path: "/usuario", element: <UsuarioFormPage /> },
];

const AppRoutes: React.FC = () => (
  <Routes>
    {defaultRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AppRoutes;
