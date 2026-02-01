import { createBrowserRouter } from "react-router-dom";
import FluxoCaixaRoutes from "./FluxoCaixaRoutes";
import { Home } from "../pages/home/Home";
import UsuarioFormPage from "../pages/usuario/UsuarioFormPage";
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
      ...FluxoCaixaRoutes
    ]
  }
]);
