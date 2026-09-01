import { useAuth } from "../";
import { LoginFormPage } from "../../pages/usuario/LoginFormPage";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();

  if (auth.isLoading) return null;

  return auth.usuario ? children : <LoginFormPage />;
}
