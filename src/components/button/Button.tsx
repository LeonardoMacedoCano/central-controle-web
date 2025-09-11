import React from 'react';
import styled, { css } from 'styled-components';
import { 
  convertReactStyleToCSSObject,
  getVariantColor,
  VariantColor
} from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantColor | 'login';
  width?: string;
  height?: string;
  icon?: React.ReactNode;
  description?: string;
  hint?: string;
  disabled?: boolean;
  disabledHover?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  description, 
  width, 
  height, 
  icon, 
  hint, 
  disabled,
  disabledHover,
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      width={width} 
      height={height} 
      title={hint} 
      disabled={disabled}
      disabledHover={disabledHover}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',}}>{icon}</span>}
      {description && <span style={{ marginLeft: '8px' }}>{description}</span>}
    </StyledButton>
  );
};

export default Button;

interface StyledButtonProps {
  variant?: VariantColor | 'login';
  width?: string;
  height?: string;
  disabled?: boolean;
  disabledHover?: boolean;
  style?: React.CSSProperties;
}

const getButtonVariantStyles = (variant: StyledButtonProps['variant'], theme: any) => {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'tertiary':
    case 'quaternary':
    case 'success':
    case 'info':
    case 'warning':
      return css`
        background-color: ${getVariantColor(theme, variant)};
        color: ${theme.colors.white};
      `;
    case 'login':
      return css`
        width: 98%;
        background-color: ${theme.colors.quaternary};
        font-weight: 800;
        height: 50px;
        border-radius: 5px;
        font-size: 18px;
      `;
    default:
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
  }
};

const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  max-height: 100%;
  max-width: 100%;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};

  &:hover {
    opacity: ${props => (props.disabledHover ? '1' : '0.3')};
  }

  ${({ variant, theme }) => getButtonVariantStyles(variant, theme)}

  ${props => props.style && css`${convertReactStyleToCSSObject(props.style)}`}
`;
