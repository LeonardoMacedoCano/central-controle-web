import { createBrowserRouter } from "react-router-dom";
import FluxoCaixaRoutes from "./FluxoCaixaRoutes";
import { Home } from "../pages/home/Home";
import UsuarioFormPage from "../pages/usuario/UsuarioFormPage";
import NotificacaoListPage from "../pages/usuario/notificacao/NotificacaoListPage";
import NotificacaoViewPage from "../pages/usuario/notificacao/NotificacaoViewPage";
import AppLayout from "../layouts/AppLayout";
import { RequireAuth } from "../contexts";

export const router = createBrowserRouter([
  {
    handle: { breadcrumb: "Home" },
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "usuario",
        element: <UsuarioFormPage />,
        handle: { breadcrumb: "Usuário" }
      },
      {
        path: "notificacoes",
        handle: { breadcrumb: "Notificações" },
        children: [
          {
            index: true,
            element: <NotificacaoListPage />
          },
          {
            path: "resumo/:id",
            element: <NotificacaoViewPage />,
            handle: { breadcrumb: "Visualizar" }
          }
        ]
      },
      ...FluxoCaixaRoutes
    ]
  }
]);
