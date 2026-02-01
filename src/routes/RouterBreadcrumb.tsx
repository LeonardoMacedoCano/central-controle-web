import { useMatches, Link, type UIMatch } from "react-router-dom";
import { RouteHandle } from "../types";
import { Breadcrumb } from "lcano-react-ui";

export const RouterBreadcrumb = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  const items = matches
    .filter(m => m.handle?.breadcrumb)
    .map(m => ({
      label: m.handle!.breadcrumb!,
      path: m.pathname,
    }));

  return <Breadcrumb items={items} LinkComponent={Link} />;
};
