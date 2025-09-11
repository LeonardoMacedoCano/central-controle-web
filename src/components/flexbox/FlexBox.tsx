import { CSSProperties, FC, ReactNode } from 'react';
import styled from 'styled-components';

interface FlexBoxProps {
  children: ReactNode;
  width?: string;
  height?: string;
  flexDirection?: 'row' | 'column';
  borderTop?: boolean;
  borderBottom?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  style?: CSSProperties;
}

interface FlexBoxChildProps {
  children: ReactNode;
  width?: string;
  height?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  alignCenter?: boolean;
  alignRight?: boolean;
  style?: CSSProperties;
}

export const FlexBox: FC<FlexBoxProps> & { Item: FC<FlexBoxChildProps> } = ({ children, ...rest }) => (
  <FlexBoxContainer {...rest}>
    {children}
  </FlexBoxContainer>
);

FlexBox.Item = ({ children, ...rest }) => (
  <FlexBoxItem {...rest}>
    {children}
  </FlexBoxItem>
);

export default FlexBox;

interface FlexBoxContainerProps {
  width?: string;
  height?: string;
  flexDirection?: 'row' | 'column';
  borderTop?: boolean;
  borderBottom?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
}

const FlexBoxContainer = styled.div<FlexBoxContainerProps>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  
  border-top: ${({ borderTop, theme }) => borderTop ? `1px solid ${theme.colors.gray}` : 'none'};
  border-bottom: ${({ borderBottom, theme }) => borderBottom ? `1px solid ${theme.colors.gray}` : 'none'};
  border-left: ${({ borderLeft, theme }) => borderLeft ? `1px solid ${theme.colors.gray}` : 'none'};
  border-right: ${({ borderRight, theme }) => borderRight ? `1px solid ${theme.colors.gray}` : 'none'};
  
  border-top-left-radius: ${({ borderTop, borderLeft }) => (borderTop && borderLeft ? '5px' : '0')};
  border-top-right-radius: ${({ borderTop, borderRight }) => (borderTop && borderRight ? '5px' : '0')};
  border-bottom-left-radius: ${({ borderBottom, borderLeft }) => (borderBottom && borderLeft ? '5px' : '0')};
  border-bottom-right-radius: ${({ borderBottom, borderRight }) => (borderBottom && borderRight ? '5px' : '0')};
`;

interface FlexBoxItemProps {
  width?: string;
  height?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  alignRight?: boolean;
  alignCenter?: boolean;
}

const FlexBoxItem = styled.div<FlexBoxItemProps>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
  ${({ alignRight }) => alignRight && 'margin-left: auto;'}
  ${({ alignCenter }) => alignCenter && 'margin: 0 auto;'}
  border-top: ${({ borderTop, theme }) => borderTop ? `1px solid ${theme.colors.gray}` : 'none'};
  border-bottom: ${({ borderBottom, theme }) => borderBottom ? `1px solid ${theme.colors.gray}` : 'none'};
  border-left: ${({ borderLeft, theme }) => borderLeft ? `1px solid ${theme.colors.gray}` : 'none'};
  border-right: ${({ borderRight, theme }) => borderRight ? `1px solid ${theme.colors.gray}` : 'none'};
`;
