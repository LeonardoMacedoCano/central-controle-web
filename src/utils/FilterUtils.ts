import { FilterItem, Filters } from "../types";

export function buildFilterRsql(filters: Filters) {
  let searchParams = '';

  Object.values(filters).forEach((filter: FilterItem) => {
    if (searchParams) {
      searchParams += ' and ';
    }

    let value =
      typeof filter.value === 'string'
        ? encodeURIComponent(filter.value)
        : filter.value;

    if (filter.operator.name === 'Contém') {
      value = `*${value}*`;
    }

    if (filter.field.type === 'STRING') {
      value = `"${value}"`;
    }

    searchParams +=
      filter.field.name + filter.operator.symbol + decodeURIComponent(value);
  });

  return searchParams;
}