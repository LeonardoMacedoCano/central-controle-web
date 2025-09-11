import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FieldValue from '../fieldvalue/FieldValue';
import { parseDateStringToDate, formatDateToYMDString, getCurrentDate } from '../../utils';
import { Field, FilterDTO, Operator, OPERATORS } from '../../types';
import FlexBox from '../flexbox/FlexBox';
import Button from '../button/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Container from '../container/Container';

type Props = {
  fields: Field[];
  search(filters: FilterDTO[]): void;
};

const SearchFilter: React.FC<Props> = ({ fields, search }) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [searchValue, setSearchValue] = useState<string | number | boolean | null>(null);
  const [filters, setFilters] = useState<FilterDTO[]>([]);

  useEffect(() => {
    if (!searchValue) {
      if (selectedField?.type.toLowerCase() === 'date') {
        setSearchValue(formatDateToYMDString(getCurrentDate()));
      } else if (selectedField?.type.toLowerCase() === 'boolean') {
        setSearchValue('true');
      }
    }
  }, [selectedField, searchValue]);

  const handleFieldChange = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      setSelectedField(field);
      setSelectedOperator(OPERATORS[field.type][0]);
      setSearchValue(null);
    }
  };

  const handleOperatorChange = (operatorName: string) => {
    if (selectedField) {
      const operator = OPERATORS[selectedField.type].find(op => op.name === operatorName);
      if (operator) setSelectedOperator(operator);
    }
  };

  const handleValueChange = (value: any) => {
    if (selectedField?.type.toLowerCase() === 'date') {
      const formattedValue = formatDateValue(value);
      setSearchValue(formattedValue);
    } else if (selectedField?.type.toLowerCase() === 'boolean') {
      setSearchValue(value);
    } else {
      setSearchValue(value);
    }
  };

  const formatDateValue = (value: any): string => {
    if (value instanceof Date) {
      return formatDateToYMDString(value);
    }
    
    const parsedDate = parseDateStringToDate(value);
    return parsedDate ? formatDateToYMDString(parsedDate) : String(value);
  };

  const onAddFilter = () => {
    if (selectedField && selectedOperator && searchValue !== null) {
      const formattedValue = selectedField.type.toLowerCase() === 'date'
        ? formatDateValue(searchValue)
        : String(searchValue);

      const newFilter: FilterDTO = {
        field: selectedField.name,
        operator: selectedOperator.symbol,
        operadorDescr: selectedOperator.name,
        value: formattedValue,
      };

      const newFilters = [...filters, newFilter];
      setFilters(newFilters);
      search(newFilters);

      resetFilterState();
    }
  };

  const resetFilterState = () => {
    setSelectedField(null);
    setSelectedOperator(null);
    setSearchValue(null);
  };

  const onRemove = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    search(updatedFilters);
  };

  return (
    <Container backgroundColor="transparent" width="100%">
      <FilterControls hasFilters={filters.length > 0}>
        <FlexBox flexDirection="row">
          <FlexBox.Item borderRight>
            <FieldValue
              type="select"
              value={selectedField?.name || ''}
              options={fields.map(field => ({ key: field.name, value: field.label }))}
              placeholder="Selecione..."
              onUpdate={handleFieldChange}
              editable
            />
          </FlexBox.Item>
          <FlexBox.Item borderRight>
            <FieldValue
              type="select"
              value={selectedOperator?.name || ''}
              options={
                selectedField
                  ? OPERATORS[selectedField.type].map(op => ({ key: op.name, value: op.name }))
                  : []
              }
              placeholder="Selecione..."
              onUpdate={handleOperatorChange}
              editable
            />
          </FlexBox.Item>
          <FlexBox.Item borderRight>
            <FieldValue
              type={selectedField?.type.toLowerCase() as 'string' | 'number' | 'boolean' | 'date' | 'select'}
              value={searchValue || ''}
              onUpdate={handleValueChange}
              options={selectedField?.type === 'SELECT' && selectedField?.options ? selectedField?.options : undefined}
              editable
              placeholder={
                selectedField?.type.toLowerCase() === 'date' || selectedField?.type.toLowerCase() === 'select'
                  ? 'Selecione...'
                  : 'Digite...'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddFilter();
                }
              }}
            />
          </FlexBox.Item>
            <Button 
              onClick={onAddFilter}
              icon={<FaPlus />}
              variant='success'
              hint='Adicionar'
              width='100px'
              height='40px'
              style={{
                borderTopRightRadius: '5px',
                borderBottomRightRadius: filters.length > 0 ? '0px' : '5px',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            />
        </FlexBox>
      </FilterControls>

      <PanelFilterTags>
        {filters.map((filter, index) => (
          <FilterTag key={index}>
            <span>{fields.find(f => f.name === filter.field)?.label} {filter.operadorDescr} {filter.value}</span>
            <Button 
                onClick={() => onRemove(index)}
                icon={<FaTrash />}
                variant='warning'
                hint='Excluir'
                height='20px'
                width='20px'
                style={{
                  borderRadius: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  padding: '5px'
                }}
              />
          </FilterTag>
        ))}
      </PanelFilterTags>
    </Container>
  );
};

export default SearchFilter;

const FilterControls = styled.div<{ hasFilters: boolean }>`
  height: 40px;
  background-color: transparent;
  border-bottom: ${({ hasFilters, theme }) => (hasFilters ? `1px solid ${theme.colors.gray}` : 'none')};
`;

const PanelFilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.tertiary};
`;

const FilterTag = styled.div`
  height: 30px;
  margin: 5px;
  display: flex;
  gap: 8px;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  font-size: 14px;
`;

