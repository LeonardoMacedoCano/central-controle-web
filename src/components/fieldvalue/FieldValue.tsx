import React from 'react';
import styled, { css } from 'styled-components';
import { SelectValue } from '../../types';
import { 
  formatDateToYMString,
  formatDateToYMDString,
  parseDateStringToDate,
  getVariantColor,
  VariantColor
} from '../../utils';

type FieldValueProps = {
  type: 'string' | 'number' | 'boolean' | 'date' | 'month' | 'select';
  value?: string | number | boolean | SelectValue;
  variant?: VariantColor;
  description?: string;
  hint?: string;
  editable?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minValue?: number;
  maxValue?: number;
  inputWidth?: string;
  inline?: boolean;
  options?: SelectValue[];
  icon?: React.ReactNode;
  padding?: string;
  placeholder?: string;
  maxDecimalPlaces?: number;
  maxIntegerDigits?: number;
  onUpdate?: (value: any) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const FieldValue: React.FC<FieldValueProps> = ({
  type,
  value = "",
  variant,
  description,
  hint,
  editable,
  width,
  maxWidth,
  maxHeight,
  minValue,
  maxValue,
  inputWidth,
  inline,
  options,
  icon,
  padding,
  placeholder,
  maxDecimalPlaces = 2,
  maxIntegerDigits = 8,
  onUpdate,
  onKeyDown,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    if (!onUpdate) return;

    let formattedValue: any = event.target.value;

    switch (type) {
      case 'number':
        formattedValue = validateNumericInput(formattedValue);
        formattedValue = validateMinValue(formattedValue);
        formattedValue = validateMaxValue(formattedValue);
        break;
      case 'boolean':
        formattedValue = event.target.value === 'false' ? 'false' : 'true';
        break;
      case 'date':
        formattedValue = parseDateStringToDate(event.target.value);
        break;
    }

    onUpdate(formattedValue);
  };

  const validateNumericInput = (value: string): string => {
    const [integerPart, decimalPart] = value.split('.');
    
    if (integerPart.length > maxIntegerDigits) {
      value = `${integerPart.slice(0, maxIntegerDigits)}${decimalPart ? '.' + decimalPart : ''}`;
    }
  
    if (type === 'number' && decimalPart && decimalPart.length > maxDecimalPlaces) {
      value = `${integerPart}.${decimalPart.slice(0, maxDecimalPlaces)}`;
    }
  
    return value;
  };
  
  const validateMinValue = (value: string): string => {
    if ((minValue || minValue === 0) && parseFloat(value) < minValue) {
      return minValue.toString();
    }
    return value;
  };
  
  const validateMaxValue = (value: string): string => {
    if (maxValue && parseFloat(value) > maxValue) {
      return maxValue.toString();
    }
    return value;
  };
  
  const formatValue = (val: any) => {
    if (typeof val === 'string' || typeof val === 'number') {
      if (type === 'number' && typeof val === 'string') {
        return val;
      }
      return String(val);
    }
  
    if (val instanceof Date && type === 'month') {
      return formatDateToYMString(val);
    }
  
    if (typeof val === 'string' && type === 'date') {
      return formatDateToYMDString(parseDateStringToDate(val));
    }
  
    if (type === 'date') {
      return formatDateToYMDString(val);
    }
  
    if (typeof val === 'string' && type === 'boolean') {
      return val ? 'true' : 'false';
    }
  
    return '';
  };
  
  return (
    <StyledFieldValue width={width} maxWidth={maxWidth} maxHeight={maxHeight} inline={inline} padding={padding}>
      {description && 
        <Label title={hint}>
          {description}
        </Label>
      }
      {type === 'select' ? (
        <StyledSelect
          value={(typeof value === 'object' && value !== null) ? value.key : String(value)}
          onChange={(event) => handleInputChange(event)}
          disabled={!editable}
          inputWidth={inputWidth}
          inline={inline}
          variant={variant}
        >
          <option value=''>{placeholder || ' Selecione...'}</option>
          {options?.map((option) => (
            <option key={option.key} value={String(option.key)}>
              {`${option.value}`}
            </option>          
          ))}
        </StyledSelect>
      ) : type === 'boolean' ? (
        <StyledSelect
          value={formatValue(value)}
          onChange={(event) => handleInputChange(event)}
          disabled={!editable}
          inputWidth={inputWidth}
          inline={inline}
          variant={variant}
        >
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </StyledSelect>
      ) : (
        <>
          {icon && 
            <Icon>
              {icon}
            </Icon>
          }
          <StyledInput
            type={editable ? type : 'string'} 
            readOnly={!editable}
            value={formatValue(value)}
            onChange={(event) => handleInputChange(event)}
            inputWidth={inputWidth}
            inline={inline}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            variant={variant}
          />
        </>
      )}
    </StyledFieldValue>
  );
};

export default FieldValue;

interface StyledFieldValueProps {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  inline?: boolean;
  padding?: string;
}

export const StyledFieldValue = styled.div<StyledFieldValueProps>`
  width: ${({ width }) => width || '100%'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  max-height: ${({ maxHeight }) => maxHeight || 'none'};
  height: 100%;
  padding: ${({ padding }) => padding || '5px'};
  display: flex;
  flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
  align-items: ${({ inline }) => (inline ? 'center' : 'stretch')};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  height: 100%;
  display: flex;
  align-items: center;
`;

interface StyledInputProps {
  inputWidth?: string;
  inline?: boolean;
  readOnly?: boolean;
  variant?: VariantColor;
}

export const StyledInput = styled.input<StyledInputProps>`
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : 'none')};
  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'pointer')};

  &::-webkit-calendar-picker-indicator {
    filter: invert(100%);
  }

  ${({ variant, theme }) =>
    variant &&css`
      color: ${getVariantColor(theme, variant)};
    `
  }
`;

export const StyledSelect = styled.select<StyledInputProps>`
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : 'none')};

  ${({ variant, theme }) =>
    variant &&
    css`
      color: ${getVariantColor(theme, variant)};
    `}

  option {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Icon = styled.div`
  height: 100%;
  width: auto;
`;
