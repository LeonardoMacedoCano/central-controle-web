import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionNavItem } from './navConfig';

interface SectionNavProps {
  items: SectionNavItem[];
  ariaLabel?: string;
}

export const SectionNav: React.FC<SectionNavProps> = ({ items, ariaLabel = 'Navegação da seção' }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Nav aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Pill
            key={item.to}
            type="button"
            $active={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(item.to)}
          >
            {item.label}
          </Pill>
        );
      })}
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Pill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.quaternary : theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.quaternary : theme.colors.tertiary};
  }
`;
