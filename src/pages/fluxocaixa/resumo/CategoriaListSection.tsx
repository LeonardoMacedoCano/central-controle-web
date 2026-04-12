import React from "react";
import styled from "styled-components";
import { getVariantColor, SummaryCard, VariantColor } from "lcano-react-ui";
import { CategoriaTotais } from "../../../types";

interface CategoriaListSectionProps {
  titulo: string;
  itens: CategoriaTotais[];
  variantPadrao: VariantColor;
  variantNegativo?: VariantColor;
  format?: (v: number) => string;
  mensagemVazia?: string;
}

const CategoriaListSection: React.FC<CategoriaListSectionProps> = ({
  titulo,
  itens,
  variantPadrao,
  variantNegativo,
  format,
  mensagemVazia = 'Nenhuma categoria no período.',
}) => {
  const display = format ?? String;
  return (
      <SummaryCard
       label={titulo}
       value={
        itens.length === 0 ? (
          <Vazia>{mensagemVazia}</Vazia>
        ) : (
          itens.map((item) => {
            const isNegativo = item.total < 0;
            const variant: VariantColor =
              isNegativo && variantNegativo ? variantNegativo : variantPadrao;
            return (
              <Item key={item.categoria}>
                <ItemNome>{item.categoria}</ItemNome>
                <ItemValor $variant={variant}>{display(item.total)}</ItemValor>
              </Item>
            );
          })
        )
       } 
       variant="primary"
      />
  );
};

export default CategoriaListSection;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemNome = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
`;

const ItemValor = styled.span<{ $variant: VariantColor }>`
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
  white-space: nowrap;
  color: ${({ theme, $variant }) => getVariantColor(theme, $variant)};
`;

const Vazia = styled.div`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 13px;
  font-style: italic;
  padding: 8px 0;
`;