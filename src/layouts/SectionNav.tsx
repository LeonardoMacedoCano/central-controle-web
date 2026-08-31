import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionNavItem } from './navConfig';
import { SectionMenuBox, SectionMenuTitle, SectionMenuItem } from './styles';

interface SectionNavProps {
  title: string;
  items: SectionNavItem[];
}

export const SectionNav: React.FC<SectionNavProps> = ({ title, items }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <SectionMenuBox aria-label={title}>
      <SectionMenuTitle>{title}</SectionMenuTitle>
      {items.map((item) => {
        const active = item.isActive(pathname);
        return (
          <SectionMenuItem
            key={item.to}
            type="button"
            $active={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(item.to)}
          >
            {item.label}
          </SectionMenuItem>
        );
      })}
    </SectionMenuBox>
  );
};
