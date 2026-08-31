import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIMARY_NAV_LABEL, SectionNavItem } from './navConfig';
import { SectionMenuBox, SectionMenuTitle, SectionMenuItem } from './styles';

interface SectionNavProps {
  title: string;
  items: SectionNavItem[];
  onClose: () => void;
}

export const SectionNav: React.FC<SectionNavProps> = ({ title, items, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const boxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (boxRef.current?.contains(target)) return;
      // cliques no menu principal são tratados pelo próprio menu (abre/fecha)
      if (target.closest(`[aria-label="${PRIMARY_NAV_LABEL}"]`)) return;
      onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [onClose]);

  const handleSelect = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <SectionMenuBox ref={boxRef} aria-label={title}>
      <SectionMenuTitle>{title}</SectionMenuTitle>
      {items.map((item) => {
        const active = item.isActive(pathname);
        return (
          <SectionMenuItem
            key={item.to}
            type="button"
            $active={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => handleSelect(item.to)}
          >
            {item.label}
          </SectionMenuItem>
        );
      })}
    </SectionMenuBox>
  );
};
