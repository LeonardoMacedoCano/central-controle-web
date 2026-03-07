import { useAuth } from "../";
import { LoginFormPage } from "../../pages/usuario/LoginFormPage";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();

  return auth.usuario ? children : <LoginFormPage />;
}