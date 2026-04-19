import { RouteObject } from 'react-router-dom';
import FluxoCaixaConfigPage from '../pages/fluxocaixa/configuracao/FluxoCaixaConfigPage';
import MovimentacaoCategoriaListPage from '../pages/fluxocaixa/configuracao/movimentacaocategoria/MovimentacaoCategoriaListPage';
import ParametroFormPage from '../pages/fluxocaixa/configuracao/parametro/ParametroFormPage';
import MapeamentoExtratoBancarioListPage from '../pages/fluxocaixa/configuracao/mapeamentoextratobancario/MapeamentoExtratoBancarioListPage';
import MapeamentoExtratoBancarioFormPage from '../pages/fluxocaixa/configuracao/mapeamentoextratobancario/MapeamentoExtratoBancarioFormPage';
import MapeamentoExtratoBancarioViewPage from '../pages/fluxocaixa/configuracao/mapeamentoextratobancario/MapeamentoExtratoBancarioViewPage';
import FluxoCaixaResumo from '../pages/fluxocaixa/resumo/FluxoCaixaResumo';
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
            path: "mapeamento-extrato-bancario",
            handle: { breadcrumb: "Mapeamentos Extrato" },
            children: [
              {
                index: true,
                element: <MapeamentoExtratoBancarioListPage />,
              },
              {
                path: "novo",
                element: <MapeamentoExtratoBancarioFormPage />,
                handle: { breadcrumb: "Novo" },
              },
              {
                path: "editar/:id",
                element: <MapeamentoExtratoBancarioFormPage />,
                handle: { breadcrumb: "Editar" },
              },
              {
                path: "resumo/:id",
                element: <MapeamentoExtratoBancarioViewPage />,
                handle: { breadcrumb: "Resumo" },
              },
            ],
          },
        ],
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
          {
            path: "extrato-fluxo-caixa",
            element: <ImportacaoExtratoFormPage />,
            handle: { breadcrumb: "Importação de Extrato" },
          },
        ],
      },
    ],
  },
];

export default FluxoCaixaRoutes;
