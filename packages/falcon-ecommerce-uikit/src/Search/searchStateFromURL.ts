import qs from 'qs';
import { SearchState } from './SearchContext';
import { FilterOperator } from './types';

export function searchStateFromURL(url: string): Partial<SearchState> {
  const parts: any = qs.parse(url.replace('?', ''));
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
