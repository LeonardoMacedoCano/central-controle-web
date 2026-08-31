import type { ReactNode } from 'react';
import { FaBell, FaDollarSign, FaHome } from 'react-icons/fa';

export const PRIMARY_NAV_LABEL = 'Navegação principal';

export interface PrimaryNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  to: string;
  isActive: (pathname: string) => boolean;
}

export interface SectionNavItem {
  label: string;
  to: string;
  isActive: (pathname: string) => boolean;
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
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    icon: <FaBell />,
    to: '/notificacoes',
    isActive: (p) => p === '/notificacoes' || p.startsWith('/notificacoes/'),
  },
];

export const fluxoCaixaSection: SectionNavItem[] = [
  {
    label: 'Resumo',
    to: '/fluxocaixa',
    isActive: (p) => p === '/fluxocaixa',
  },
  {
    label: 'Lançamentos',
    to: '/fluxocaixa/lancamento',
    isActive: (p) => p.startsWith('/fluxocaixa/lancamento'),
  },
  {
    label: 'Configuração',
    to: '/fluxocaixa/config',
    isActive: (p) => p.startsWith('/fluxocaixa/config'),
  },
];
