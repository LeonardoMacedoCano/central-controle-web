import { useContext } from "react";
import { AuthContext } from "../";
import { LoginFormPage } from "../../pages/usuario/LoginFormPage";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);

  return auth.usuario ? children : <LoginFormPage />;
}