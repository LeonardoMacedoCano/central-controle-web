import React from 'react';
import styled, { css } from 'styled-components';
import { getVariantColor, VariantColor } from '../../utils';

interface CardProps {
  variant?: VariantColor;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  hasBorder?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  variant = 'info', 
  width = '100%', 
  height = '100%', 
  style, 
  children, 
  hasBorder = false
}) => {
  return (
    <OuterContainer>
      <InnerCardContainer variant={variant} width={width} height={height} style={style} hasBorder={hasBorder}>
        {children}
      </InnerCardContainer>
    </OuterContainer>
  );
};

export default Card;

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const InnerCardContainer = styled.div<CardProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background-color: transparent;
  font-weight: bold;

  ${({ width, height }) => css`
    width: ${width};
    height: ${height};
  `}

  color: ${({ variant, theme }) => getVariantColor(theme, variant)};
  
  ${({ hasBorder, variant, theme }) => hasBorder && css`
    border: 1px solid ${getVariantColor(theme, variant)};
  `}

  text-align: center;
`;

