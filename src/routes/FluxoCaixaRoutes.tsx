import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategoria/MovimentacaoCategoriaListPage';
import ParametroFormPage from '../pages/fluxocaixa/configuracao/parametro/ParametroFormPage';
import RegraExtratoContaCorrenteListPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteListPage';
import RegraExtratoContaCorrenteFormPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteFormPage';
import RegraExtratoContaCorrenteViewPage from '../pages/fluxocaixa/configuracao/regraextratocontacorrente/RegraExtratoContaCorrenteViewPage';
import FluxoCaixaResumo from '../pages/fluxocaixa/FluxoCaixaResumo';
import SimpleModuleLayout from '../layouts/SimpleModuleLayout';
import LancamentoListPage from '../pages/fluxocaixa/lancamento/LancamentoListPage';
import LancamentoFormPage from '../pages/fluxocaixa/lancamento/LancamentoFormPage';
import LancamentoViewPage from '../pages/fluxocaixa/lancamento/LancamentoViewPage';
import ImportacaoExtratoFormPage from '../pages/fluxocaixa/lancamento/ImportacaoExtratoFormPage';

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
            element: <ParametroFormPage />,
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
                element: <RegraExtratoContaCorrenteViewPage />,
                handle: { breadcrumb: "Resumo" },
              },
            ],
          },
        ],
      },

      {
        path: "extrato-fluxo-caixa",
        element: <ImportacaoExtratoFormPage />,
        handle: { breadcrumb: "Importação de Extrato" },
      },

      {
        path: "lancamento",
        handle: { breadcrumb: "Lançamento" },
        children: [
          {
            index: true,
            element: <LancamentoListPage />,
          },
          {
            path: "novo",
            element: <LancamentoFormPage />,
            handle: { breadcrumb: "Novo" },
          },
          {
            path: "resumo/:id",
            element: <LancamentoViewPage />,
            handle: { breadcrumb: "Resumo" },
          },
          {
            path: "editar/:id",
            element: <LancamentoFormPage />,
            handle: { breadcrumb: "Editar" },
          },
        ],
      },
    ],
  },
];

export default FluxoCaixaRoutes;
