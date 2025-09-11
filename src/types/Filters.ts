export type Option = {
  key: string;
  value: string;
};

type SelectField = {
  name: string;
  label: string;
  type: 'SELECT';
  options: Option[];
};

type NumberField = {
  name: string;
  label: string;
  type: 'NUMBER';
};

type StringField = {
  name: string;
  label: string;
  type: 'STRING';
};

type DateField = {
  name: string;
  label: string;
  type: 'DATE';
};

type BooleanField = {
  name: string;
  label: string;
  type: 'BOOLEAN';
};

const STRING_OPERATORS: Operator[] = [
  { name: 'Contém', symbol: 'LIKE' },
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' }
];

const NUMBER_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' },
  { name: 'Maior', symbol: '>' },
  { name: 'Menor', symbol: '<' },
  { name: 'Maior ou igual', symbol: '>=' },
  { name: 'Menor ou igual', symbol: '<=' }
];

const DATE_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' },
  { name: 'Maior', symbol: '>' },
  { name: 'Menor', symbol: '<' },
  { name: 'Maior ou igual', symbol: '>=' },
  { name: 'Menor ou igual', symbol: '<=' }
];

const SELECT_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' }
];

const BOOLEAN_OPERATORS: Operator[] = [{ name: 'Igual', symbol: '==' }];

export type FilterItem = {
  value: any;
  operator: Operator;
  field: Field;
};

export type Field =
  | SelectField
  | NumberField
  | StringField
  | DateField
  | BooleanField;

export type Operator = {
  name: string;
  symbol: string;
};

export type Filters = Record<string, FilterItem>;

export interface FilterDTO {
  field: string;
  operator: string;
  operadorDescr: string;
  value: string;
};

export const OPERATORS: Record<Field['type'], Operator[]> = {
  STRING: STRING_OPERATORS,
  NUMBER: NUMBER_OPERATORS,
  DATE: DATE_OPERATORS,
  SELECT: SELECT_OPERATORS,
  BOOLEAN: BOOLEAN_OPERATORS
};

export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_COMPACT = 5;
