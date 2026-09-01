import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Container,
  OptionGrid,
  OptionGridContainer,
  OptionGridDescription,
} from "lcano-react-ui";

type ConfigOptionId = "parametro" | "categoria" | "mapeamento-extrato-bancario";

const configOptions: {
  id: ConfigOptionId;
  label: string;
  description: string;
}[] = [
  {
    id: "parametro",
    label: "Parâmetros",
    description: "Configurações de despesas, rendas, ativos e extratos.",
  },
  {
    id: "categoria",
    label: "Categorias",
    description: "Categorias e subcategorias das movimentações.",
  },
  {
    id: "mapeamento-extrato-bancario",
    label: "Mapeamentos Extrato Bancário",
    description: "Regras de mapeamento para importação de extratos.",
  },
];

const OptionGridWrapper = styled.div`
  ${OptionGridContainer} {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  ${OptionGridDescription} {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const FluxoCaixaConfigPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container padding="16px">
      <OptionGridWrapper>
        <OptionGrid
          options={configOptions}
          value={"" as ConfigOptionId}
          onChange={(id) => navigate(`/fluxocaixa/config/${id}`)}
        />
      </OptionGridWrapper>
    </Container>
  );
};

export default FluxoCaixaConfigPage;
