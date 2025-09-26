import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategora/MovimentacaoCategoriaListPage';
import ParametroPage from '../pages/fluxocaixa/configuracao/parametro/ParametroPage';

const FluxoCaixaRoutes: RouteObject[] = [
  { path: "fluxocaixa/config", element: <FluxoCaixaConfigPage /> },
  { path: "fluxocaixa/categoria", element: <MovimentacaoCategoriaListPage /> },
  { path: "fluxocaixa/parametro", element: <ParametroPage /> },
];

export default FluxoCaixaRoutes;