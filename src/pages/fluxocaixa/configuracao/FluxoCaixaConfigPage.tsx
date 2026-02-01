import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "lcano-react-ui";

const buttonStyle: React.CSSProperties = {
  border: "3px solid rgba(255, 255, 255, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50px",
  width: "100%",
};

const configButtons = [
  { label: "Parâmetros", path: "/fluxocaixa/config/parametro" },
  { label: "Categorias", path: "/fluxocaixa/config/categoria" },
  { label: "Regras Extrato Conta Corrente", path: "/fluxocaixa/config/regra-extrato-conta-corrente" },
];

const FluxoCaixaConfigPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Stack direction="column">
        <Stack direction="row" divider="x">
          {configButtons.map(({ label, path }, index) => {
            const isFirst = index === 0;
            const isLast = index === configButtons.length - 1;

            return (
              <Button
                key={path}
                variant="tertiary"
                description={label}
                hint={label}
                style={{
                  ...buttonStyle,
                  borderTopLeftRadius: isFirst ? "5px" : undefined,
                  borderBottomLeftRadius: isFirst ? "5px" : undefined,
                  borderTopRightRadius: isLast ? "5px" : undefined,
                  borderBottomRightRadius: isLast ? "5px" : undefined,
                }}
                onClick={() => navigate(path)}
              />
            );
          })}
        </Stack>
      </Stack>
    </>
  );
};

export default FluxoCaixaConfigPage;
