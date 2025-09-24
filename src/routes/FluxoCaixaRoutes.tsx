import { RouteObject } from 'react-router-dom';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategora/MovimentacaoCategoriaListPage';

const FluxoCaixaRoutes: RouteObject[] = [
  { path: "/config-fluxo-caixa", element: <MovimentacaoCategoriaListPage /> },
];

export default FluxoCaixaRoutes;