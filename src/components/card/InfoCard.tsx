import React from 'react';
import styled from 'styled-components';
import { getVariantColor, VariantColor } from '../../utils';

interface InfoCardProps {
  variant?: VariantColor;
  title: string;
  description?: string;
  height?: string;
  width?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  variant = 'info', 
  title, 
  description, 
  height,
  width,
  onClick, 
  children
}) => (
  <CardContainer
    variant={variant} 
    height={height} 
    width={width} 
    onClick={onClick}
  >
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
    {children && <CardContent>{children}</CardContent>}
  </CardContainer>
);

export default InfoCard;

const CardContainer = styled.div<{ variant: VariantColor, height?: string, width?: string }>`
  background: ${({ theme }) => theme.colors.tertiary};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-top: 5px solid ${({ theme, variant }) => getVariantColor(theme, variant)};
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled.h3`
  font-weight: bold;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.white};
`;

const CardDescription = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.white};
  margin: 5px 0 10px;
  text-align: justify;
`;

const CardContent = styled.div`
  margin-top: auto;
`;
