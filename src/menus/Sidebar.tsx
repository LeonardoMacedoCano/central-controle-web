import React from 'react';
import { FaHome, FaDollarSign } from 'react-icons/fa';
import { AppSidebarContainer, AppSidebar, LinkSidebar, MenuItem, SubmenuContainer, SubmenuContent, SubMenuItem } from './styles';

interface SidebarProps {
  isOpen: boolean;
  activeSubmenu: string | null;
  setActiveSubmenu: React.Dispatch<React.SetStateAction<string | null>>;
  handleLinkClick: () => void;
}

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

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSubmenu, setActiveSubmenu, handleLinkClick }) => {
  const handleSubmenuToggle = (submenu: string) => {
    setActiveSubmenu(prev => (prev === submenu ? null : submenu));
  };

  const sidebarItems: SidebarItem[] = [
    {
      to: "/",
      Icon: FaHome,
      Text: "Home"
    },
    {
      Icon: FaDollarSign,
      Text: "Fluxo Caixa",
      submenu: [
        { to: "/resumo-fluxo-caixa", Text: "Resumo" },
        { to: "/lancamentos", Text: "Lançamentos" },
        { to: "/config-fluxo-caixa", Text: "Configuração" },
      ],
    },
  ];

  return (
    <AppSidebarContainer isActive={isOpen}>
      <AppSidebar>
        {sidebarItems.map((item, index) => (
          item.submenu ? (
            <SubmenuContainer key={index}>
              <MenuItem onClick={() => handleSubmenuToggle(item.Text)}>
                <item.Icon />
                {isOpen && <span>{item.Text}</span>}
              </MenuItem>
              {isOpen && activeSubmenu === item.Text && (
                <SubmenuContent>
                  {item.submenu.map((subItem, subIndex) => (
                    <LinkSidebar 
                      key={`${index}-${subIndex}`} 
                      to={subItem.to} 
                      onClick={handleLinkClick}
                    >
                      <SubMenuItem>{subItem.Text}</SubMenuItem>
                    </LinkSidebar>
                  ))}
                </SubmenuContent>
              )}
            </SubmenuContainer>
          ) : item.to ? (
            <LinkSidebar 
              key={index} 
              to={item.to} 
              onClick={() => {
                item.onClick?.();
                handleLinkClick();
              }}
            >
              <MenuItem>
                <item.Icon />
                {isOpen && <span>{item.Text}</span>}
              </MenuItem>
            </LinkSidebar>
          ) : null
        ))}
      </AppSidebar>
    </AppSidebarContainer>
  );
};
