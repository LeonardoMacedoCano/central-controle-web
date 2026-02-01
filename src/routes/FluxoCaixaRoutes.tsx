import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategora/MovimentacaoCategoriaListPage';
import ParametroPage from '../pages/fluxocaixa/configuracao/parametro/ParametroPage';
import RegraExtratoContaCorrenteListPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteListPage';
import RegraExtratoContaCorrenteFormPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteFormPage';
import RegraExtratoContaCorrentePage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrentePage';
import FluxoCaixaResumo from '../pages/fluxocaixa/FluxoCaixaResumo';
import SimpleModuleLayout from '../layouts/SimpleModuleLayout';

const FluxoCaixaRoutes: RouteObject[] = [
    {
    path: "fluxocaixa",
    element: <SimpleModuleLayout />,
    handle: { breadcrumb: "Fluxo Caixa" },
    children: [
      { 
        index: true,
        element: <FluxoCaixaResumo /> 
      },
      {
        path: "config",
        handle: { breadcrumb: "Configuração" },
        children: [
          {
            index: true,
            element: <FluxoCaixaConfigPage />,
          },
          {
            path: "parametro",
            element: <ParametroPage />,
            handle: { breadcrumb: "Parâmetros" },
          },
          {
            path: "categoria",
            element: <MovimentacaoCategoriaListPage />,
            handle: { breadcrumb: "Categorias" },
          },
          {
            path: "regra-extrato-conta-corrente",
            handle: { breadcrumb: "Regras Extrato" },
            children: [
              {
                index: true,
                element: <RegraExtratoContaCorrenteListPage />,
              },
              {
                path: "novo",
                element: <RegraExtratoContaCorrenteFormPage />,
                handle: { breadcrumb: "Novo" },
              },
              {
                path: "editar/:id",
                element: <RegraExtratoContaCorrenteFormPage />,
                handle: { breadcrumb: "Editar" },
              },
              {
                path: "resumo/:id",
                element: <RegraExtratoContaCorrentePage />,
                handle: { breadcrumb: "Resumo" },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default FluxoCaixaRoutes;