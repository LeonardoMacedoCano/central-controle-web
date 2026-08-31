import type { ReactNode } from 'react';
import { FaBell, FaDollarSign, FaHome } from 'react-icons/fa';

export interface SubNavItem {
  id: string;
  label: string;
  to: string;
  isActive: (pathname: string) => boolean;
}

export interface PrimaryNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  to: string;
  isActive: (pathname: string) => boolean;
  submenu?: SubNavItem[];
}

export const primaryNav: PrimaryNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <FaHome />,
    to: '/',
    isActive: (p) => p === '/',
  },
  {
    id: 'fluxocaixa',
    label: 'Fluxo Caixa',
    icon: <FaDollarSign />,
    to: '/fluxocaixa',
    isActive: (p) => p === '/fluxocaixa' || p.startsWith('/fluxocaixa/'),
    submenu: [
      {
        id: 'resumo',
        label: 'Resumo',
        to: '/fluxocaixa',
        isActive: (p) => p === '/fluxocaixa',
      },
      {
        id: 'lancamento',
        label: 'Lançamentos',
        to: '/fluxocaixa/lancamento',
        isActive: (p) => p.startsWith('/fluxocaixa/lancamento'),
      },
      {
        id: 'config',
        label: 'Configuração',
        to: '/fluxocaixa/config',
        isActive: (p) => p.startsWith('/fluxocaixa/config'),
      },
    ],
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    icon: <FaBell />,
    to: '/notificacoes',
    isActive: (p) => p === '/notificacoes' || p.startsWith('/notificacoes/'),
  },
];
