import { useMatches, Link } from "react-router-dom";
import styled from "styled-components";
import type { UIMatch } from "react-router-dom";
import { RouteHandle } from "../../types";

const Breadcrumb: React.FC = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  const crumbs = matches
    .filter(m => m.handle?.breadcrumb)
    .map(m => ({
      label: m.handle!.breadcrumb!,
      path: m.pathname,
    }));

  if (crumbs.length === 0) return null;

  return (
    <BreadcrumbContainer>
      {crumbs.map((crumb, index) => (
        <span key={crumb.path}>
          {index < crumbs.length - 1 ? (
            <Link to={crumb.path}>{crumb.label}</Link>
          ) : (
            <strong>{crumb.label}</strong>
          )}
        </span>
      ))}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  font-size: 16px;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.tertiary};
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${({ theme }) => theme.colors.quaternary};
      color: ${({ theme }) => theme.colors.black};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.quaternary};
    font-weight: 600;
    padding: 4px 8px;
  }

  span:not(:last-child)::after {
    content: "›";
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.quaternary};
    font-size: 18px;
  }
`;