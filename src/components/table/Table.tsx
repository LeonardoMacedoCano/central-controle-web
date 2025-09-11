import React, { ReactNode, useState, FC } from 'react';
import styled from 'styled-components';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { Container, Button, SearchPagination } from '../';
import { PagedResponse } from '../../types';

type ColumnProps<T> = {
  header: ReactNode;
  value(value: T, index: number): ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  titleAlign?: 'left' | 'center' | 'right';
};

export const Column = <T extends any>({}: ColumnProps<T>) => null;

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: () => ReactNode;
  visible: boolean;
}

const TableActions: FC<TableActionsProps> = ({ onView, onEdit, onDelete, visible, customActions }) => {
  const commonButtonStyles = {
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '25px',
    width: '25px',
  };

  return (
    <ActionsContainer>
      <ActionsWrapper visible={visible}>
        {customActions && <CustomActionWrapper>{customActions()}</CustomActionWrapper>}

        {onView && (
          <Button
            onClick={onView}
            variant="success"
            icon={<FaEye />}
            hint="Visualizar"
            style={commonButtonStyles}
          />
        )}
        {onEdit && (
          <Button
            variant="info"
            icon={<FaEdit />}
            onClick={onEdit}
            style={commonButtonStyles}
          />
        )}
        {onDelete && (
          <Button
            variant="warning"
            icon={<FaTrash />}
            onClick={onDelete}
            style={commonButtonStyles}
          />
        )}
      </ActionsWrapper>
    </ActionsContainer>
  );
};

interface TableProps<T> {
  values: T[] | PagedResponse<T>;
  columns: ReactNode[];
  messageEmpty?: string;
  keyExtractor(item: T, index?: number): string | number;
  onClickRow?(item: T, index?: number): void;
  rowSelected?(item: T): boolean;
  loadPage?: (pageIndex: number, pageSize: number) => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  customActions?: (item: T) => ReactNode;
}

const getValues = (values: any[] | PagedResponse<any>): any[] => {
  if ('content' in values) {
    return (values as PagedResponse<any>).content || [];
  }
  return values as any[];
};

export const Table = <T extends any>({
  values,
  columns,
  messageEmpty,
  keyExtractor,
  onClickRow,
  rowSelected,
  loadPage,
  onView,
  onEdit,
  onDelete,
  customActions,
}: TableProps<T>) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const renderTableHead = () => (
    <thead>
      <TableHeadRow>
        {columns.map((column, index) => {
          if (React.isValidElement(column)) {
            const columnProps = column.props as ColumnProps<T>;
            return (
              <TableHeadColumn key={index}>
                <TableColumnTitle align={columnProps.titleAlign || 'center'}>
                  {columnProps.header}
                </TableColumnTitle>
              </TableHeadColumn>
            );
          }
          return null;
        })}
      </TableHeadRow>
    </thead>
  );

  const renderTableBody = () => {
    const data = getValues(values);
    return (
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1}>
              <EmptyMessage>{messageEmpty}</EmptyMessage>
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <TableRow
              key={keyExtractor(item, index)}
              onClick={() => onClickRow && onClickRow(item, index)}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              {columns.map((column, columnIndex) => {
                if (React.isValidElement(column)) {
                  const columnProps = column.props as ColumnProps<T>;
                  return (
                    <TableColumn
                      key={columnIndex}
                      isSelected={rowSelected ? rowSelected(item) : false}
                      width={columnProps.width}
                      align={columnProps.align}
                    >
                      <TruncatedContent>{columnProps.value(item, index)}</TruncatedContent>
                    </TableColumn>
                  );
                }
                return null;
              })}
              <ActionColumn>
                <TableActions
                  onView={onView ? () => onView(item) : undefined}
                  onEdit={onEdit ? () => onEdit(item) : undefined}
                  onDelete={onDelete ? () => onDelete(item) : undefined}
                  visible={hoveredRowIndex === index}
                  customActions={customActions && (() => customActions(item))}
                />
              </ActionColumn>
            </TableRow>
          ))
        )}
      </tbody>
    );
  };

  const renderPagination = () => {
    if (loadPage && 'content' in values && values.totalElements > 0) {
      return (
        <SearchPagination height="35px" page={values} loadPage={loadPage} />
      );
    }
    return null;
  };

  return (
    <Container backgroundColor="transparent" width="100%">
      {getValues(values).length === 0 ? (
        <EmptyMessage>{messageEmpty}</EmptyMessage>
      ) : (
        <TableContainer>
          <StyledTable>
            {renderTableHead()}
            {renderTableBody()}
          </StyledTable>
        </TableContainer>
      )}
      {renderPagination()}
    </Container>
  );
};

const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
  table-layout: fixed;
`;

const EmptyMessage = styled.div`
  padding: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeadRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
`;

const TableHeadColumn = styled.th`
  padding: 0 3px;
  text-align: left;
  background-color: transparent;
  border-left: 1px solid ${({ theme }) => theme.colors.gray};

  &:first-child {
    border-left: none;
  }
`;

const TableColumn = styled.td<{ isSelected?: boolean; width?: string; align?: string }>`
  font-size: 13px;
  height: 35px;
  text-align: ${({ align }) => align || 'left'};
  border-left: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ width }) => width || 'auto'};
  width: ${({ width }) => width || 'auto'};
  padding: 0 5px;
  display: table-cell;

  &:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.quaternary : 'transparent')};
  }

  &:first-child {
    border-left: none;
  }
`;

const TruncatedContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
`;

const TableColumnTitle = styled.div<{ align?: string }>`
  font-size: 14px;
  height: 40px;
  text-align: ${({ align }) => align};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'};
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.quaternary};
`;

const TableRow = styled.tr<{ isSelected?: boolean }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  }
`;

const ActionColumn = styled.td`
  position: sticky;
  right: 0;
  padding: 2px;
  z-index: 2;
`;

const ActionsContainer = styled.div`
  position: relative;
  height: 100%;
`;

const ActionsWrapper = styled.div<{ visible: boolean }>`
  position: sticky;
  top: 0;
  right: 5px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease-in-out;
`;

const CustomActionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
`;

export default Table;
