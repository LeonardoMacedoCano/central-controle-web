import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategora/MovimentacaoCategoriaListPage';

const FluxoCaixaRoutes: RouteObject[] = [
  { path: "fluxocaixa/config", element: <FluxoCaixaConfigPage /> },
  { path: "fluxocaixa/categoria", element: <MovimentacaoCategoriaListPage /> },
];

export default FluxoCaixaRoutes;