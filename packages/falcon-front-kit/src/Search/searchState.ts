import qs from 'qs';
import { SortOrderValue, PaginationInput } from '@deity/falcon-data';
import { FilterInput, FilterOperator } from '@deity/falcon-shop-extension';

export type SearchState = {
  term?: string;
  filters: FilterInput[];
  sort?: SortOrderValue;
  pagination?: PaginationInput;
};

export function searchStateFromURL(url: string): Partial<SearchState> {
  const parts = qs.parse(url.replace('?', ''));
  const searchState: Partial<SearchState> = {};

  if (parts.q) {
    searchState.term = parts.q;
  }

  if (parts.p) {
    searchState.pagination = {
      page: parseInt(parts.p, 10),
      perPage: parseInt(parts.pp, 10)
    };
  }

  if (parts.sort) {
    const [field, direction] = parts.sort.split(':');
    searchState.sort = {
      field,
      direction
    };
  }

  if (parts.filters) {
    const names = Object.keys(parts.filters);
    searchState.filters = [];
    for (let i = 0; i < names.length; i++) {
      const [field, operator] = names[i].split(':');
      searchState.filters.push({
        field,
        operator: (operator as FilterOperator) || FilterOperator.equals,
        value: parts.filters[names[i]].split(',')
      });
    }
  }

  return searchState;
}

export type UrlParts = {
  // search query
  q?: string;
  // search filters - key/value map
  filters?: { [key: string]: string };
  // current page
  p?: string;
  // items per page
  pp?: string;
  // sort order
  sort?: string;
};

export function searchStateToURL(state: Partial<SearchState>): string {
  const { term, filters, sort, pagination } = state;

  const parts: UrlParts = {};

  if (filters) {
    parts.filters = {};
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      const name = filter.operator === FilterOperator.equals ? filter.field : `${filter.field}:${filter.operator}`;
      parts.filters[name] = filter.value.join(',');
    }
  }

  if (sort && sort.field && sort.direction) {
    parts.sort = `${sort.field}:${sort.direction}`;
  }

  if (pagination) {
    if (pagination.perPage) {
      parts.pp = pagination.perPage.toString();
    }
    if (pagination.page) {
      parts.p = pagination.page.toString();
    }
  }

  if (term) {
    parts.q = term; // eslint-disable-line id-length
  }

  return qs.stringify(parts, { encode: false });
}
