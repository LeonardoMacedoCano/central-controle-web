import { useContext } from "react";
import { AuthContext } from "../";
import { Login } from "../../pages/login/Login";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);

  return auth.usuario ? children : <Login />;
}