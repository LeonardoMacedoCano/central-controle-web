import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategora/MovimentacaoCategoriaListPage';
import ParametroPage from '../pages/fluxocaixa/configuracao/parametro/ParametroPage';
import RegraExtratoContaCorrenteListPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteListPage';
import RegraExtratoContaCorrenteFormPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteFormPage';

const FluxoCaixaRoutes: RouteObject[] = [
  { path: "fluxocaixa/config", element: <FluxoCaixaConfigPage /> },
  { path: "fluxocaixa/categoria", element: <MovimentacaoCategoriaListPage /> },
  { path: "fluxocaixa/parametro", element: <ParametroPage /> },
  { path: "fluxocaixa/regra-extrato-conta-corrente", element: <RegraExtratoContaCorrenteListPage /> },
  { path: "fluxocaixa/regra-extrato-conta-corrente/novo", element: <RegraExtratoContaCorrenteFormPage /> },
];

export default FluxoCaixaRoutes;