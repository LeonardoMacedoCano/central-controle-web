import { FaDollarSign, FaHome } from "react-icons/fa";

interface SubmenuItem {
  to: string;
  Text: string;
}

interface SidebarItem {
  to?: string;
  Icon: React.ComponentType;
  Text: string;
  onClick?: () => void;
  submenu?: SubmenuItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    to: "/",
    Icon: FaHome,
    Text: "Home"
  },
  {
    Icon: FaDollarSign,
    Text: "Fluxo Caixa",
    submenu: [
      { to: "/fluxocaixa", Text: "Resumo" },
      { to: "/fluxocaixa/lancamento", Text: "Lançamentos" },
      { to: "/fluxocaixa/config", Text: "Configuração" },
    ],
  },
];